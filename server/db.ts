import { eq, and, like, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, listings, transactions, contactReveals, domainShields, inquiries } from "../drizzle/schema";
import type { InsertListing, InsertTransaction, InsertDomainShield } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── USER QUERIES ───────────────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }

    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── LISTING QUERIES ────────────────────────────────────────────────────────

export async function createListing(data: Omit<InsertListing, "id" | "createdAt" | "updatedAt" | "viewCount" | "contactRevealCount">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(listings).values({ ...data, status: "active" });
  return { id: result[0].insertId };
}

export async function searchListings(params: { search?: string; category?: string; city?: string; limit?: number }) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(listings).where(eq(listings.status, "active")).orderBy(desc(listings.createdAt)).limit(params.limit || 50);

  // We'll use raw conditions for filtering
  const conditions: any[] = [eq(listings.status, "active")];
  if (params.category) conditions.push(eq(listings.category, params.category as any));
  if (params.city) conditions.push(like(listings.city, `%${params.city}%`));
  if (params.search) conditions.push(like(listings.title, `%${params.search}%`));

  const results = await db.select().from(listings).where(and(...conditions)).orderBy(desc(listings.createdAt)).limit(params.limit || 50);
  return results;
}

export async function getListingById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(listings).where(eq(listings.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getListingsBySeller(sellerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(listings).where(eq(listings.sellerId, sellerId)).orderBy(desc(listings.createdAt));
}

export async function incrementViewCount(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(listings).set({ viewCount: sql`${listings.viewCount} + 1` }).where(eq(listings.id, id));
}

export async function getSellerStats(sellerId: number) {
  const db = await getDb();
  if (!db) return { activeListings: 0, totalViews: 0, totalReveals: 0, estimatedRevenue: "0.00" };

  const sellerListings = await db.select().from(listings).where(eq(listings.sellerId, sellerId));
  const activeListings = sellerListings.filter(l => l.status === "active").length;
  const totalViews = sellerListings.reduce((sum, l) => sum + (l.viewCount || 0), 0);
  const totalReveals = sellerListings.reduce((sum, l) => sum + (l.contactRevealCount || 0), 0);
  // Estimated revenue: each reveal is worth ~$2 to the seller (80% of a $2.50 reveal fee)
  const estimatedRevenue = (totalReveals * 2).toFixed(2);

  return { activeListings, totalViews, totalReveals, estimatedRevenue };
}

// ─── CONTACT REVEAL QUERIES ─────────────────────────────────────────────────

export async function hasRevealedContact(buyerId: number, listingId: number) {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select().from(contactReveals)
    .where(and(eq(contactReveals.buyerId, buyerId), eq(contactReveals.listingId, listingId)))
    .limit(1);
  return result.length > 0;
}

export async function recordContactReveal(buyerId: number, sellerId: number, listingId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(contactReveals).values({ buyerId, sellerId, listingId });
  await db.update(listings).set({ contactRevealCount: sql`${listings.contactRevealCount} + 1` }).where(eq(listings.id, listingId));
}

export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function recordTransaction(data: {
  type: "subscription" | "contact_reveal" | "listing_boost" | "franchise_fee";
  buyerId: number;
  sellerId?: number;
  listingId?: number;
  operatorId?: number;
  amount: string;
  platformPercentage?: string;
  operatorPercentage?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const amount = parseFloat(data.amount);
  const platformPct = parseFloat(data.platformPercentage || "15.00");
  const operatorPct = parseFloat(data.operatorPercentage || "5.00");
  const platformFee = (amount * platformPct / 100).toFixed(2);
  const operatorCommission = data.operatorId ? (amount * operatorPct / 100).toFixed(2) : "0.00";
  const sellerPayout = (amount - parseFloat(platformFee) - parseFloat(operatorCommission)).toFixed(2);

  // Generate provenance hash (Apex_SHA~512# style)
  const provenanceData = `${data.type}:${data.buyerId}:${data.sellerId || 0}:${Date.now()}:${amount}`;
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("SHA-512", encoder.encode(provenanceData));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const provenanceHash = `Apex_SHA~512#${hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 64)}`;

  const result = await db.insert(transactions).values({
    type: data.type,
    buyerId: data.buyerId,
    sellerId: data.sellerId || null,
    listingId: data.listingId || null,
    operatorId: data.operatorId || null,
    amount: data.amount,
    platformFee,
    operatorCommission,
    sellerPayout,
    platformPercentage: platformPct.toFixed(2),
    operatorPercentage: operatorPct.toFixed(2),
    status: "completed",
    provenanceHash,
  });

  return { id: result[0].insertId, provenanceHash };
}

// ─── DOMAIN SHIELD QUERIES ──────────────────────────────────────────────────

export async function getDomainShieldsByOperator(operatorId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(domainShields).where(eq(domainShields.operatorId, operatorId));
}

export async function createDomainShield(data: Omit<InsertDomainShield, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(domainShields).values(data);
  return { id: result[0].insertId };
}
