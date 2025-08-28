import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginSchema, insertTournamentSchema, insertTournamentParticipantSchema, insertTransactionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await storage.createUser(userData);
      // Don't return password
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Don't return password
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: "Invalid login data", error });
    }
  });

  // Tournament routes
  app.get("/api/tournaments", async (req, res) => {
    try {
      const { game, featured } = req.query;
      
      let tournaments;
      if (featured === "true") {
        tournaments = await storage.getFeaturedTournaments();
      } else if (game) {
        tournaments = await storage.getTournamentsByGame(game as string);
      } else {
        tournaments = await storage.getTournaments();
      }
      
      res.json({ tournaments });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tournaments", error });
    }
  });

  app.get("/api/tournaments/:id", async (req, res) => {
    try {
      const tournament = await storage.getTournament(req.params.id);
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }

      const participants = await storage.getTournamentParticipants(tournament.id);
      res.json({ tournament, participants });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tournament", error });
    }
  });

  app.post("/api/tournaments", async (req, res) => {
    try {
      const tournamentData = insertTournamentSchema.parse(req.body);
      const tournament = await storage.createTournament(tournamentData);
      res.json({ tournament });
    } catch (error) {
      res.status(400).json({ message: "Invalid tournament data", error });
    }
  });

  app.put("/api/tournaments/:id", async (req, res) => {
    try {
      const updates = req.body;
      const tournament = await storage.updateTournament(req.params.id, updates);
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }
      res.json({ tournament });
    } catch (error) {
      res.status(500).json({ message: "Failed to update tournament", error });
    }
  });

  app.delete("/api/tournaments/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteTournament(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Tournament not found" });
      }
      res.json({ message: "Tournament deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete tournament", error });
    }
  });

  // Tournament participation routes
  app.post("/api/tournaments/:id/join", async (req, res) => {
    try {
      const participantData = insertTournamentParticipantSchema.parse({
        ...req.body,
        tournamentId: req.params.id
      });

      const tournament = await storage.getTournament(req.params.id);
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }

      if ((tournament.currentPlayers || 0) >= tournament.maxPlayers) {
        return res.status(400).json({ message: "Tournament is full" });
      }

      // Check if user has enough balance
      const user = await storage.getUser(participantData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const userBalance = parseFloat(user.walletBalance || "0");
      const entryFee = parseFloat(tournament.entryFee);

      if (userBalance < entryFee) {
        return res.status(400).json({ message: "Insufficient wallet balance" });
      }

      // Create participant
      const participant = await storage.addTournamentParticipant(participantData);

      // Deduct entry fee from user balance
      await storage.updateUserBalance(participantData.userId, -entryFee);

      // Create transaction record
      await storage.createTransaction({
        userId: participantData.userId,
        tournamentId: tournament.id,
        type: "ENTRY_FEE",
        amount: tournament.entryFee,
        description: `Entry fee for ${tournament.name}`,
      });

      res.json({ participant });
    } catch (error) {
      res.status(400).json({ message: "Failed to join tournament", error });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user", error });
    }
  });

  app.get("/api/users/:id/tournaments", async (req, res) => {
    try {
      const userTournaments = await storage.getUserTournaments(req.params.id);
      res.json({ tournaments: userTournaments });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user tournaments", error });
    }
  });

  app.get("/api/users/:id/transactions", async (req, res) => {
    try {
      const transactions = await storage.getUserTransactions(req.params.id);
      res.json({ transactions });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions", error });
    }
  });

  app.post("/api/users/:id/deposit", async (req, res) => {
    try {
      const { amount, paymentGateway, transactionRef } = req.body;
      const userId = req.params.id;

      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      // Create transaction record
      const transaction = await storage.createTransaction({
        userId,
        type: "DEPOSIT",
        amount: amount.toString(),
        description: "Wallet deposit",
        paymentGateway,
        transactionRef,
      });

      // Update user balance
      await storage.updateUserBalance(userId, amount);

      // Update transaction status
      await storage.updateTransaction(transaction.id, { status: "COMPLETED" });

      res.json({ transaction, message: "Deposit successful" });
    } catch (error) {
      res.status(500).json({ message: "Failed to process deposit", error });
    }
  });

  // Leaderboard routes
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const { period = "ALL_TIME", limit = 10 } = req.query;
      const leaderboard = await storage.getLeaderboard(period as string, parseInt(limit as string));
      res.json({ leaderboard });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leaderboard", error });
    }
  });

  // Admin routes
  app.get("/api/admin/stats", async (req, res) => {
    try {
      // Simple admin check - in real app, use proper authentication
      const { adminId } = req.query;
      const user = await storage.getUser(adminId as string);
      
      if (!user || user.isAdmin !== "true") {
        return res.status(403).json({ message: "Access denied" });
      }

      const stats = await storage.getAdminStats();
      res.json({ stats });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admin stats", error });
    }
  });

  app.put("/api/admin/tournaments/:id/update-results", async (req, res) => {
    try {
      const { adminId, results } = req.body;
      const user = await storage.getUser(adminId as string);
      
      if (!user || user.isAdmin !== "true") {
        return res.status(403).json({ message: "Access denied" });
      }

      const tournamentId = req.params.id;
      
      // Update tournament status to finished
      await storage.updateTournament(tournamentId, { status: "FINISHED", endTime: new Date() });

      // Update participant results and distribute prizes
      for (const result of results) {
        const { participantId, placement, kills, survivalTime, prizeWon } = result;
        
        await storage.updateTournamentParticipant(participantId, {
          placement,
          kills,
          survivalTime,
          prizeWon: prizeWon.toString(),
          status: "FINISHED"
        });

        // If prize won, update user balance and create transaction
        if (prizeWon > 0) {
          const participant = await storage.getTournamentParticipants(tournamentId);
          const winningParticipant = participant.find(p => p.id === participantId);
          
          if (winningParticipant) {
            await storage.updateUserBalance(winningParticipant.userId, prizeWon);
            
            await storage.createTransaction({
              userId: winningParticipant.userId,
              tournamentId,
              type: "PRIZE_WIN",
              amount: prizeWon.toString(),
              description: `Prize for tournament ${tournamentId}`,
            });
            
            await storage.updateTransaction(
              (await storage.getUserTransactions(winningParticipant.userId))[0].id,
              { status: "COMPLETED" }
            );
          }
        }
      }

      res.json({ message: "Tournament results updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update tournament results", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
