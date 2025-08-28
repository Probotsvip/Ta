import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tournament } from "@shared/schema";
import { useAuth } from "@/contexts/auth-context";
import { Crosshair, Flame, Wallet, Trophy } from "lucide-react";

interface JoinTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournament?: Tournament;
  onJoin?: (data: { inGameName: string; inGameId: string }) => void;
  isLoading?: boolean;
}

export default function JoinTournamentModal({ 
  isOpen, 
  onClose, 
  tournament, 
  onJoin,
  isLoading = false
}: JoinTournamentModalProps) {
  const { user } = useAuth();
  const [inGameName, setInGameName] = useState("");
  const [inGameId, setInGameId] = useState("");

  const handleJoin = () => {
    if (!inGameName.trim() || !inGameId.trim()) return;
    onJoin?.({ inGameName: inGameName.trim(), inGameId: inGameId.trim() });
  };

  const handleClose = () => {
    setInGameName("");
    setInGameId("");
    onClose();
  };

  const getGameIcon = () => {
    return tournament?.game === "PUBG" ? <Crosshair className="w-5 h-5" /> : <Flame className="w-5 h-5" />;
  };

  const canJoin = user && tournament && 
    parseFloat(user.walletBalance) >= parseFloat(tournament.entryFee) &&
    inGameName.trim() && inGameId.trim();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" data-testid="join-tournament-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2" data-testid="modal-title">
            {tournament ? (
              <>
                {getGameIcon()}
                Join Tournament
              </>
            ) : (
              "Quick Join Tournament"
            )}
          </DialogTitle>
        </DialogHeader>

        {tournament && (
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-lg">
              <h3 className="font-semibold mb-2" data-testid="tournament-title">{tournament.name}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Entry Fee:</span>
                  <div className="font-medium" data-testid="modal-entry-fee">₹{tournament.entryFee}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Prize Pool:</span>
                  <div className="font-medium text-primary" data-testid="modal-prize-pool">₹{tournament.prizePool}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Players:</span>
                  <div className="font-medium" data-testid="modal-player-count">
                    {tournament.currentPlayers || 0}/{tournament.maxPlayers}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Tier:</span>
                  <div className="font-medium">{tournament.tier}</div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div>
                <Label htmlFor="inGameName">In-Game Name</Label>
                <Input
                  id="inGameName"
                  value={inGameName}
                  onChange={(e) => setInGameName(e.target.value)}
                  placeholder="Enter your in-game name"
                  data-testid="input-game-name"
                />
              </div>
              <div>
                <Label htmlFor="inGameId">
                  {tournament.game === "PUBG" ? "PUBG ID" : "Free Fire ID"}
                </Label>
                <Input
                  id="inGameId"
                  value={inGameId}
                  onChange={(e) => setInGameId(e.target.value)}
                  placeholder={`Enter your ${tournament.game === "PUBG" ? "PUBG" : "Free Fire"} ID`}
                  data-testid="input-game-id"
                />
              </div>
            </div>

            <Separator />

            <div className="bg-muted p-3 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  <span>Wallet Balance:</span>
                </div>
                <span className="font-medium" data-testid="wallet-balance">
                  ₹{user ? parseFloat(user.walletBalance).toLocaleString("en-IN") : "0"}
                </span>
              </div>
              {user && parseFloat(user.walletBalance) < parseFloat(tournament.entryFee) && (
                <div className="text-xs text-destructive mt-1">
                  Insufficient balance. Please add funds to your wallet.
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={handleClose}
                data-testid="cancel-join-button"
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleJoin}
                disabled={!canJoin || isLoading}
                data-testid="confirm-join-button"
              >
                {isLoading ? "Joining..." : `Join (₹${tournament.entryFee})`}
              </Button>
            </div>
          </div>
        )}

        {!tournament && (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              Select a tournament from the main page to join
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
