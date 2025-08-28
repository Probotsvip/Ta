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
    activePlayers: 0,
    liveTournaments: 0,
    totalPrizePool: 0,
  });

  const { data: featuredData } = useQuery({
    queryKey: ["/api/tournaments?featured=true"],
  });

  const { data: gameData } = useQuery({
    queryKey: ["/api/tournaments?game=" + activeGame],
  });

  // Calculate real stats from data
  useEffect(() => {
    if (featuredData?.tournaments && gameData?.tournaments) {
      const allTournaments = featuredData.tournaments;
      const activeTournaments = allTournaments.filter(t => t.status === 'WAITING' || t.status === 'LIVE').length;
      const totalPrize = allTournaments.reduce((sum, t) => sum + parseFloat(t.prizePool || '0'), 0);
      const totalPlayers = allTournaments.reduce((sum, t) => sum + (t.currentPlayers || 0), 0);

      setLiveStats({
        activePlayers: totalPlayers,
        liveTournaments: activeTournaments,
        totalPrizePool: totalPrize,
      });
    }
  }, [featuredData, gameData]);

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
                    <div className="text-2xl font-bold text-primary">
                      {liveStats.activePlayers || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Active Players</div>
                  </CardContent>
                </Card>
                <Card className="bg-gaming-card/50 backdrop-blur-sm">
                  <CardContent className="pt-4 text-center">
                    <div className="text-2xl font-bold text-secondary">
                      {liveStats.liveTournaments || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Live Tournaments</div>
                  </CardContent>
                </Card>
                <Card className="bg-gaming-card/50 backdrop-blur-sm">
                  <CardContent className="pt-4 text-center">
                    <div className="text-2xl font-bold text-accent">
                      ₹{liveStats.totalPrizePool ? Math.floor(liveStats.totalPrizePool).toLocaleString('en-IN') : 0}
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
            <div className="text-2xl font-bold text-primary">{liveStats.liveTournaments || 0}</div>
            <div className="text-xs text-muted-foreground">Live Now</div>
          </CardContent>
        </Card>
        <Card className="text-center bg-gaming-card hover:bg-gaming-card/80 transition-colors" data-testid="stat-players">
          <CardContent className="pt-4">
            <Users className="w-6 h-6 mx-auto mb-2 text-secondary" />
            <div className="text-2xl font-bold text-secondary">{liveStats.activePlayers || 0}</div>
            <div className="text-xs text-muted-foreground">Total Players</div>
          </CardContent>
        </Card>
        <Card className="text-center bg-gaming-card hover:bg-gaming-card/80 transition-colors" data-testid="stat-prize">
          <CardContent className="pt-4">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-accent" />
            <div className="text-2xl font-bold text-accent">₹{liveStats.totalPrizePool ? Math.floor(liveStats.totalPrizePool).toLocaleString('en-IN') : 0}</div>
            <div className="text-xs text-muted-foreground">Total Prize Pool</div>
          </CardContent>
        </Card>
        <Card className="text-center bg-gaming-card hover:bg-gaming-card/80 transition-colors" data-testid="stat-rank">
          <CardContent className="pt-4">
            <Star className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-primary">#{user.rank || 'Unranked'}</div>
            <div className="text-xs text-muted-foreground">Your Global Rank</div>
          </CardContent>
        </Card>
      </div>


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
