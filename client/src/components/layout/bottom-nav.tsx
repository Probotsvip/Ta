import { Link, useLocation } from "wouter";
import { Home, Trophy, TrendingUp, Wallet, User } from "lucide-react";

export default function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/tournaments", label: "Tournaments", icon: Trophy },
    { href: "/leaderboard", label: "Stats", icon: TrendingUp },
    { href: "/wallet", label: "Wallet", icon: Wallet },
  ];

  const isActive = (href: string) => {
    return location === href || (href !== "/" && location.startsWith(href));
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:hidden z-40" data-testid="bottom-navigation">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <button
                className={`flex flex-col items-center py-2 px-4 transition-colors ${
                  isActive(item.href) ? "text-primary" : "text-muted-foreground"
                }`}
                data-testid={`bottom-nav-${item.label.toLowerCase()}`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
