"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, ArrowUpRight, Clock, Download, Filter, RefreshCw, Search, Shield, Users } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Transaction {
  id: string
  type: "deposit" | "withdrawal" | "transfer"
  amount: string
  token: string
  status: "completed" | "pending" | "failed" | "flagged"
  from: string
  to: string
  date: string
  time: string
  user: string
  userEmail: string
  walletId: string
  walletName: string
  walletType: "custodial" | "mpc" | "smart-contract"
  requiresApproval: boolean
  riskScore?: number
}

// Sample data for admin transaction history
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
    requiresApproval: false
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
    riskScore: 65
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
    requiresApproval: false
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
    requiresApproval: false
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
    riskScore: 85
  },
]

export default function AdminTransactionHistoryPage() {
  const [selectedWallet, setSelectedWallet] = useState<string>("all")
  const [dateRange, setDateRange] = useState<string>("all")
  const [transactionType, setTransactionType] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("") 
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])

  // Filter transactions based on search query and filters
  const filteredTransactions = transactions.filter(transaction => {
    // Search filter
    const matchesSearch = 
      searchQuery === "" || 
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.walletName.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Wallet filter
    const matchesWallet = selectedWallet === "all" || 
      (selectedWallet === "custodial" && transaction.walletType === "custodial") ||
      (selectedWallet === "mpc" && transaction.walletType === "mpc") ||
      (selectedWallet === "smart-contract" && transaction.walletType === "smart-contract")
    
    // Transaction type filter
    const matchesType = transactionType === "all" || transaction.type === transactionType
    
    // Status filter
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter
    
    return matchesSearch && matchesWallet && matchesType && matchesStatus
  })

  const handleSelectAllTransactions = (checked: boolean) => {
    if (checked) {
      setSelectedTransactions(filteredTransactions.map(tx => tx.id))
    } else {
      setSelectedTransactions([])
    }
  }

  const handleSelectTransaction = (txId: string, checked: boolean) => {
    if (checked) {
      setSelectedTransactions([...selectedTransactions, txId])
    } else {
      setSelectedTransactions(selectedTransactions.filter(id => id !== txId))
    }
  }

  const handleBulkApprove = () => {
    // In a real app, this would approve all selected transactions
    console.log("Approving transactions:", selectedTransactions)
    setSelectedTransactions([])
  }

  const handleBulkReject = () => {
    // In a real app, this would reject all selected transactions
    console.log("Rejecting transactions:", selectedTransactions)
    setSelectedTransactions([])
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transaction Management</h1>
            <p className="text-muted-foreground">Monitor and manage all user transactions across the platform</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions.length}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {transactions.filter(tx => tx.status === "pending" || tx.status === "flagged").length}
              </div>
              <p className="text-xs text-muted-foreground">Requires admin attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${transactions.reduce((sum, tx) => sum + parseFloat(tx.amount.replace(/,/g, '')), 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">All transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(transactions.map(tx => tx.user)).size}
              </div>
              <p className="text-xs text-muted-foreground">With transactions</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>View and manage all transactions across the platform</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {selectedTransactions.length > 0 && (
                  <>
                    <Button variant="outline" size="sm" onClick={handleBulkApprove}>
                      Approve Selected
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleBulkReject}>
                      Reject Selected
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
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
                  <SelectTrigger className="h-10 w-44">
                    <SelectValue placeholder="Select wallet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Wallets</SelectItem>
                    <SelectItem value="custodial">Custodial Wallets</SelectItem>
                    <SelectItem value="mpc">MPC Wallets</SelectItem>
                    <SelectItem value="smart-contract">Smart Contract Wallets</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={transactionType} onValueChange={setTransactionType}>
                  <SelectTrigger className="h-10 w-44">
                    <SelectValue placeholder="Transaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="deposit">Deposits</SelectItem>
                    <SelectItem value="withdrawal">Withdrawals</SelectItem>
                    <SelectItem value="transfer">Transfers</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-10 w-44">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="h-10 w-44">
                    <SelectValue placeholder="Date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">Last 30 Days</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="h-10">
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedTransactions.length === filteredTransactions.length && filteredTransactions.length > 0}
                        onCheckedChange={handleSelectAllTransactions}
                        aria-label="Select all transactions"
                      />
                    </TableHead>
                    <TableHead className="py-3 text-sm font-medium">Transaction ID</TableHead>
                    <TableHead className="py-3 text-sm font-medium">User</TableHead>
                    <TableHead className="py-3 text-sm font-medium">Wallet</TableHead>
                    <TableHead className="py-3 text-sm font-medium">Type</TableHead>
                    <TableHead className="py-3 text-sm font-medium">Amount</TableHead>
                    <TableHead className="py-3 text-sm font-medium">Status</TableHead>
                    <TableHead className="py-3 text-sm font-medium">Risk Score</TableHead>
                    <TableHead className="py-3 text-sm font-medium">Date & Time</TableHead>
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
                          <div className="font-medium">{transaction.user}</div>
                          <div className="text-xs text-muted-foreground">{transaction.userEmail}</div>
                        </TableCell>
                        <TableCell className="py-3 text-sm">
                          <div>{transaction.walletName}</div>
                          <div className="text-xs text-muted-foreground capitalize">{transaction.walletType}</div>
                        </TableCell>
                        <TableCell className="py-3">
                          {transaction.type === "deposit" && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <ArrowDown className="mr-1 h-3 w-3" />
                              Deposit
                            </Badge>
                          )}
                          {transaction.type === "withdrawal" && (
                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                              <ArrowUp className="mr-1 h-3 w-3" />
                              Withdrawal
                            </Badge>
                          )}
                          {transaction.type === "transfer" && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              <ArrowUpRight className="mr-1 h-3 w-3" />
                              Transfer
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="py-3 text-sm">
                          ${transaction.amount} {transaction.token}
                        </TableCell>
                        <TableCell className="py-3 text-sm">
                          {transaction.status === "completed" && (
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-green-500" />
                              Completed
                            </div>
                          )}
                          {transaction.status === "pending" && (
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-yellow-500" />
                              Pending
                            </div>
                          )}
                          {transaction.status === "failed" && (
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-red-500" />
                              Failed
                            </div>
                          )}
                          {transaction.status === "flagged" && (
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-purple-500" />
                              Flagged
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="py-3 text-sm">
                          {transaction.riskScore ? (
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-16 rounded-full bg-gray-200">
                                <div 
                                  className={`h-2 rounded-full ${transaction.riskScore >= 75 ? 'bg-red-500' : transaction.riskScore >= 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                  style={{ width: `${transaction.riskScore}%` }}
                                />
                              </div>
                              <span>{transaction.riskScore}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="py-3 text-sm">
                          {transaction.date}
                          <span className="ml-2 text-xs text-muted-foreground">{transaction.time}</span>
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <div className="flex justify-end gap-2">
                            {(transaction.status === "pending" || transaction.status === "flagged") && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      Review
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Review transaction details</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            <Link href={`/admin/transactions/${transaction.id}`}>
                              <Button variant="ghost" size="sm">
                                Details
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} className="h-24 text-center">
                        No transactions found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="text-sm text-muted-foreground">
                Showing <strong>{filteredTransactions.length}</strong> of <strong>{transactions.length}</strong> transactions
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}