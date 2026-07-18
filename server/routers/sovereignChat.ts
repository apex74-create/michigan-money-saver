import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  TwelveDimensionalArmor,
  CoinHole,
  encodeSovereignMessage,
  decodeSovereignMessage,
  SovereignPEEngine,
  TriStarSuperpositionRouter,
} from "../sovereign-engines";

/**
 * Sovereign Chat Router — Franchise Tier Secure Communication
 * 4-layer sovereign stack: Vertex → 12D Armor → CoinHole → Subscription Envelope
 */
export const sovereignChatRouter = router({
  /**
   * Initialize a coinhole session for sovereign chat.
   * Returns the coinhole ID and peer ID for this session.
   */
  initSession: protectedProcedure
    .input(
      z.object({
        tristarValue: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const tristarValue =
        input.tristarValue || Math.floor(Math.random() * 0x7fffffff);
      const coinhole = new CoinHole(tristarValue, Date.now());

      return {
        userId: ctx.user.id,
        coinholeId: coinhole.id,
        peerId: coinhole.peerId,
        tierLabel: coinhole.tierLabel,
        coinScore: coinhole.coinScore,
        tristarValue,
      };
    }),

  /**
   * Encode a message using 12D armor for sovereign transmission.
   * Returns the armored envelope ready to send.
   */
  encodeMessage: protectedProcedure
    .input(
      z.object({
        text: z.string(),
        tristarValue: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const coinhole = new CoinHole(input.tristarValue, Date.now());
      const encoded = encodeSovereignMessage(
        input.text,
        coinhole,
        input.tristarValue
      );

      return {
        envelope: encoded.envelope,
        armoredPayload: encoded.armoredPayload,
        peEpoch: encoded.peEpoch,
        success: true,
      };
    }),

  /**
   * Decode an armored message.
   * Returns the original vertex data if decoding succeeds.
   */
  decodeMessage: protectedProcedure
    .input(
      z.object({
        envelope: z.any(),
        excludePeerId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const vertex = decodeSovereignMessage(
          input.envelope,
          input.excludePeerId
        );
        if (!vertex) {
          return { success: false, message: "Failed to decode message" };
        }

        return {
          success: true,
          data: vertex.data,
          label: vertex.label,
          timestamp: vertex.ts,
          vid: vertex.vid,
        };
      } catch (error) {
        return {
          success: false,
          message: "Decoding error: " + String(error),
        };
      }
    }),

  /**
   * Get current PE (Phase Envelope) timing for synchronization.
   * Used to ensure both peers are in the same encryption window.
   */
  getPEStatus: publicProcedure.query(async () => {
    const peEngine = new SovereignPEEngine();
    await peEngine.init();

    const now = Date.now();
    const pe = peEngine.calculatePE(now);
    const inAperture = peEngine.isInAperture(now);

    return {
      peValue: pe,
      inAperture,
      timestamp: now,
      alignedEpoch: TwelveDimensionalArmor.alignedEpoch(now),
      windowMs: TwelveDimensionalArmor.PE_WINDOW,
    };
  }),

  /**
   * Calculate TriStar routing value for proof-of-ownership.
   * Used in domain shield coin routine and transaction verification.
   */
  calculateTriStarRoute: protectedProcedure
    .input(
      z.object({
        threatLevel: z.number().optional().default(0),
        sessionAge: z.number().optional().default(0),
      })
    )
    .query(async ({ input }) => {
      const peEngine = new SovereignPEEngine();
      await peEngine.init();

      const router = new TriStarSuperpositionRouter(peEngine);
      const route = router.route(Date.now());

      return {
        tristarValue: route.value,
        path: route.path,
        phase: route.phase,
        timestamp: Date.now(),
      };
    }),

  /**
   * Validate armor key synchronization between peers.
   * Both peers should generate identical keys for the same epoch.
   */
  validateArmorSync: publicProcedure
    .input(
      z.object({
        epoch: z.number(),
      })
    )
    .query(async ({ input }) => {
      const keys = TwelveDimensionalArmor.generateKeys(input.epoch);
      const keyArray = Array.from(keys);

      return {
        epoch: input.epoch,
        keyCount: keyArray.length,
        keySum: keyArray.reduce((a, b) => a + b, 0),
        aligned: TwelveDimensionalArmor.alignedEpoch(input.epoch) === input.epoch,
      };
    }),

  /**
   * Test encode/decode round-trip for debugging.
   * Verifies 12D armor is working correctly.
   */
  testRoundTrip: protectedProcedure
    .input(
      z.object({
        testMessage: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const timestamp = Date.now();

      // Encode
      const encoded = TwelveDimensionalArmor.encode(input.testMessage, timestamp);

      // Decode
      const decoded = TwelveDimensionalArmor.decode(encoded, timestamp);

      return {
        original: input.testMessage,
        encoded: encoded.substring(0, 50) + "...",
        decoded,
        success: decoded === input.testMessage,
      };
    }),
});
