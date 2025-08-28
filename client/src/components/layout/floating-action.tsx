import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import JoinTournamentModal from "@/components/modals/join-tournament";

export default function FloatingActionButton() {
  const [showJoinModal, setShowJoinModal] = useState(false);

  return (
    <>
      <Button
        className="fixed bottom-20 md:bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:scale-110 transition-transform neon-border animate-neon-pulse z-30"
        size="icon"
        onClick={() => setShowJoinModal(true)}
        data-testid="floating-quick-join"
      >
        <Zap className="w-6 h-6" />
      </Button>

      <JoinTournamentModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
      />
    </>
  );
}
