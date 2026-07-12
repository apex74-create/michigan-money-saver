import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import NavBar from "@/components/NavBar";
import DoritoTriangle from "@/components/DoritoTriangle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Shield, Globe, Lock, Radio, Zap, Server } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Franchise() {
  const { user, isAuthenticated } = useAuth();
  const isPro = (user as any)?.subscriptionTier === "pro" || (user as any)?.role === "operator" || (user as any)?.role === "admin";

  const [nameplate, setNameplate] = useState("");
  const [provisionType, setProvisionType] = useState<"apex" | "byod">("apex");
  const [domains, setDomains] = useState({ tarwell: "", torito: "", vault: "" });

  const provisionMutation = trpc.franchise.provisionShield.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const { data: myShields } = trpc.franchise.myShields.useQuery(undefined, { enabled: isAuthenticated && isPro });

  const handleProvision = () => {
    if (!nameplate) {
      toast.error("Enter your business nameplate");
      return;
    }
    provisionMutation.mutate({
      nameplate,
      provisionType: provisionType === "apex" ? "apex_provisioned" : "bring_your_own",
      tarwellDomain: domains.tarwell || undefined,
      toritoDomain: domains.torito || undefined,
      vaultDomain: domains.vault || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="pt-20 pb-16">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-[10px] tracking-[0.4em] text-brass uppercase mb-2">
              OPERATOR / FRANCHISE PANEL
            </p>
            <h1 className="text-3xl font-bold">
              <span className="text-terminal">DORITO TRIANGLE</span>{" "}
              <span className="text-foreground">DOMAIN SHIELD</span>
            </h1>
            <p className="text-muted-foreground text-xs mt-3 max-w-lg mx-auto">
              Three domains form your sovereign defense triangle. TARWELL catches threats,
              TORITO tunnels clean traffic, VAULT seals evidence. Your branded mesh, your rules.
            </p>
          </div>

          {!isAuthenticated ? (
            <div className="text-center py-16 border border-terminal/20 bg-card corner-brackets max-w-md mx-auto">
              <Shield size={32} className="text-terminal/50 mx-auto mb-4" />
              <h3 className="text-sm font-bold text-foreground mb-2">OPERATOR ACCESS REQUIRED</h3>
              <p className="text-[10px] text-muted-foreground mb-4">Pro/Franchise tier required for domain shield setup</p>
              <Button onClick={() => startLogin()} className="bg-terminal text-background text-[10px] tracking-[0.2em] uppercase">
                ▸ CONNECT
              </Button>
            </div>
          ) : !isPro ? (
            <div className="text-center py-16 border border-classified/20 bg-card corner-brackets max-w-md mx-auto">
              <Lock size={32} className="text-classified/50 mx-auto mb-4" />
              <h3 className="text-sm font-bold text-foreground mb-2">PRO/FRANCHISE TIER REQUIRED</h3>
              <p className="text-[10px] text-muted-foreground mb-4">
                Your tier: {(user as any)?.subscriptionTier?.toUpperCase() || "FREE"}
              </p>
              <Button onClick={() => toast.info("Stripe integration coming soon")} className="bg-classified text-background text-[10px] tracking-[0.2em] uppercase">
                ▸ UPGRADE TO PRO ($99.99/mo)
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left: Triangle Visualization + Status */}
              <div className="space-y-6">
                <div className="border border-terminal/20 bg-card p-6 flex justify-center">
                  <DoritoTriangle size={280} />
                </div>

                {/* TriStar Routing Status */}
                <div className="border border-border bg-card p-6">
                  <h3 className="text-[11px] tracking-[0.2em] text-brass uppercase font-bold mb-4">
                    TRISTAR ROUTING STATUS
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: "TARWELL", desc: "Tarpit / Attacker Trap", status: "STANDBY", color: "classified" },
                      { label: "TORITO", desc: "Encrypted Tunnel", status: "STANDBY", color: "info-blue" },
                      { label: "VAULT", desc: "Evidence Seal / VFS", status: "STANDBY", color: "brass" },
                    ].map((node, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border border-border">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full bg-${node.color}/50`} />
                          <div>
                            <div className={`text-[10px] font-bold text-${node.color} tracking-wider`}>{node.label}</div>
                            <div className="text-[9px] text-muted-foreground">{node.desc}</div>
                          </div>
                        </div>
                        <span className="text-[9px] px-2 py-0.5 border border-muted-foreground/30 text-muted-foreground tracking-wider">
                          {node.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <div className="text-[9px] text-muted-foreground tracking-wider">
                      SOVEREIGN SEARCH: TARWELL → TORITO → VAULT
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Setup Form */}
              <div className="space-y-6">
                {/* Provision Type */}
                <div className="border border-border bg-card p-6">
                  <h3 className="text-[11px] tracking-[0.2em] text-brass uppercase font-bold mb-4">
                    ADD DOMAIN SHIELD
                  </h3>

                  <div className="space-y-4">
                    {/* Nameplate */}
                    <div className="space-y-2">
                      <label className="text-[10px] tracking-[0.2em] text-terminal uppercase">BUSINESS NAMEPLATE</label>
                      <Input
                        placeholder="michigan-money-saver"
                        value={nameplate}
                        onChange={(e) => setNameplate(e.target.value)}
                        className="bg-background border-terminal/20"
                      />
                    </div>

                    {/* Provision Type Toggle */}
                    <div className="space-y-2">
                      <label className="text-[10px] tracking-[0.2em] text-terminal uppercase">PROVISION TYPE</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setProvisionType("apex")}
                          className={`p-3 border text-[10px] tracking-wider text-center transition-all ${
                            provisionType === "apex"
                              ? "border-terminal text-terminal bg-terminal/5"
                              : "border-border text-muted-foreground hover:border-terminal/30"
                          }`}
                        >
                          <Server size={14} className="mx-auto mb-1" />
                          APEX PROVISIONED
                        </button>
                        <button
                          onClick={() => setProvisionType("byod")}
                          className={`p-3 border text-[10px] tracking-wider text-center transition-all ${
                            provisionType === "byod"
                              ? "border-brass text-brass bg-brass/5"
                              : "border-border text-muted-foreground hover:border-brass/30"
                          }`}
                        >
                          <Globe size={14} className="mx-auto mb-1" />
                          BRING YOUR OWN
                        </button>
                      </div>
                    </div>

                    {provisionType === "apex" ? (
                      <div className="p-4 border border-terminal/20 bg-terminal/5 space-y-2">
                        <div className="text-[9px] text-terminal tracking-wider">DOMAINS WILL BE ASSIGNED:</div>
                        <div className="text-[10px] text-foreground font-mono">
                          TARWELL.{nameplate || "{nameplate}"}.com
                        </div>
                        <div className="text-[10px] text-foreground font-mono">
                          TORITO.{nameplate || "{nameplate}"}.com
                        </div>
                        <div className="text-[10px] text-foreground font-mono">
                          VAULT.{nameplate || "{nameplate}"}.com
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <label className="text-[9px] tracking-[0.2em] text-classified uppercase">TARWELL DOMAIN</label>
                          <Input
                            placeholder="tarpit.yourdomain.com"
                            value={domains.tarwell}
                            onChange={(e) => setDomains({ ...domains, tarwell: e.target.value })}
                            className="bg-background border-classified/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] tracking-[0.2em] text-info-blue uppercase">TORITO DOMAIN</label>
                          <Input
                            placeholder="tunnel.yourdomain.com"
                            value={domains.torito}
                            onChange={(e) => setDomains({ ...domains, torito: e.target.value })}
                            className="bg-background border-info-blue/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] tracking-[0.2em] text-brass uppercase">VAULT DOMAIN</label>
                          <Input
                            placeholder="vault.yourdomain.com"
                            value={domains.vault}
                            onChange={(e) => setDomains({ ...domains, vault: e.target.value })}
                            className="bg-background border-brass/20"
                          />
                        </div>
                        <div className="p-3 border border-brass/20 bg-brass/5">
                          <div className="text-[9px] text-brass tracking-wider">
                            SET A RECORD FOR EACH → 34.74.51.230 (APEX AUTHORITY SERVER)
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Submit */}
                    <Button
                      onClick={handleProvision}
                      className="w-full bg-terminal text-background text-[10px] tracking-[0.2em] uppercase"
                    >
                      <Zap size={14} className="mr-2" />
                      PROVISION DOMAIN SHIELD
                    </Button>
                  </div>
                </div>

                {/* Info Panel */}
                <div className="border border-border bg-card p-6">
                  <h3 className="text-[11px] tracking-[0.2em] text-brass uppercase font-bold mb-4">
                    SHIELD CAPABILITIES
                  </h3>
                  <div className="space-y-3">
                    {[
                      { icon: Shield, label: "SSL auto-provisioned on all 3 domains", color: "terminal" },
                      { icon: Radio, label: "TriStar routing: TARWELL → TORITO → VAULT", color: "info-blue" },
                      { icon: Lock, label: "Sovereign search — no PII, no tracking", color: "brass" },
                      { icon: Globe, label: "Custom branded mesh network", color: "terminal" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <item.icon size={12} className={`text-${item.color}`} />
                        <span className="text-[10px] text-muted-foreground">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
