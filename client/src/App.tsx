import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/auth-context";
import Header from "@/components/layout/header";
import BottomNav from "@/components/layout/bottom-nav";
import FloatingActionButton from "@/components/layout/floating-action";
import Home from "@/pages/home";
import Tournaments from "@/pages/tournaments";
import Leaderboard from "@/pages/leaderboard";
import Wallet from "@/pages/wallet";
import AdminPanel from "@/pages/admin-v2";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-20 md:pb-6">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/tournaments" component={Tournaments} />
          <Route path="/leaderboard" component={Leaderboard} />
          <Route path="/wallet" component={Wallet} />
          <Route path="/admin" component={AdminPanel} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <BottomNav />
      <FloatingActionButton />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
