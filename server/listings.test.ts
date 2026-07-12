import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

function createAuthContext(overrides: Partial<NonNullable<TrpcContext["user"]>> = {}): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user-123",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
      ...overrides,
    } as any,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

describe("listings.search", () => {
  it("returns an array (empty or populated) for public access", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.listings.search({});
    expect(Array.isArray(result)).toBe(true);
  });

  it("accepts search, category, and city filters", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.listings.search({
      search: "garage",
      category: "furniture",
      city: "Detroit",
    });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("listings.create", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.listings.create({
        title: "Test Sale",
        category: "general",
        address: "123 Main St",
        city: "Detroit",
        state: "MI",
        zip: "48201",
        saleDate: new Date().toISOString(),
      })
    ).rejects.toThrow();
  });
});

describe("listings.revealContact", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.listings.revealContact({ listingId: 1 })
    ).rejects.toThrow();
  });

  it("rejects free tier users", async () => {
    const ctx = createAuthContext({ subscriptionTier: "free" } as any);
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.listings.revealContact({ listingId: 999 })
    ).rejects.toThrow(/Basic or Pro subscription required/);
  });
});

describe("listings.myListings", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.listings.myListings()).rejects.toThrow();
  });

  it("returns array for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.listings.myListings();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("listings.myStats", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.listings.myStats()).rejects.toThrow();
  });

  it("returns stats object for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.listings.myStats();
    expect(result).toHaveProperty("activeListings");
    expect(result).toHaveProperty("totalViews");
    expect(result).toHaveProperty("totalReveals");
    expect(result).toHaveProperty("estimatedRevenue");
  });
});
