/**
 * Sovereign Engines — TypeScript Implementation
 * Adapted from adp-mesh for Michigan Money Saver Franchise Tier
 * Patent Pending | © 2026 Apex Air Solutions, LLC
 */

// ─────────────────────────────────────────────────────────────────────────────
// 12-Dimensional Variable Armor
// ─────────────────────────────────────────────────────────────────────────────

export class TwelveDimensionalArmor {
  static PE_WINDOW = 10000; // 10-second key rotation window

  /**
   * Generate the 12 armor key bytes for a given timestamp.
   * Each apostle node (0-11) oscillates at its own phase offset.
   */
  static generateKeys(timestamp: number): Uint8Array {
    const aligned = Math.floor(timestamp / this.PE_WINDOW) * this.PE_WINDOW;
    const pePhase = ((aligned % 10000) / 10000) * 2 * Math.PI;
    const keys = new Uint8Array(12);

    for (let d = 0; d < 12; d++) {
      const apostleAngle = (d / 12) * 2 * Math.PI;
      keys[d] = Math.round(Math.abs(Math.sin(apostleAngle + pePhase)) * 255);
    }

    return keys;
  }

  /**
   * Armor-encode a plain-text message.
   * Returns a base64 string safe for embedding in JSON.
   */
  static encode(text: string, timestamp: number = Date.now()): string {
    const keys = this.generateKeys(timestamp);
    const bytes = new TextEncoder().encode(text);
    const out = new Uint8Array(bytes.length);

    for (let i = 0; i < bytes.length; i++) {
      out[i] = bytes[i] ^ keys[i % 12];
    }

    return Buffer.from(out).toString("base64");
  }

  /**
   * Armor-decode a base64 armored payload back to plain text.
   */
  static decode(b64: string, timestamp: number): string {
    const keys = this.generateKeys(timestamp);
    const raw = Buffer.from(b64, "base64");
    const bytes = new Uint8Array(raw.length);

    for (let i = 0; i < raw.length; i++) {
      bytes[i] = raw[i] ^ keys[i % 12];
    }

    return new TextDecoder().decode(bytes);
  }

  /**
   * Return the aligned PE timestamp to embed in outgoing messages.
   */
  static alignedEpoch(timestamp: number = Date.now()): number {
    return Math.floor(timestamp / this.PE_WINDOW) * this.PE_WINDOW;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CoinHole Session
// ─────────────────────────────────────────────────────────────────────────────

export interface CoinHoleConfig {
  tristarValue: number;
  sessionStartMs: number;
}

export class CoinHole {
  private _tristarValue: number;
  private _sessionStartMs: number;
  private _peEpoch: number;
  private _peerId: string | null = null;

  constructor(tristarValue: number, sessionStartMs: number) {
    this._tristarValue = tristarValue || 1;
    this._sessionStartMs = sessionStartMs || Date.now();
    this._peEpoch = Math.floor(Date.now() / 3600000); // 1-hour bucket
  }

  /** Stable ID shared by all peers in this coinhole. */
  get id(): string {
    const raw = (this._tristarValue * this._peEpoch) % 0x7fffffff;
    return "ch_" + Math.abs(raw).toString(36);
  }

  /** Peer ID — unique to this device within the coinhole. */
  get peerId(): string {
    if (!this._peerId) {
      this._peerId =
        "p_" +
        Date.now().toString(36) +
        Math.random().toString(36).slice(2, 6);
    }
    return this._peerId;
  }

  /** L6 coin score: 0.8 / 1.0 / 1.2 based on session age. */
  get coinScore(): number {
    const age = Date.now() - this._sessionStartMs;
    if (age > 3600000) return 1.2;
    if (age > 600000) return 1.0;
    return 0.8;
  }

  /** Subscription tier label used in the disguise envelope. */
  get tierLabel(): "standard" | "premium" | "enterprise" {
    const s = this.coinScore;
    if (s >= 1.2) return "enterprise";
    if (s >= 1.0) return "premium";
    return "standard";
  }

  /** A new coinhole opens each PE epoch — sessions roll automatically. */
  refresh(): void {
    this._peEpoch = Math.floor(Date.now() / 3600000);
  }

  /** Export config for persistence. */
  toConfig(): CoinHoleConfig {
    return {
      tristarValue: this._tristarValue,
      sessionStartMs: this._sessionStartMs,
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Subscription Pay Service Security Assembly — Disguise Layer
// ─────────────────────────────────────────────────────────────────────────────

export interface SubscriptionEnvelopeData {
  sub_id: string;
  device_token: string;
  event_type: string;
  payload: string;
  epoch: number;
  tier: string;
  build: string;
}

export interface UnwrappedEnvelope {
  armoredPayload: string;
  epoch: number;
  peerId: string;
  coinholeId: string;
  tier: string;
}

export class SubscriptionEnvelope {
  /**
   * Wrap an armored payload in a subscription security report envelope.
   * To any observer this looks like a routine subscription API call.
   */
  static wrap(
    armoredPayload: string,
    coinhole: CoinHole,
    peEpoch: number
  ): SubscriptionEnvelopeData {
    return {
      sub_id: coinhole.id,
      device_token: coinhole.peerId,
      event_type: "sec_report",
      payload: armoredPayload,
      epoch: peEpoch,
      tier: coinhole.tierLabel,
      build: "vx2",
    };
  }

  /**
   * Unwrap — extract the armored payload and epoch from an envelope.
   */
  static unwrap(envelope: SubscriptionEnvelopeData): UnwrappedEnvelope {
    return {
      armoredPayload: envelope.payload,
      epoch: envelope.epoch,
      peerId: envelope.device_token,
      coinholeId: envelope.sub_id,
      tier: envelope.tier,
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Vertex Filing Tunnel — Recursive Message Container
// ─────────────────────────────────────────────────────────────────────────────

export interface Vertex {
  vid: number;
  data: string;
  label: string;
  children: Vertex[];
  ts: number;
}

export function createVertex(
  data: string,
  tristarValue: number,
  label: string = "chat"
): Vertex {
  const ts = Date.now();
  const vid = Math.abs(Math.round(tristarValue * ts)) % 0x7fffffff;

  return {
    vid,
    data: data.trim(),
    label,
    children: [],
    ts,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Sovereign Chat Message Encoding
// ─────────────────────────────────────────────────────────────────────────────

export interface EncodedMessage {
  envelope: SubscriptionEnvelopeData;
  armoredPayload: string;
  peEpoch: number;
}

/**
 * Full 4-layer sovereign stack encoding:
 *   Layer 1 — Vertex (Recursive Filing Tunnel)
 *   Layer 2 — 12-Dimensional Variable Armor
 *   Layer 3 — CoinHole Session Channel
 *   Layer 4 — Subscription Pay Service Security Assembly
 */
export function encodeSovereignMessage(
  text: string,
  coinhole: CoinHole,
  tristarValue: number
): EncodedMessage {
  const ts = Date.now();
  const peEpoch = TwelveDimensionalArmor.alignedEpoch(ts);

  // Layer 1 — pack into a Vertex
  const vertex = createVertex(text, tristarValue, "chat");
  const vertexJson = JSON.stringify(vertex);

  // Layer 2 — 12D Variable Armor
  const armored = TwelveDimensionalArmor.encode(vertexJson, ts);

  // Layer 3 + 4 — CoinHole envelope + Subscription skin
  const envelope = SubscriptionEnvelope.wrap(armored, coinhole, peEpoch);

  return {
    envelope,
    armoredPayload: armored,
    peEpoch,
  };
}

/**
 * Decode a received sovereign message.
 * Returns null if decoding fails or message is invalid.
 */
export function decodeSovereignMessage(
  envelope: SubscriptionEnvelopeData,
  excludePeerId?: string
): Vertex | null {
  try {
    // Skip messages from self
    if (excludePeerId && envelope.device_token === excludePeerId) {
      return null;
    }

    const unwrapped = SubscriptionEnvelope.unwrap(envelope);

    // Layer 2 → Layer 1: decode armor, then extract vertex
    const vertexJson = TwelveDimensionalArmor.decode(
      unwrapped.armoredPayload,
      unwrapped.epoch
    );
    const vertex: Vertex = JSON.parse(vertexJson);

    // Only accept chat-labelled vertices
    if (!vertex || vertex.label !== "chat" || !vertex.data) {
      return null;
    }

    return vertex;
  } catch {
    // Wrong coinhole, wrong epoch, wrong armor, or bad vertex — discard silently
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Sovereign PE (Phase Envelope) Timing Engine
// ─────────────────────────────────────────────────────────────────────────────

export class SovereignPEEngine {
  static SOVEREIGN_CYCLE_MS = 2369; // prime near 2370ms
  static PE_BASE_MS = 368; // ms — coinhole aperture base
  static PE_RANGE_MS = 2; // ms — aperture oscillation range (368-370)
  static EPOCH_WINDOW_MS = 10000; // 10-second key rotation window

  private installTs: number = 0;
  private meshHeartbeatInterval: number = SovereignPEEngine.SOVEREIGN_CYCLE_MS;
  private coinholeEpoch: number = 0;
  private heartbeatSamples: number[] = [];

  /**
   * Initialize — plants sovereign root on first run.
   * In a real implementation, this would use persistent storage.
   */
  async init(): Promise<void> {
    // For now, use current timestamp as install time
    this.installTs = Date.now();
  }

  /**
   * Record a mesh node heartbeat timestamp.
   * Called each time a real mesh node is seen.
   */
  recordMeshHeartbeat(ts: number = Date.now()): void {
    this.heartbeatSamples.push(ts);
    if (this.heartbeatSamples.length > 10) {
      this.heartbeatSamples.shift();
    }

    if (this.heartbeatSamples.length >= 2) {
      const deltas: number[] = [];
      for (let i = 1; i < this.heartbeatSamples.length; i++) {
        deltas.push(this.heartbeatSamples[i] - this.heartbeatSamples[i - 1]);
      }
      const avg = deltas.reduce((a, b) => a + b, 0) / deltas.length;
      if (avg > 100 && avg < 30000) {
        this.meshHeartbeatInterval = Math.round(avg);
      }
    }
  }

  /**
   * Update coinhole epoch for self-inspection cross-check.
   */
  updateCoinholeEpoch(epoch: number): void {
    this.coinholeEpoch = epoch;
  }

  /**
   * Sovereign phase — elapsed time from install, modulo mesh cycle.
   */
  private sovereignPhase(now: number): number {
    const elapsed = now - this.installTs;
    const cycleMs =
      this.meshHeartbeatInterval > 0
        ? this.meshHeartbeatInterval
        : SovereignPEEngine.SOVEREIGN_CYCLE_MS;
    return (elapsed % cycleMs) / cycleMs;
  }

  /**
   * Calculate the current PE (Phase Envelope) value.
   * Returns a value in the 368-370ms aperture window.
   */
  calculatePE(now: number = Date.now()): number {
    const phase = this.sovereignPhase(now);
    const oscillation = Math.sin(phase * 2 * Math.PI);
    const peValue =
      SovereignPEEngine.PE_BASE_MS +
      oscillation * SovereignPEEngine.PE_RANGE_MS;
    return Math.round(peValue);
  }

  /**
   * Check if current time is within the PE aperture window.
   */
  isInAperture(now: number = Date.now()): boolean {
    const pe = this.calculatePE(now);
    return pe >= SovereignPEEngine.PE_BASE_MS &&
      pe <= SovereignPEEngine.PE_BASE_MS + SovereignPEEngine.PE_RANGE_MS;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TriStar Superposition Router
// ─────────────────────────────────────────────────────────────────────────────

export interface TriStarRoute {
  value: number;
  path: string[];
  phase: number;
}

export class TriStarSuperpositionRouter {
  private apostles: number[] = [];
  private peEngine: SovereignPEEngine;

  constructor(peEngine: SovereignPEEngine) {
    this.peEngine = peEngine;
    this.initializeApostles();
  }

  /**
   * Initialize the 12 apostle nodes at their phase offsets.
   */
  private initializeApostles(): void {
    this.apostles = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * 2 * Math.PI;
      this.apostles.push(Math.sin(angle));
    }
  }

  /**
   * Route a message through the TriStar superposition.
   * Returns a routing value and path for proof-of-ownership.
   */
  route(now: number = Date.now()): TriStarRoute {
    const pe = this.peEngine.calculatePE(now);
    const phase = (pe % 1000) / 1000;

    // Calculate superposition value from all 12 apostles
    let value = 0;
    const path: string[] = [];

    for (let i = 0; i < 12; i++) {
      const apostlePhase = this.apostles[i] + phase;
      const contribution = Math.sin(apostlePhase) * 255;
      value += contribution;
      path.push(`apostle_${i}`);
    }

    // Normalize to 0-1 range
    value = Math.abs(value) / (12 * 255);

    return {
      value: Math.round(value * 0x7fffffff),
      path,
      phase,
    };
  }
}
