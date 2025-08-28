export interface GameStats {
  totalTournaments: number;
  totalPlayers: string;
  totalPrize: string;
  userRank: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  avatar?: string;
  walletBalance: string;
  totalWinnings: string;
  totalGames: number;
  winRate: string;
  rank: number;
  isAdmin: string;
}

export interface TournamentStatus {
  WAITING: "WAITING";
  STARTING: "STARTING";
  LIVE: "LIVE";
  FINISHED: "FINISHED";
  CANCELLED: "CANCELLED";
}

export interface GameType {
  PUBG: "PUBG";
  FREE_FIRE: "FREE_FIRE";
}

export interface TournamentTier {
  BRONZE: "BRONZE";
  SILVER: "SILVER";
  GOLD: "GOLD";
  DIAMOND: "DIAMOND";
}
