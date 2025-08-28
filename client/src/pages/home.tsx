import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Trophy, Crosshair, Flame, Gamepad2 } from "lucide-react";
import TournamentCard from "@/components/tournament-card";
import CreateTournamentModal from "@/components/modals/create-tournament";
import { Tournament } from "@shared/schema";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeGame, setActiveGame] = useState("PUBG");

  const { data: featuredData } = useQuery({
    queryKey: ["/api/tournaments", { featured: "true" }],
  });

  const { data: gameData } = useQuery({
    queryKey: ["/api/tournaments", { game: activeGame }],
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold gradient-text mb-4">GameArena</div>
            <p className="text-muted-foreground mb-4">
              Join tournaments, win prizes, and become a gaming legend!
            </p>
            <Button className="w-full" data-testid="login-prompt">
              Login to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const featuredTournaments = featuredData || [];
  const gameTournaments = gameData || [];

  return (
    <div className="container mx-auto px-4 py-6" data-testid="home-page">
      {/* Hero Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="text-center" data-testid="stat-tournaments">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-primary">156</div>
            <div className="text-xs text-muted-foreground">Live Tournaments</div>
          </CardContent>
        </Card>
        <Card className="text-center" data-testid="stat-players">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-secondary">24.5K</div>
            <div className="text-xs text-muted-foreground">Active Players</div>
          </CardContent>
        </Card>
        <Card className="text-center" data-testid="stat-prize">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-accent">₹12.8L</div>
            <div className="text-xs text-muted-foreground">Prize Pool</div>
          </CardContent>
        </Card>
        <Card className="text-center" data-testid="stat-rank">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-primary">#{user.rank}</div>
            <div className="text-xs text-muted-foreground">Your Rank</div>
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
    </div>
  );
}
