import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, Trophy, Crosshair, Flame } from "lucide-react";
import { Tournament } from "@shared/schema";
import { useAuth } from "@/contexts/auth-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import JoinTournamentModal from "@/components/modals/join-tournament";

interface TournamentCardProps {
  tournament: Tournament;
}

export default function TournamentCard({ tournament }: TournamentCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showJoinModal, setShowJoinModal] = useState(false);

  const joinMutation = useMutation({
    mutationFn: async (joinData: { inGameName: string; inGameId: string }) => {
      const response = await apiRequest("POST", `/api/tournaments/${tournament.id}/join`, {
        userId: user?.id,
        ...joinData,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      toast({
        title: "Success!",
        description: "Successfully joined tournament",
      });
      setShowJoinModal(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to join tournament",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = () => {
    switch (tournament.status) {
      case "LIVE":
        return <Badge variant="destructive" className="text-xs font-medium">LIVE</Badge>;
      case "STARTING":
        return <Badge className="bg-accent text-accent-foreground text-xs font-medium">STARTING</Badge>;
      case "WAITING":
        return <Badge className="bg-primary text-primary-foreground text-xs font-medium">OPEN</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs font-medium">{tournament.status}</Badge>;
    }
  };

  const getGameIcon = () => {
    return tournament.game === "PUBG" ? <Crosshair className="w-4 h-4" /> : <Flame className="w-4 h-4" />;
  };

  const getTierColor = () => {
    switch (tournament.tier) {
      case "DIAMOND": return "text-blue-400";
      case "GOLD": return "text-yellow-400";
      case "SILVER": return "text-gray-300";
      default: return "text-orange-400";
    }
  };

  const progressPercentage = ((tournament.currentPlayers || 0) / tournament.maxPlayers) * 100;
  const canJoin = tournament.status === "WAITING" && (tournament.currentPlayers || 0) < tournament.maxPlayers;

  return (
    <>
      <Card className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition-colors hover-glow" data-testid={`tournament-card-${tournament.id}`}>
        <div className="p-4 pb-0">
          <div className="flex items-center justify-between mb-3">
            {getStatusBadge()}
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="w-3 h-3 mr-1" />
              <span data-testid="tournament-time">
                {tournament.status === "LIVE" ? "Live Now" : "Starting Soon"}
              </span>
            </div>
          </div>

          <div className="flex items-center mb-2">
            {getGameIcon()}
            <h3 className="font-semibold ml-2" data-testid="tournament-name">
              {tournament.name}
            </h3>
            <Badge variant="outline" className={`ml-auto text-xs ${getTierColor()}`}>
              {tournament.tier}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4 pt-2">
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Entry Fee:</span>
              <span className="font-medium" data-testid="entry-fee">₹{tournament.entryFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Prize Pool:</span>
              <span className="font-medium text-primary" data-testid="prize-pool">
                ₹{parseFloat(tournament.prizePool).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Players:</span>
              <span className="font-medium" data-testid="player-count">
                {tournament.currentPlayers || 0}/{tournament.maxPlayers}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <Progress 
              value={progressPercentage} 
              className="h-2"
              data-testid="tournament-progress"
            />
          </div>

          <Button
            className={`w-full font-medium transition-opacity ${
              canJoin 
                ? tournament.tier === "DIAMOND" 
                  ? "bg-blue-600 hover:bg-blue-700" 
                  : tournament.tier === "GOLD"
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : tournament.tier === "SILVER"
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-primary hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
            disabled={!canJoin || joinMutation.isPending}
            onClick={() => setShowJoinModal(true)}
            data-testid="join-tournament-button"
          >
            {joinMutation.isPending ? "Joining..." : 
             !canJoin ? "Full" : "Join Now"}
          </Button>
        </CardContent>
      </Card>

      <JoinTournamentModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        tournament={tournament}
        onJoin={joinMutation.mutate}
        isLoading={joinMutation.isPending}
      />
    </>
  );
}
