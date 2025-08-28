import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Search, 
  Trophy, 
  Crosshair, 
  Flame, 
  Gamepad2, 
  Clock, 
  Users, 
  Star, 
  TrendingUp,
  Zap,
  Target,
  Sword
} from "lucide-react";
import TournamentCard from "@/components/tournament-card";
import CreateTournamentModal from "@/components/modals/create-tournament";
import AuthModal from "@/components/modals/auth-modal";
import { Tournament } from "@shared/schema";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeGame, setActiveGame] = useState("PUBG");
  const [liveStats, setLiveStats] = useState({
    activePlayers: 24567,
    liveTournaments: 156,
    totalPrizePool: 1280000,
  });

  const { data: featuredData } = useQuery({
    queryKey: ["/api/tournaments?featured=true"],
  });

  const { data: gameData } = useQuery({
    queryKey: ["/api/tournaments?game=" + activeGame],
  });

  // Live stats animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        activePlayers: prev.activePlayers + Math.floor(Math.random() * 10) - 5,
        liveTournaments: prev.liveTournaments + Math.floor(Math.random() * 3) - 1,
        totalPrizePool: prev.totalPrizePool + Math.floor(Math.random() * 1000) - 500,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
          {/* Hero Section */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="container mx-auto px-4 py-16 text-center relative z-10">
              <div className="mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Trophy className="w-12 h-12 text-primary animate-glow" />
                  <h1 className="text-5xl font-bold gradient-text">GameArena</h1>
                </div>
                <p className="text-xl text-muted-foreground mb-2">
                  India's Premier Mobile Gaming Tournament Platform
                </p>
                <p className="text-lg text-primary">
                  Compete • Win • Dominate
                </p>
              </div>

              {/* Live Stats */}
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
                <Card className="bg-gaming-card/50 backdrop-blur-sm">
                  <CardContent className="pt-4 text-center">
                    <div className="text-2xl font-bold text-primary animate-pulse">
                      {liveStats.activePlayers.toLocaleString()}+
                    </div>
                    <div className="text-xs text-muted-foreground">Active Players</div>
                  </CardContent>
                </Card>
                <Card className="bg-gaming-card/50 backdrop-blur-sm">
                  <CardContent className="pt-4 text-center">
                    <div className="text-2xl font-bold text-secondary animate-pulse">
                      {liveStats.liveTournaments}
                    </div>
                    <div className="text-xs text-muted-foreground">Live Tournaments</div>
                  </CardContent>
                </Card>
                <Card className="bg-gaming-card/50 backdrop-blur-sm">
                  <CardContent className="pt-4 text-center">
                    <div className="text-2xl font-bold text-accent animate-pulse">
                      ₹{Math.floor(liveStats.totalPrizePool / 1000)}K+
                    </div>
                    <div className="text-xs text-muted-foreground">Prize Pool</div>
                  </CardContent>
                </Card>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Button 
                  size="lg"
                  className="neon-border animate-pulse-glow text-lg px-8 py-3"
                  onClick={() => setShowAuthModal(true)}
                  data-testid="join-now-button"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Join Tournament Now
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-3"
                  onClick={() => setShowAuthModal(true)}
                  data-testid="watch-demo-button"
                >
                  <Star className="w-5 h-5 mr-2" />
                  Watch Live Demo
                </Button>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <Card className="bg-gaming-card/30 backdrop-blur-sm border-primary/20">
                  <CardContent className="pt-6 text-center">
                    <Crosshair className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-lg font-bold mb-2">PUBG Mobile</h3>
                    <p className="text-sm text-muted-foreground">
                      Battle royale tournaments with massive prize pools
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gaming-card/30 backdrop-blur-sm border-secondary/20">
                  <CardContent className="pt-6 text-center">
                    <Flame className="w-12 h-12 mx-auto mb-4 text-secondary" />
                    <h3 className="text-lg font-bold mb-2">Free Fire</h3>
                    <p className="text-sm text-muted-foreground">
                      Fast-paced action with instant match results
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gaming-card/30 backdrop-blur-sm border-accent/20">
                  <CardContent className="pt-6 text-center">
                    <Trophy className="w-12 h-12 mx-auto mb-4 text-accent" />
                    <h3 className="text-lg font-bold mb-2">Real Rewards</h3>
                    <p className="text-sm text-muted-foreground">
                      Win real money and amazing gaming gear
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    );
  }

  const featuredTournaments = featuredData?.tournaments || [];
  const gameTournaments = gameData?.tournaments || [];

  return (
    <div className="container mx-auto px-4 py-6" data-testid="home-page">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold gradient-text mb-2">
              Welcome back, {user.username}! 🔥
            </h1>
            <p className="text-muted-foreground">
              Ready to dominate the battlefield today?
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Wallet Balance</div>
            <div className="text-2xl font-bold text-primary">
              ₹{parseFloat(user.walletBalance).toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="text-center bg-gaming-card hover:bg-gaming-card/80 transition-colors" data-testid="stat-tournaments">
          <CardContent className="pt-4">
            <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-primary animate-pulse">{liveStats.liveTournaments}</div>
            <div className="text-xs text-muted-foreground">Live Now</div>
          </CardContent>
        </Card>
        <Card className="text-center bg-gaming-card hover:bg-gaming-card/80 transition-colors" data-testid="stat-players">
          <CardContent className="pt-4">
            <Users className="w-6 h-6 mx-auto mb-2 text-secondary" />
            <div className="text-2xl font-bold text-secondary animate-pulse">{liveStats.activePlayers.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Players Online</div>
          </CardContent>
        </Card>
        <Card className="text-center bg-gaming-card hover:bg-gaming-card/80 transition-colors" data-testid="stat-prize">
          <CardContent className="pt-4">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-accent" />
            <div className="text-2xl font-bold text-accent animate-pulse">₹{Math.floor(liveStats.totalPrizePool / 1000)}K</div>
            <div className="text-xs text-muted-foreground">Total Prize Pool</div>
          </CardContent>
        </Card>
        <Card className="text-center bg-gaming-card hover:bg-gaming-card/80 transition-colors" data-testid="stat-rank">
          <CardContent className="pt-4">
            <Star className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-primary">#{user.rank}</div>
            <div className="text-xs text-muted-foreground">Your Global Rank</div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Challenges */}
      <Card className="mb-8 bg-gaming-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sword className="w-5 h-5 text-primary" />
            Daily Challenges
            <Badge className="bg-primary text-primary-foreground">2/3 Complete</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Crosshair className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium">Win 3 PUBG Matches</p>
                  <p className="text-sm text-muted-foreground">2/3 completed</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-primary">₹50</div>
                <Progress value={67} className="w-16 h-2" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-secondary-foreground" />
                </div>
                <div>
                  <p className="font-medium">Join 2 Tournaments</p>
                  <p className="text-sm text-muted-foreground">1/2 completed</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-secondary">₹75</div>
                <Progress value={50} className="w-16 h-2" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg border border-accent/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-medium text-accent">Reach Top 10 in Free Fire</p>
                  <p className="text-sm text-muted-foreground">0/1 completed</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-accent">₹100</div>
                <Progress value={0} className="w-16 h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Button 
          className="neon-border animate-pulse-glow"
          onClick={() => setShowCreateModal(true)}
          data-testid="create-tournament-button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Tournament
        </Button>
        <Link href="/tournaments">
          <Button variant="secondary" data-testid="find-tournament-button">
            <Search className="w-4 h-4 mr-2" />
            Find Tournament
          </Button>
        </Link>
        <Link href="/leaderboard">
          <Button variant="outline" className="bg-accent hover:bg-accent/90" data-testid="view-rewards-button">
            <Trophy className="w-4 h-4 mr-2" />
            View Rewards
          </Button>
        </Link>
      </div>

      {/* Game Tabs */}
      <Tabs value={activeGame} onValueChange={setActiveGame} className="mb-8">
        <TabsList className="grid w-fit grid-cols-3 bg-muted">
          <TabsTrigger value="PUBG" className="flex items-center gap-2" data-testid="tab-pubg">
            <Crosshair className="w-4 h-4" />
            PUBG Mobile
          </TabsTrigger>
          <TabsTrigger value="FREE_FIRE" className="flex items-center gap-2" data-testid="tab-freefire">
            <Flame className="w-4 h-4" />
            Free Fire
          </TabsTrigger>
          <TabsTrigger value="COD" className="flex items-center gap-2" data-testid="tab-cod" disabled>
            <Gamepad2 className="w-4 h-4" />
            COD Mobile
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeGame} className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gameTournaments.length > 0 ? (
              gameTournaments.map((tournament: Tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))
            ) : (
              <div className="col-span-full text-center py-12" data-testid="no-tournaments">
                <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  No {activeGame.replace("_", " ")} tournaments available right now.
                </p>
                <Button 
                  className="mt-4"
                  onClick={() => setShowCreateModal(true)}
                  data-testid="create-first-tournament"
                >
                  Create the First Tournament
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Featured Tournaments */}
      {featuredTournaments.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Featured Tournaments</h2>
            <Link href="/tournaments">
              <Button variant="link" className="text-primary" data-testid="view-all-tournaments">
                View All
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredTournaments.slice(0, 3).map((tournament: Tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        </div>
      )}

      {/* My Active Tournament */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">My Active Tournament</h2>
        <Card className="bg-gaming-card" data-testid="my-tournament-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <Crosshair className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">PUBG Evening Battle</h3>
                  <p className="text-sm text-muted-foreground">Currently Playing</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary">#3</div>
                <div className="text-xs text-muted-foreground">Current Rank</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div>
                <div className="text-sm font-medium">12</div>
                <div className="text-xs text-muted-foreground">Kills</div>
              </div>
              <div>
                <div className="text-sm font-medium">18:45</div>
                <div className="text-xs text-muted-foreground">Survival Time</div>
              </div>
              <div>
                <div className="text-sm font-medium text-primary">₹450</div>
                <div className="text-xs text-muted-foreground">Potential Win</div>
              </div>
            </div>
            
            <Button 
              variant="secondary" 
              className="w-full"
              data-testid="view-live-match"
            >
              <Trophy className="w-4 h-4 mr-2" />
              View Live Match
            </Button>
          </CardContent>
        </Card>
      </div>

      <CreateTournamentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={(data) => {
          console.log("Create tournament:", data);
          setShowCreateModal(false);
        }}
      />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
