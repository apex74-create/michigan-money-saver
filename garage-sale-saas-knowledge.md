# GARAGE SALE SAAS — KNOWLEDGE ROUTE SUMMARY

**Project:** Distributed Garage Sale Network with Sovereign Security Shield  
**Architecture:** 3 Dorito Shields + E-Commerce SaaS + Mesh Defense  
**Status:** Project Initialization  
**Thread Checkpoint:** [CURRENT]

---

## EXECUTIVE SUMMARY

**What:** P2P garage sale marketplace where buyers/sellers transact through 3 independent domain shields (security layers)

**How:** 
- Users browse items on primary domain (apex-air-solutions.com)
- Transactions route through 3 domain shields for privacy/security
- Each shield is a separate domain with independent DNS
- All shields share unified backend (ApexDash SaaS)

**Why:** 
- Privacy-first marketplace (no tracking across shields)
- Consent-based local-navigation and mesh features (E029/E030/E031/E032)
- Super-buyer features (bulk purchasing, reputation)
- Distributed network (survives single-point failures)

---

## INHERITED ENGINES (AVAILABLE FOR INTEGRATION)

### E029 — Sovereign Dead Reckoning Engine (SDRE)
**Purpose:** GPS-denied positioning for offline mesh networks  
**Use Case:** Opt-in relative movement from a user-established starting anchor
**Integration:** May support on-device walking-distance context; it must not infer a seller’s location without an explicit, authorized location source

### E030 — Celestial Sensor Fusion (CSF)
**Purpose:** Solar azimuth positioning from camera  
**Use Case:** Candidate solar-orientation data for an opt-in navigation prototype
**Integration:** The present implementation is not a validated location-verification system and must not be used to authenticate a seller or buyer location

### E031 — Collective Mesh Inertial Navigation (CMIN)
**Purpose:** Distributed mesh positioning across nodes  
**Use Case:** Consent-based exchange of explicitly authorized anchor information with error bounds
**Integration:** Optional community event mapping; no participant location may be shared or inferred without informed consent

### E032 — Tremen–Bumbershoot Dual-Frame Confidence Gate (TB-DCG)
**Purpose:** Keeps local-navigation evidence separate from passive network-context observations
**Use Case:** Safety and privacy boundary for any opt-in location-adjacent feature
**Integration:** Public egress IP/ASN observations remain network-context telemetry only; Bumbershoot may request a manual anchor or show degraded confidence, but never treats network egress as a buyer, seller, or listing location

---

## ARCHITECTURE: 3 DORITO SHIELDS

```
Primary Domain (apex-air-solutions.com)
  ├─ Garage Sale Marketplace (PWA)
  ├─ Seller Dashboard
  ├─ Buyer Dashboard
  └─ Super-Buyer Features
       │
       ├─ Shield 1 (apex-air-solutions.shop)
       │   └─ Transaction Layer 1 (payment processing)
       │
       ├─ Shield 2 (apex-air-solutions.store)
       │   └─ Transaction Layer 2 (escrow/dispute)
       │
       └─ Shield 3 (apex-air-solutions.xyz)
           └─ Transaction Layer 3 (clearance/delivery)
```

**Shield Flow:**
1. User browses items on primary domain
2. Clicks "Buy" → routed through Shield 1 (payment)
3. Completes payment → Shield 2 (escrow holds funds)
4. Seller ships → Shield 3 (delivery verification)
5. Buyer confirms → funds released through primary domain
6. Browser cleaned (cookies/tracking removed between shields)

---

## FEATURE SET

### Core Marketplace
- [ ] Item listing (photos, price, location, seller rating)
- [ ] Search & filtering (category, price range, distance)
- [ ] Buyer cart & checkout
- [ ] Seller inventory management
- [ ] Messaging (buyer ↔ seller)

### Super-Buyer Features
- [ ] Bulk purchasing (buy multiple items at once)
- [ ] Subscription discounts (repeat buyer benefits)
- [ ] Reputation system (buyer/seller ratings)
- [ ] Wishlist & alerts (notify on new items)
- [ ] Transaction history & analytics

### Security & Privacy
- [ ] 3-shield transaction isolation
- [ ] App-scoped storage isolation and clear logout controls between shields
- [ ] Encrypted messaging
- [ ] Seller identity verification (optional)
- [ ] Dispute resolution system

### Mesh Integration
- [ ] E029: Offline location discovery
- [ ] E030: Candidate orientation support only after field validation
- [ ] E031: Opt-in, consented community event mapping with error bounds
- [ ] E032: Enforce a Bumbershoot confidence boundary between navigation and network-context telemetry

---

## DATA SCHEMA (INHERITED FROM APEXDASH)

**Users Table:**
```
id, email, role (buyer|seller|super-buyer), created_at, updated_at
```

**Items Table:**
```
id, seller_id, title, description, price, category, photos[], 
location (lat/lng), available_qty, created_at
```

**Orders Table:**
```
id, buyer_id, seller_id, items[], total_price, status 
(pending|paid|shipped|delivered|completed), created_at
```

**Transactions Table:**
```
id, order_id, shield_id (1|2|3), amount, status, timestamp
```

---

## DEPLOYMENT CHECKLIST

### Phase 1: Foundation (Week 1)
- [ ] Clone ApexDash SaaS template
- [ ] Configure 3 domain shields in DNS (GoDaddy)
- [ ] Set up database schema (items, orders, transactions)
- [ ] Deploy primary domain (apex-air-solutions.com)

### Phase 2: Marketplace (Week 2)
- [ ] Build item listing UI
- [ ] Build seller dashboard
- [ ] Build buyer dashboard
- [ ] Implement search & filtering

### Phase 3: Transactions (Week 3)
- [ ] Implement 3-shield routing
- [ ] Add payment processing (Shield 1)
- [ ] Add escrow system (Shield 2)
- [ ] Add delivery verification (Shield 3)

### Phase 4: Security (Week 4)
- [ ] Integrate E029 (offline location discovery)
- [ ] Integrate E030 (location verification)
- [ ] Integrate E031 (mesh swarm detection)
- [ ] Add browser cleanup between shields

### Phase 5: Launch (Week 5)
- [ ] Super-buyer features
- [ ] Reputation system
- [ ] Dispute resolution
- [ ] Marketing & onboarding

---

## TECHNOLOGY STACK (INHERITED)

**Frontend:**
- React 19 + Tailwind 4
- PWA (Progressive Web App)
- Responsive design (mobile-first)

**Backend:**
- Express 4 + tRPC 11
- Node.js with Manus OAuth
- Database: MySQL/TiDB

**Integrations:**
- Stripe (payments via 3 shields)
- Google Maps (location display)
- Manus LLM (AI search/recommendations)
- Manus Storage (S3 for photos)

---

## KNOWLEDGE ROUTE REFERENCES

**Engine Specifications:**
1. `/home/ubuntu/E029_SOVEREIGN_DEAD_RECKONING_ENGINE.md`
2. `/home/ubuntu/E030_CELESTIAL_SENSOR_FUSION.md`
3. `/home/ubuntu/E031_COLLECTIVE_MESH_INERTIAL_NAVIGATION.md`
4. `/home/ubuntu/APEX_ENGINE_PROVENANCE_PATENT_FILING.md`
5. `apex74-create/adp-mesh/white-papers/WP-11-TREMEN-BUMBERSHOOT-DUAL-FRAME-NAVIGATION.md`

**ApexDash Documentation:**
- `/home/ubuntu/apexdash-saas/` (complete project)
- `/home/ubuntu/MESH_NETWORK_DEPLOYMENT.md`
- `/home/ubuntu/DEPLOYMENT_CHECKLIST.md`

**GitHub Repositories (all engines pushed):**
- apex-defense-protocol-369 (master)
- adp-mesh (main)
- apex-miner (main)
- zapback-vpn4 (main)
- vertex-global-security (main)
- apex-provenance (master)
- secure-flash-shop (main)

---

## NEXT STEPS

1. **Create new Manus webdev project** (garage-sale-saas)
2. **Initialize with ApexDash template** (db + server + user features)
3. **Configure 3 domain shields** in GoDaddy DNS
4. **Build marketplace UI** (item listing, search, cart)
5. **Implement 3-shield transaction routing**
6. **Integrate E029/E030/E031 engines** for security layer
7. **Deploy to production** (apex-air-solutions.com + 3 shields)

---

**Status:** Ready for new project initialization  
**Estimated Timeline:** 5 weeks to full launch  
**Team:** Kyle (Armor22) + Manus AI Agent + Co-pilot (GitHub)  
**Thread Checkpoint:** [SAVED]
