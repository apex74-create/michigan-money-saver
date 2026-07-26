import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Radio, Zap, Shield, Lock, Globe, Star, RefreshCw, Send } from "lucide-react";

// ── 12-Star Topology Visualizer ───────────────────────────────────────────────
function StarTopology({
  traversal,
  active,
}: {
  traversal: { point: number; label: string; status: string }[];
  active: boolean;
}) {
  const cx = 120, cy = 120, r = 90;
  const points = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), i };
  });

  return (
    <svg viewBox="0 0 240 240" className="w-full max-w-[240px] mx-auto">
      {/* Star lines */}
      {points.map((p, i) => {
        const next = points[(i + 1) % 12];
        const t = traversal[i];
        const passed = t?.status === "passed";
        return (
          <line
            key={i}
            x1={p.x} y1={p.y} x2={next.x} y2={next.y}
            stroke={passed ? "#00ff88" : "#1a1a1a"}
            strokeWidth={passed ? 1.5 : 0.5}
            className={passed ? "drop-shadow-[0_0_4px_#00ff88]" : ""}
          />
        );
      })}
      {/* Cross lines through center */}
      {[0, 1, 2, 3, 4, 5].map(i => {
        const p = points[i], opp = points[i + 6];
        const t = traversal[i];
        const passed = t?.status === "passed";
        return (
          <line key={`cross-${i}`}
            x1={p.x} y1={p.y} x2={opp.x} y2={opp.y}
            stroke={passed ? "#b08840" : "#111"}
            strokeWidth={0.5}
            strokeDasharray="2,4"
          />
        );
      })}
      {/* Center dot */}
      <circle cx={cx} cy={cy} r={4} fill={active ? "#00ff88" : "#333"}
        className={active ? "animate-pulse" : ""} />
      {/* Star points */}
      {points.map((p, i) => {
        const t = traversal[i];
        const passed = t?.status === "passed";
        const isDorito = i < 3;
        return (
          <g key={i}>
            <circle
              cx={p.x} cy={p.y} r={isDorito ? 7 : 5}
              fill={passed ? (isDorito ? "#ff3366" : "#00ff88") : "#0a0a0a"}
              stroke={passed ? (isDorito ? "#ff3366" : "#00ff88") : "#333"}
              strokeWidth={1.5}
              className={passed ? "drop-shadow-[0_0_6px_#00ff88]" : ""}
            />
            <text
              x={p.x} y={p.y - 10}
              textAnchor="middle"
              fontSize="6"
              fill={passed ? "#00ff88" : "#444"}
              fontFamily="monospace"
            >
              {t?.label?.substring(0, 7) || `A${i}`}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Coin Status Badge ─────────────────────────────────────────────────────────
function CoinBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    minting: "border-brass text-brass",
    traversing: "border-terminal text-terminal animate-pulse",
    verified: "border-terminal text-terminal",
    expired: "border-red-500 text-red-500",
    rejected: "border-red-500 text-red-500",
  };
  return (
    <span className={`text-[9px] border px-2 py-0.5 font-mono tracking-widest ${colors[status] || "border-muted-foreground text-muted-foreground"}`}>
      {status.toUpperCase()}
    </span>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ApexNetwork() {
  const { user, isAuthenticated } = useAuth();
  const [selectedSite, setSelectedSite] = useState("");
  const [activeCoin, setActiveCoin] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{ from: string; text: string; ts: number }[]>([]);
  const [traversalState, setTraversalState] = useState<{ point: number; label: string; status: string }[]>([]);
  const [autoTraverse, setAutoTraverse] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const { data: sites } = trpc.apexNetwork.listSites.useQuery();
  const { data: myCoins, refetch: refetchCoins } = trpc.apexNetwork.myCoins.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: coinStatus, refetch: refetchStatus } = trpc.apexNetwork.getCoinStatus.useQuery(
    { coinHash: activeCoin! },
    { enabled: !!activeCoin, refetchInterval: activeCoin ? 2000 : false }
  );

  const mintMutation = trpc.apexNetwork.mintCoin.useMutation({
    onSuccess: (data) => {
      setActiveCoin(data.coinHash);
      setTraversalState(data.traversal.map(t => ({ point: t.point, label: t.label, status: t.status })));
      toast.success("12-STAR COIN MINTED — TRAVERSAL INITIATED");
      refetchCoins();
      if (autoTraverse) {
        setTimeout(() => runFullMutation.mutate({ coinHash: data.coinHash }), 500);
      }
    },
    onError: (e) => toast.error(e.message),
  });

  const runFullMutation = trpc.apexNetwork.runFullTraversal.useMutation({
    onSuccess: (data) => {
      setTraversalState(data.traversal.map((t: any) => ({ point: t.point, label: t.label, status: t.status })));
      toast.success("✓ " + data.message);
      refetchCoins();
      refetchStatus();
    },
    onError: (e) => toast.error(e.message),
  });

  const { data: peStatus } = trpc.sovereignChat.getPEStatus.useQuery(undefined, {
    refetchInterval: 5000,
  });

  // Sync traversal state from coin status
  useEffect(() => {
    if (coinStatus?.traversal) {
      setTraversalState((coinStatus.traversal as any[]).map((t: any) => ({
        point: t.point, label: t.label, status: t.status,
      })));
    }
  }, [coinStatus]);

  const handleSendChat = () => {
    if (!chatInput.trim() || !coinStatus?.coinholeOpen) return;
    setMessages(prev => [...prev, { from: user?.name || "YOU", text: chatInput, ts: Date.now() }]);
    setChatInput("");
    setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4 border border-terminal/20 bg-card p-8">
            <Star size={32} className="text-terminal/50 mx-auto" />
            <div className="text-terminal text-sm font-bold tracking-wider">APEX NETWORK ACCESS REQUIRED</div>
            <p className="text-muted-foreground text-xs">Connect to access the 12-Star CoinHole network</p>
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
          <div className="border-b border-terminal/20 pb-4 mb-6">
            <p className="text-[9px] tracking-[0.5em] text-brass uppercase">APEX AIR SOLUTIONS LLC — PATENT PENDING</p>
            <h1 className="text-xl font-bold text-terminal tracking-wider mt-1">
              APEX NETWORK — 12-STAR COINHOLE
            </h1>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              CROSS-SITE SOVEREIGN CHAT · COIN TRAVERSES ALL 12 STAR POINTS BEFORE COINHOLE OPENS
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Left — Star Topology + Coin Mint */}
            <div className="space-y-4">
              {/* Star Visualizer */}
              <div className="border border-terminal/30 bg-card/50 p-4 space-y-3">
                <div className="text-[10px] tracking-widest text-terminal uppercase flex items-center gap-2">
                  <Star size={12} /> 12-STAR TOPOLOGY
                </div>
                <StarTopology
                  traversal={traversalState.length ? traversalState : Array.from({ length: 12 }, (_, i) => ({ point: i, label: `A${i}`, status: "pending" }))}
                  active={coinStatus?.coinholeOpen || false}
                />
                {coinStatus && (
                  <div className="space-y-1 text-[9px]">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">PROGRESS</span>
                      <span className="text-terminal">{coinStatus.passedCount}/12 POINTS</span>
                    </div>
                    <div className="h-1 bg-background border border-terminal/20 overflow-hidden">
                      <div
                        className="h-full bg-terminal transition-all duration-500"
                        style={{ width: `${coinStatus.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">STATUS</span>
                      <CoinBadge status={coinStatus.status} />
                    </div>
                    {coinStatus.coinholeOpen && (
                      <div className="text-terminal text-center text-[10px] border border-terminal/30 py-1 animate-pulse">
                        ● COINHOLE OPEN — SOVEREIGN CHAT ACTIVE
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* PE Status */}
              {peStatus && (
                <div className="border border-terminal/20 bg-card/50 p-3 space-y-1 text-[9px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">PE APERTURE</span>
                    <span className={peStatus.inAperture ? "text-terminal" : "text-brass"}>
                      {peStatus.inAperture ? "● LOCKED" : "○ DRIFTING"}
                    </span>
                  </div>
                  <div className="h-1 bg-background border border-terminal/20 overflow-hidden">
                    <div
                      className={`h-full transition-all ${peStatus.inAperture ? "bg-terminal" : "bg-brass"}`}
                      style={{ width: `${Math.max(5, Math.min(100, ((peStatus.peValue - 366) / 6) * 100))}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Center — Mint + Chat */}
            <div className="space-y-4">
              {/* Mint Coin */}
              <div className="border border-brass/30 bg-card/50 p-4 space-y-3">
                <div className="text-[10px] tracking-widest text-brass uppercase flex items-center gap-2">
                  <Zap size={12} /> MINT 12-STAR COIN
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] text-muted-foreground uppercase tracking-widest">TARGET APEX SITE</label>
                  <select
                    value={selectedSite}
                    onChange={e => setSelectedSite(e.target.value)}
                    className="w-full bg-background border border-terminal/30 text-foreground text-[10px] px-3 py-2 font-mono focus:outline-none focus:border-terminal"
                  >
                    <option value="">— SELECT TARGET SITE —</option>
                    {sites?.map(s => (
                      <option key={s.id} value={s.domain}>{s.label} ({s.domain})</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="autoTraverse"
                    checked={autoTraverse}
                    onChange={e => setAutoTraverse(e.target.checked)}
                    className="accent-terminal"
                  />
                  <label htmlFor="autoTraverse" className="text-[9px] text-muted-foreground">
                    AUTO-TRAVERSE ALL 12 POINTS
                  </label>
                </div>
                <Button
                  onClick={() => {
                    if (!selectedSite) { toast.error("Select a target site"); return; }
                    mintMutation.mutate({ targetSite: selectedSite });
                  }}
                  disabled={mintMutation.isPending || !selectedSite}
                  className="w-full bg-brass text-background text-[10px] tracking-widest uppercase"
                >
                  <Star size={12} className="mr-2" />
                  {mintMutation.isPending ? "MINTING..." : "MINT 12-STAR COIN"}
                </Button>
                {activeCoin && !coinStatus?.coinholeOpen && (
                  <Button
                    onClick={() => runFullMutation.mutate({ coinHash: activeCoin })}
                    disabled={runFullMutation.isPending}
                    variant="outline"
                    className="w-full border-terminal text-terminal text-[10px] tracking-widest uppercase"
                  >
                    <Zap size={12} className="mr-2" />
                    {runFullMutation.isPending ? "TRAVERSING..." : "RUN FULL TRAVERSAL"}
                  </Button>
                )}
              </div>

              {/* Sovereign Chat */}
              <div className="border border-terminal/30 bg-card/50 p-4 space-y-3">
                <div className="text-[10px] tracking-widest text-terminal uppercase flex items-center gap-2">
                  <Radio size={12} className={coinStatus?.coinholeOpen ? "animate-pulse" : ""} />
                  SOVEREIGN CHAT
                  {coinStatus?.coinholeOpen && (
                    <span className="text-[8px] text-terminal border border-terminal/30 px-1">OPEN</span>
                  )}
                </div>
                {!coinStatus?.coinholeOpen ? (
                  <div className="text-[10px] text-muted-foreground text-center py-6 border border-terminal/10">
                    MINT A COIN AND COMPLETE 12-STAR TRAVERSAL<br />
                    <span className="text-[9px]">TO OPEN THE COINHOLE</span>
                  </div>
                ) : (
                  <>
                    <div className="h-36 overflow-y-auto space-y-2 border border-terminal/10 bg-background/50 p-2 text-xs">
                      {messages.length === 0 && (
                        <div className="text-muted-foreground text-[10px] text-center pt-4">
                          ▸ COINHOLE ACTIVE — COINHOLE ID: {coinStatus.coinholeId}
                        </div>
                      )}
                      {messages.map((m, i) => (
                        <div key={i} className="flex items-baseline gap-2">
                          <span className="text-brass text-[9px]">{m.from}</span>
                          <span className="text-foreground">{m.text}</span>
                        </div>
                      ))}
                      <div ref={chatBottomRef} />
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleSendChat()}
                        placeholder="TRANSMIT SOVEREIGN MESSAGE..."
                        className="flex-1 bg-background border border-terminal/30 text-foreground text-[10px] px-3 py-1.5 font-mono placeholder:text-muted-foreground/40 focus:outline-none focus:border-terminal"
                      />
                      <Button onClick={handleSendChat} disabled={!chatInput.trim()} className="bg-terminal text-background h-8 px-3">
                        <Send size={12} />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right — My Coins + Network Sites */}
            <div className="space-y-4">
              {/* Network Sites */}
              <div className="border border-terminal/20 bg-card/50 p-4 space-y-2">
                <div className="text-[10px] tracking-widest text-terminal uppercase flex items-center gap-2">
                  <Globe size={12} /> APEX NETWORK SITES
                </div>
                {sites?.map(s => (
                  <div key={s.id} className="flex items-center justify-between border border-white/5 px-2 py-1.5">
                    <div>
                      <div className="text-[9px] text-foreground">{s.label}</div>
                      <div className="text-[8px] text-muted-foreground truncate">{s.domain}</div>
                    </div>
                    <span className="text-[8px] text-terminal border border-terminal/20 px-1">{s.role.toUpperCase()}</span>
                  </div>
                ))}
              </div>

              {/* My Coins */}
              <div className="border border-brass/20 bg-card/50 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] tracking-widest text-brass uppercase flex items-center gap-2">
                    <Shield size={12} /> MY COINS
                  </div>
                  <button onClick={() => refetchCoins()} className="text-muted-foreground hover:text-terminal">
                    <RefreshCw size={10} />
                  </button>
                </div>
                {!myCoins?.length ? (
                  <div className="text-[9px] text-muted-foreground text-center py-3">NO COINS MINTED YET</div>
                ) : (
                  myCoins.slice(0, 5).map((c: any) => (
                    <div
                      key={c.id}
                      className={`border px-2 py-1.5 cursor-pointer transition-colors ${activeCoin === c.coinHash ? "border-terminal bg-terminal/5" : "border-white/5 hover:border-terminal/30"}`}
                      onClick={() => setActiveCoin(c.coinHash)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] text-muted-foreground truncate w-32">{c.coinHash.substring(0, 24)}...</span>
                        <CoinBadge status={c.status} />
                      </div>
                      <div className="text-[8px] text-muted-foreground mt-0.5 truncate">{c.targetSite}</div>
                    </div>
                  ))
                )}
              </div>

              {/* DORITO TRIANGLE Status */}
              <div className="border border-terminal/20 bg-card/50 p-4 space-y-2">
                <div className="text-[10px] tracking-widest text-terminal uppercase">DORITO TRIANGLE</div>
                {[
                  { label: "TARWELL", passed: coinStatus?.tarwellPassed, color: "text-red-400" },
                  { label: "TORITO", passed: coinStatus?.toritoPassed, color: "text-brass" },
                  { label: "VAULT", passed: coinStatus?.vaultPassed, color: "text-terminal" },
                ].map(({ label, passed, color }) => (
                  <div key={label} className="flex items-center justify-between border border-white/5 px-2 py-1">
                    <span className={`text-[9px] ${color}`}>{label}</span>
                    <span className={`text-[9px] ${passed ? "text-terminal" : "text-muted-foreground"}`}>
                      {passed ? "● PASSED" : "○ PENDING"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
