import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  phoneNumber: text("phone_number"),
  avatar: text("avatar"),
  walletBalance: decimal("wallet_balance", { precision: 10, scale: 2 }).default("0.00"),
  totalWinnings: decimal("total_winnings", { precision: 10, scale: 2 }).default("0.00"),
  totalGames: integer("total_games").default(0),
  winRate: decimal("win_rate", { precision: 5, scale: 2 }).default("0.00"),
  rank: integer("rank").default(0),
  isAdmin: varchar("is_admin").default("false"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tournaments = pgTable("tournaments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  game: text("game").notNull(), // "PUBG" or "FREE_FIRE"
  gameMode: text("game_mode").notNull(), // "SOLO", "DUO", "SQUAD"
  maxPlayers: integer("max_players").notNull(),
  currentPlayers: integer("current_players").default(0),
  entryFee: decimal("entry_fee", { precision: 10, scale: 2 }).notNull(),
  prizePool: decimal("prize_pool", { precision: 10, scale: 2 }).notNull(),
  prizeDistribution: jsonb("prize_distribution"), // {"1": 0.5, "2": 0.3, "3": 0.2}
  roomId: text("room_id"),
  roomPassword: text("room_password"),
  mapName: text("map_name"),
  status: text("status").default("WAITING"), // "WAITING", "STARTING", "LIVE", "FINISHED", "CANCELLED"
  tier: text("tier").default("BRONZE"), // "BRONZE", "SILVER", "GOLD", "DIAMOND"
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tournamentParticipants = pgTable("tournament_participants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tournamentId: varchar("tournament_id").references(() => tournaments.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  inGameName: text("in_game_name").notNull(),
  inGameId: text("in_game_id").notNull(),
  kills: integer("kills").default(0),
  survivalTime: integer("survival_time").default(0), // in seconds
  placement: integer("placement"),
  points: integer("points").default(0),
  prizeWon: decimal("prize_won", { precision: 10, scale: 2 }).default("0.00"),
  status: text("status").default("JOINED"), // "JOINED", "PLAYING", "FINISHED", "DISQUALIFIED"
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  tournamentId: varchar("tournament_id").references(() => tournaments.id),
  type: text("type").notNull(), // "ENTRY_FEE", "PRIZE_WIN", "DEPOSIT", "WITHDRAWAL"
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("PENDING"), // "PENDING", "COMPLETED", "FAILED"
  description: text("description"),
  paymentGateway: text("payment_gateway"), // "RAZORPAY", "PAYTM", etc.
  transactionRef: text("transaction_ref"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const leaderboard = pgTable("leaderboard", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  period: text("period").notNull(), // "DAILY", "WEEKLY", "MONTHLY", "ALL_TIME"
  totalWinnings: decimal("total_winnings", { precision: 10, scale: 2 }).default("0.00"),
  totalGames: integer("total_games").default(0),
  winRate: decimal("win_rate", { precision: 5, scale: 2 }).default("0.00"),
  rank: integer("rank").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  walletBalance: true,
  totalWinnings: true,
  totalGames: true,
  winRate: true,
  rank: true,
  isAdmin: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTournamentSchema = createInsertSchema(tournaments).omit({
  id: true,
  currentPlayers: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTournamentParticipantSchema = createInsertSchema(tournamentParticipants).omit({
  id: true,
  kills: true,
  survivalTime: true,
  placement: true,
  points: true,
  prizeWon: true,
  status: true,
  joinedAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  status: true,
  createdAt: true,
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Tournament = typeof tournaments.$inferSelect;
export type InsertTournament = z.infer<typeof insertTournamentSchema>;
export type TournamentParticipant = typeof tournamentParticipants.$inferSelect;
export type InsertTournamentParticipant = z.infer<typeof insertTournamentParticipantSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type LeaderboardEntry = typeof leaderboard.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
