import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, Lock, Trophy, Gamepad2, Star, Crown } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register } = useAuth();
  const { toast } = useToast();
  
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });
  
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    phoneNumber: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showAdminAccess, setShowAdminAccess] = useState(false);
  const [adminCode, setAdminCode] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await login(loginForm.email, loginForm.password);
    
    if (success) {
      toast({
        title: "Welcome Back!",
        description: "Successfully logged into GameArena",
      });
      onClose();
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await register(registerForm);
    
    if (success) {
      toast({
        title: "Account Created!",
        description: "Welcome to GameArena! Start your journey to victory.",
      });
      onClose();
    } else {
      toast({
        title: "Registration Failed",
        description: "Please check your details and try again.",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  const quickLoginAdmin = async () => {
    setIsLoading(true);
    const success = await login("admin@gamearena.com", "admin123");
    if (success) {
      toast({
        title: "Admin Access Granted!",
        description: "Welcome back, Administrator",
      });
      onClose();
    }
    setIsLoading(false);
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gaming-card border-primary/20">
        <DialogHeader className="text-center">
          <DialogTitle className="flex items-center justify-center gap-2 text-2xl gradient-text">
            <Trophy className="w-6 h-6 text-primary animate-glow" />
            GameArena
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login" data-testid="tab-login">Login</TabsTrigger>
            <TabsTrigger value="register" data-testid="tab-register">Register</TabsTrigger>
          </TabsList>

          {/* Admin Access Section */}
          <div className="mb-6 text-center">
            {!showAdminAccess ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdminAccess(true)}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Admin Access
              </Button>
            ) : (
              <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
                <div className="text-sm font-medium text-primary flex items-center justify-center gap-2">
                  <Crown className="w-4 h-4" />
                  Admin Panel Access
                </div>
                <div className="space-y-2">
                  <input
                    type="password"
                    placeholder="Enter admin code..."
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-center"
                    data-testid="admin-code-input"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowAdminAccess(false);
                        setAdminCode("");
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        if (adminCode === "GAMEARENA2025") {
                          quickLoginAdmin();
                          setShowAdminAccess(false);
                          setAdminCode("");
                        } else {
                          toast({
                            title: "Access Denied",
                            description: "Invalid admin code!",
                            variant: "destructive",
                          });
                        }
                      }}
                      disabled={isLoading || !adminCode}
                      className="flex-1"
                      data-testid="admin-login-button"
                    >
                      Access
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="pl-10"
                    required
                    data-testid="input-login-email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="pl-10"
                    required
                    data-testid="input-login-password"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full neon-border"
                disabled={isLoading}
                data-testid="button-login"
              >
                {isLoading ? "Logging in..." : "Login to GameArena"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="register-username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="register-username"
                      type="text"
                      placeholder="Gaming handle"
                      value={registerForm.username}
                      onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                      className="pl-10"
                      required
                      data-testid="input-register-username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-fullname">Full Name</Label>
                  <Input
                    id="register-fullname"
                    type="text"
                    placeholder="Your real name"
                    value={registerForm.fullName}
                    onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                    required
                    data-testid="input-register-fullname"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="your@email.com"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    className="pl-10"
                    required
                    data-testid="input-register-email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="register-phone"
                    type="tel"
                    placeholder="+91-9876543210"
                    value={registerForm.phoneNumber}
                    onChange={(e) => setRegisterForm({ ...registerForm, phoneNumber: e.target.value })}
                    className="pl-10"
                    data-testid="input-register-phone"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Strong password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    className="pl-10"
                    required
                    minLength={6}
                    data-testid="input-register-password"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full neon-border"
                disabled={isLoading}
                data-testid="button-register"
              >
                {isLoading ? "Creating Account..." : "Join GameArena"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="text-center text-xs text-muted-foreground mt-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Gamepad2 className="w-4 h-4" />
            <span>Ready to become a champion?</span>
          </div>
          <p>Join thousands of players competing for real money prizes!</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}