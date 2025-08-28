import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Wallet, Menu, User, Trophy, TrendingUp, Home } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/tournaments", label: "Tournaments", icon: Trophy },
    { href: "/leaderboard", label: "Leaderboard", icon: TrendingUp },
    { href: "/wallet", label: "Wallet", icon: Wallet },
  ];

  const isActive = (href: string) => {
    return location === href || (href !== "/" && location.startsWith(href));
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50" data-testid="header">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <div className="text-2xl font-bold gradient-text cursor-pointer" data-testid="logo">
                GameArena
              </div>
            </Link>
            <nav className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <button
                    className={`text-sm transition-colors hover:text-primary ${
                      isActive(item.href) 
                        ? "text-primary font-medium" 
                        : "text-muted-foreground"
                    }`}
                    data-testid={`nav-${item.label.toLowerCase()}`}
                  >
                    {item.label}
                  </button>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-muted px-3 py-2 rounded-lg">
              <Wallet className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium" data-testid="wallet-balance">
                ₹{parseFloat(user.walletBalance).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8 border-2 border-primary" data-testid="user-avatar">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <div className="text-sm font-medium" data-testid="username">
                  {user.username}
                </div>
                <Badge variant="secondary" className="text-xs" data-testid="user-rank">
                  #{user.rank}
                </Badge>
              </div>
            </div>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" data-testid="mobile-menu-trigger">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="py-4">
                  <div className="flex items-center space-x-3 mb-6">
                    <Avatar className="w-12 h-12 border-2 border-primary">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.username}</div>
                      <div className="text-sm text-muted-foreground">#{user.rank}</div>
                      <div className="text-sm text-primary">₹{user.walletBalance}</div>
                    </div>
                  </div>

                  <nav className="space-y-2">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link key={item.href} href={item.href}>
                          <button
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                              isActive(item.href) 
                                ? "bg-primary/10 text-primary" 
                                : "hover:bg-muted"
                            }`}
                            onClick={() => setIsOpen(false)}
                            data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                          >
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                          </button>
                        </Link>
                      );
                    })}
                    
                    <div className="pt-4 border-t border-border">
                      <button
                        onClick={logout}
                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-destructive/10 text-destructive"
                        data-testid="logout-button"
                      >
                        <User className="w-5 h-5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
