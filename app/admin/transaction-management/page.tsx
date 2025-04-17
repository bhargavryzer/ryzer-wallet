"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Clock,
  Download,
  Filter,
  Info,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Transaction interface
interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "transfer";
  amount: string;
  token: string;
  status: "completed" | "pending" | "failed" | "flagged";
  from: string;
  to: string;
  date: string;
  time: string;
  user: string;
  userEmail: string;
  walletId: string;
  walletName: string;
  walletType: "custodial" | "mpc" | "smart-contract";
  requiresApproval: boolean;
  riskScore?: number;
  appliedPolicies?: string[];
}

// Policy interface
interface Policy {
  id: string;
  priority: number;
  type: string;
  name: string;
  wallets: string;
  conditions: string;
  action: string;
  creator: string;
  createdAt: string;
  status: "active" | "inactive";
  description: string;
}

// Address list interface
interface AddressList {
  id: string;
  name: string;
  addressCount: number;
  creator: string;
  createdAt: string;
  description: string;
}

// Sample data (unchanged from original)
const policies: Policy[] = [
  {
    id: "policy-1",
    priority: 1,
    type: "Approval",
    name: "Large Withdrawal Policy",
    wallets: "All Wallets",
    conditions: "Amount > $10,000",
    action: "Admin Approval",
    creator: "System",
    createdAt: "2025-03-10",
    status: "active",
    description: "Requires admin approval for withdrawals exceeding $10,000",
  },
  {
    id: "policy-2",
    priority: 2,
    type: "Restriction",
    name: "Blacklisted Address Policy",
    wallets: "All Wallets",
    conditions: "Recipient in Blacklist",
    action: "Auto Rejection",
    creator: "John Admin",
    createdAt: "2025-03-15",
    status: "active",
    description: "Automatically rejects transactions to blacklisted addresses",
  },
  {
    id: "policy-3",
    priority: 3,
    type: "Approval",
    name: "New Address Policy",
    wallets: "Custodial Wallets",
    conditions: "New Recipient",
    action: "User Confirmation",
    creator: "System",
    createdAt: "2025-03-20",
    status: "active",
    description: "Requires additional user confirmation for transactions to new addresses",
  },
  {
    id: "policy-4",
    priority: 4,
    type: "Monitoring",
    name: "Unusual Activity Policy",
    wallets: "All Wallets",
    conditions: "Unusual Pattern",
    action: "Flag for Review",
    creator: "Sarah Admin",
    createdAt: "2025-04-01",
    status: "active",
    description: "Flags transactions with unusual patterns for admin review",
  },
  {
    id: "policy-5",
    priority: 5,
    type: "Default",
    name: "Default Policy",
    wallets: "All Wallets",
    conditions: "Any Transaction",
    action: "Auto Approval",
    creator: "System",
    createdAt: "2025-03-01",
    status: "active",
    description: "Default policy for all transactions that don't match other policies",
  },
];

const addressLists: AddressList[] = [
  {
    id: "list-1",
    name: "Whitelist",
    addressCount: 15,
    creator: "John Admin",
    createdAt: "2025-03-10",
    description: "Approved addresses for automatic transaction approval",
  },
  {
    id: "list-2",
    name: "Blacklist",
    addressCount: 8,
    creator: "System",
    createdAt: "2025-03-01",
    description: "Blocked addresses that cannot receive transactions",
  },
  {
    id: "list-3",
    name: "Exchange Addresses",
    addressCount: 12,
    creator: "Sarah Admin",
    createdAt: "2025-03-15",
    description: "Known exchange addresses for monitoring purposes",
  },
  {
    id: "list-4",
    name: "Partner Addresses",
    addressCount: 5,
    creator: "John Admin",
    createdAt: "2025-04-01",
    description: "Addresses of partner organizations",
  },
];

const transactions: Transaction[] = [
  {
    id: "TX123456789",
    type: "deposit",
    amount: "5,000.00",
    token: "USDC",
    status: "completed",
    from: "0x1a2...3b4c",
    to: "0x5d6...7e8f",
    date: "2025-04-14",
    time: "09:45 AM",
    user: "John Smith",
    userEmail: "john.smith@example.com",
    walletId: "wallet-1",
    walletName: "Main Wallet",
    walletType: "custodial",
    requiresApproval: false,
    appliedPolicies: ["policy-5"],
  },
  {
    id: "TX123456790",
    type: "withdrawal",
    amount: "25,500.00",
    token: "USDC",
    status: "pending",
    from: "0x5d6...7e8f",
    to: "0x9g0...1h2i",
    date: "2025-04-13",
    time: "03:22 PM",
    user: "Sarah Johnson",
    userEmail: "sarah.j@example.com",
    walletId: "wallet-3",
    walletName: "Personal Wallet",
    walletType: "custodial",
    requiresApproval: true,
    riskScore: 65,
    appliedPolicies: ["policy-1"],
  },
  {
    id: "TX123456791",
    type: "transfer",
    amount: "10,000.00",
    token: "USDC",
    status: "completed",
    from: "0x5d6...7e8f",
    to: "0x3j4...5k6l",
    date: "2025-04-12",
    time: "11:15 AM",
    user: "Michael Brown",
    userEmail: "m.brown@example.com",
    walletId: "wallet-4",
    walletName: "Business Wallet",
    walletType: "mpc",
    requiresApproval: false,
    appliedPolicies: ["policy-5"],
  },
  {
    id: "TX123456792",
    type: "deposit",
    amount: "7,500.00",
    token: "USDC",
    status: "completed",
    from: "0x7m8...9n0o",
    to: "0x5d6...7e8f",
    date: "2025-04-11",
    time: "02:30 PM",
    user: "Robert Wilson",
    userEmail: "r.wilson@example.com",
    walletId: "wallet-7",
    walletName: "Investment Wallet",
    walletType: "mpc",
    requiresApproval: false,
    appliedPolicies: ["policy-5"],
  },
  {
    id: "TX123456793",
    type: "withdrawal",
    amount: "35,000.00",
    token: "USDC",
    status: "flagged",
    from: "0x5d6...7e8f",
    to: "0x1p2...3q4r",
    date: "2025-04-10",
    time: "10:05 AM",
    user: "Emily Davis",
    userEmail: "emily.d@example.com",
    walletId: "wallet-6",
    walletName: "Main Wallet",
    walletType: "custodial",
    requiresApproval: true,
    riskScore: 85,
    appliedPolicies: ["policy-1", "policy-4"],
  },
  {
    id: "TX123456794",
    type: "withdrawal",
    amount: "8,500.00",
    token: "USDC",
    status: "failed",
    from: "0x5d6...7e8f",
    to: "0x2r3...4s5t",
    date: "2025-04-09",
    time: "04:15 PM",
    user: "Robert Wilson",
    userEmail: "r.wilson@example.com",
    walletId: "wallet-7",
    walletName: "Investment Wallet",
    walletType: "mpc",
    requiresApproval: false,
    appliedPolicies: ["policy-2"],
  },
];

export default function TransactionManagementPage() {
  const [showCreatePolicy, setShowCreatePolicy] = useState(false);
  const [showCreateList, setShowCreateList] = useState(false);
  const [showEmergencyControls, setShowEmergencyControls] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const [selectedLists, setSelectedLists] = useState<string[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("transactions");
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");
  const [transactionType, setTransactionType] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [policyFilter, setPolicyFilter] = useState<string>("all");

  // Filter policies
  const filteredPolicies = policies.filter(
    (policy) =>
      searchQuery === "" ||
      policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter address lists
  const filteredLists = addressLists.filter(
    (list) =>
      searchQuery === "" ||
      list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      list.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      searchQuery === "" ||
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.walletName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWallet =
      selectedWallet === "all" ||
      (selectedWallet === "custodial" && transaction.walletType === "custodial") ||
      (selectedWallet === "mpc" && transaction.walletType === "mpc") ||
      (selectedWallet === "smart-contract" && transaction.walletType === "smart-contract");
    const matchesType = transactionType === "all" || transaction.type === transactionType;
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    const matchesPolicy =
      policyFilter === "all" ||
      (transaction.appliedPolicies && transaction.appliedPolicies.includes(policyFilter));
    return matchesSearch && matchesWallet && matchesType && matchesStatus && matchesPolicy;
  });

  // Policy selection handlers
  const handleSelectAllPolicies = (checked: boolean) => {
    if (checked) {
      setSelectedPolicies(filteredPolicies.map((policy) => policy.id));
    } else {
      setSelectedPolicies([]);
    }
  };

  const handleSelectPolicy = (policyId: string, checked: boolean) => {
    if (checked) {
      setSelectedPolicies([...selectedPolicies, policyId]);
    } else {
      setSelectedPolicies(selectedPolicies.filter((id) => id !== policyId));
    }
  };

  // Address list selection handlers
  const handleSelectAllLists = (checked: boolean) => {
    if (checked) {
      setSelectedLists(filteredLists.map((list) => list.id));
    } else {
      setSelectedLists([]);
    }
  };

  const handleSelectList = (listId: string, checked: boolean) => {
    if (checked) {
      setSelectedLists([...selectedLists, listId]);
    } else {
      setSelectedLists(selectedLists.filter((id) => id !== listId));
    }
  };

  // Transaction selection handlers
  const handleSelectAllTransactions = (checked: boolean) => {
    if (checked) {
      setSelectedTransactions(filteredTransactions.map((tx) => tx.id));
    } else {
      setSelectedTransactions([]);
    }
  };

  const handleSelectTransaction = (txId: string, checked: boolean) => {
    if (checked) {
      setSelectedTransactions([...selectedTransactions, txId]);
    } else {
      setSelectedTransactions(selectedTransactions.filter((id) => id !== txId));
    }
  };

  // Action handlers
  const handleCreatePolicy = () => {
    setShowCreatePolicy(false);
  };

  const handleCreateList = () => {
    setShowCreateList(false);
  };

  const handleEmergencyModeToggle = (checked: boolean) => {
    setEmergencyMode(checked);
  };

  const handleBulkApprove = () => {
    console.log("Approving transactions:", selectedTransactions);
    setSelectedTransactions([]);
  };

  const handleBulkReject = () => {
    console.log("Rejecting transactions:", selectedTransactions);
    setSelectedTransactions([]);
  };

  const getPolicyNameById = (policyId: string): string => {
    const policy = policies.find((p) => p.id === policyId);
    return policy ? policy.name : "Unknown Policy";
  };

  const getPolicyActionById = (policyId: string): string => {
    const policy = policies.find((p) => p.id === policyId);
    return policy ? policy.action : "Unknown Action";
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transaction Management</h1>
            <p className="text-muted-foreground">Monitor and manage transactions with policy enforcement</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => setShowEmergencyControls(true)}>
              <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
              Emergency Controls
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{policies.filter((p) => p.status === "active").length}</div>
              <p className="text-xs text-muted-foreground">Controlling transaction flow</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {transactions.filter((tx) => tx.status === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground">Transactions awaiting review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Flagged Transactions</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {transactions.filter((tx) => tx.status === "flagged").length}
              </div>
              <p className="text-xs text-muted-foreground">Potential risk detected</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Policy Triggers</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="policies">Policies</TabsTrigger>
                <TabsTrigger value="lists">Address Lists</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Transactions Tab */}
            <TabsContent value="transactions" className="mt-0 space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    className="h-10 pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Select value={selectedWallet} onValueChange={setSelectedWallet}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Wallet Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Wallets</SelectItem>
                      <SelectItem value="custodial">Custodial</SelectItem>
                      <SelectItem value="mpc">MPC</SelectItem>
                      <SelectItem value="smart-contract">Smart Contract</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={transactionType} onValueChange={setTransactionType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Transaction Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="deposit">Deposits</SelectItem>
                      <SelectItem value="withdrawal">Withdrawals</SelectItem>
                      <SelectItem value="transfer">Transfers</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="flagged">Flagged</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={policyFilter} onValueChange={setPolicyFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Applied Policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Policies</SelectItem>
                      {policies.map((policy) => (
                        <SelectItem key={policy.id} value={policy.id}>
                          {policy.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedTransactions.length > 0 && (
                <div className="flex items-center justify-between bg-muted p-4 rounded-md">
                  <div className="text-sm">
                    <span className="font-medium">{selectedTransactions.length}</span> transaction(s) selected
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleBulkApprove}>
                      Approve Selected
                    </Button>
                    <Button size="sm" variant="destructive" onClick={handleBulkReject}>
                      Reject Selected
                    </Button>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            selectedTransactions.length === filteredTransactions.length &&
                            filteredTransactions.length > 0
                          }
                          onCheckedChange={handleSelectAllTransactions}
                          aria-label="Select all transactions"
                        />
                      </TableHead>
                      <TableHead className="py-3 text-sm font-medium">Transaction ID</TableHead>
                      <TableHead className="py-3 text-sm font-medium">Type</TableHead>
                      <TableHead className="py-3 text-sm font-medium">Amount</TableHead>
                      <TableHead className="py-3 text-sm font-medium">Status</TableHead>
                      <TableHead className="py-3 text-sm font-medium">User</TableHead>
                      <TableHead className="py-3 text-sm font-medium">Wallet</TableHead>
                      <TableHead className="py-3 text-sm font-medium">Date & Time</TableHead>
                      <TableHead className="py-3 text-sm font-medium">Applied Policies</TableHead>
                      <TableHead className="py-3 text-sm font-medium">Risk</TableHead>
                      <TableHead className="py-3 text-sm font-medium text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedTransactions.includes(transaction.id)}
                              onCheckedChange={(checked) => handleSelectTransaction(transaction.id, !!checked)}
                              aria-label={`Select transaction ${transaction.id}`}
                            />
                          </TableCell>
                          <TableCell className="py-3 text-sm font-medium">
                            <Link href={`/admin/transactions/${transaction.id}`} className="hover:underline">
                              {transaction.id}
                            </Link>
                          </TableCell>
                          <TableCell className="py-3 text-sm">
                            <Badge
                              variant="outline"
                              className={
                                transaction.type === "deposit"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : transaction.type === "withdrawal"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-purple-50 text-purple-700 border-purple-200"
                              }
                            >
                              {transaction.type === "deposit" ? (
                                <ArrowDown className="mr-1 h-3 w-3" />
                              ) : transaction.type === "withdrawal" ? (
                                <ArrowUp className="mr-1 h-3 w-3" />
                              ) : (
                                <ArrowUpRight className="mr-1 h-3 w-3" />
                              )}
                              {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-3 text-sm">
                            ${transaction.amount} {transaction.token}
                          </TableCell>
                          <TableCell className="py-3 text-sm">
                            <Badge
                              variant="outline"
                              className={
                                transaction.status === "completed"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : transaction.status === "pending"
                                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                  : transaction.status === "failed"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : "bg-purple-50 text-purple-700 border-purple-200"
                              }
                            >
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-3 text-sm">
                            <div>{transaction.user}</div>
                            <div className="text-xs text-muted-foreground">{transaction.userEmail}</div>
                          </TableCell>
                          <TableCell className="py-3 text-sm">
                            <div>{transaction.walletName}</div>
                            <div className="text-xs text-muted-foreground">
                              {transaction.walletType.charAt(0).toUpperCase() + transaction.walletType.slice(1)}
                            </div>
                          </TableCell>
                          <TableCell className="py-3 text-sm">
                            {transaction.date} {transaction.time}
                          </TableCell>
                          <TableCell className="py-3 text-sm">
                            {transaction.appliedPolicies ? (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="cursor-pointer">
                                      {transaction.appliedPolicies.length} {transaction.appliedPolicies.length === 1 ? "Policy" : "Policies"}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <ul className="list-disc pl-4">
                                      {transaction.appliedPolicies.map((policyId) => (
                                        <li key={policyId}>{getPolicyNameById(policyId)}</li>
                                      ))}
                                    </ul>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ) : (
                              "None"
                            )}
                          </TableCell>
                          <TableCell className="py-3 text-sm">
                            {transaction.riskScore ? (
                              <Badge
                                variant="outline"
                                className={
                                  transaction.riskScore >= 80
                                    ? "bg-red-50 text-red-700 border-red-200"
                                    : transaction.riskScore >= 50
                                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                    : "bg-green-50 text-green-700 border-green-200"
                                }
                              >
                                {transaction.riskScore}
                              </Badge>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell className="py-3 text-sm text-right">
                            <div className="flex justify-end gap-2">
                              {transaction.requiresApproval && (
                                <>
                                  <Button size="sm" variant="outline">
                                    Approve
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    Reject
                                  </Button>
                                </>
                              )}
                              <Button variant="ghost" size="sm">
                                <ArrowRight className="h-4 w-4" />
                                <span className="sr-only">View Details</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={11} className="h-24 text-center">
                          No transactions found matching your criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Policies Tab */}
            <TabsContent value="policies" className="mt-0 space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search policies..."
                    className="h-10 pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button onClick={() => setShowCreatePolicy(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Policy
                </Button>
              </div>

              {selectedPolicies.length > 0 && (
                <div className="flex items-center justify-between bg-muted p-4 rounded-md">
                  <div className="text-sm">
                    <span className="font-medium">{selectedPolicies.length}</span> policy(ies) selected
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm">Activate</Button>
                    <Button size="sm" variant="outline">
                      Deactivate
                    </Button>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedPolicies.length === filteredPolicies.length && filteredPolicies.length > 0}
                          onCheckedChange={handleSelectAllPolicies}
                          aria-label="Select all policies"
                        />
                      </TableHead>
                      <TableHead className="py-3 text-sm font-medium">Name</TableHead>
                      <TableHead className="py-3 text-sm font-medium">Type</TableHead>
                      <TableHead className="py-3 text-sm font-medium">Priority</TableHead>
                      <TableHead className="py-3 text-sm font-medium">Wallets</TableHead>
                      <TableHead className="py-3 text-sm font-medium">Conditions</TableHead>
                      <TableHead className="py-3 text-sm font-medium">Action</TableHead>
                      <TableHead className="py-3 text-sm font-medium">Status</TableHead>
                      <TableHead className="py-3 text-sm font-medium text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPolicies.length > 0 ? (
                      filteredPolicies.map((policy) => (
                        <TableRow key={policy.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedPolicies.includes(policy.id)}
                              onCheckedChange={(checked) => handleSelectPolicy(policy.id, !!checked)}
                              aria-label={`Select policy ${policy.name}`}
                            />
                          </TableCell>
                          <TableCell className="py-3 text-sm font-medium">{policy.name}</TableCell>
                          <TableCell className="py-3 text-sm">{policy.type}</TableCell>
                          <TableCell className="py-3 text-sm">{policy.priority}</TableCell>
                          <TableCell className="py-3 text-sm">{policy.wallets}</TableCell>
                          <TableCell className="py-3 text-sm">{policy.conditions}</TableCell>
                          <TableCell className="py-3 text-sm">{policy.action}</TableCell>
                          <TableCell className="py-3 text-sm">
                            <Badge variant={policy.status === "active" ? "default" : "secondary"}>
                              {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-3 text-sm text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm">
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          No policies found matching your criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Address Lists Tab */}
            <TabsContent value="lists" className="mt-0 space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search address lists..."
                    className="h-10 pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button onClick={() => setShowCreateList(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Address List
                </Button>
              </div>

              {selectedLists.length > 0 && (
                <div className="flex items-center justify-between bg-muted p-4 rounded-md">
                  <div className="text-sm">
                    <span className="font-medium">{selectedLists.length}</span> list(s) selected
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Delete
                    </Button>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedLists.length === filteredLists.length && filteredLists.length > 0}
                          onCheckedChange={handleSelectAllLists}
                          aria-label="Select all address lists"
                        />
                      </TableHead>
                      <TableHead className="py-3 text-sm font-medium">Name</TableHead>
                      <TableHead className="py-3 text-sm font-medium">Address Count</TableHead>
                      <TableHead className="py-3 text-sm font-medium">Creator</TableHead>
                      <TableHead className="py-3 text-sm font-medium">Created At</TableHead>
                      <TableHead className="py-3 text-sm font-medium">Description</TableHead>
                      <TableHead className="py-3 text-sm font-medium text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLists.length > 0 ? (
                      filteredLists.map((list) => (
                        <TableRow key={list.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedLists.includes(list.id)}
                              onCheckedChange={(checked) => handleSelectList(list.id, !!checked)}
                              aria-label={`Select address list ${list.name}`}
                            />
                          </TableCell>
                          <TableCell className="py-3 text-sm font-medium">{list.name}</TableCell>
                          <TableCell className="py-3 text-sm">{list.addressCount}</TableCell>
                          <TableCell className="py-3 text-sm">{list.creator}</TableCell>
                          <TableCell className="py-3 text-sm">{list.createdAt}</TableCell>
                          <TableCell className="py-3 text-sm">{list.description}</TableCell>
                          <TableCell className="py-3 text-sm text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm">
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No address lists found matching your criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Create Policy Dialog */}
        <Dialog open={showCreatePolicy} onOpenChange={setShowCreatePolicy}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Policy</DialogTitle>
              <DialogDescription>Define a new policy to control transaction behavior.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="policy-name">Policy Name</Label>
                <Input id="policy-name" placeholder="Enter policy name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="policy-type">Type</Label>
                <Select>
                  <SelectTrigger id="policy-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approval">Approval</SelectItem>
                    <SelectItem value="restriction">Restriction</SelectItem>
                    <SelectItem value="monitoring">Monitoring</SelectItem>
                    <SelectItem value="default">Default</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="policy-priority">Priority</Label>
                <Input id="policy-priority" type="number" placeholder="Enter priority" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreatePolicy(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePolicy}>Create Policy</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Address List Dialog */}
        <Dialog open={showCreateList} onOpenChange={setShowCreateList}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Address List</DialogTitle>
              <DialogDescription>Create a new address list for transaction policies.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="list-name">List Name</Label>
                <Input id="list-name" placeholder="Enter list name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="list-description">Description</Label>
                <Input id="list-description" placeholder="Enter description" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateList(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateList}>Create List</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Emergency Controls Dialog */}
        <Dialog open={showEmergencyControls} onOpenChange={setShowEmergencyControls}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Emergency Controls</DialogTitle>
              <DialogDescription>
                Use these controls to manage platform-wide transaction restrictions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emergency-mode">Emergency Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Halts all non-critical transactions platform-wide
                  </p>
                </div>
                <Switch
                  id="emergency-mode"
                  checked={emergencyMode}
                  onCheckedChange={handleEmergencyModeToggle}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEmergencyControls(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}