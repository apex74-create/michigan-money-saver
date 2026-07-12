import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Shield, Zap, Crown } from "lucide-react";
import { toast } from "sonner";

export default function Pricing() {
  const handleSubscribe = (tier: string) => {
    toast.info(`${tier} subscription — Stripe integration coming soon. Contact operator for early access.`);
  };

  const tiers = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      icon: Zap,
      color: "terminal",
      description: "Local yard sale access. Browse, post one sale per month, basic search.",
      features: [
        "Browse all active listings",
        "Post 1 sale per month",
        "Basic search & filter",
        "View price ranges (no contact reveal)",
        "Community forum access",
      ],
      limitations: [
        "Cannot reveal seller contact info",
        "No network mesh access",
        "No priority placement",
      ],
    },
    {
      name: "Basic",
      price: "$9.99",
      period: "/month",
      icon: Shield,
      color: "brass",
      popular: true,
      description: "Full network access. Unlimited listings, contact reveals, and mesh connectivity.",
      features: [
        "Unlimited sale listings",
        "Unlock seller contact info (paywall reveal)",
        "Network mesh — connect to nearby sales",
        "Priority search placement",
        "Sovereign chat with sellers",
        "Photo gallery (up to 20 per listing)",
        "Performance analytics",
        "NFC tap-to-pay ready",
      ],
      limitations: [
        "No custom domains",
        "No operator dashboard",
      ],
    },
    {
      name: "Pro/Franchise",
      price: "$99.99",
      period: "/month",
      icon: Crown,
      color: "classified",
      description: "Operator-level access. Run your own branded garage sale network with 3-domain shield.",
      features: [
        "Everything in Basic",
        "DORITO TRIANGLE 3-Domain Shield",
        "TARWELL tarpit defense",
        "TORITO encrypted tunnel",
        "VAULT evidence sealing",
        "TriStar routing UI",
        "Operator revenue share (5% commission)",
        "Custom branded domains",
        "Franchise onboarding panel",
        "Garage Band Mesh event hosting",
        "White-label capability",
        "Priority support channel",
      ],
      limitations: [],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="pt-20 pb-16">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <p className="text-[10px] tracking-[0.4em] text-brass uppercase">
              VERTEX SALES SYSTEM // SUBSCRIPTION TIERS
            </p>
            <h1 className="text-3xl font-bold text-foreground">
              Pick Your Tier. Push Button. <span className="text-terminal">Go.</span>
            </h1>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              From selling your couch to running a franchise network of garage sales
              across the state. Percentage-based commission keeps everyone aligned.
            </p>
          </div>

          {/* Tier Cards */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {tiers.map((tier, i) => (
              <div
                key={i}
                className={`relative border bg-card p-8 transition-all ${
                  tier.popular
                    ? "border-brass box-glow-brass scale-[1.02]"
                    : "border-border hover:border-terminal/30"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-brass text-background text-[9px] tracking-[0.3em] uppercase font-bold">
                    RECOMMENDED
                  </div>
                )}

                <div className="space-y-6">
                  {/* Icon + Name */}
                  <div className="flex items-center gap-3">
                    <tier.icon size={20} className={`text-${tier.color}`} />
                    <span className={`text-[11px] tracking-[0.3em] text-${tier.color} uppercase font-bold`}>
                      {tier.name}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-bold text-${tier.color}`}>{tier.price}</span>
                    <span className="text-xs text-muted-foreground">{tier.period}</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tier.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 border-t border-border pt-4">
                    <div className="text-[9px] tracking-[0.2em] text-muted-foreground uppercase mb-3">
                      INCLUDES
                    </div>
                    {tier.features.map((f, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <span className={`text-${tier.color} text-xs mt-0.5`}>▸</span>
                        <span className="text-[11px] text-foreground/80">{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limitations */}
                  {tier.limitations.length > 0 && (
                    <div className="space-y-1 border-t border-border pt-3">
                      {tier.limitations.map((l, j) => (
                        <div key={j} className="flex items-start gap-2">
                          <span className="text-classified/50 text-xs mt-0.5">✕</span>
                          <span className="text-[10px] text-muted-foreground/60">{l}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CTA */}
                  <Button
                    onClick={() => handleSubscribe(tier.name)}
                    className={`w-full text-[10px] tracking-[0.2em] uppercase ${
                      tier.popular
                        ? "bg-brass text-background hover:bg-brass/90"
                        : `border border-${tier.color}/50 text-${tier.color} bg-transparent hover:bg-${tier.color}/10`
                    }`}
                  >
                    {tier.price === "$0" ? "▸ START FREE" : "▸ SUBSCRIBE NOW"}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Commission Info */}
          <div className="mt-16 max-w-2xl mx-auto border border-terminal/20 bg-card p-6 corner-brackets">
            <h3 className="text-terminal text-sm font-bold tracking-wider mb-4 text-center">
              VERTEX COMMISSION STRUCTURE
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-terminal">15%</div>
                <div className="text-[9px] tracking-wider text-muted-foreground uppercase">PLATFORM FEE</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-brass">5%</div>
                <div className="text-[9px] tracking-wider text-muted-foreground uppercase">OPERATOR CUT</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">80%</div>
                <div className="text-[9px] tracking-wider text-muted-foreground uppercase">SELLER KEEPS</div>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-4 leading-relaxed">
              Every transaction is sealed with Apex_SHA~512# provenance. Court-admissible.
              Append-only ledger. No disputes. No chargebacks. Clean commerce.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
