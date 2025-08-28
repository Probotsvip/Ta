import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTournamentSchema } from "@shared/schema";
import { z } from "zod";

const createTournamentSchema = insertTournamentSchema.extend({
  startTime: z.string().min(1, "Start time is required"),
});

type CreateTournamentForm = z.infer<typeof createTournamentSchema>;

interface CreateTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTournamentForm) => void;
  isLoading?: boolean;
}

export default function CreateTournamentModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  isLoading = false
}: CreateTournamentModalProps) {
  const form = useForm<CreateTournamentForm>({
    resolver: zodResolver(createTournamentSchema),
    defaultValues: {
      name: "",
      description: "",
      game: "PUBG",
      gameMode: "SQUAD",
      maxPlayers: 100,
      entryFee: "50",
      prizePool: "4500",
      tier: "BRONZE",
      roomId: "",
      roomPassword: "",
      mapName: "",
      startTime: "",
    },
  });

  const gameValue = form.watch("game");

  const handleSubmit = (data: CreateTournamentForm) => {
    onSubmit({
      ...data,
      startTime: new Date(data.startTime).toISOString(),
    });
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto" data-testid="create-tournament-modal">
        <DialogHeader>
          <DialogTitle>Create Tournament</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tournament Name</FormLabel>
                  <FormControl>
                    <Input placeholder="PUBG Squad Championship" {...field} data-testid="input-tournament-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tournament description..." 
                      className="min-h-[80px]" 
                      {...field}
                      value={field.value || ''}
                      data-testid="input-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="game"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Game</FormLabel>
                    <Select onValueChange={(value) => {
                      field.onChange(value);
                      // Auto-adjust max players based on game
                      const maxPlayers = value === "FREE_FIRE" ? 50 : 100;
                      form.setValue("maxPlayers", maxPlayers);
                    }} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-game">
                          <SelectValue placeholder="Select game" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PUBG">PUBG Mobile</SelectItem>
                        <SelectItem value="FREE_FIRE">Free Fire</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gameMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Game Mode</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-game-mode">
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SOLO">Solo</SelectItem>
                        <SelectItem value="DUO">Duo</SelectItem>
                        <SelectItem value="SQUAD">Squad</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="maxPlayers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Players</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={gameValue === "FREE_FIRE" ? 10 : 20}
                        max={gameValue === "FREE_FIRE" ? 50 : 100}
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        data-testid="input-max-players"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tier</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-tier">
                          <SelectValue placeholder="Select tier" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="BRONZE">Bronze</SelectItem>
                        <SelectItem value="SILVER">Silver</SelectItem>
                        <SelectItem value="GOLD">Gold</SelectItem>
                        <SelectItem value="DIAMOND">Diamond</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="entryFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entry Fee (₹)</FormLabel>
                    <FormControl>
                      <Input placeholder="50" {...field} data-testid="input-entry-fee" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prizePool"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prize Pool (₹)</FormLabel>
                    <FormControl>
                      <Input placeholder="4500" {...field} data-testid="input-prize-pool" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="roomId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room ID</FormLabel>
                    <FormControl>
                      <Input placeholder="12345678" {...field} value={field.value || ''} data-testid="input-room-id" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roomPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Password</FormLabel>
                    <FormControl>
                      <Input placeholder="1234" {...field} value={field.value || ''} data-testid="input-room-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="mapName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Map</FormLabel>
                    <FormControl>
                      <Input placeholder="Erangel" {...field} value={field.value || ''} data-testid="input-map-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input 
                        type="datetime-local" 
                        {...field} 
                        data-testid="input-start-time"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1" 
                onClick={handleClose}
                data-testid="cancel-create-button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
                data-testid="create-tournament-button"
              >
                {isLoading ? "Creating..." : "Create Tournament"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
