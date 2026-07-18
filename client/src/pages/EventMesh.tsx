import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Radio, MapPin, Search, Shield, Wifi, Heart, Tent, Car,
  QrCode, Users, Zap, Navigation, AlertTriangle, Phone
} from "lucide-react";

// Vertex Package Assembly — 36 engines categorized into module groups
const VERTEX_ENGINES = [
  { id: "E001", name: "Mesh Radar", category: "AWARENESS", desc: "Real-time vendor/buyer proximity radar" },
  { id: "E002", name: "Venue Mapper", category: "AWARENESS", desc: "Auto-maps venue boundaries + lot perimeter" },
  { id: "E003", name: "Camping Finder", category: "SERVICES", desc: "Nearby camping spots for festivals" },
  { id: "E004", name: "Emergency Locator", category: "SERVICES", desc: "Hospitals, urgent care, first aid stations" },
  { id: "E005", name: "Vendor Beacon", category: "COMMERCE", desc: "Broadcast your booth location to mesh" },
  { id: "E006", name: "NFC Pay Gate", category: "COMMERCE", desc: "Tap-to-pay sovereign transactions" },
  { id: "E007", name: "Sovereign Chat", category: "COMMS", desc: "Encrypted mesh messaging — no cell needed" },
  { id: "E008", name: "Event Search", category: "DISCOVERY", desc: "Search all vendors/items at this event" },
  { id: "E009", name: "Parking Assist", category: "SERVICES", desc: "Available parking + shuttle routes" },
  { id: "E010", name: "Weather Station", category: "AWARENESS", desc: "Hyperlocal weather for outdoor events" },
  { id: "E011", name: "Set Times", category: "DISCOVERY", desc: "Stage schedules synced to mesh" },
  { id: "E012", name: "Lost & Found", category: "SERVICES", desc: "Mesh-powered lost item recovery" },
  { id: "E013", name: "Water Station", category: "SERVICES", desc: "Nearest hydration points mapped" },
  { id: "E014", name: "Restroom Finder", category: "SERVICES", desc: "Real-time restroom availability" },
  { id: "E015", name: "Food Court Radar", category: "DISCOVERY", desc: "All food vendors with wait times" },
  { id: "E016", name: "TriStar Shield", category: "DEFENSE", desc: "3-domain defense for vendor data" },
  { id: "E017", name: "Tarpit Guard", category: "DEFENSE", desc: "TARWELL attacker trap for event mesh" },
  { id: "E018", name: "Tunnel Relay", category: "DEFENSE", desc: "TORITO encrypted data relay" },
];

const CATEGORY_COLORS: Record<string, string> = {
  AWARENESS: "terminal",
  SERVICES: "info-blue",
  COMMERCE: "brass",
  COMMS: "terminal",
  DISCOVERY: "brass",
  DEFENSE: "classified",
};

export default function EventMesh() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"dashboard" | "assembly">("dashboard");
  const [selectedEngines, setSelectedEngines] = useState<string[]>(["E001", "E002", "E004", "E005", "E006", "E007", "E008"]);
  const [searchQuery, setSearchQuery] = useState("");

  const isPro = (user as any)?.subscriptionTier === "pro" || (user as any)?.role === "operator" || (user as any)?.role === "admin";

  const toggleEngine = (id: string) => {
    setSelectedEngines((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4 border border-terminal/20 bg-card p-8 corner-brackets">
            <QrCode size={32} className="text-terminal mx-auto" />
            <div className="text-terminal text-sm font-bold tracking-wider">SCAN QR TO JOIN MESH</div>
            <p className="text-muted-foreground text-xs max-w-sm">
              Scan the event QR code at the door or connect here to join the Garage Band Mesh
            </p>
            <Button onClick={() => startLogin()} className="bg-terminal text-background text-[10px] tracking-[0.2em] uppercase">
              ▸ CONNECT TO MESH
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="pt-16 pb-8">
        <div className="container">
          {/* Header with mesh status */}
          <div className="flex items-center justify-between mb-6 p-4 border border-terminal/20 bg-card">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-terminal animate-pulse" />
              <div>
                <div className="text-[11px] font-bold text-terminal tracking-wider">GARAGE BAND MESH — ACTIVE</div>
                <div className="text-[9px] text-muted-foreground tracking-wider">EVENT: SUMMER LOT FESTIVAL 2026</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-[9px] text-muted-foreground">NODES</div>
                <div className="text-terminal font-bold text-sm">47</div>
              </div>
              <div className="text-right">
                <div className="text-[9px] text-muted-foreground">VENDORS</div>
                <div className="text-brass font-bold text-sm">12</div>
              </div>
              <div className="text-right">
                <div className="text-[9px] text-muted-foreground">SIGNAL</div>
                <div className="text-terminal font-bold text-sm">98%</div>
              </div>
            </div>
          </div>

          {/* Tab Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-4 py-2 text-[10px] tracking-[0.2em] uppercase border transition-all ${
                activeTab === "dashboard" ? "border-terminal text-terminal bg-terminal/5" : "border-border text-muted-foreground"
              }`}
            >
              MESH DASHBOARD
            </button>
            {isPro && (
              <button
                onClick={() => setActiveTab("assembly")}
                className={`px-4 py-2 text-[10px] tracking-[0.2em] uppercase border transition-all ${
                  activeTab === "assembly" ? "border-brass text-brass bg-brass/5" : "border-border text-muted-foreground"
                }`}
              >
                VERTEX PACKAGE ASSEMBLY
              </button>
            )}
          </div>

          {activeTab === "dashboard" ? (
            <>
              {/* Search Bar */}
              <div className="mb-6 relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search vendors, items, services at this event..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-card border-terminal/20"
                />
              </div>

              {/* Main Dashboard Grid */}
              <div className="grid lg:grid-cols-3 gap-4">
                {/* Venue Radar Map */}
                <div className="lg:col-span-2 border border-terminal/20 bg-card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-[10px] tracking-[0.2em] text-brass uppercase font-bold">VENUE RADAR</div>
                    <div className="flex items-center gap-2">
                      <Navigation size={10} className="text-terminal" />
                      <span className="text-[9px] text-terminal">GPS LOCKED</span>
                    </div>
                  </div>
                  {/* Radar visualization */}
                  <div className="relative w-full aspect-[16/10] bg-background border border-border overflow-hidden">
                    {/* Grid overlay */}
                    <div className="absolute inset-0" style={{
                      backgroundImage: `linear-gradient(rgba(0,255,136,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.05) 1px, transparent 1px)`,
                      backgroundSize: '30px 30px'
                    }} />
                    {/* Center point (you) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 rounded-full bg-terminal animate-ping opacity-30" />
                      <div className="w-3 h-3 rounded-full bg-terminal absolute top-0.5 left-0.5" />
                    </div>
                    {/* Vendor dots */}
                    {[
                      { x: 30, y: 25, label: "Crystals & Gems", type: "vendor" },
                      { x: 65, y: 35, label: "Vintage Vinyl", type: "vendor" },
                      { x: 20, y: 60, label: "Food Truck Row", type: "food" },
                      { x: 75, y: 70, label: "Handmade Jewelry", type: "vendor" },
                      { x: 45, y: 80, label: "Tie-Dye Station", type: "vendor" },
                      { x: 85, y: 20, label: "First Aid", type: "medical" },
                      { x: 10, y: 85, label: "Parking Lot B", type: "service" },
                    ].map((dot, i) => (
                      <div
                        key={i}
                        className="absolute group cursor-pointer"
                        style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
                      >
                        <div className={`w-2.5 h-2.5 rounded-full ${
                          dot.type === "vendor" ? "bg-brass" :
                          dot.type === "food" ? "bg-terminal" :
                          dot.type === "medical" ? "bg-classified" :
                          "bg-info-blue"
                        }`} />
                        <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-card border border-border text-[8px] text-foreground whitespace-nowrap z-10">
                          {dot.label}
                        </div>
                      </div>
                    ))}
                    {/* Legend */}
                    <div className="absolute bottom-2 left-2 flex gap-3">
                      <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-brass" /><span className="text-[7px] text-muted-foreground">VENDOR</span></div>
                      <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-terminal" /><span className="text-[7px] text-muted-foreground">FOOD</span></div>
                      <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-classified" /><span className="text-[7px] text-muted-foreground">MEDICAL</span></div>
                      <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-info-blue" /><span className="text-[7px] text-muted-foreground">SERVICE</span></div>
                    </div>
                  </div>
                </div>

                {/* Right sidebar — services */}
                <div className="space-y-4">
                  {/* Nearby Services */}
                  <div className="border border-border bg-card p-4">
                    <div className="text-[10px] tracking-[0.2em] text-brass uppercase font-bold mb-3">NEARBY SERVICES</div>
                    <div className="space-y-2">
                      {[
                        { icon: Heart, label: "St. Mary's Hospital", dist: "2.3 mi", color: "classified" },
                        { icon: AlertTriangle, label: "Event First Aid Tent", dist: "200 ft", color: "classified" },
                        { icon: Phone, label: "Emergency: 911", dist: "—", color: "classified" },
                        { icon: Tent, label: "Camp Zone A (Festival)", dist: "0.4 mi", color: "info-blue" },
                        { icon: Tent, label: "Camp Zone B (Overflow)", dist: "0.8 mi", color: "info-blue" },
                        { icon: Car, label: "Parking Lot B (Free)", dist: "0.2 mi", color: "terminal" },
                        { icon: Car, label: "Parking Garage C", dist: "0.5 mi", color: "terminal" },
                      ].map((svc, i) => (
                        <div key={i} className="flex items-center justify-between p-2 border border-border hover:border-terminal/30 transition-colors">
                          <div className="flex items-center gap-2">
                            <svc.icon size={11} className={`text-${svc.color}`} />
                            <span className="text-[10px] text-foreground">{svc.label}</span>
                          </div>
                          <span className="text-[9px] text-muted-foreground">{svc.dist}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mesh Stats */}
                  <div className="border border-terminal/20 bg-card p-4">
                    <div className="text-[10px] tracking-[0.2em] text-terminal uppercase font-bold mb-3">MESH HEALTH</div>
                    <div className="space-y-2">
                      <div className="flex justify-between"><span className="text-[9px] text-muted-foreground">SIGNAL STRENGTH</span><span className="text-[9px] text-terminal">████████░░ 82%</span></div>
                      <div className="flex justify-between"><span className="text-[9px] text-muted-foreground">CONNECTED NODES</span><span className="text-[9px] text-terminal">47 / 50</span></div>
                      <div className="flex justify-between"><span className="text-[9px] text-muted-foreground">TRISTAR STATUS</span><span className="text-[9px] text-terminal">ROUTING</span></div>
                      <div className="flex justify-between"><span className="text-[9px] text-muted-foreground">ENCRYPTION</span><span className="text-[9px] text-brass">AES-256-GCM</span></div>
                      <div className="flex justify-between"><span className="text-[9px] text-muted-foreground">SOVEREIGN SEARCH</span><span className="text-[9px] text-terminal">ACTIVE</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Vendors Grid */}
              <div className="mt-6 border border-border bg-card p-4">
                <div className="text-[10px] tracking-[0.2em] text-brass uppercase font-bold mb-4">ACTIVE VENDORS ON MESH</div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { name: "Crystal Kingdom", items: 23, distance: "50 ft" },
                    { name: "Vinyl Vault", items: 156, distance: "120 ft" },
                    { name: "Tie-Dye Dreams", items: 45, distance: "80 ft" },
                    { name: "Handmade Haven", items: 67, distance: "200 ft" },
                    { name: "Vintage Threads", items: 89, distance: "150 ft" },
                    { name: "Lot Snacks", items: 12, distance: "30 ft" },
                    { name: "Sticker Bomb", items: 200, distance: "90 ft" },
                    { name: "Glass Gallery", items: 34, distance: "175 ft" },
                  ].map((vendor, i) => (
                    <div key={i} className="border border-border p-3 hover:border-brass/50 transition-colors cursor-pointer">
                      <div className="text-[10px] font-bold text-foreground">{vendor.name}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[9px] text-brass">{vendor.items} items</span>
                        <span className="text-[9px] text-muted-foreground">{vendor.distance}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* VERTEX PACKAGE ASSEMBLY — Operator builds custom event package */
            <div className="space-y-6">
              <div className="border border-brass/20 bg-card p-6">
                <h2 className="text-brass font-bold text-sm tracking-wider mb-2">VERTEX PACKAGE ASSEMBLY</h2>
                <p className="text-[10px] text-muted-foreground leading-relaxed mb-4">
                  Build your custom event mesh package from the 36 Vertex engines.
                  Select which modules your attendees will see when they join your mesh.
                  Each engine is a sovereign, sandboxed tool that operates independently.
                </p>
                <div className="flex items-center gap-4 text-[9px]">
                  <span className="text-terminal">{selectedEngines.length} ENGINES SELECTED</span>
                  <span className="text-muted-foreground">|</span>
                  <span className="text-brass">PACKAGE COST: ${(selectedEngines.length * 2.99).toFixed(2)}/event</span>
                </div>
              </div>

              {/* Engine Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {VERTEX_ENGINES.map((engine) => {
                  const isSelected = selectedEngines.includes(engine.id);
                  const color = CATEGORY_COLORS[engine.category] || "terminal";
                  return (
                    <button
                      key={engine.id}
                      onClick={() => toggleEngine(engine.id)}
                      className={`text-left p-4 border transition-all ${
                        isSelected
                          ? `border-${color} bg-${color}/5 box-glow-terminal`
                          : "border-border bg-card hover:border-terminal/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[9px] tracking-[0.2em] text-${color} uppercase font-bold`}>
                          {engine.id}
                        </span>
                        <span className={`text-[8px] px-1.5 py-0.5 border ${
                          isSelected ? `border-${color} text-${color}` : "border-border text-muted-foreground"
                        } uppercase tracking-wider`}>
                          {engine.category}
                        </span>
                      </div>
                      <div className="text-[11px] font-bold text-foreground mb-1">{engine.name}</div>
                      <div className="text-[9px] text-muted-foreground leading-relaxed">{engine.desc}</div>
                      {isSelected && (
                        <div className={`mt-2 text-[8px] text-${color} tracking-wider`}>▸ ACTIVE</div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Deploy Button */}
              <div className="border border-terminal/20 bg-card p-6 text-center">
                <Button
                  onClick={() => toast.success(`Package assembled with ${selectedEngines.length} engines. Deploy to event mesh when ready.`)}
                  className="bg-terminal text-background text-[10px] tracking-[0.2em] uppercase px-8"
                >
                  <Zap size={14} className="mr-2" />
                  DEPLOY PACKAGE TO EVENT MESH
                </Button>
                <p className="text-[9px] text-muted-foreground mt-3">
                  Attendees who scan your event QR will receive this exact package configuration
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

