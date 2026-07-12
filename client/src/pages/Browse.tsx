import { useState } from "react";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Search, MapPin, Calendar, Grid3X3, Map, Filter } from "lucide-react";

const CATEGORIES = [
  "all", "general", "furniture", "electronics", "clothing", "tools",
  "toys", "books", "sports", "automotive", "collectibles", "other"
];

export default function Browse() {
  const [view, setView] = useState<"grid" | "map">("grid");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [city, setCity] = useState("");

  const { data: listings, isLoading } = trpc.listings.search.useQuery({
    search,
    category: category === "all" ? undefined : category,
    city: city || undefined,
  });

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="pt-20 pb-16">
        <div className="container">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-xl font-bold text-foreground">BROWSE SALES</h1>
              <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase mt-1">
                {listings?.length || 0} ACTIVE LISTINGS ON MESH
              </p>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView("grid")}
                className={view === "grid" ? "text-terminal border border-terminal/30" : "text-muted-foreground"}
              >
                <Grid3X3 size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView("map")}
                className={view === "map" ? "text-terminal border border-terminal/30" : "text-muted-foreground"}
              >
                <Map size={16} />
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8 p-4 border border-border bg-card">
            <div className="flex-1 min-w-[200px] relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search sales..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background border-terminal/20 text-sm"
              />
            </div>
            <div className="relative min-w-[150px]">
              <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="City..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="pl-9 bg-background border-terminal/20 text-sm"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-background border border-terminal/20 text-foreground text-xs px-3 py-2 uppercase tracking-wider"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Content */}
          {view === "grid" ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="border border-border bg-card p-4 animate-pulse h-48" />
                ))
              ) : listings && listings.length > 0 ? (
                listings.map((listing: any) => (
                  <Link key={listing.id} href={`/listing/${listing.id}`}>
                    <div className="border border-border bg-card p-4 hover:border-terminal/50 transition-all cursor-pointer group corner-brackets">
                      {/* Photo placeholder */}
                      <div className="w-full h-32 bg-muted mb-3 flex items-center justify-center border border-border">
                        {listing.photos && listing.photos.length > 0 ? (
                          <img src={listing.photos[0]} alt={listing.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-muted-foreground tracking-wider">NO PHOTO</span>
                        )}
                      </div>
                      {/* Info */}
                      <h3 className="text-sm font-bold text-foreground group-hover:text-terminal transition-colors truncate">
                        {listing.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <MapPin size={10} className="text-brass" />
                        <span className="text-[10px] text-muted-foreground truncate">
                          {listing.city}, {listing.state}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar size={10} className="text-terminal" />
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(listing.saleDate).toLocaleDateString()}
                        </span>
                      </div>
                      {/* Price range */}
                      {(listing.priceMin || listing.priceMax) && (
                        <div className="mt-2 text-[10px] text-brass font-bold tracking-wider">
                          {listing.priceMin && `$${listing.priceMin}`}
                          {listing.priceMin && listing.priceMax && " — "}
                          {listing.priceMax && `$${listing.priceMax}`}
                        </div>
                      )}
                      <div className="mt-2">
                        <span className="text-[9px] px-2 py-0.5 border border-terminal/30 text-terminal uppercase tracking-wider">
                          {listing.category}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-16 border border-border bg-card">
                  <div className="text-muted-foreground text-sm mb-2">NO LISTINGS FOUND</div>
                  <p className="text-[10px] text-muted-foreground/60 tracking-wider">
                    Be the first to post a sale in your area
                  </p>
                  <Link href="/create">
                    <Button className="mt-4 bg-terminal text-background text-[10px] tracking-wider uppercase">
                      POST A SALE
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            /* Map View Placeholder */
            <div className="border border-terminal/20 bg-card h-[500px] flex items-center justify-center">
              <div className="text-center space-y-3">
                <Map size={48} className="text-terminal/30 mx-auto" />
                <div className="text-sm text-muted-foreground">MAP VIEW</div>
                <div className="text-[10px] text-muted-foreground/60 tracking-wider">
                  Topographical mesh visualization — coming soon
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
