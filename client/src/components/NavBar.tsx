import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield, Store, LayoutDashboard, Tag, Zap } from "lucide-react";
import { useState } from "react";

export default function NavBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/browse", label: "BROWSE", icon: Store },
    { href: "/pricing", label: "PRICING", icon: Tag },
    { href: "/franchise", label: "FRANCHISE", icon: Shield },
  ];

  const authLinks = [
    { href: "/create", label: "POST SALE", icon: Zap },
    { href: "/dashboard", label: "DASHBOARD", icon: LayoutDashboard },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-terminal/30 bg-background/95 backdrop-blur-sm">
      <div className="container flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 relative">
            <svg viewBox="0 0 32 32" className="w-full h-full">
              <polygon
                points="16,2 30,28 2,28"
                fill="none"
                stroke="#00ff88"
                strokeWidth="1.5"
                className="group-hover:drop-shadow-[0_0_8px_#00ff88] transition-all"
              />
              <polygon
                points="16,8 25,24 7,24"
                fill="none"
                stroke="#b08840"
                strokeWidth="1"
                opacity="0.7"
              />
            </svg>
          </div>
          <span className="text-terminal font-bold text-sm tracking-wider hidden sm:block">
            MICHIGAN MONEY SAVER
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <span
                className={`px-3 py-1.5 text-[11px] tracking-[0.2em] uppercase transition-all ${
                  location === link.href
                    ? "text-terminal border border-terminal/50 bg-terminal/5"
                    : "text-muted-foreground hover:text-terminal"
                }`}
              >
                {link.label}
              </span>
            </Link>
          ))}
          {isAuthenticated &&
            authLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`px-3 py-1.5 text-[11px] tracking-[0.2em] uppercase transition-all ${
                    location === link.href
                      ? "text-brass border border-brass/50 bg-brass/5"
                      : "text-muted-foreground hover:text-brass"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
        </div>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-[10px] tracking-wider text-brass uppercase">
                {user?.name || "OPERATOR"}
              </span>
              <span className="text-[9px] px-2 py-0.5 border border-terminal/50 text-terminal uppercase">
                {(user as any)?.subscriptionTier || "FREE"}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                className="text-[10px] tracking-wider text-classified hover:text-classified/80"
              >
                DISCONNECT
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => startLogin()}
              className="text-[10px] tracking-[0.2em] border border-terminal/50 text-terminal hover:bg-terminal/10"
            >
              ▸ CONNECT
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-terminal"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-terminal/20 bg-background/98 backdrop-blur-sm p-4 space-y-2">
          {[...navLinks, ...(isAuthenticated ? authLinks : [])].map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
              <span className="flex items-center gap-2 px-3 py-2 text-[11px] tracking-[0.2em] text-muted-foreground hover:text-terminal transition-colors">
                <link.icon size={14} />
                {link.label}
              </span>
            </Link>
          ))}
          {!isAuthenticated && (
            <button
              onClick={() => { startLogin(); setMobileOpen(false); }}
              className="w-full text-left px-3 py-2 text-[11px] tracking-[0.2em] text-terminal border border-terminal/30 mt-2"
            >
              ▸ CONNECT
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
