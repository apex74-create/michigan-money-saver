import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  createListing, searchListings, getListingById, getListingsBySeller,
  incrementViewCount, getSellerStats, hasRevealedContact, recordContactReveal,
  getUserByOpenId, getUserById, recordTransaction,
  getDomainShieldsByOperator, createDomainShield, getDb,
} from "./db";
import { listings } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { storagePut } from "./storage";

const listingsRouter = router({
  uploadPhoto: protectedProcedure
    .input(z.object({
      listingId: z.number(),
      fileName: z.string(),
      base64Data: z.string(),
      contentType: z.string().default("image/jpeg"),
    }))
    .mutation(async ({ input, ctx }) => {
      const listing = await getListingById(input.listingId);
      if (!listing) throw new Error("Listing not found");
      if (listing.sellerId !== ctx.user.id) throw new Error("Not your listing");

      const buffer = Buffer.from(input.base64Data, "base64");
      const fileKey = `listings/${input.listingId}/${Date.now()}-${input.fileName}`;
      const { url } = await storagePut(fileKey, buffer, input.contentType);

      // Update listing photos array
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const currentPhotos: string[] = (listing.photos as string[]) || [];
      const updatedPhotos = [...currentPhotos, url];
      await db.update(listings).set({ photos: updatedPhotos }).where(eq(listings.id, input.listingId));

      return { url, totalPhotos: updatedPhotos.length };
    }),

  search: publicProcedure
    .input(z.object({
      search: z.string().optional(),
      category: z.string().optional(),
      city: z.string().optional(),
      limit: z.number().optional(),
    }).optional())
    .query(async ({ input }) => {
      return searchListings(input || {});
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const listing = await getListingById(input.id);
      if (!listing) return null;

      // Increment view count
      await incrementViewCount(input.id);

      // Check if current user has revealed contact
      let contactRevealed = false;
      let sellerPhone: string | null = null;
      let sellerEmail: string | null = null;

      if (ctx.user) {
        contactRevealed = await hasRevealedContact(ctx.user.id, input.id);
        if (contactRevealed) {
          // Fetch real seller info
          const seller = await getUserById(listing.sellerId);
          if (seller) {
            sellerPhone = seller.phone || "(No phone on file)";
            sellerEmail = seller.email || "(No email on file)";
          }
        }
      }

      return {
        ...listing,
        contactRevealed,
        sellerPhone,
        sellerEmail,
        // Hide exact address unless revealed
        address: contactRevealed ? listing.address : `${listing.city}, ${listing.state}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      category: z.enum(["general", "furniture", "electronics", "clothing", "tools", "toys", "books", "sports", "automotive", "collectibles", "other"]),
      address: z.string().min(1),
      city: z.string().min(1),
      state: z.string().min(1),
      zip: z.string().min(1),
      saleDate: z.string(),
      saleEndDate: z.string().optional(),
      priceMin: z.number().optional(),
      priceMax: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const result = await createListing({
        sellerId: ctx.user.id,
        title: input.title,
        description: input.description || null,
        category: input.category,
        address: input.address,
        city: input.city,
        state: input.state,
        zip: input.zip,
        saleDate: new Date(input.saleDate),
        saleEndDate: input.saleEndDate ? new Date(input.saleEndDate) : null,
        priceMin: input.priceMin?.toString() || null,
        priceMax: input.priceMax?.toString() || null,
        photos: null,
        lat: null,
        lng: null,
        status: "active",
      });
      return result;
    }),

  myListings: protectedProcedure.query(async ({ ctx }) => {
    return getListingsBySeller(ctx.user.id);
  }),

  myStats: protectedProcedure.query(async ({ ctx }) => {
    return getSellerStats(ctx.user.id);
  }),

  updateStatus: protectedProcedure
    .input(z.object({ id: z.number(), status: z.enum(["active", "ended", "cancelled"]) }))
    .mutation(async ({ input, ctx }) => {
      const listing = await getListingById(input.id);
      if (!listing) throw new Error("Listing not found");
      if (listing.sellerId !== ctx.user.id && (ctx.user as any).role !== "admin") {
        throw new Error("Not authorized to modify this listing");
      }
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.update(listings).set({ status: input.status }).where(eq(listings.id, input.id));
      return { success: true };
    }),

  revealContact: protectedProcedure
    .input(z.object({ listingId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.user as any;
      // Check subscription tier — enforced server-side
      if (!user.subscriptionTier || user.subscriptionTier === "free") {
        throw new Error("Basic or Pro subscription required to reveal contact info. Upgrade your tier.");
      }

      // Check if already revealed
      const alreadyRevealed = await hasRevealedContact(ctx.user.id, input.listingId);
      if (alreadyRevealed) {
        return { success: true, message: "Already revealed" };
      }

      const listing = await getListingById(input.listingId);
      if (!listing) throw new Error("Listing not found");

      // Record the reveal
      await recordContactReveal(ctx.user.id, listing.sellerId, input.listingId);

      // Record transaction with commission split + provenance hash
      await recordTransaction({
        type: "contact_reveal",
        buyerId: ctx.user.id,
        sellerId: listing.sellerId,
        listingId: input.listingId,
        amount: "2.50",
      });

      return { success: true, message: "Contact revealed" };
    }),
});

const franchiseRouter = router({
  myShields: protectedProcedure.query(async ({ ctx }) => {
    return getDomainShieldsByOperator(ctx.user.id);
  }),

  provisionShield: protectedProcedure
    .input(z.object({
      nameplate: z.string().min(1),
      provisionType: z.enum(["apex_provisioned", "bring_your_own"]),
      tarwellDomain: z.string().optional(),
      toritoDomain: z.string().optional(),
      vaultDomain: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.user as any;
      // Backend-enforced RBAC for franchise features
      if (user.subscriptionTier !== "pro" && user.role !== "operator" && user.role !== "admin") {
        throw new Error("Pro/Franchise tier required for domain shield provisioning");
      }

      const tarwellDomain = input.provisionType === "apex_provisioned"
        ? `tarwell.${input.nameplate}.com`
        : input.tarwellDomain || null;
      const toritoDomain = input.provisionType === "apex_provisioned"
        ? `torito.${input.nameplate}.com`
        : input.toritoDomain || null;
      const vaultDomain = input.provisionType === "apex_provisioned"
        ? `vault.${input.nameplate}.com`
        : input.vaultDomain || null;

      const result = await createDomainShield({
        operatorId: ctx.user.id,
        nameplate: input.nameplate,
        provisionType: input.provisionType,
        tarwellDomain,
        toritoDomain,
        vaultDomain,
        sslStatus: "provisioning",
        tristarStatus: "initializing",
        config: { createdBy: ctx.user.id, timestamp: Date.now() },
      });

      // Record franchise fee transaction with provenance
      await recordTransaction({
        type: "franchise_fee",
        buyerId: ctx.user.id,
        amount: "99.99",
      });

      return {
        id: result.id,
        message: "Domain shield provisioning initiated. SSL + TriStar routing will activate within 24hrs.",
      };
    }),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  listings: listingsRouter,
  franchise: franchiseRouter,
});

export type AppRouter = typeof appRouter;
