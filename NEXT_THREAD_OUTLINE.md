# MICHIGAN MONEY SAVER — NEXT EXECUTION THREAD OUTLINE

## PHASE 2: DYNAMIC LANDING PAGE + MARKETPLACE AGGREGATION

### 2.1 Landing Page Content Propagation
- **Zip Code Input** — User enters zip code on page load
- **Auto-Populate with 12 Initial Listings** — Fetch from open-source sales APIs / local listings database
- **Instacart-Style Feed** — Grid layout showing items for sale in the area
- **Live Feed Updates** — New listings appear as they're posted

### 2.2 Advertising Slots (Margin/Body Divs)
- **Top Banner Ad Slot** — Large vendor ads (Cars.com, eBay, Facebook Marketplace, etc.)
- **Sidebar Ad Slots** — Medium-sized vendor ads
- **In-Feed Ad Slots** — Native advertising between listings
- **Revenue Model** — CPM or CPC basis for vendor partnerships

### 2.3 Browse Page Enhancements
- **Preserve existing grid + map view**
- **Add filter sidebar** — Category, price range, distance, date posted
- **Add sort options** — Newest, price (low-to-high), distance
- **Keep paywall logic intact** — Contact reveal still gated by subscription tier

---

## PHASE 3: COMMISSION STRUCTURE EXPLAINER + NETWORK TIERS

### 3.1 Landing Page Explainer Section
- **How It Works** — Seller posts → Platform takes commission → Seller gets paid
- **Tier Progression** — Visual showing 1 site → 10 sites → 12-site mesh
- **Revenue Split Visualization** — Show % breakdown (platform, operator, vendors)

### 3.2 Garage Sale Network Tiers UI
- **Free Tier** — 1 site, basic listing, no contact reveal
- **Basic Tier** ($9.99/mo) — 1 site, contact reveal, analytics
- **Operator Tier** ($99.99/mo) — 10 sites, 15% commission split
- **Franchise Tier** ($499.99/mo) — 12-site mesh, 3-domain shields, full security tooling

### 3.3 Security Tool Upsells
- **TARWELL Tarpit** — Attacker trap configuration
- **TORITO Tunnel** — Encrypted data relay
- **VAULT Evidence Seal** — Provenance hashing
- **TriStar Routing** — Mesh traffic control
- **Sovereign Chat** — Encrypted messaging
- **Sovereign Search** — Privacy-first search

---

## PHASE 4: 3D MESH DASHBOARD (GPS-DENIED)

### 4.1 Dual-Plane Map Rendering
- **Top-Down View** — Standard map with vendor nodes
- **3D Isometric View** — Layered mesh topology showing signal paths
- **Node Visualization** — Balls representing each mesh participant
- **Signal Lines** — Showing smeared butter routing between nodes

### 4.2 Sovereign Search
- **Works with or without GPS** — Triangulation-based location if GPS unavailable
- **Search Bar** — Find vendors, items, services in the mesh
- **Filter Results** — By category, distance, availability

### 4.3 Mesh Health Telemetry
- **Signal Strength Meter** — Real-time mesh signal quality
- **Connected Nodes Count** — How many devices in the mesh
- **TriStar Status** — Routing state (ACTIVE, ROUTING, STANDBY)
- **Encryption Status** — AES-256-GCM indicator

---

## PHASE 5: SMEARED CHAT ROUTING + NODE METADATA

### 5.1 Chat System
- **Node-to-Node Messaging** — Tap a node ball to open chat
- **Smeared Routing** — Messages guided by butter surface topology
- **Offline Capability** — Messages queue if recipient offline, deliver on reconnect

### 5.2 Node Ball Metadata
- **On Tap** — Show vendor name, items count, distance, rating
- **Routing Source Info** — Which infrastructure the node bumped into (cell tower, WiFi, etc.)
- **Signal Quality** — RSSI indicator for this specific node

---

## PHASE 6: MASTER ADMIN DASHBOARD (AIR TRAFFIC CONTROLLER)

### 6.1 Revenue Breakdown
- **Total Platform Revenue** — Real-time sum of all commissions
- **Operator Revenue** — Per-operator breakdown
- **Vendor Revenue** — Per-vendor breakdown
- **Commission Split Visualization** — Pie chart showing 15%/5%/80% split

### 6.2 Mesh Operations Center
- **Live Node Map** — All active nodes in the system
- **Traffic Flow** — Real-time packet routing visualization
- **PE Envelope Status** — 369ms phase envelope oscillation display
- **Alert System** — Anomalies, jams, routing issues

### 6.3 Managed Credits System
- **Credit Allocation** — Assign credits to operators/vendors
- **Usage Tracking** — Credits consumed per transaction
- **Tier Upgrades** — One-click upgrade path for users

---

## IMPLEMENTATION NOTES

- **No major refactoring** — Keep existing Home, Browse, CreateListing, Dashboard pages intact
- **Additive only** — New components slot into existing architecture
- **Keep tRPC procedures** — Extend routers.ts with new procedures as needed
- **Database schema** — Already supports listings, transactions, users with tiers
- **Testing** — Add vitest for new procedures before delivery

---

## CHECKPOINT STRATEGY

- **After Phase 2** — Landing page with aggregation working, ads slots rendering
- **After Phase 3** — Explainer + tier UI complete, pricing page updated
- **After Phase 4** — 3D mesh dashboard functional (GPS-denied mode)
- **After Phase 5** — Chat routing + node metadata wired
- **After Phase 6** — Master admin dashboard live with revenue telemetry
- **FINAL** — All tests passing, screenshots taken, ready for publish

