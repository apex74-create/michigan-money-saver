import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useRoute } from "wouter";
import { toast } from "sonner";
import { MapPin, Calendar, Lock, Phone, Mail, Eye } from "lucide-react";

export default function ListingDetail() {
  const [, params] = useRoute("/listing/:id");
  const id = parseInt(params?.id || "0");
  const { user, isAuthenticated } = useAuth();

  const { data: listing, isLoading } = trpc.listings.getById.useQuery({ id }, { enabled: !!id });
  const revealMutation = trpc.listings.revealContact.useMutation({
    onSuccess: () => {
      toast.success("Contact info revealed! Check below.");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-terminal text-sm animate-pulse tracking-wider">LOADING...</div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-classified text-sm tracking-wider">LISTING NOT FOUND</div>
        </div>
      </div>
    );
  }

  const canReveal = isAuthenticated && ((user as any)?.subscriptionTier === "basic" || (user as any)?.subscriptionTier === "pro");

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="pt-20 pb-16">
        <div className="container max-w-3xl">
          {/* Header */}
          <div className="border border-border bg-card p-6 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[9px] px-2 py-0.5 border border-terminal/30 text-terminal uppercase tracking-wider">
                  {listing.category}
                </span>
                <h1 className="text-2xl font-bold text-foreground mt-3">{listing.title}</h1>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Eye size={10} />
                  {listing.viewCount} views
                </div>
              </div>
            </div>

            {/* Location & Date */}
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2">
                <MapPin size={12} className="text-brass" />
                <span className="text-xs text-muted-foreground">
                  {listing.city}, {listing.state} {listing.zip}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={12} className="text-terminal" />
                <span className="text-xs text-muted-foreground">
                  {new Date(listing.saleDate).toLocaleDateString()} at {new Date(listing.saleDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* Price Range */}
            {(listing.priceMin || listing.priceMax) && (
              <div className="mt-4 p-3 border border-brass/20 bg-brass/5">
                <div className="text-[9px] tracking-[0.2em] text-brass uppercase mb-1">ESTIMATED PRICE RANGE</div>
                <div className="text-lg font-bold text-brass">
                  {listing.priceMin && `$${listing.priceMin}`}
                  {listing.priceMin && listing.priceMax && " — "}
                  {listing.priceMax && `$${listing.priceMax}`}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {listing.description && (
            <div className="border border-border bg-card p-6 mb-6">
              <div className="text-[10px] tracking-[0.2em] text-brass uppercase mb-3">DESCRIPTION</div>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {listing.description}
              </p>
            </div>
          )}

          {/* Contact Reveal / Paywall */}
          <div className="border border-border bg-card p-6">
            <div className="text-[10px] tracking-[0.2em] text-brass uppercase mb-4">SELLER CONTACT</div>

            {listing.contactRevealed ? (
              <div className="space-y-3 p-4 border border-terminal/30 bg-terminal/5">
                <div className="text-[9px] tracking-wider text-terminal uppercase mb-2">
                  ▸ CONTACT UNLOCKED
                </div>
                {listing.sellerPhone && (
                  <div className="flex items-center gap-2">
                    <Phone size={12} className="text-terminal" />
                    <span className="text-sm text-foreground">{listing.sellerPhone}</span>
                  </div>
                )}
                {listing.sellerEmail && (
                  <div className="flex items-center gap-2">
                    <Mail size={12} className="text-terminal" />
                    <span className="text-sm text-foreground">{listing.sellerEmail}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin size={12} className="text-terminal" />
                  <span className="text-sm text-foreground">{listing.address}</span>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 border border-classified/20 bg-classified/5">
                <Lock size={32} className="text-classified/50 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-foreground mb-2">CONTACT INFO LOCKED</h3>
                <p className="text-[10px] text-muted-foreground mb-4 max-w-sm mx-auto">
                  Seller's phone, email, and exact address are behind the paywall.
                  Basic or Pro subscription required to reveal.
                </p>
                {!isAuthenticated ? (
                  <Button
                    onClick={() => startLogin()}
                    className="bg-terminal text-background text-[10px] tracking-[0.2em] uppercase"
                  >
                    ▸ CONNECT TO UNLOCK
                  </Button>
                ) : !canReveal ? (
                  <div className="space-y-2">
                    <p className="text-[9px] text-classified tracking-wider">
                      YOUR TIER: {(user as any)?.subscriptionTier?.toUpperCase() || "FREE"} — UPGRADE REQUIRED
                    </p>
                    <Button
                      onClick={() => toast.info("Stripe integration coming soon")}
                      className="bg-brass text-background text-[10px] tracking-[0.2em] uppercase"
                    >
                      ▸ UPGRADE TO BASIC ($9.99/mo)
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => revealMutation.mutate({ listingId: id })}
                    disabled={revealMutation.isPending}
                    className="bg-terminal text-background text-[10px] tracking-[0.2em] uppercase"
                  >
                    {revealMutation.isPending ? "REVEALING..." : "▸ REVEAL CONTACT INFO"}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
