import { 
  type User, 
  type InsertUser, 
  type Tournament, 
  type InsertTournament,
  type TournamentParticipant,
  type InsertTournamentParticipant,
  type Transaction,
  type InsertTransaction,
  type LeaderboardEntry,
  type LoginData
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  updateUserBalance(id: string, amount: number): Promise<User | undefined>;

  // Tournament operations
  getTournaments(): Promise<Tournament[]>;
  getTournament(id: string): Promise<Tournament | undefined>;
  createTournament(tournament: InsertTournament): Promise<Tournament>;
  updateTournament(id: string, updates: Partial<Tournament>): Promise<Tournament | undefined>;
  deleteTournament(id: string): Promise<boolean>;
  getTournamentsByGame(game: string): Promise<Tournament[]>;
  getFeaturedTournaments(): Promise<Tournament[]>;

  // Tournament participants
  getTournamentParticipants(tournamentId: string): Promise<TournamentParticipant[]>;
  addTournamentParticipant(participant: InsertTournamentParticipant): Promise<TournamentParticipant>;
  updateTournamentParticipant(id: string, updates: Partial<TournamentParticipant>): Promise<TournamentParticipant | undefined>;
  getUserTournaments(userId: string): Promise<(TournamentParticipant & { tournament: Tournament })[]>;

  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getUserTransactions(userId: string): Promise<Transaction[]>;
  updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction | undefined>;

  // Leaderboard operations
  getLeaderboard(period: string, limit?: number): Promise<(LeaderboardEntry & { user: User })[]>;
  updateLeaderboard(userId: string, period: string, stats: Partial<LeaderboardEntry>): Promise<void>;

  // Admin operations
  getAdminStats(): Promise<{
    totalRevenue: number;
    activeTournaments: number;
    totalUsers: number;
    totalTransactions: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private tournaments: Map<string, Tournament>;
  private tournamentParticipants: Map<string, TournamentParticipant>;
  private transactions: Map<string, Transaction>;
  private leaderboard: Map<string, LeaderboardEntry>;

  constructor() {
    this.users = new Map();
    this.tournaments = new Map();
    this.tournamentParticipants = new Map();
    this.transactions = new Map();
    this.leaderboard = new Map();
    this.seedData();
  }

  private seedData() {
    // Create admin user
    const adminId = randomUUID();
    const admin: User = {
      id: adminId,
      username: "admin",
      email: "admin@gamearena.com",
      password: "admin123", // In real app, this would be hashed
      fullName: "Admin User",
      phoneNumber: "+91-9999999999",
      avatar: null,
      walletBalance: "0.00",
      totalWinnings: "0.00",
      totalGames: 0,
      winRate: "0.00",
      rank: 1,
      isAdmin: "true",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(adminId, admin);

    // Create sample user
    const userId = randomUUID();
    const user: User = {
      id: userId,
      username: "ProGamer_99",
      email: "user@gamearena.com",
      password: "user123",
      fullName: "Pro Gamer",
      phoneNumber: "+91-9876543210",
      avatar: null,
      walletBalance: "2450.00",
      totalWinnings: "15350.00",
      totalGames: 45,
      winRate: "67.50",
      rank: 847,
      isAdmin: "false",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userId, user);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      phoneNumber: insertUser.phoneNumber || null,
      avatar: insertUser.avatar || null,
      walletBalance: "0.00",
      totalWinnings: "0.00",
      totalGames: 0,
      winRate: "0.00",
      rank: 0,
      isAdmin: "false",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserBalance(id: string, amount: number): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const currentBalance = parseFloat(user.walletBalance || "0");
    const newBalance = (currentBalance + amount).toFixed(2);
    
    return this.updateUser(id, { walletBalance: newBalance });
  }

  async getTournaments(): Promise<Tournament[]> {
    return Array.from(this.tournaments.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getTournament(id: string): Promise<Tournament | undefined> {
    return this.tournaments.get(id);
  }

  async createTournament(insertTournament: InsertTournament): Promise<Tournament> {
    const id = randomUUID();
    const tournament: Tournament = {
      ...insertTournament,
      id,
      description: insertTournament.description || null,
      currentPlayers: 0,
      status: "WAITING",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tournaments.set(id, tournament);
    return tournament;
  }

  async updateTournament(id: string, updates: Partial<Tournament>): Promise<Tournament | undefined> {
    const tournament = this.tournaments.get(id);
    if (!tournament) return undefined;

    const updatedTournament = { ...tournament, ...updates, updatedAt: new Date() };
    this.tournaments.set(id, updatedTournament);
    return updatedTournament;
  }

  async deleteTournament(id: string): Promise<boolean> {
    return this.tournaments.delete(id);
  }

  async getTournamentsByGame(game: string): Promise<Tournament[]> {
    return Array.from(this.tournaments.values())
      .filter(t => t.game === game)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getFeaturedTournaments(): Promise<Tournament[]> {
    return Array.from(this.tournaments.values())
      .filter(t => t.status === "WAITING" || t.status === "LIVE")
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
      .slice(0, 6);
  }

  async getTournamentParticipants(tournamentId: string): Promise<TournamentParticipant[]> {
    return Array.from(this.tournamentParticipants.values())
      .filter(p => p.tournamentId === tournamentId);
  }

  async addTournamentParticipant(insertParticipant: InsertTournamentParticipant): Promise<TournamentParticipant> {
    const id = randomUUID();
    const participant: TournamentParticipant = {
      ...insertParticipant,
      id,
      kills: 0,
      survivalTime: 0,
      placement: null,
      points: 0,
      prizeWon: "0.00",
      status: "JOINED",
      joinedAt: new Date(),
    };
    this.tournamentParticipants.set(id, participant);

    // Update tournament current players count
    const tournament = this.tournaments.get(insertParticipant.tournamentId);
    if (tournament) {
      await this.updateTournament(tournament.id, { 
        currentPlayers: (tournament.currentPlayers || 0) + 1 
      });
    }

    return participant;
  }

  async updateTournamentParticipant(id: string, updates: Partial<TournamentParticipant>): Promise<TournamentParticipant | undefined> {
    const participant = this.tournamentParticipants.get(id);
    if (!participant) return undefined;

    const updatedParticipant = { ...participant, ...updates };
    this.tournamentParticipants.set(id, updatedParticipant);
    return updatedParticipant;
  }

  async getUserTournaments(userId: string): Promise<(TournamentParticipant & { tournament: Tournament })[]> {
    const userParticipations = Array.from(this.tournamentParticipants.values())
      .filter(p => p.userId === userId);

    return userParticipations.map(p => {
      const tournament = this.tournaments.get(p.tournamentId);
      return { ...p, tournament: tournament! };
    }).filter(p => p.tournament);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      description: insertTransaction.description || null,
      tournamentId: insertTransaction.tournamentId || null,
      paymentGateway: insertTransaction.paymentGateway || null,
      transactionRef: insertTransaction.transactionRef || null,
      status: "PENDING",
      createdAt: new Date(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;

    const updatedTransaction = { ...transaction, ...updates };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  async getLeaderboard(period: string, limit: number = 10): Promise<(LeaderboardEntry & { user: User })[]> {
    const entries = Array.from(this.leaderboard.values())
      .filter(entry => entry.period === period)
      .sort((a, b) => (b.rank || 0) - (a.rank || 0))
      .slice(0, limit);

    return entries.map(entry => {
      const user = this.users.get(entry.userId);
      return { ...entry, user: user! };
    }).filter(entry => entry.user);
  }

  async updateLeaderboard(userId: string, period: string, stats: Partial<LeaderboardEntry>): Promise<void> {
    const existingEntry = Array.from(this.leaderboard.values())
      .find(entry => entry.userId === userId && entry.period === period);

    if (existingEntry) {
      const updated = { ...existingEntry, ...stats, updatedAt: new Date() };
      this.leaderboard.set(existingEntry.id, updated);
    } else {
      const id = randomUUID();
      const newEntry: LeaderboardEntry = {
        id,
        userId,
        period,
        totalWinnings: stats.totalWinnings || "0.00",
        totalGames: stats.totalGames || 0,
        winRate: stats.winRate || "0.00",
        rank: stats.rank || 0,
        updatedAt: new Date(),
      };
      this.leaderboard.set(id, newEntry);
    }
  }

  async getAdminStats(): Promise<{
    totalRevenue: number;
    activeTournaments: number;
    totalUsers: number;
    totalTransactions: number;
  }> {
    const totalRevenue = Array.from(this.transactions.values())
      .filter(t => t.status === "COMPLETED" && t.type === "ENTRY_FEE")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const activeTournaments = Array.from(this.tournaments.values())
      .filter(t => t.status === "WAITING" || t.status === "LIVE").length;

    const totalUsers = this.users.size;
    const totalTransactions = this.transactions.size;

    return {
      totalRevenue,
      activeTournaments,
      totalUsers,
      totalTransactions,
    };
  }
}

export const storage = new MemStorage();
