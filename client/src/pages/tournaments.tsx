import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Plus, Trophy, Crosshair, Flame } from "lucide-react";
import TournamentCard from "@/components/tournament-card";
import CreateTournamentModal from "@/components/modals/create-tournament";
import { Tournament } from "@shared/schema";

export default function Tournaments() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGame, setSelectedGame] = useState("all");
  const [selectedTier, setSelectedTier] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["/api/tournaments"],
  });

  const tournaments: Tournament[] = data || [];

  const filteredTournaments = tournaments.filter((tournament) => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGame = selectedGame === "all" || tournament.game === selectedGame;
    const matchesTier = selectedTier === "all" || tournament.tier === selectedTier;
    const matchesStatus = selectedStatus === "all" || tournament.status === selectedStatus;
    
    return matchesSearch && matchesGame && matchesTier && matchesStatus;
  });

  const liveCount = tournaments.filter(t => t.status === "LIVE").length;
  const waitingCount = tournaments.filter(t => t.status === "WAITING").length;
  const totalPrizePool = tournaments.reduce((sum, t) => sum + parseFloat(t.prizePool), 0);

  return (
    <div className="container mx-auto px-4 py-6" data-testid="tournaments-page">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-destructive" data-testid="live-count">{liveCount}</div>
            <div className="text-xs text-muted-foreground">Live Now</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-primary" data-testid="waiting-count">{waitingCount}</div>
            <div className="text-xs text-muted-foreground">Open for Join</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-accent" data-testid="total-tournaments">{tournaments.length}</div>
            <div className="text-xs text-muted-foreground">Total Tournaments</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-secondary" data-testid="total-prize-pool">
              ₹{totalPrizePool.toLocaleString("en-IN")}
            </div>
            <div className="text-xs text-muted-foreground">Total Prize Pool</div>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Button 
          className="neon-border"
          onClick={() => setShowCreateModal(true)}
          data-testid="create-tournament-action"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Tournament
        </Button>
        
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tournaments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="search-tournaments"
          />
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Game</label>
              <Select value={selectedGame} onValueChange={setSelectedGame}>
                <SelectTrigger data-testid="filter-game">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Games</SelectItem>
                  <SelectItem value="PUBG">PUBG Mobile</SelectItem>
                  <SelectItem value="FREE_FIRE">Free Fire</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Tier</label>
              <Select value={selectedTier} onValueChange={setSelectedTier}>
                <SelectTrigger data-testid="filter-tier">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="BRONZE">Bronze</SelectItem>
                  <SelectItem value="SILVER">Silver</SelectItem>
                  <SelectItem value="GOLD">Gold</SelectItem>
                  <SelectItem value="DIAMOND">Diamond</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger data-testid="filter-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="WAITING">Open</SelectItem>
                  <SelectItem value="LIVE">Live</SelectItem>
                  <SelectItem value="FINISHED">Finished</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedGame("all");
                  setSelectedTier("all");
                  setSelectedStatus("all");
                }}
                data-testid="clear-filters"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tournament Tabs */}
      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-5">
          <TabsTrigger value="all" data-testid="tab-all">All ({filteredTournaments.length})</TabsTrigger>
          <TabsTrigger value="live" data-testid="tab-live">
            Live ({filteredTournaments.filter(t => t.status === "LIVE").length})
          </TabsTrigger>
          <TabsTrigger value="waiting" data-testid="tab-waiting">
            Open ({filteredTournaments.filter(t => t.status === "WAITING").length})
          </TabsTrigger>
          <TabsTrigger value="starting" data-testid="tab-starting">
            Starting ({filteredTournaments.filter(t => t.status === "STARTING").length})
          </TabsTrigger>
          <TabsTrigger value="finished" data-testid="tab-finished">
            Finished ({filteredTournaments.filter(t => t.status === "FINISHED").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <TournamentGrid tournaments={filteredTournaments} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="live" className="mt-6">
          <TournamentGrid 
            tournaments={filteredTournaments.filter(t => t.status === "LIVE")} 
            isLoading={isLoading} 
          />
        </TabsContent>

        <TabsContent value="waiting" className="mt-6">
          <TournamentGrid 
            tournaments={filteredTournaments.filter(t => t.status === "WAITING")} 
            isLoading={isLoading} 
          />
        </TabsContent>

        <TabsContent value="starting" className="mt-6">
          <TournamentGrid 
            tournaments={filteredTournaments.filter(t => t.status === "STARTING")} 
            isLoading={isLoading} 
          />
        </TabsContent>

        <TabsContent value="finished" className="mt-6">
          <TournamentGrid 
            tournaments={filteredTournaments.filter(t => t.status === "FINISHED")} 
            isLoading={isLoading} 
          />
        </TabsContent>
      </Tabs>

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

function TournamentGrid({ tournaments, isLoading }: { tournaments: Tournament[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-muted rounded-lg"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (tournaments.length === 0) {
    return (
      <div className="text-center py-12" data-testid="no-tournaments-found">
        <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
        <p className="text-muted-foreground">No tournaments found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="tournaments-grid">
      {tournaments.map((tournament) => (
        <TournamentCard key={tournament.id} tournament={tournament} />
      ))}
    </div>
  );
}
