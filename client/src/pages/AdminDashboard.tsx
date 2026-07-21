import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  Shield, Radio, Zap, Lock, Globe, Terminal,
  Activity, Send, RefreshCw, Eye, EyeOff, AlertTriangle
} from "lucide-react";

// ── PE Timing Meter ──────────────────────────────────────────────────────────
function PETimingMeter({ peValue, inAperture }: { peValue: number; inAperture: boolean }) {
  const pct = ((peValue - 366) / 6) * 100;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[10px] tracking-widest">
        <span className="text-muted-foreground uppercase">PE APERTURE</span>
        <span className={inAperture ? "text-terminal animate-pulse" : "text-brass"}>
          {peValue}ms {inAperture ? "● LOCKED" : "○ DRIFTING"}
        </span>
      </div>
      <div className="h-1.5 bg-card border border-terminal/20 rounded-none overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${inAperture ? "bg-terminal" : "bg-brass"}`}
          style={{ width: `${Math.max(2, Math.min(100, pct))}%` }}
        />
      </div>
      <div className="flex justify-between text-[9px] text-muted-foreground">
        <span>368ms</span><span>369ms</span><span>370ms</span>
      </div>
    </div>
  );
}

// ── Armor Key Visualizer ─────────────────────────────────────────────────────
function ArmorKeyGrid({ keySum }: { keySum: number }) {
  const keys = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * 2 * Math.PI;
    const val = Math.round(Math.abs(Math.sin(angle + (keySum / 3060) * 2 * Math.PI)) * 255);
    return val;
  });
  return (
    <div className="grid grid-cols-6 gap-1">
      {keys.map((k, i) => (
        <div key={i} className="text-center">
          <div
            className="h-6 w-full border border-terminal/30 transition-all duration-300"
            style={{ backgroundColor: `rgba(0,255,136,${k / 255 * 0.8})` }}
          />
          <div className="text-[8px] text-muted-foreground mt-0.5">A{i}</div>
        </div>
      ))}
    </div>
  );
}

// ── Sovereign Chat Panel ─────────────────────────────────────────────────────
function SovereignChatPanel() {
  const [messages, setMessages] = useState<{ from: string; text: string; ts: number; armored?: string }[]>([]);
  const [input, setInput] = useState("");
  const [session, setSession] = useState<{ coinholeId: string; peerId: string; tristarValue: number } | null>(null);
  const [showArmor, setShowArmor] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const initMutation = trpc.sovereignChat.initSession.useMutation({
    onSuccess: (data) => {
      setSession({ coinholeId: data.coinholeId, peerId: data.peerId, tristarValue: data.tristarValue });
      toast.success(`COINHOLE OPEN: ${data.coinholeId}`);
    },
  });

  const encodeMutation = trpc.sovereignChat.encodeMessage.useMutation({
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        from: "YOU",
        text: input,
        ts: data.peEpoch,
        armored: data.armoredPayload.substring(0, 32) + "...",
      }]);
      setInput("");
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    },
  });

  const testMutation = trpc.sovereignChat.testRoundTrip.useMutation({
    onSuccess: (data) => {
      toast.success(data.success ? `✓ ARMOR VERIFIED: ${data.decoded}` : "✗ ARMOR MISMATCH");
    },
  });

  const handleSend = () => {
    if (!input.trim() || !session) return;
    encodeMutation.mutate({ text: input, tristarValue: session.tristarValue });
  };

  return (
    <div className="border border-terminal/30 bg-card/50 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-[10px] tracking-widest text-terminal uppercase flex items-center gap-2">
          <Radio size={12} className="animate-pulse" /> SOVEREIGN CHAT
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowArmor(v => !v)}
            className="text-[9px] text-muted-foreground hover:text-terminal transition-colors flex items-center gap-1"
          >
            {showArmor ? <EyeOff size={10} /> : <Eye size={10} />} ARMOR
          </button>
          {!session ? (
            <Button
              size="sm"
              onClick={() => initMutation.mutate({})}
              disabled={initMutation.isPending}
              className="bg-terminal text-background text-[9px] tracking-widest h-6 px-2"
            >
              OPEN COINHOLE
            </Button>
          ) : (
            <span className="text-[9px] text-terminal border border-terminal/30 px-2 py-0.5">
              {session.coinholeId}
            </span>
          )}
        </div>
      </div>

      {session && (
        <>
          <div className="h-40 overflow-y-auto space-y-2 font-mono text-xs border border-terminal/10 bg-background/50 p-2">
            {messages.length === 0 && (
              <div className="text-muted-foreground text-[10px] text-center pt-4">
                ▸ COINHOLE ACTIVE — SEND FIRST MESSAGE
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className="space-y-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-brass text-[9px]">{m.from}</span>
                  <span className="text-foreground">{m.text}</span>
                </div>
                {showArmor && m.armored && (
                  <div className="text-[8px] text-muted-foreground pl-4 break-all">
                    ▸ ARMORED: {m.armored}
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder="TRANSMIT SOVEREIGN MESSAGE..."
              className="flex-1 bg-background border border-terminal/30 text-foreground text-xs px-3 py-1.5 font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:border-terminal"
            />
            <Button
              onClick={handleSend}
              disabled={encodeMutation.isPending || !input.trim()}
              className="bg-terminal text-background h-8 px-3"
            >
              <Send size={12} />
            </Button>
          </div>

          <button
            onClick={() => testMutation.mutate({ testMessage: "APEX_ARMOR_TEST_" + Date.now() })}
            className="text-[9px] text-muted-foreground hover:text-terminal transition-colors"
          >
            ▸ RUN ARMOR ROUND-TRIP TEST
          </button>
        </>
      )}

      {!session && (
        <div className="text-[10px] text-muted-foreground text-center py-4">
          Open a coinhole to begin sovereign encrypted communication
        </div>
      )}
    </div>
  );
}

// ── TriStar Route Panel ───────────────────────────────────────────────────────
function TriStarRoutePanel() {
  const { data: route, refetch, isFetching } = trpc.sovereignChat.calculateTriStarRoute.useQuery({});

  return (
    <div className="border border-brass/30 bg-card/50 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-[10px] tracking-widest text-brass uppercase flex items-center gap-2">
          <Zap size={12} /> TRISTAR ROUTE
        </div>
        <button onClick={() => refetch()} className="text-muted-foreground hover:text-terminal transition-colors">
          <RefreshCw size={10} className={isFetching ? "animate-spin" : ""} />
        </button>
      </div>

      {route ? (
        <div className="space-y-2 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">TRISTAR VALUE</span>
            <span className="text-terminal">{route.tristarValue.toString(16).toUpperCase().padStart(8, "0")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">PHASE</span>
            <span className="text-brass">{(route.phase * 100).toFixed(4)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">APOSTLES</span>
            <span className="text-foreground">{route.path.length} NODES</span>
          </div>
          <div className="grid grid-cols-4 gap-1 mt-2">
            {["TARWELL", "TORITO", "VAULT", "APEX"].map((node, i) => (
              <div key={node} className="text-center border border-terminal/20 py-1">
                <div className="text-[8px] text-terminal">●</div>
                <div className="text-[8px] text-muted-foreground">{node}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-[10px] text-muted-foreground text-center py-2">CALCULATING...</div>
      )}
    </div>
  );
}

// ── Domain Shield Status ──────────────────────────────────────────────────────
function DomainShieldStatus({ shields }: { shields: any[] }) {
  if (!shields || shields.length === 0) {
    return (
      <div className="border border-terminal/20 bg-card/50 p-4">
        <div className="text-[10px] text-muted-foreground text-center">
          NO DOMAIN SHIELDS PROVISIONED
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {shields.map((shield: any) => (
        <div key={shield.id} className="border border-terminal/20 bg-card/50 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-terminal text-[10px] tracking-widest font-bold uppercase">
              {shield.nameplate}
            </span>
            <span className={`text-[9px] border px-2 py-0.5 ${
              shield.sslStatus === "active" ? "border-terminal text-terminal" :
              shield.sslStatus === "provisioning" ? "border-brass text-brass animate-pulse" :
              "border-red-500 text-red-500"
            }`}>
              {shield.sslStatus?.toUpperCase() || "UNKNOWN"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[9px] font-mono">
            {[
              { label: "TARWELL", domain: shield.tarwellDomain, color: "text-red-400" },
              { label: "TORITO", domain: shield.toritoDomain, color: "text-brass" },
              { label: "VAULT", domain: shield.vaultDomain, color: "text-terminal" },
            ].map(({ label, domain, color }) => (
              <div key={label} className="border border-white/10 p-1.5">
                <div className={`${color} text-[8px] mb-1`}>{label}</div>
                <div className="text-muted-foreground truncate text-[8px]">
                  {domain || "—"}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Admin Dashboard ──────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = (user as any)?.role === "admin" || (user as any)?.role === "operator";

  const { data: peStatus, refetch: refetchPE } = trpc.sovereignChat.getPEStatus.useQuery(undefined, {
    refetchInterval: 5000,
  });

  const { data: myShields } = trpc.franchise.myShields.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4 border border-terminal/20 bg-card p-8">
            <div className="text-terminal text-sm font-bold tracking-wider">SOVEREIGN ACCESS REQUIRED</div>
            <p className="text-muted-foreground text-xs">Franchise tier required for admin access</p>
            <Button onClick={() => startLogin()} className="bg-terminal text-background text-[10px] tracking-[0.2em] uppercase">
              ▸ CONNECT
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-mono">
      <NavBar />
      <div className="pt-20 pb-16">
        <div className="container max-w-6xl">

          {/* Header */}
          <div className="flex items-center justify-between mb-6 border-b border-terminal/20 pb-4">
            <div>
              <p className="text-[9px] tracking-[0.5em] text-brass uppercase">APEX AIR SOLUTIONS LLC — PATENT PENDING</p>
              <h1 className="text-xl font-bold text-terminal tracking-wider mt-1">
                VERTEX DEFENDER DASHBOARD
              </h1>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                SOVEREIGN MESH OPERATOR CONTROL PLANE
              </p>
            </div>
            <div className="text-right space-y-1">
              <div className="text-[9px] text-muted-foreground">OPERATOR</div>
              <div className="text-terminal text-xs">{user?.name?.toUpperCase()}</div>
              <div className="flex items-center gap-1 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-terminal animate-pulse" />
                <span className="text-[9px] text-terminal">MESH ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: "COINHOLE", value: "SOVEREIGN", color: "text-terminal", icon: <Lock size={12} /> },
              { label: "PE WINDOW", value: peStatus ? `${peStatus.peValue}ms` : "...", color: peStatus?.inAperture ? "text-terminal" : "text-brass", icon: <Activity size={12} /> },
              { label: "SHIELDS", value: `${myShields?.length || 0} ACTIVE`, color: "text-brass", icon: <Shield size={12} /> },
              { label: "TRISTAR", value: "ROUTING", color: "text-terminal", icon: <Radio size={12} /> },
            ].map(({ label, value, color, icon }) => (
              <div key={label} className="border border-terminal/20 bg-card/50 p-3 flex items-center gap-2">
                <span className={color}>{icon}</span>
                <div>
                  <div className="text-[8px] text-muted-foreground">{label}</div>
                  <div className={`text-xs font-bold ${color}`}>{value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Left Column — PE + Armor */}
            <div className="space-y-4">
              <div className="border border-terminal/30 bg-card/50 p-4 space-y-4">
                <div className="text-[10px] tracking-widest text-terminal uppercase flex items-center gap-2">
                  <Activity size={12} /> PHASE ENVELOPE ENGINE
                </div>
                {peStatus ? (
                  <>
                    <PETimingMeter peValue={peStatus.peValue} inAperture={peStatus.inAperture} />
                    <div className="space-y-1 text-[9px]">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ALIGNED EPOCH</span>
                        <span className="text-terminal">{peStatus.alignedEpoch}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">KEY WINDOW</span>
                        <span className="text-brass">{peStatus.windowMs / 1000}s ROTATION</span>
                      </div>
                    </div>
                    <button
                      onClick={() => refetchPE()}
                      className="text-[9px] text-muted-foreground hover:text-terminal transition-colors flex items-center gap-1"
                    >
                      <RefreshCw size={9} /> RESYNC
                    </button>
                  </>
                ) : (
                  <div className="text-[10px] text-muted-foreground text-center py-4">SYNCING...</div>
                )}
              </div>

              <div className="border border-terminal/30 bg-card/50 p-4 space-y-3">
                <div className="text-[10px] tracking-widest text-terminal uppercase flex items-center gap-2">
                  <Terminal size={12} /> 12D ARMOR KEYS
                </div>
                <ArmorKeyGrid keySum={peStatus?.alignedEpoch ? peStatus.alignedEpoch % 3060 : tick * 7} />
                <div className="text-[9px] text-muted-foreground">
                  12 APOSTLE NODES — ROTATING EVERY {peStatus?.windowMs ? peStatus.windowMs / 1000 : 10}s
                </div>
              </div>
            </div>

            {/* Center Column — Sovereign Chat */}
            <div className="space-y-4">
              <SovereignChatPanel />
              <TriStarRoutePanel />
            </div>

            {/* Right Column — Domain Shields */}
            <div className="space-y-4">
              <div className="border border-brass/30 bg-card/50 p-4 space-y-3">
                <div className="text-[10px] tracking-widest text-brass uppercase flex items-center gap-2">
                  <Shield size={12} /> DOMAIN SHIELDS
                </div>
                <DomainShieldStatus shields={myShields || []} />
                <a
                  href="/franchise"
                  className="block text-center text-[9px] text-terminal border border-terminal/30 py-1.5 hover:bg-terminal/10 transition-colors"
                >
                  ▸ PROVISION NEW SHIELD
                </a>
              </div>

              {/* Coin Routine */}
              <div className="border border-terminal/20 bg-card/50 p-4 space-y-3">
                <div className="text-[10px] tracking-widest text-terminal uppercase flex items-center gap-2">
                  <Zap size={12} /> COIN ROUTINE
                </div>
                <div className="space-y-2 text-[9px] font-mono">
                  {[
                    { step: "1", label: "TARWELL CATCH", status: "ACTIVE", color: "text-red-400" },
                    { step: "2", label: "TORITO TUNNEL", status: "ACTIVE", color: "text-brass" },
                    { step: "3", label: "VAULT SEAL", status: "ACTIVE", color: "text-terminal" },
                    { step: "4", label: "APEX SHA HASH", status: "MINTING", color: "text-terminal animate-pulse" },
                  ].map(({ step, label, status, color }) => (
                    <div key={step} className="flex items-center justify-between border border-white/5 px-2 py-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{step}</span>
                        <span className="text-foreground">{label}</span>
                      </div>
                      <span className={color}>{status}</span>
                    </div>
                  ))}
                </div>
                <div className="text-[8px] text-muted-foreground border-t border-white/5 pt-2">
                  PROOF-OF-OWNERSHIP: TARWELL → TORITO → VAULT → APEX
                </div>
              </div>

              {/* ZapBack Radar Placeholder */}
              <div className="border border-red-500/20 bg-card/50 p-4 space-y-3">
                <div className="text-[10px] tracking-widest text-red-400 uppercase flex items-center gap-2">
                  <AlertTriangle size={12} /> ZAPBACK RADAR
                </div>
                <div className="relative h-24 border border-red-500/20 bg-background/50 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full border border-red-500/20" />
                    <div className="absolute w-12 h-12 rounded-full border border-red-500/30" />
                    <div className="absolute w-4 h-4 rounded-full border border-red-500/50" />
                    <div
                      className="absolute w-0.5 h-10 bg-red-500/60 origin-bottom"
                      style={{ transform: `rotate(${(tick * 3) % 360}deg)`, bottom: "50%" }}
                    />
                  </div>
                  <div className="absolute bottom-1 right-2 text-[8px] text-red-400/60">SCANNING</div>
                </div>
                <div className="text-[9px] text-muted-foreground">
                  DEVICE AWARENESS — EVIL TWIN DETECTION
                </div>
                <div className="text-[8px] text-muted-foreground/60 italic">
                  Full ZapBack integration: Franchise tier
                </div>
              </div>
            </div>
          </div>

          {/* Bottom — Sovereign Search */}
          <div className="mt-4 border border-terminal/20 bg-card/50 p-4">
            <div className="flex items-center gap-3">
              <Globe size={14} className="text-terminal" />
              <div className="flex-1">
                <div className="text-[10px] tracking-widest text-terminal uppercase mb-1">SOVEREIGN SEARCH</div>
                <div className="flex gap-2">
                  <input
                    placeholder="SEARCH WITHOUT TRACKING — ROUTES TARWELL → TORITO → VAULT → DUCKDUCKGO"
                    className="flex-1 bg-background border border-terminal/30 text-foreground text-[10px] px-3 py-1.5 font-mono placeholder:text-muted-foreground/40 focus:outline-none focus:border-terminal"
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        const q = (e.target as HTMLInputElement).value.trim();
                        if (q) window.open(`https://duckduckgo.com/?q=${encodeURIComponent(q)}&kp=-2&kl=us-en&k1=-1`, "_blank");
                      }
                    }}
                  />
                  <Button
                    className="bg-terminal text-background text-[9px] tracking-widest h-8 px-3"
                    onClick={(e) => {
                      const inp = (e.currentTarget.previousElementSibling as HTMLInputElement);
                      const q = inp?.value?.trim();
                      if (q) window.open(`https://duckduckgo.com/?q=${encodeURIComponent(q)}&kp=-2&kl=us-en&k1=-1`, "_blank");
                    }}
                  >
                    SEARCH
                  </Button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
