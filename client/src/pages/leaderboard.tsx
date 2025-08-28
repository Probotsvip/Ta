import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Crown, Medal, Award, TrendingUp, Calendar, Clock, Star } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function Leaderboard() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("DAILY");

  const { data: leaderboardData } = useQuery({
    queryKey: ["/api/leaderboard", { period: selectedPeriod }],
  });

  const leaderboard = leaderboardData || [];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-orange-600" />;
      default:
        return <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs font-bold">{rank}</div>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1: return "bg-yellow-500 text-black";
      case 2: return "bg-gray-400 text-white";
      case 3: return "bg-orange-600 text-white";
      default: return "bg-primary text-primary-foreground";
    }
  };

  return (
    <div className="container mx-auto px-4 py-6" data-testid="leaderboard-page">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="w-8 h-8 text-primary animate-glow" />
          <h1 className="text-3xl font-bold gradient-text">Global Leaderboard</h1>
        </div>
        <p className="text-muted-foreground">Compete with the best players worldwide</p>
      </div>

      {/* Period Selector */}
      <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod} className="mb-8">
        <div className="flex justify-center">
          <TabsList className="grid w-fit grid-cols-4 bg-muted">
            <TabsTrigger value="DAILY" className="flex items-center gap-2" data-testid="period-daily">
              <Clock className="w-4 h-4" />
              Daily
            </TabsTrigger>
            <TabsTrigger value="WEEKLY" className="flex items-center gap-2" data-testid="period-weekly">
              <Calendar className="w-4 h-4" />
              Weekly
            </TabsTrigger>
            <TabsTrigger value="MONTHLY" className="flex items-center gap-2" data-testid="period-monthly">
              <TrendingUp className="w-4 h-4" />
              Monthly
            </TabsTrigger>
            <TabsTrigger value="ALL_TIME" className="flex items-center gap-2" data-testid="period-all-time">
              <Star className="w-4 h-4" />
              All Time
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 mt-8">
          {leaderboard.slice(0, 3).map((player: any, index: number) => (
            <Card 
              key={player.id} 
              className={`relative overflow-hidden ${
                index === 0 ? 'order-2 md:order-2 ring-2 ring-yellow-500 animate-pulse-glow' :
                index === 1 ? 'order-1 md:order-1' : 'order-3 md:order-3'
              } ${index === 0 ? 'md:scale-110 md:-mt-4' : ''}`}
              data-testid={`podium-${index + 1}`}
            >
              <div className={`absolute top-0 left-0 right-0 h-1 ${
                index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-500' :
                'bg-gradient-to-r from-orange-400 to-orange-600'
              }`} />
              
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-4">
                  {getRankIcon(index + 1)}
                </div>
                
                <Avatar className="w-16 h-16 mx-auto mb-3 border-2 border-primary">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {player.user?.username?.slice(0, 2).toUpperCase() || "??"}
                  </AvatarFallback>
                </Avatar>
                
                <h3 className="font-bold text-lg mb-1" data-testid="player-username">
                  {player.user?.username || "Unknown Player"}
                </h3>
                
                <div className="text-2xl font-bold text-primary mb-2" data-testid="player-winnings">
                  ₹{parseFloat(player.totalWinnings).toLocaleString("en-IN")}
                </div>
                
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>{player.totalGames} games</div>
                  <div>{parseFloat(player.winRate)}% win rate</div>
                </div>
                
                <Badge className={`mt-3 ${getRankBadgeColor(index + 1)}`}>
                  #{index + 1}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Full Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Full Leaderboard</span>
              {user && (
                <Badge variant="secondary" data-testid="user-current-rank">
                  Your Rank: #{user.rank}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0" data-testid="leaderboard-list">
              {leaderboard.map((player: any, index: number) => (
                <div 
                  key={player.id}
                  className={`flex items-center justify-between p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors ${
                    player.userId === user?.id ? 'bg-primary/10 border-primary/20' : ''
                  }`}
                  data-testid={`leaderboard-row-${index}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8">
                      {index < 3 ? (
                        getRankIcon(index + 1)
                      ) : (
                        <Badge className={getRankBadgeColor(index + 1)}>
                          {index + 1}
                        </Badge>
                      )}
                    </div>
                    
                    <Avatar className="w-10 h-10 border-2 border-muted">
                      <AvatarFallback className="bg-muted text-foreground">
                        {player.user?.username?.slice(0, 2).toUpperCase() || "??"}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="font-semibold" data-testid="row-username">
                        {player.user?.username || "Unknown Player"}
                        {player.userId === user?.id && (
                          <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground" data-testid="row-games">
                        {player.totalGames} games played
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-lg text-primary" data-testid="row-winnings">
                      ₹{parseFloat(player.totalWinnings).toLocaleString("en-IN")}
                    </div>
                    <div className="text-sm text-muted-foreground" data-testid="row-winrate">
                      {parseFloat(player.winRate)}% win rate
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {leaderboard.length === 0 && (
              <div className="text-center py-12" data-testid="no-leaderboard-data">
                <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  No leaderboard data available for this period.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </Tabs>

      {/* User Stats Card */}
      {user && (
        <Card className="mt-8 bg-gaming-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Avatar className="w-8 h-8 border-2 border-primary">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              Your Gaming Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary" data-testid="user-rank">#{user.rank}</div>
                <div className="text-xs text-muted-foreground">Global Rank</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary" data-testid="user-winnings">
                  ₹{parseFloat(user.totalWinnings).toLocaleString("en-IN")}
                </div>
                <div className="text-xs text-muted-foreground">Total Winnings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent" data-testid="user-games">{user.totalGames}</div>
                <div className="text-xs text-muted-foreground">Games Played</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary" data-testid="user-winrate">{user.winRate}%</div>
                <div className="text-xs text-muted-foreground">Win Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
