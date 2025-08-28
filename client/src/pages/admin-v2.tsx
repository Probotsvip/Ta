import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Settings, 
  Users, 
  Trophy, 
  CreditCard, 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Plus,
  UserCheck,
  UserX,
  Crown,
  Shield,
  Target,
  Zap,
  Activity,
  Bell,
  Calendar,
  MapPin,
  Clock,
  Star,
  Award,
  Gamepad2,
  Crosshair,
  Flame,
  CheckCircle,
  XCircle,
  RefreshCw,
  Filter,
  Search,
  Download,
  Upload,
  MoreHorizontal,
  Sword,
  Coins,
  Users2,
  LineChart,
  PieChart,
  Wifi,
  WifiOff,
  Sparkles,
  Rocket
} from "lucide-react";
import { Tournament, User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CreateTournamentModal from "@/components/modals/create-tournament";

export default function AdminPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [liveStats, setLiveStats] = useState({
    onlineUsers: 1247,
    activeTournaments: 23,
    todayRevenue: 156750,
    pendingWithdrawals: 45230,
  });

  // Check if user is admin
  if (!user || user.isAdmin !== "true") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Access denied. You don't have admin privileges.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { data: adminStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats?adminId=" + user.id],
  });

  const { data: tournamentsData } = useQuery({
    queryKey: ["/api/tournaments"],
  });

  const createTournamentMutation = useMutation({
    mutationFn: async (tournamentData: any) => {
      const response = await apiRequest("POST", "/api/tournaments", {
        ...tournamentData,
        createdBy: user.id
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "🎯 Tournament Created!",
        description: "New tournament is live and ready for players",
      });
      setShowCreateModal(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create tournament",
        variant: "destructive",
      });
    },
  });

  const deleteTournamentMutation = useMutation({
    mutationFn: async (tournamentId: string) => {
      const response = await apiRequest("DELETE", `/api/tournaments/${tournamentId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "🗑️ Tournament Deleted",
        description: "Tournament removed successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete tournament",
        variant: "destructive",
      });
    },
  });

  // Live stats animation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        onlineUsers: Math.max(0, prev.onlineUsers + Math.floor(Math.random() * 20) - 10),
        activeTournaments: Math.max(0, prev.activeTournaments + Math.floor(Math.random() * 3) - 1),
        todayRevenue: Math.max(0, prev.todayRevenue + Math.floor(Math.random() * 5000) - 2500),
        pendingWithdrawals: Math.max(0, prev.pendingWithdrawals + Math.floor(Math.random() * 2000) - 1000),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const stats = adminStats?.stats || {
    totalRevenue: 0,
    activeTournaments: 0,
    totalUsers: 0,
    totalTransactions: 0
  };

  const tournaments: Tournament[] = tournamentsData?.tournaments || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-6" data-testid="admin-panel">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text flex items-center gap-3">
              <Crown className="w-10 h-10 text-primary animate-glow" />
              GameArena Admin
              <Sparkles className="w-6 h-6 text-accent animate-pulse" />
            </h1>
            <p className="text-muted-foreground text-lg">
              Complete tournament platform management & analytics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-primary/20 text-primary border-primary animate-pulse-glow" data-testid="admin-status">
              <Wifi className="w-4 h-4 mr-1" />
              Live System
            </Badge>
            <Button 
              className="neon-border"
              onClick={() => setShowCreateModal(true)}
            >
              <Rocket className="w-4 h-4 mr-2" />
              Launch Tournament
            </Button>
          </div>
        </div>

        {/* Live Stats Banner */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="bg-gaming-card hover-glow">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Users2 className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">ONLINE NOW</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {liveStats.onlineUsers.toLocaleString()}
                  </div>
                  <div className="text-xs text-green-400">+12% from hour ago</div>
                </div>
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-primary animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gaming-card hover-glow">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-secondary" />
                    <span className="text-xs text-muted-foreground">LIVE BATTLES</span>
                  </div>
                  <div className="text-2xl font-bold text-secondary">
                    {liveStats.activeTournaments}
                  </div>
                  <div className="text-xs text-green-400">+3 started today</div>
                </div>
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                  <Sword className="w-6 h-6 text-secondary animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gaming-card hover-glow">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    <span className="text-xs text-muted-foreground">TODAY REVENUE</span>
                  </div>
                  <div className="text-2xl font-bold text-accent">
                    ₹{Math.floor(liveStats.todayRevenue / 1000)}K
                  </div>
                  <div className="text-xs text-green-400">+18% vs yesterday</div>
                </div>
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <Coins className="w-6 h-6 text-accent animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gaming-card hover-glow">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="text-xs text-muted-foreground">PENDING</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-500">
                    ₹{Math.floor(liveStats.pendingWithdrawals / 1000)}K
                  </div>
                  <div className="text-xs text-orange-400">Withdrawal requests</div>
                </div>
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <Download className="w-6 h-6 text-orange-500 animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-6 bg-gaming-card mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2" data-testid="tab-dashboard">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="tournaments" className="flex items-center gap-2" data-testid="tab-tournaments">
              <Trophy className="w-4 h-4" />
              Tournaments
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2" data-testid="tab-users">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2" data-testid="tab-analytics">
              <LineChart className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="financials" className="flex items-center gap-2" data-testid="tab-financials">
              <CreditCard className="w-4 h-4" />
              Financials
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2" data-testid="tab-settings">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Actions Dashboard */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gaming-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full neon-border"
                    onClick={() => setShowCreateModal(true)}
                    data-testid="quick-create-tournament"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Tournament
                  </Button>
                  <Button variant="secondary" className="w-full">
                    <Bell className="w-4 h-4 mr-2" />
                    Send Announcement
                  </Button>
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Data
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gaming-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-secondary" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Server Health</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-500">Excellent</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-500">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Payment Gateway</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-500">Active</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gaming-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-accent" />
                    Platform Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Revenue</span>
                    <span className="font-bold text-primary">₹{stats.totalRevenue.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Active Users</span>
                    <span className="font-bold text-secondary">{stats.totalUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Tournaments</span>
                    <span className="font-bold text-accent">{tournaments.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-gaming-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Real-time Activity Feed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <UserCheck className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">New player registration</p>
                      <p className="text-xs text-muted-foreground">ProGamer2024 joined GameArena</p>
                    </div>
                    <span className="text-xs text-muted-foreground">Live</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <Trophy className="w-5 h-5 text-secondary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Tournament completed</p>
                      <p className="text-xs text-muted-foreground">PUBG Solo Championship finished</p>
                    </div>
                    <span className="text-xs text-muted-foreground">2m ago</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <DollarSign className="w-5 h-5 text-accent" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Withdrawal request</p>
                      <p className="text-xs text-muted-foreground">User requested ₹5,000 withdrawal</p>
                    </div>
                    <span className="text-xs text-muted-foreground">5m ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tournaments Tab */}
          <TabsContent value="tournaments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Trophy className="w-6 h-6 text-primary" />
                Tournament Command Center
              </h2>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button 
                  className="neon-border animate-pulse-glow"
                  onClick={() => setShowCreateModal(true)}
                  data-testid="create-tournament-admin"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Launch New Battle
                </Button>
              </div>
            </div>

            {/* Tournament Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card className="bg-gaming-card">
                <CardContent className="pt-4 text-center">
                  <Crosshair className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="text-xl font-bold text-primary">{tournaments.filter(t => t.game === 'PUBG').length}</div>
                  <div className="text-xs text-muted-foreground">PUBG Tournaments</div>
                </CardContent>
              </Card>
              <Card className="bg-gaming-card">
                <CardContent className="pt-4 text-center">
                  <Flame className="w-6 h-6 mx-auto mb-2 text-secondary" />
                  <div className="text-xl font-bold text-secondary">{tournaments.filter(t => t.game === 'FREE_FIRE').length}</div>
                  <div className="text-xs text-muted-foreground">Free Fire Tournaments</div>
                </CardContent>
              </Card>
              <Card className="bg-gaming-card">
                <CardContent className="pt-4 text-center">
                  <Activity className="w-6 h-6 mx-auto mb-2 text-accent" />
                  <div className="text-xl font-bold text-accent">{tournaments.filter(t => t.status === 'LIVE').length}</div>
                  <div className="text-xs text-muted-foreground">Live Now</div>
                </CardContent>
              </Card>
              <Card className="bg-gaming-card">
                <CardContent className="pt-4 text-center">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                  <div className="text-xl font-bold text-orange-500">{tournaments.filter(t => t.status === 'WAITING').length}</div>
                  <div className="text-xs text-muted-foreground">Starting Soon</div>
                </CardContent>
              </Card>
            </div>

            {tournaments.length > 0 ? (
              <Card className="bg-gaming-card">
                <CardHeader>
                  <CardTitle>All Tournaments</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tournament</TableHead>
                        <TableHead>Game</TableHead>
                        <TableHead>Players</TableHead>
                        <TableHead>Prize Pool</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tournaments.map((tournament) => (
                        <TableRow key={tournament.id} data-testid={`tournament-row-${tournament.id}`}>
                          <TableCell className="font-medium">{tournament.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {tournament.game === 'PUBG' ? 
                                <Crosshair className="w-4 h-4 text-primary" /> : 
                                <Flame className="w-4 h-4 text-secondary" />
                              }
                              {tournament.game}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              {tournament.currentPlayers}/{tournament.maxPlayers}
                            </div>
                          </TableCell>
                          <TableCell className="text-accent font-bold">₹{tournament.prizePool}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                tournament.status === "LIVE" ? "destructive" : 
                                tournament.status === "WAITING" ? "default" : 
                                "secondary"
                              }
                              className="animate-pulse"
                            >
                              {tournament.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" data-testid={`view-tournament-${tournament.id}`}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" data-testid={`edit-tournament-${tournament.id}`}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => deleteTournamentMutation.mutate(tournament.id)}
                                disabled={deleteTournamentMutation.isPending}
                                data-testid={`delete-tournament-${tournament.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gaming-card">
                <CardContent className="py-16 text-center">
                  <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Tournaments Yet</h3>
                  <p className="text-muted-foreground mb-6">Create your first tournament to get started!</p>
                  <Button 
                    className="neon-border"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    Launch First Tournament
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Other tabs with placeholder content for now */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-gaming-card">
              <CardContent className="py-16 text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">User Management</h3>
                <p className="text-muted-foreground">Advanced user management features coming soon!</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-gaming-card">
              <CardContent className="py-16 text-center">
                <LineChart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
                <p className="text-muted-foreground">Detailed analytics and reporting dashboard coming soon!</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financials" className="space-y-6">
            <Card className="bg-gaming-card">
              <CardContent className="py-16 text-center">
                <CreditCard className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Financial Management</h3>
                <p className="text-muted-foreground">Revenue tracking and financial controls coming soon!</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-gaming-card">
              <CardContent className="py-16 text-center">
                <Settings className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Platform Settings</h3>
                <p className="text-muted-foreground">System configuration and settings coming soon!</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <CreateTournamentModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={createTournamentMutation.mutate}
          isLoading={createTournamentMutation.isPending}
        />
      </div>
    </div>
  );
}