"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ArrowRight,
  CreditCard,
  Download,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Users,
  Wallet,
  AlertTriangle,
  BarChart3,
  Eye,
  EyeOff,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { WalletBalanceChart } from "@/components/wallet-balance-chart";
import { WalletTransactionList } from "@/components/wallet-transaction-list";
import { QuickActions } from "@/components/quick-actions";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { CreateWalletDialog } from "@/components/dialogs/create-wallet-dialog";
import { useAuth } from "@/contexts/auth-context";
import {
  getDashboardStats,
  getRecentUsers,
  getPendingApprovals,
  getWallets,
  handleApproval,
  getAssetTrend,
} from "@/services/api";

// Types
interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalWallets: number;
  totalAssets: string;
  frozenWallets: number;
  pendingApprovals: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  wallets: number;
  status: "active" | "inactive";
  lastActive: string;
}

interface PendingAction {
  id: string;
  type: "wallet_approval" | "large_withdrawal" | "security_alert";
  user: string;
  description: string;
  requestedAt: string;
}

interface Wallet {
  id: string;
  name: string;
  type: "custodial" | "mpc";
  balance: string;
  tokens: number;
  address: string;
}

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [hideBalance, setHideBalance] = useState(false);
  const [showCreateWallet, setShowCreateWallet] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userRole = user?.role || "user";

  // Queries
  const { data: stats, isLoading: isLoadingStats } = useQuery<DashboardStats>({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
    enabled: userRole === "admin",
  });

  const { data: users, isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ["recentUsers", searchQuery],
    queryFn: () => getRecentUsers(searchQuery),
    enabled: userRole === "admin",
  });

  const { data: pendingActions, isLoading: isLoadingApprovals } = useQuery<PendingAction[]>({
    queryKey: ["pendingApprovals"],
    queryFn: getPendingApprovals,
    enabled: userRole === "admin",
  });

  const { data: wallets, isLoading: isLoadingWallets } = useQuery<Wallet[]>({
    queryKey: ["wallets", searchQuery],
    queryFn: () => getWallets(searchQuery),
  });

  // Mutations
  const handleApprovalMutation = useMutation({
    mutationFn: ({ approvalId, action, reason }: { 
      approvalId: string; 
      action: "approve" | "deny"; 
      reason?: string;
    }) => handleApproval(approvalId, action, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingApprovals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      toast({
        title: "Success",
        description: "Action processed successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to process action",
      });
    },
  });

  const handleApprovalAction = useCallback(async (
    approvalId: string,
    action: "approve" | "deny",
    reason?: string
  ) => {
    try {
      await handleApprovalMutation.mutateAsync({ approvalId, action, reason });
    } catch (error) {
      console.error("Failed to process approval:", error);
    }
  }, [handleApprovalMutation]);

  // Filter users based on search query
  const filteredUsers = users?.filter(
    (user) =>
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Handlers
  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries();
  }, [queryClient]);

  const handleExportReport = useCallback(async () => {
    try {
      // Implement export functionality
      toast({
        title: "Export Started",
        description: "Your report will be downloaded shortly",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Failed to generate report",
      });
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {userRole === "admin" ? "Admin Dashboard" : "Dashboard"}
            </h1>
            <p className="text-muted-foreground">
              {userRole === "admin"
                ? "Monitor and manage all user wallets and platform activities"
                : "Manage your wallets, assets, and transactions"}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            {userRole === "admin" ? (
              <Button onClick={handleExportReport}>
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            ) : (
              <Button onClick={() => setShowCreateWallet(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Wallet
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {userRole === "admin" && <TabsTrigger value="users">Users</TabsTrigger>}
            <TabsTrigger value="wallets">Wallets</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {userRole === "admin" ? (
                <>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats?.totalUsers}</div>
                      <p className="text-xs text-muted-foreground">{stats?.activeUsers} active users</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Wallets</CardTitle>
                      <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats?.totalWallets}</div>
                      <p className="text-xs text-muted-foreground">Across {stats?.totalUsers} users</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats?.totalAssets}</div>
                      <p className="text-xs text-muted-foreground">All managed assets</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats?.pendingApprovals}</div>
                      <p className="text-xs text-muted-foreground">Requires admin attention</p>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <>
                  <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setHideBalance(!hideBalance)}
                        aria-label={hideBalance ? "Show balance" : "Hide balance"}
                      >
                        {hideBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-semibold" aria-live="polite">
                        {hideBalance ? (
                          <>
                            <VisuallyHidden>Balance hidden</VisuallyHidden>
                            <span aria-hidden="true">••••••</span>
                          </>
                        ) : (
                          "$48,493,931"
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                  </Card>
                  <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
                      <CreditCard className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-semibold">
                        {hideBalance ? (
                          <>
                            <VisuallyHidden>Balance hidden</VisuallyHidden>
                            <span aria-hidden="true">••••••</span>
                          </>
                        ) : (
                          "$37,842,498"
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">+12.5% from last month</p>
                    </CardContent>
                  </Card>
                  <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Active Wallets</CardTitle>
                      <Shield className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-semibold">24</div>
                      <p className="mt-1 text-xs text-muted-foreground">+3 since last month</p>
                    </CardContent>
                  </Card>
                  <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-semibold">12</div>
                      <p className="mt-1 text-xs text-muted-foreground">-2 since yesterday</p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Main Content Area */}
            {userRole === "admin" ? (
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <CardTitle>Recent Users</CardTitle>
                        <CardDescription>Recently active users on the platform</CardDescription>
                      </div>
                      <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search users..."
                          className="pl-8 w-full sm:w-[200px]"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Wallets</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Last Active</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </TableCell>
                              <TableCell>{user.wallets}</TableCell>
                              <TableCell>
                                <Badge variant={user.status === "active" ? "default" : "secondary"}>
                                  {user.status === "active" ? "Active" : "Inactive"}
                                </Badge>
                              </TableCell>
                              <TableCell>{user.lastActive}</TableCell>
                              <TableCell className="text-right">
                                <Link href={`/admin/users/${user.id}`}>
                                  <Button variant="ghost" size="sm">
                                    <ArrowRight className="h-4 w-4" />
                                    <span className="sr-only">View Details</span>
                                  </Button>
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                              No users found matching your search.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/admin/users">View All Users</Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pending Approvals</CardTitle>
                    <CardDescription>Actions requiring administrator approval</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Requested</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingActions?.map((action) => (
                          <TableRow key={action.id}>
                            <TableCell>
                              <Badge variant="outline">
                                {action.type === "wallet_approval"
                                  ? "Wallet"
                                  : action.type === "large_withdrawal"
                                  ? "Withdrawal"
                                  : "Security"}
                              </Badge>
                            </TableCell>
                            <TableCell>{action.user}</TableCell>
                            <TableCell>{action.description}</TableCell>
                            <TableCell>{action.requestedAt}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleApprovalAction(action.id, "approve")}>
                                  Approve
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleApprovalAction(action.id, "deny")}>
                                  Deny
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Approvals
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-7">
                <Card className="border-none shadow-sm lg:col-span-4">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Assets Trend</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">Your asset value over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <WalletBalanceChart />
                  </CardContent>
                </Card>
                <div className="lg:col-span-3">
                  <QuickActions />
                </div>
              </div>
            )}

            {/* Quick Actions for Admin / Transactions for User */}
            {userRole === "admin" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Link href="/admin/wallets">
                      <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Wallet Management</CardTitle>
                          <Wallet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-muted-foreground">
                            Manage user wallets and assign new wallets to users
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                    <Link href="/admin/users">
                      <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">User Management</CardTitle>
                          <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-muted-foreground">Add, edit, or deactivate user accounts</p>
                        </CardContent>
                      </Card>
                    </Link>
                    <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Transaction Approvals</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">Review and approve pending transactions</p>
                      </CardContent>
                    </Card>
                    <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Reports</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">Generate and export platform reports</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-medium">Recent Transactions</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        View and manage your recent transactions
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative w-full sm:w-80">
                        <Search
                          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                          aria-hidden="true"
                        />
                        <Input
                          type="search"
                          placeholder="Search transactions..."
                          className="h-10 pl-10"
                          aria-label="Search transactions"
                        />
                      </div>
                      <Button variant="outline" size="icon" className="h-10 w-10" aria-label="Filter transactions">
                        <Filter className="h-4 w-4" />
                        <VisuallyHidden>Filter</VisuallyHidden>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-4">
                      <TabsTrigger value="all" className="text-sm">
                        All
                      </TabsTrigger>
                      <TabsTrigger value="deposits" className="text-sm">
                        Deposits
                      </TabsTrigger>
                      <TabsTrigger value="withdrawals" className="text-sm">
                        Withdrawals
                      </TabsTrigger>
                      <TabsTrigger value="transfers" className="text-sm">
                        Transfers
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="all" className="mt-6">
                      <WalletTransactionList />
                    </TabsContent>
                    <TabsContent value="deposits" className="mt-6">
                      <WalletTransactionList type="deposit" />
                    </TabsContent>
                    <TabsContent value="withdrawals" className="mt-6">
                      <WalletTransactionList type="withdrawal" />
                    </TabsContent>
                    <TabsContent value="transfers" className="mt-6">
                      <WalletTransactionList type="transfer" />
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex flex-col items-center justify-between gap-4 border-t px-6 py-4 sm:flex-row">
                  <div className="text-sm text-muted-foreground">
                    Showing <strong>10</strong> of <strong>24</strong> transactions
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )}
          </TabsContent>

          {/* Users Tab - Admin Only */}
          {userRole === "admin" && (
            <TabsContent value="users" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>Manage all platform users</CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search users..."
                          className="pl-8 w-full sm:w-[200px]"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add User
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Wallets</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </TableCell>
                            <TableCell>{user.wallets}</TableCell>
                            <TableCell>
                              <Badge variant={user.status === "active" ? "default" : "secondary"}>
                                {user.status === "active" ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>{user.lastActive}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm">
                                  Edit
                                </Button>
                                <Button variant="ghost" size="sm">
                                  Deactivate
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            No users found matching your search.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Wallets Tab - Both Roles */}
          <TabsContent value="wallets" className="space-y-6 mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Custodial Wallets</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$12,450.00</div>
                  <p className="text-xs text-muted-foreground">1 wallet</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">MPC Wallets</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,230.50</div>
                  <p className="text-xs text-muted-foreground">1 wallet</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Wallet List</CardTitle>
                    <CardDescription>All wallets managed on the platform</CardDescription>
                  </div>
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search wallets..."
                      className="pl-8 w-full sm:w-[200px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Tokens</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wallets?.map((wallet) => (
                      <TableRow key={wallet.id}>
                        <TableCell>{wallet.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{wallet.type}</Badge>
                        </TableCell>
                        <TableCell>{wallet.balance}</TableCell>
                        <TableCell>{wallet.tokens}</TableCell>
                        <TableCell className="font-mono text-sm">{wallet.address}</TableCell>
                        <TableCell className="text-right">
                          <Link href={`/wallets/${wallet.id}`}>
                            <Button variant="ghost" size="sm">
                              <ArrowRight className="h-4 w-4" />
                              <span className="sr-only">View Details</span>
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/wallets">View All Wallets</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Wallet Dialog */}
      <CreateWalletDialog 
        open={showCreateWallet} 
        onOpenChange={setShowCreateWallet} 
      />
    </DashboardLayout>
  );
}