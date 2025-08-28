import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Wallet as WalletIcon, 
  Plus, 
  Minus, 
  CreditCard, 
  History, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Transaction } from "@shared/schema";

const depositSchema = z.object({
  amount: z.number().min(10, "Minimum deposit is ₹10").max(100000, "Maximum deposit is ₹1,00,000"),
  paymentMethod: z.string().min(1, "Please select a payment method"),
});

const withdrawalSchema = z.object({
  amount: z.number().min(100, "Minimum withdrawal is ₹100").max(50000, "Maximum withdrawal is ₹50,000"),
  bankAccount: z.string().min(1, "Bank account is required"),
  ifscCode: z.string().min(11, "Valid IFSC code is required"),
});

type DepositForm = z.infer<typeof depositSchema>;
type WithdrawalForm = z.infer<typeof withdrawalSchema>;

export default function Wallet() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);

  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ["/api/users", user?.id, "transactions"],
    enabled: !!user?.id,
  });

  const depositForm = useForm<DepositForm>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      amount: 0,
      paymentMethod: "",
    },
  });

  const withdrawalForm = useForm<WithdrawalForm>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: 0,
      bankAccount: "",
      ifscCode: "",
    },
  });

  const depositMutation = useMutation({
    mutationFn: async (data: DepositForm) => {
      const response = await apiRequest("POST", `/api/users/${user?.id}/deposit`, {
        amount: data.amount,
        paymentGateway: data.paymentMethod,
        transactionRef: `DEP_${Date.now()}`,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "transactions"] });
      toast({
        title: "Success!",
        description: "Deposit successful. Funds added to your wallet.",
      });
      setShowDepositModal(false);
      depositForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to process deposit",
        variant: "destructive",
      });
    },
  });

  const transactions: Transaction[] = transactionsData || [];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "DEPOSIT":
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
      case "WITHDRAWAL":
        return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case "ENTRY_FEE":
        return <Minus className="w-4 h-4 text-red-500" />;
      case "PRIZE_WIN":
        return <Plus className="w-4 h-4 text-green-500" />;
      default:
        return <DollarSign className="w-4 h-4 text-primary" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "FAILED":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "PENDING":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Completed</Badge>;
      case "FAILED":
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Failed</Badge>;
      case "PENDING":
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const totalDeposits = transactions
    .filter(t => t.type === "DEPOSIT" && t.status === "COMPLETED")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalWithdrawals = transactions
    .filter(t => t.type === "WITHDRAWAL" && t.status === "COMPLETED")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalWinnings = transactions
    .filter(t => t.type === "PRIZE_WIN" && t.status === "COMPLETED")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <WalletIcon className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Please login to access your wallet.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6" data-testid="wallet-page">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <WalletIcon className="w-8 h-8 text-primary animate-glow" />
          <h1 className="text-3xl font-bold gradient-text">My Wallet</h1>
        </div>
        <p className="text-muted-foreground">Manage your funds and track your transactions</p>
      </div>

      {/* Balance Card */}
      <Card className="mb-8 bg-gaming-card neon-border">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-primary mb-2" data-testid="wallet-balance">
              ₹{parseFloat(user.walletBalance).toLocaleString("en-IN")}
            </div>
            <p className="text-muted-foreground">Available Balance</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              className="neon-border animate-pulse-glow"
              onClick={() => setShowDepositModal(true)}
              data-testid="add-money-button"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Money
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowWithdrawalModal(true)}
              data-testid="withdraw-button"
            >
              <Minus className="w-4 h-4 mr-2" />
              Withdraw
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-green-500" data-testid="total-deposits">
              ₹{totalDeposits.toLocaleString("en-IN")}
            </div>
            <div className="text-xs text-muted-foreground">Total Deposits</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-red-500" data-testid="total-withdrawals">
              ₹{totalWithdrawals.toLocaleString("en-IN")}
            </div>
            <div className="text-xs text-muted-foreground">Total Withdrawals</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-primary" data-testid="total-winnings">
              ₹{totalWinnings.toLocaleString("en-IN")}
            </div>
            <div className="text-xs text-muted-foreground">Total Winnings</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-accent" data-testid="total-transactions">
              {transactions.length}
            </div>
            <div className="text-xs text-muted-foreground">Total Transactions</div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="animate-pulse space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 bg-muted rounded-lg"></div>
                ))}
              </div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12" data-testid="no-transactions">
              <History className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No transactions yet</p>
              <p className="text-sm text-muted-foreground">Start by adding money to your wallet</p>
            </div>
          ) : (
            <div className="space-y-0">
              {transactions.map((transaction) => (
                <div 
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors"
                  data-testid={`transaction-${transaction.id}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-full">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    
                    <div>
                      <div className="font-medium" data-testid="transaction-description">
                        {transaction.description || transaction.type.replace("_", " ")}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(transaction.createdAt!).toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <div 
                        className={`font-bold ${
                          transaction.type === "DEPOSIT" || transaction.type === "PRIZE_WIN" 
                            ? "text-green-500" 
                            : "text-red-500"
                        }`}
                        data-testid="transaction-amount"
                      >
                        {transaction.type === "DEPOSIT" || transaction.type === "PRIZE_WIN" ? "+" : "-"}
                        ₹{parseFloat(transaction.amount).toLocaleString("en-IN")}
                      </div>
                      {getStatusBadge(transaction.status)}
                    </div>
                    {getStatusIcon(transaction.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deposit Modal */}
      <Dialog open={showDepositModal} onOpenChange={setShowDepositModal}>
        <DialogContent className="sm:max-w-md" data-testid="deposit-modal">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-green-500" />
              Add Money to Wallet
            </DialogTitle>
          </DialogHeader>

          <Form {...depositForm}>
            <form onSubmit={depositForm.handleSubmit((data) => depositMutation.mutate(data))} className="space-y-4">
              <FormField
                control={depositForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter amount"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        data-testid="deposit-amount"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={depositForm.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="payment-method-select">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="RAZORPAY">Razorpay</SelectItem>
                        <SelectItem value="PAYTM">Paytm</SelectItem>
                        <SelectItem value="UPI">UPI</SelectItem>
                        <SelectItem value="NETBANKING">Net Banking</SelectItem>
                        <SelectItem value="CARD">Debit/Credit Card</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => setShowDepositModal(false)}
                  data-testid="cancel-deposit"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={depositMutation.isPending}
                  data-testid="confirm-deposit"
                >
                  {depositMutation.isPending ? "Processing..." : "Add Money"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Withdrawal Modal */}
      <Dialog open={showWithdrawalModal} onOpenChange={setShowWithdrawalModal}>
        <DialogContent className="sm:max-w-md" data-testid="withdrawal-modal">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Minus className="w-5 h-5 text-red-500" />
              Withdraw Money
            </DialogTitle>
          </DialogHeader>

          <Form {...withdrawalForm}>
            <form onSubmit={withdrawalForm.handleSubmit((data) => console.log("Withdraw:", data))} className="space-y-4">
              <FormField
                control={withdrawalForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter amount"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        data-testid="withdrawal-amount"
                      />
                    </FormControl>
                    <div className="text-xs text-muted-foreground">
                      Available: ₹{user.walletBalance}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={withdrawalForm.control}
                name="bankAccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Account Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter bank account number"
                        {...field}
                        data-testid="bank-account"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={withdrawalForm.control}
                name="ifscCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IFSC Code</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter IFSC code"
                        {...field}
                        data-testid="ifsc-code"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => setShowWithdrawalModal(false)}
                  data-testid="cancel-withdrawal"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  className="flex-1"
                  data-testid="confirm-withdrawal"
                >
                  Withdraw Money
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
