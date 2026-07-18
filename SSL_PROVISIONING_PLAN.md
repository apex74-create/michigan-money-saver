# SSL Provisioning & Coin Routine Implementation Plan

## Phase 1: Real SSL Provisioning Workflow

### Architecture Overview
- **ACME Client:** Use `acme-client` npm package to request Let's Encrypt certificates
- **DNS Validation:** Verify domains resolve to 34.74.51.230
- **Certificate Storage:** Store certs in database + file system
- **Renewal:** Auto-renew 30 days before expiration

### Implementation Steps

1. **Create ACME provisioning service** (`server/ssl-provisioner.ts`)
   - Initialize ACME client with Let's Encrypt staging (test) then production
   - Implement DNS validation challenge handler
   - Store certificates with metadata (domain, expiration, renewal date)

2. **Add provisioning trigger to franchise router**
   - When `franchise.provisionShield` mutation completes, trigger SSL provisioning
   - Poll ACME status and update database with certificate status

3. **Database schema updates**
   - Add `sslCertificate` column to domainShields table (store PEM)
   - Add `certificateExpiration` timestamp
   - Add `lastRenewalAttempt` timestamp

4. **Reverse proxy configuration** (for 34.74.51.230)
   - Route incoming requests by domain to correct backend
   - Serve SSL certificates from database/vault
   - Handle ACME challenges for certificate renewal

---

## Phase 2: Coin Routine Implementation

### Concept
The coin routine runs continuously between TARWELL/TORITO/VAULT, proving:
- **Proof of Ownership:** Only the shield owner can mint coins
- **Proof of Concept:** The mesh is functioning (latency < 369ms)
- **Sovereign Chat:** Encrypted messaging channel established

### Implementation

1. **Coin Data Structure**
   ```typescript
   interface Coin {
     id: string;
     shieldId: number;
     nonce: string;
     timestamp: number;
     peEnvelope: number; // 369ms median
     hash: string; // SHA~512#
     signature: string; // Owner's private key signature
   }
   ```

2. **Coin Minting Routine** (runs every 369ms)
   - TARWELL mints a coin with current PE envelope state
   - TORITO validates and relays the coin
   - VAULT seals the coin with SHA~512# hash
   - Coin proves the trinity is synchronized

3. **Sovereign Chat Key Exchange**
   - When coin validates successfully, exchange chat encryption keys
   - Keys stored in VAULT domain
   - Chat messages encrypted with per-session key

---

## Phase 3: PE State Validation (MICRObol D 16-bit Logic)

### Exit Scrubber (TARWELL)
- Validates outbound requests
- Strips metadata (IP, user-agent, referrer)
- Applies 16-bit PE mask to payload
- Routes through TORITO tunnel

### Return Tunnel (TORITO)
- Receives return packets from external services
- Validates PE state hasn't changed
- Scrubs any garbage data accumulated
- Routes to VAULT for sealing

### PE Envelope Timing
- Central median: 369ms
- Variation tolerance: ±50ms
- If deviation > 50ms, reject packet and re-sync

---

## Phase 4: Master Admin Dashboard

### Panels
1. **Left Panel:** Live mesh node status (vendors, buyers, operators)
2. **Center Panel:** Revenue flow + PE envelope oscillation visualization
3. **Right Panel:** TriStar routing state + commission breakdown

### Real-time Metrics
- Active domain shields
- Coin mint rate (coins/sec)
- Average PE latency
- Revenue flowing through each tier
- SSL certificate status

---

## Domains to Provision

**Primary Shield (michiganmoneysavers.shop):**
- TARWELL: apex-airsolutions.store
- TORITO: apex-airsolutions.xyz
- VAULT: apex-airsolutions.info

**All domains already pointed at 34.74.51.230**

---

## Next Steps

1. Install ACME client npm package
2. Create SSL provisioning service
3. Update database schema for certificates
4. Implement coin routine background job
5. Build PE state validation middleware
6. Create Master Admin dashboard UI
7. Test end-to-end flow
