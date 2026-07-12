import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Plus, Eye, Users, DollarSign, TrendingUp, MoreVertical, CheckCircle, XCircle, Pause } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const { data: myListings } = trpc.listings.myListings.useQuery(undefined, { enabled: isAuthenticated });
  const { data: stats } = trpc.listings.myStats.useQuery(undefined, { enabled: isAuthenticated });
  const updateStatusMutation = trpc.listings.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Listing status updated");
      utils.listings.myListings.invalidate();
      utils.listings.myStats.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4 border border-terminal/20 bg-card p-8 corner-brackets">
            <div className="text-terminal text-sm font-bold tracking-wider">DASHBOARD ACCESS REQUIRED</div>
            <p className="text-muted-foreground text-xs">Connect to manage your sales</p>
            <Button onClick={() => startLogin()} className="bg-terminal text-background text-[10px] tracking-[0.2em] uppercase">
              ▸ CONNECT
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="pt-20 pb-16">
        <div className="container">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-xl font-bold text-foreground">SELLER DASHBOARD</h1>
              <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase mt-1">
                WELCOME BACK, {user?.name?.toUpperCase() || "OPERATOR"}
              </p>
            </div>
            <Link href="/create">
              <Button className="bg-terminal text-background text-[10px] tracking-[0.2em] uppercase">
                <Plus size={14} className="mr-1" /> NEW SALE
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "ACTIVE LISTINGS", value: stats?.activeListings || 0, icon: TrendingUp, color: "terminal" },
              { label: "TOTAL VIEWS", value: stats?.totalViews || 0, icon: Eye, color: "brass" },
              { label: "CONTACT REVEALS", value: stats?.totalReveals || 0, icon: Users, color: "info-blue" },
              { label: "EST. REVENUE", value: `$${stats?.estimatedRevenue || "0.00"}`, icon: DollarSign, color: "brass" },
            ].map((stat, i) => (
              <div key={i} className="border border-border bg-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon size={12} className={`text-${stat.color}`} />
                  <span className="text-[9px] tracking-[0.2em] text-muted-foreground uppercase">{stat.label}</span>
                </div>
                <div className={`text-2xl font-bold text-${stat.color}`}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Listings Table */}
          <div className="border border-border bg-card">
            <div className="p-4 border-b border-border">
              <h2 className="text-[11px] tracking-[0.2em] text-brass uppercase font-bold">MY LISTINGS</h2>
            </div>
            <div className="divide-y divide-border">
              {myListings && myListings.length > 0 ? (
                myListings.map((listing: any) => (
                  <Link key={listing.id} href={`/listing/${listing.id}`}>
                    <div className="p-4 hover:bg-terminal/5 transition-colors cursor-pointer flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-foreground">{listing.title}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[9px] text-muted-foreground">
                            {listing.city}, {listing.state}
                          </span>
                          <span className="text-[9px] text-muted-foreground">
                            {new Date(listing.saleDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-[9px] px-2 py-0.5 border uppercase tracking-wider ${
                          listing.status === "active" ? "border-terminal/50 text-terminal" :
                          listing.status === "ended" ? "border-muted-foreground/50 text-muted-foreground" :
                          "border-brass/50 text-brass"
                        }`}>
                          {listing.status}
                        </span>
                        <div className="text-right">
                          <div className="text-[10px] text-muted-foreground">{listing.viewCount} views</div>
                          <div className="text-[10px] text-terminal">{listing.contactRevealCount} reveals</div>
                        </div>
                        <div className="relative">
                          <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMenuOpen(menuOpen === listing.id ? null : listing.id); }}
                            className="p-1 hover:bg-terminal/10 rounded"
                          >
                            <MoreVertical size={14} className="text-muted-foreground" />
                          </button>
                          {menuOpen === listing.id && (
                            <div className="absolute right-0 top-8 z-50 border border-border bg-card p-1 min-w-[140px] shadow-lg">
                              {listing.status !== "active" && (
                                <button
                                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateStatusMutation.mutate({ id: listing.id, status: "active" }); setMenuOpen(null); }}
                                  className="w-full text-left px-3 py-1.5 text-[10px] text-terminal hover:bg-terminal/10 flex items-center gap-2"
                                >
                                  <CheckCircle size={10} /> ACTIVATE
                                </button>
                              )}
                              {listing.status === "active" && (
                                <button
                                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateStatusMutation.mutate({ id: listing.id, status: "ended" }); setMenuOpen(null); }}
                                  className="w-full text-left px-3 py-1.5 text-[10px] text-brass hover:bg-brass/10 flex items-center gap-2"
                                >
                                  <Pause size={10} /> END SALE
                                </button>
                              )}
                              <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateStatusMutation.mutate({ id: listing.id, status: "cancelled" }); setMenuOpen(null); }}
                                className="w-full text-left px-3 py-1.5 text-[10px] text-classified hover:bg-classified/10 flex items-center gap-2"
                              >
                                <XCircle size={10} /> CANCEL
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground text-sm mb-3">No listings yet</p>
                  <Link href="/create">
                    <Button className="bg-terminal text-background text-[10px] tracking-[0.2em] uppercase">
                      POST YOUR FIRST SALE
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
