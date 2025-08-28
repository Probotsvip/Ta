import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  Crown
} from "lucide-react";
import { Tournament, User, Transaction } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CreateTournamentModal from "@/components/modals/create-tournament";

export default function Admin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");

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
    queryKey: ["/api/admin/stats", { adminId: user.id }],
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
        title: "Success!",
        description: "Tournament created successfully",
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
        title: "Success!",
        description: "Tournament deleted successfully",
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

  const stats = adminStats || {
    totalRevenue: 0,
    activeTournaments: 0,
    totalUsers: 0,
    totalTransactions: 0
  };

  const tournaments: Tournament[] = tournamentsData || [];

  return (
    <div className="container mx-auto px-4 py-6" data-testid="admin-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Crown className="w-8 h-8 text-primary animate-glow" />
            Admin Panel
          </h1>
          <p className="text-muted-foreground">Manage tournaments, users, and platform analytics</p>
        </div>
        <Badge className="bg-primary text-primary-foreground" data-testid="admin-badge">
          Administrator
        </Badge>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5 bg-muted mb-8">
          <TabsTrigger value="overview" className="flex items-center gap-2" data-testid="tab-overview">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="tournaments" className="flex items-center gap-2" data-testid="tab-tournaments">
            <Trophy className="w-4 h-4" />
            Tournaments
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2" data-testid="tab-users">
            <Users className="w-4 h-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2" data-testid="tab-transactions">
            <CreditCard className="w-4 h-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2" data-testid="tab-settings">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gaming-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-primary" data-testid="total-revenue">
                      ₹{stats.totalRevenue.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-green-500">+12.5% from last month</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gaming-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Tournaments</p>
                    <p className="text-2xl font-bold text-secondary" data-testid="active-tournaments">
                      {stats.activeTournaments}
                    </p>
                    <p className="text-xs text-green-500">+8 from yesterday</p>
                  </div>
                  <Trophy className="w-8 h-8 text-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gaming-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold text-accent" data-testid="total-users">
                      {stats.totalUsers.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-green-500">+234 this week</p>
                  </div>
                  <Users className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gaming-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                    <p className="text-2xl font-bold text-primary" data-testid="total-transactions">
                      {stats.totalTransactions}
                    </p>
                    <p className="text-xs text-green-500">+45 today</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Button 
                  className="h-20 flex-col gap-2 neon-border"
                  onClick={() => setShowCreateModal(true)}
                  data-testid="quick-create-tournament"
                >
                  <Plus className="w-6 h-6" />
                  Create Tournament
                </Button>
                
                <Button variant="secondary" className="h-20 flex-col gap-2" data-testid="quick-manage-users">
                  <Users className="w-6 h-6" />
                  Manage Users
                </Button>
                
                <Button variant="outline" className="h-20 flex-col gap-2" data-testid="quick-view-analytics">
                  <BarChart3 className="w-6 h-6" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tournaments Tab */}
        <TabsContent value="tournaments" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Tournament Management</h2>
            <Button 
              className="neon-border"
              onClick={() => setShowCreateModal(true)}
              data-testid="create-tournament-admin"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Tournament
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Tournaments</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
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
                      <TableCell>{tournament.game}</TableCell>
                      <TableCell>
                        {tournament.currentPlayers}/{tournament.maxPlayers}
                      </TableCell>
                      <TableCell className="text-primary">₹{tournament.prizePool}</TableCell>
                      <TableCell>
                        <Badge variant={tournament.status === "LIVE" ? "destructive" : "secondary"}>
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
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">User Management</h2>
            <div className="flex gap-2">
              <Input placeholder="Search users..." className="w-64" data-testid="search-users" />
              <Button variant="outline" data-testid="filter-users">Filter</Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-4 text-center">
                <div className="text-2xl font-bold text-primary">1,234</div>
                <div className="text-xs text-muted-foreground">Active Users</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <div className="text-2xl font-bold text-secondary">456</div>
                <div className="text-xs text-muted-foreground">Premium Users</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <div className="text-2xl font-bold text-accent">89</div>
                <div className="text-xs text-muted-foreground">Banned Users</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <div className="text-2xl font-bold text-primary">12</div>
                <div className="text-xs text-muted-foreground">Pending Reports</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent User Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg" data-testid="user-activity-item">
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">New user registration</p>
                      <p className="text-sm text-muted-foreground">ProGamer2024 joined the platform</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">2 min ago</div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg" data-testid="user-activity-item">
                  <div className="flex items-center gap-3">
                    <UserX className="w-5 h-5 text-destructive" />
                    <div>
                      <p className="font-medium">User reported</p>
                      <p className="text-sm text-muted-foreground">CheatMaster reported for suspicious activity</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">15 min ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Transaction Management</h2>
            <Button variant="outline" data-testid="export-transactions">Export Data</Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-4 text-center">
                <div className="text-2xl font-bold text-primary">₹1,23,456</div>
                <div className="text-xs text-muted-foreground">Today's Revenue</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <div className="text-2xl font-bold text-secondary">₹45,678</div>
                <div className="text-xs text-muted-foreground">Pending Withdrawals</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <div className="text-2xl font-bold text-accent">234</div>
                <div className="text-xs text-muted-foreground">Failed Transactions</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <div className="text-2xl font-bold text-primary">98.5%</div>
                <div className="text-xs text-muted-foreground">Success Rate</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground" data-testid="no-transactions">
                <CreditCard className="w-12 h-12 mx-auto mb-3" />
                <p>No recent transactions to display</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <h2 className="text-2xl font-bold">Platform Settings</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tournament Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Default Entry Fee</label>
                  <Input placeholder="₹50" data-testid="default-entry-fee" />
                </div>
                <div>
                  <label className="text-sm font-medium">Max Players per Tournament</label>
                  <Input placeholder="100" data-testid="max-players" />
                </div>
                <Button data-testid="save-tournament-settings">Save Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Platform Fee (%)</label>
                  <Input placeholder="10" data-testid="platform-fee" />
                </div>
                <div>
                  <label className="text-sm font-medium">Min Withdrawal Amount</label>
                  <Input placeholder="₹100" data-testid="min-withdrawal" />
                </div>
                <Button data-testid="save-payment-settings">Save Settings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <CreateTournamentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={createTournamentMutation.mutate}
        isLoading={createTournamentMutation.isPending}
      />
    </div>
  );
}
