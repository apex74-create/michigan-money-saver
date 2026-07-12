import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Link } from "wouter";
import NavBar from "@/components/NavBar";
import DoritoTriangle from "@/components/DoritoTriangle";
import { Button } from "@/components/ui/button";
import { Shield, Zap, Users, Lock, Radio, QrCode } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      {/* Hero Section */}
      <section className="pt-20 pb-16 relative overflow-hidden">
        {/* Background grid pulse */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #00ff88 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />

        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
            {/* Left: Copy */}
            <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-[10px] tracking-[0.4em] text-brass uppercase">
                  VERTEX SALES SYSTEM // PATENT PENDING
                </p>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  <span className="text-terminal glow-terminal">MICHIGAN</span>
                  <br />
                  <span className="text-foreground">MONEY SAVER</span>
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-md pt-4">
                  The sovereign garage sale network. Post your sale, mesh with your neighborhood,
                  and trade with confidence behind the DORITO TRIANGLE shield.
                  No corporate surveillance. No tracking. Just commerce.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {isAuthenticated ? (
                  <>
                    <Link href="/create">
                      <Button className="bg-terminal text-background hover:bg-terminal/90 text-[11px] tracking-[0.15em] uppercase px-6">
                        <Zap size={14} className="mr-2" />
                        POST A SALE
                      </Button>
                    </Link>
                    <Link href="/browse">
                      <Button variant="outline" className="border-brass text-brass hover:bg-brass/10 text-[11px] tracking-[0.15em] uppercase px-6">
                        BROWSE SALES
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => startLogin()}
                      className="bg-terminal text-background hover:bg-terminal/90 text-[11px] tracking-[0.15em] uppercase px-6"
                    >
                      <Zap size={14} className="mr-2" />
                      JOIN THE MESH
                    </Button>
                    <Link href="/browse">
                      <Button variant="outline" className="border-terminal/50 text-terminal hover:bg-terminal/10 text-[11px] tracking-[0.15em] uppercase px-6">
                        BROWSE FREE
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* Stats strip */}
              <div className="flex gap-6 pt-4 border-t border-terminal/10">
                <div>
                  <div className="text-terminal font-bold text-lg">$9.99</div>
                  <div className="text-[9px] tracking-wider text-muted-foreground uppercase">LOCAL MESH</div>
                </div>
                <div>
                  <div className="text-brass font-bold text-lg">$29.99</div>
                  <div className="text-[9px] tracking-wider text-muted-foreground uppercase">NETWORK</div>
                </div>
                <div>
                  <div className="text-classified font-bold text-lg">$99.99</div>
                  <div className="text-[9px] tracking-wider text-muted-foreground uppercase">OPERATOR</div>
                </div>
              </div>
            </div>

            {/* Right: Animated Triangle */}
            <div className="flex justify-center items-center">
              <div className="relative">
                <DoritoTriangle size={360} />
                {/* Geiger counter style pulse indicator */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-terminal animate-pulse" />
                  <span className="text-[9px] text-terminal/70 tracking-wider">MESH ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 border-t border-terminal/10">
        <div className="container">
          <h2 className="text-center text-[11px] tracking-[0.4em] text-brass uppercase mb-12">
            ▸ HOW THE MESH WORKS
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "POST YOUR SALE",
                desc: "One button. Upload photos, set your date, drop a pin. Your sale goes live on the mesh instantly.",
                color: "terminal",
              },
              {
                icon: Users,
                title: "MESH CONNECTS",
                desc: "Buyers in your area see your sale. They browse items, check the price range, and decide to visit.",
                color: "brass",
              },
              {
                icon: Lock,
                title: "PAYWALL REVEAL",
                desc: "Serious buyers unlock your contact info through the paywall. No tire-kickers. Real transactions only.",
                color: "classified",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="corner-brackets border border-border bg-card p-6 hover:border-terminal/50 transition-all group"
              >
                <item.icon
                  size={24}
                  className={`text-${item.color} mb-4 group-hover:drop-shadow-[0_0_8px_currentColor] transition-all`}
                />
                <h3 className={`text-${item.color} font-bold text-sm tracking-wider mb-2`}>
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Garage Band Mesh Section */}
      <section className="py-20 border-t border-brass/20 bg-card/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <QrCode size={16} className="text-info-blue" />
                <span className="text-[10px] tracking-[0.3em] text-info-blue uppercase">
                  POWER USER FEATURE
                </span>
              </div>
              <h2 className="text-3xl font-bold">
                <span className="text-terminal">GARAGE BAND</span>{" "}
                <span className="text-brass">MESH</span>
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Think Grateful Dead lot meets sovereign commerce. Scan the QR at the door,
                and you're instantly part of the event marketplace. Every vendor on lot is live.
                Every buyer walking through sees what's for sale in real-time.
                Concert's over? Mesh dissolves. Next show? New mesh, same platform.
              </p>
              <div className="space-y-3">
                {[
                  "QR scan at venue entry — instant mesh enrollment",
                  "Real-time vendor map with NFC tap-to-pay ready",
                  "Sovereign chat between buyers and sellers",
                  "Event-scoped mesh — dissolves when the show ends",
                  "Licensed Super User package for concert vendors",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Radio size={12} className="text-terminal mt-0.5 shrink-0" />
                    <span className="text-xs text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative border border-terminal/20 bg-background p-8 corner-brackets">
              <div className="space-y-4">
                <div className="text-[10px] tracking-[0.3em] text-brass uppercase text-center">
                  EVENT MESH SIMULATION
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {["VENDOR A", "VENDOR B", "VENDOR C", "BUYER 1", "BUYER 2", "BUYER 3", "VENDOR D", "BUYER 4", "VENDOR E"].map((node, i) => (
                    <div
                      key={i}
                      className={`text-center p-2 border text-[8px] tracking-wider ${
                        node.startsWith("V")
                          ? "border-brass/50 text-brass"
                          : "border-terminal/50 text-terminal"
                      }`}
                    >
                      {node}
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 border border-info-blue/30 text-info-blue text-[9px] tracking-wider">
                    <div className="w-1.5 h-1.5 rounded-full bg-info-blue animate-pulse" />
                    9 NODES ACTIVE — MESH HEALTHY
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 border-t border-terminal/10">
        <div className="container">
          <h2 className="text-center text-[11px] tracking-[0.4em] text-brass uppercase mb-4">
            ▸ SUBSCRIPTION TIERS
          </h2>
          <p className="text-center text-muted-foreground text-xs mb-12 max-w-md mx-auto">
            From local yard sales to franchise operations. Pick your tier, push the button, go.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                tier: "Free",
                price: "$0",
                period: "forever",
                color: "terminal",
                features: ["Browse all listings", "Post 1 sale per month", "Basic search", "Community access"],
              },
              {
                tier: "Basic",
                price: "$9.99",
                period: "/month",
                color: "brass",
                features: ["Unlimited listings", "Contact reveal access", "Network mesh connection", "Priority search placement", "Sovereign chat"],
                popular: true,
              },
              {
                tier: "Pro/Franchise",
                price: "$99.99",
                period: "/month",
                color: "classified",
                features: ["Everything in Basic", "3-Domain Shield (DORITO TRIANGLE)", "Operator dashboard", "Revenue share on network", "Custom branded domains", "TriStar routing", "Garage Band Mesh events"],
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative border bg-card p-6 transition-all hover:border-${plan.color}/50 ${
                  plan.popular ? `border-${plan.color} box-glow-brass` : "border-border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-brass text-background text-[9px] tracking-[0.2em] uppercase">
                    MOST POPULAR
                  </div>
                )}
                <div className="text-center space-y-3 mb-6">
                  <div className={`text-[10px] tracking-[0.3em] text-${plan.color} uppercase`}>
                    {plan.tier}
                  </div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className={`text-3xl font-bold text-${plan.color}`}>{plan.price}</span>
                    <span className="text-[10px] text-muted-foreground">{plan.period}</span>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className={`text-${plan.color}`}>▸</span>
                      {f}
                    </div>
                  ))}
                </div>
                <Link href="/pricing">
                  <Button
                    variant="outline"
                    className={`w-full border-${plan.color}/50 text-${plan.color} hover:bg-${plan.color}/10 text-[10px] tracking-[0.2em] uppercase`}
                  >
                    {plan.price === "$0" ? "GET STARTED" : "SUBSCRIBE"}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-terminal/10">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[9px] tracking-[0.2em] text-muted-foreground uppercase">
            MICHIGAN MONEY SAVER — VERTEX SALES SYSTEM — PATENT PENDING
          </div>
          <div className="text-[9px] tracking-[0.2em] text-muted-foreground">
            © 2026 APEX AIR SOLUTIONS LLC — ALL RIGHTS RESERVED
          </div>
        </div>
      </footer>
    </div>
  );
}
