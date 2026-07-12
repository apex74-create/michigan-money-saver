# Project TODO — Michigan Money Saver (GarageSaveR)

- [x] Vertex Sales System: percentage-based commission on transactions
- [x] Platform fee tracking and operator/franchise revenue split
- [x] Transaction ledger with sealed provenance (Apex_SHA~512# style)
- [x] Database schema: users with subscription tiers, listings, listing_photos, domain_shields, inquiries
- [x] Database schema: transactions table with commission splits and status tracking
- [x] Design system: OLED black theme, JetBrains Mono font, terminal green/brass/classified red palette
- [x] Landing page with animated DORITO TRIANGLE graphic and platform overview
- [x] Subscription tier pricing section (Free / Basic / Pro/Franchise)
- [x] User authentication with subscription tier management and role-based access
- [x] Listing creation form (title, description, address, date/time, photos, categories)
- [x] Searchable/filterable listings grid view
- [ ] Searchable/filterable listings map view (placeholder — topographical mesh coming)
- [x] Paywall-gated seller contact reveal (Basic/Pro required)
- [x] Seller dashboard (manage listings, view inquiries, track performance)
- [x] Operator/franchise onboarding panel
- [x] DORITO TRIANGLE domain shield setup (TARWELL / TORITO / VAULT)
- [x] TriStar routing UI
- [x] Vitest unit tests for core procedures (10 passing)
- [x] Garage Band Mesh: QR-gated event marketplace (Power User tier feature)
- [x] Event mesh concept on landing page as premium showcase

## Phase 2 — Backend Hardening (Next Sprint)
- [ ] Implement transaction creation + commission split on contact reveal
- [ ] Add Apex_SHA~512# provenance hash generation for transaction sealing
- [ ] Photo upload integration via S3 storage helpers
- [ ] Backend-enforced RBAC for operator/franchise procedures
- [ ] Subscription tier management flow (Stripe-ready when activated)
- [ ] Seller listing management actions (edit, delete, status toggle)
- [ ] Inquiries backend + UI for buyer-seller messaging
- [ ] Persist domain shield records through tRPC procedures
- [ ] TriStar routing state machine with real status updates
- [ ] Garage Band Mesh event creation + QR entry flow
