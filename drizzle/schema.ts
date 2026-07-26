import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table with subscription tier management.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "operator"]).default("user").notNull(),
  subscriptionTier: mysqlEnum("subscriptionTier", ["free", "basic", "pro"]).default("free").notNull(),
  subscriptionExpiresAt: timestamp("subscriptionExpiresAt"),
  phone: varchar("phone", { length: 32 }),
  address: text("address"),
  city: varchar("city", { length: 128 }),
  state: varchar("state", { length: 64 }),
  zip: varchar("zip", { length: 16 }),
  bio: text("bio"),
  avatarUrl: text("avatarUrl"),
  operatorId: int("operatorId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Garage/yard sale listings with full details.
 */
export const listings = mysqlTable("listings", {
  id: int("id").autoincrement().primaryKey(),
  sellerId: int("sellerId").notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", [
    "general", "furniture", "electronics", "clothing", "tools",
    "toys", "books", "sports", "automotive", "collectibles", "other"
  ]).default("general").notNull(),
  address: text("address").notNull(),
  city: varchar("city", { length: 128 }).notNull(),
  state: varchar("state", { length: 64 }).notNull(),
  zip: varchar("zip", { length: 16 }).notNull(),
  lat: decimal("lat", { precision: 10, scale: 7 }),
  lng: decimal("lng", { precision: 10, scale: 7 }),
  saleDate: timestamp("saleDate").notNull(),
  saleEndDate: timestamp("saleEndDate"),
  priceMin: decimal("priceMin", { precision: 10, scale: 2 }),
  priceMax: decimal("priceMax", { precision: 10, scale: 2 }),
  status: mysqlEnum("status", ["draft", "active", "ended", "cancelled"]).default("draft").notNull(),
  viewCount: int("viewCount").default(0).notNull(),
  contactRevealCount: int("contactRevealCount").default(0).notNull(),
  photos: json("photos").$type<string[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Listing = typeof listings.$inferSelect;
export type InsertListing = typeof listings.$inferInsert;

/**
 * Transaction ledger — every paywall reveal or subscription payment.
 * Tracks platform fee, operator commission, and seller payout.
 */
export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["subscription", "contact_reveal", "listing_boost", "franchise_fee"]).notNull(),
  buyerId: int("buyerId").notNull(),
  sellerId: int("sellerId"),
  listingId: int("listingId"),
  operatorId: int("operatorId"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  platformFee: decimal("platformFee", { precision: 10, scale: 2 }).notNull(),
  operatorCommission: decimal("operatorCommission", { precision: 10, scale: 2 }).default("0.00").notNull(),
  sellerPayout: decimal("sellerPayout", { precision: 10, scale: 2 }).default("0.00").notNull(),
  platformPercentage: decimal("platformPercentage", { precision: 5, scale: 2 }).default("15.00").notNull(),
  operatorPercentage: decimal("operatorPercentage", { precision: 5, scale: 2 }).default("5.00").notNull(),
  status: mysqlEnum("status", ["pending", "completed", "refunded", "failed"]).default("pending").notNull(),
  provenanceHash: varchar("provenanceHash", { length: 128 }),
  metadata: json("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

/**
 * Contact reveal records — who unlocked whose info.
 */
export const contactReveals = mysqlTable("contactReveals", {
  id: int("id").autoincrement().primaryKey(),
  buyerId: int("buyerId").notNull(),
  sellerId: int("sellerId").notNull(),
  listingId: int("listingId").notNull(),
  transactionId: int("transactionId"),
  revealedAt: timestamp("revealedAt").defaultNow().notNull(),
});

export type ContactReveal = typeof contactReveals.$inferSelect;

/**
 * DORITO TRIANGLE Domain Shields — 3-domain defense assembly per operator.
 */
export const domainShields = mysqlTable("domainShields", {
  id: int("id").autoincrement().primaryKey(),
  operatorId: int("operatorId").notNull(),
  nameplate: varchar("nameplate", { length: 128 }).notNull(),
  tarwellDomain: varchar("tarwellDomain", { length: 256 }),
  toritoDomain: varchar("toritoDomain", { length: 256 }),
  vaultDomain: varchar("vaultDomain", { length: 256 }),
  provisionType: mysqlEnum("provisionType", ["apex_provisioned", "bring_your_own"]).default("apex_provisioned").notNull(),
  sslStatus: mysqlEnum("sslStatus", ["pending", "provisioning", "active", "failed"]).default("pending").notNull(),
  tristarStatus: mysqlEnum("tristarStatus", ["offline", "initializing", "routing", "active"]).default("offline").notNull(),
  config: json("config").$type<Record<string, unknown>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DomainShield = typeof domainShields.$inferSelect;
export type InsertDomainShield = typeof domainShields.$inferInsert;

/**
 * Inquiries — messages from buyers about listings.
 */
export const inquiries = mysqlTable("inquiries", {
  id: int("id").autoincrement().primaryKey(),
  listingId: int("listingId").notNull(),
  buyerId: int("buyerId").notNull(),
  sellerId: int("sellerId").notNull(),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["unread", "read", "replied"]).default("unread").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = typeof inquiries.$inferInsert;

/**
 * Apex Network Tokens — 12-Star CoinHole cross-site proof-of-ownership tokens.
 * A coin traverses all 12 star points before the coinhole opens for sovereign chat.
 * Patent Pending | © 2026 Apex Air Solutions, LLC
 */
export const apexNetworkTokens = mysqlTable("apexNetworkTokens", {
  id: int("id").autoincrement().primaryKey(),
  // Minting site info
  mintedBy: int("mintedBy").notNull(),           // user ID who minted
  sourceSite: varchar("sourceSite", { length: 256 }).notNull(),  // origin domain
  targetSite: varchar("targetSite", { length: 256 }).notNull(),  // destination domain
  // 12-Star topology
  coinholeId: varchar("coinholeId", { length: 64 }).notNull(),   // ch_xxx session ID
  tristarValue: varchar("tristarValue", { length: 32 }).notNull(), // hex routing value
  peEpoch: varchar("peEpoch", { length: 32 }).notNull(),          // PE aligned epoch
  // The coin itself — SHA-512 hash of all 12 star points
  coinHash: varchar("coinHash", { length: 128 }).notNull(),       // Apex_SHA~512# token
  // 12 star point traversal log (JSON array of {point, ts, status})
  starTraversal: json("starTraversal").$type<{
    point: number; label: string; ts: number; status: "pending" | "passed" | "failed";
  }[]>(),
  // Routing path through DORITO TRIANGLE
  tarwellPassed: boolean("tarwellPassed").default(false).notNull(),
  toritoPassed: boolean("toritoPassed").default(false).notNull(),
  vaultPassed: boolean("vaultPassed").default(false).notNull(),
  // Status
  status: mysqlEnum("status", ["minting", "traversing", "verified", "expired", "rejected"])
    .default("minting").notNull(),
  // Chat session opened after coin verification
  chatSessionId: varchar("chatSessionId", { length: 64 }),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ApexNetworkToken = typeof apexNetworkTokens.$inferSelect;
export type InsertApexNetworkToken = typeof apexNetworkTokens.$inferInsert;
