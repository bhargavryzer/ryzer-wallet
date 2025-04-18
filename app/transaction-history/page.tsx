"use client"

import { useState, useMemo } from "react"
import { ArrowDown, ArrowUp, ArrowUpRight, Clock, Filter, Search, Check, X, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Interfaces
interface Transaction {
  id: string
  type: "deposit" | "withdrawal" | "transfer"
  amount: string
  token: string
  status: "completed" | "pending" | "failed" | "pending_approval" | "rejected"
  from: string
  to: string
  date: string
  time: string
  user: string
  blockchainHash?: string
  notes?: string
}

// Sample data
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
    user: "user1@example.com",
    blockchainHash: "0xabc...123",
    notes: "User deposit for trading",
  },
  {
    id: "TX123456790",
    type: "withdrawal",
    amount: "2,500.00",
    token: "USDC",
    status: "pending_approval",
    from: "0x5d6...7e8f",
    to: "0x9g0...1h2i",
    date: "2025-04-13",
    time: "03:22 PM",
    user: "user2@example.com",
    blockchainHash: "",
    notes: "Pending admin approval",
  },
  {
    id: "TX123456791",
    type: "transfer",
    amount: "10,000.00",
    token: "USDC",
    status: "rejected",
    from: "0x5d6...7e8f",
    to: "0x3j4...5k6l",
    date: "2025-04-12",
    time: "11:15 AM",
    user: "user3@example.com",
    blockchainHash: "",
    notes: "Rejected due to policy violation",
  },
]

export default function TransactionHistoryPage() {
  const [selectedWallet, setSelectedWallet] = useState<string>("all")
  const [dateRange, setDateRange] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sort, setSort] = useState<{ key: keyof Transaction; direction: "asc" | "desc" }>({
    key: "date",
    direction: "desc",
  })
  const [page, setPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const { toast } = useToast()

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let result = transactions.filter(
      (tx) =>
        (searchQuery === "" ||
          tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.user.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedWallet === "all" || tx.to.includes(selectedWallet) || tx.from.includes(selectedWallet)) &&
        (statusFilter === "all" || tx.status === statusFilter) &&
        (dateRange === "all" ||
          (dateRange === "today" && tx.date === "2025-04-14") ||
          (dateRange === "week" && new Date(tx.date) >= new Date("2025-04-07")) ||
          (dateRange === "month" && new Date(tx.date) >= new Date("2025-03-14")))
    )

    result.sort((a, b) => {
      const key = sort.key
      const direction = sort.direction === "asc" ? 1 : -1
      if (key === "amount") return (parseFloat(a[key]) - parseFloat(b[key])) * direction
      if (key === "date") return (new Date(a[key]).getTime() - new Date(b[key]).getTime()) * direction
      return String(a[key]).localeCompare(String(b[key])) * direction
    })

    return result
  }, [searchQuery, selectedWallet, statusFilter, dateRange, sort])

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = filteredTransactions.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  // Handlers
  const handleSort = (key: keyof Transaction) => {
    setSort((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTransactions(paginatedTransactions.map((tx) => tx.id))
    } else {
      setSelectedTransactions([])
    }
  }

  const handleSelectTransaction = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedTransactions([...selectedTransactions, id])
    } else {
      setSelectedTransactions(selectedTransactions.filter((txId) => txId !== id))
    }
  }

  const handleBulkApprove = () => {
    toast({
      title: "Transactions Approved",
      description: `${selectedTransactions.length} transaction(s) approved.`,
    })
    console.log("Approving transactions:", selectedTransactions)
    setSelectedTransactions([])
  }

  const handleBulkReject = () => {
    toast({
      title: "Transactions Rejected",
      description: `${selectedTransactions.length} transaction(s) rejected.`,
    })
    console.log("Rejecting transactions:", selectedTransactions)
    setSelectedTransactions([])
  }

  const handleViewDetails = (tx: Transaction) => {
    setSelectedTransaction(tx)
    setShowDetailsDialog(true)
  }

  const handleApproveTransaction = () => {
    if (selectedTransaction) {
      toast({
        title: "Transaction Approved",
        description: `Transaction ${selectedTransaction.id} has been approved.`,
      })
      console.log("Approving transaction:", selectedTransaction.id)
    }
    setShowDetailsDialog(false)
    setSelectedTransaction(null)
  }

  const handleRejectTransaction = () => {
    if (selectedTransaction) {
      toast({
        title: "Transaction Rejected",
        description: `Transaction ${selectedTransaction.id} has been rejected.`,
      })
      console.log("Rejecting transaction:", selectedTransaction.id)
    }
    setShowDetailsDialog(false)
    setSelectedTransaction(null)
  }

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start justify-between gap-4"
        >
        </motion.div>

        {/* Summary Dashboard */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
          <Card className="bg-white border-gray-200 shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Transaction Overview</CardTitle>
              <div className="space-y-1">
      
            <p className="text-sm text-gray-600">
              Monitor and manage transactions across all platform wallets.
            </p>
          </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-4">
                <Image
                  src="/placeholder.svg?height=48&width=48&query=transactions"
                  alt="Transactions"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <div className="text-3xl font-bold text-gray-900">{transactions.length}</div>
                  <div className="text-sm text-gray-600">Total Transactions</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Image
                  src="/placeholder.svg?height=48&width=48&query=pending"
                  alt="Pending"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {transactions.filter((tx) => tx.status === "pending_approval").length}
                  </div>
                  <div className="text-sm text-gray-600">Pending Approval</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Image
                  src="/placeholder.svg?height=48&width=48&query=completed"
                  alt="Completed"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {transactions.filter((tx) => tx.status === "completed").length}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Image
                  src="/placeholder.svg?height=48&width=48&query=failed"
                  alt="Failed"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {transactions.filter((tx) => tx.status === "failed" || tx.status === "rejected").length}
                  </div>
                  <div className="text-sm text-gray-600">Failed/Rejected</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <Card className="bg-white border-gray-200 shadow-lg rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-medium">All Transactions</CardTitle>
            <CardDescription className="text-sm">Review and manage transactions across all wallets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bulk Actions */}
            {selectedTransactions.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between bg-gray-100 p-4 rounded-md"
              >
                <div className="text-sm text-gray-700">
                  <span className="font-medium">{selectedTransactions.length} transactions selected</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleBulkApprove}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Approve Selected
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleBulkReject}
                    variant="destructive"
                  >
                    Reject Selected
                  </Button>
                </div>
              </motion.div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by ID or user..."
                  className="h-10 pl-10 focus:ring-2 focus:ring-purple-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search transactions"
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
                    <SelectItem value="smart">Smart Contract Wallets</SelectItem>
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
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="h-10">
                      <Filter className="mr-2 h-4 w-4" />
                      Advanced Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Advanced Filters</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-6 py-4">
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="pending_approval">Pending Approval</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            <motion.div variants={cardVariants} initial="hidden" animate="visible">
              {paginatedTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-600">
                  <Image
                    src="/placeholder.svg?height=80&width=80&query=no-transactions"
                    alt="No Transactions"
                    width={80}
                    height={80}
                    className="mb-6"
                  />
                  <h3 className="text-lg font-medium mb-4">No transactions found.</h3>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="py-3 w-12">
                          <Checkbox
                            checked={selectedTransactions.length === paginatedTransactions.length && paginatedTransactions.length > 0}
                            onCheckedChange={handleSelectAll}
                            aria-label="Select all transactions"
                          />
                        </TableHead>
                        <TableHead className="py-3 text-sm font-medium cursor-pointer" onClick={() => handleSort("id")}>
                          Transaction ID {sort.key === "id" && (sort.direction === "asc" ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}
                        </TableHead>
                        <TableHead className="py-3 text-sm font-medium cursor-pointer" onClick={() => handleSort("type")}>
                          Type {sort.key === "type" && (sort.direction === "asc" ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}
                        </TableHead>
                        <TableHead className="py-3 text-sm font-medium cursor-pointer" onClick={() => handleSort("amount")}>
                          Amount {sort.key === "amount" && (sort.direction === "asc" ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}
                        </TableHead>
                        <TableHead className="py-3 text-sm font-medium cursor-pointer" onClick={() => handleSort("status")}>
                          Status {sort.key === "status" && (sort.direction === "asc" ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}
                        </TableHead>
                        <TableHead className="py-3 text-sm font-medium">From</TableHead>
                        <TableHead className="py-3 text-sm font-medium">To</TableHead>
                        <TableHead className="py-3 text-sm font-medium cursor-pointer" onClick={() => handleSort("user")}>
                          User {sort.key === "user" && (sort.direction === "asc" ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}
                        </TableHead>
                        <TableHead className="py-3 text-sm font-medium cursor-pointer" onClick={() => handleSort("date")}>
                          Date & Time {sort.key === "date" && (sort.direction === "asc" ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}
                        </TableHead>
                        <TableHead className="py-3 text-sm font-medium text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedTransactions.map((transaction) => (
                        <TableRow key={transaction.id} className="hover:bg-gray-50">
                          <TableCell className="py-3">
                            <Checkbox
                              checked={selectedTransactions.includes(transaction.id)}
                              onCheckedChange={(checked) => handleSelectTransaction(transaction.id, !!checked)}
                              aria-label={`Select transaction ${transaction.id}`}
                            />
                          </TableCell>
                          <TableCell className="py-3 text-sm font-medium">{transaction.id}</TableCell>
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
                            {transaction.status === "pending_approval" && (
                              <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-yellow-500" />
                                Pending Approval
                              </div>
                            )}
                            {transaction.status === "failed" && (
                              <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-red-500" />
                                Failed
                              </div>
                            )}
                            {transaction.status === "rejected" && (
                              <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-red-500" />
                                Rejected
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="py-3 text-sm">{transaction.from}</TableCell>
                          <TableCell className="py-3 text-sm">{transaction.to}</TableCell>
                          <TableCell className="py-3 text-sm">{transaction.user}</TableCell>
                          <TableCell className="py-3 text-sm">
                            {transaction.date}
                            <span className="ml-2 text-xs text-gray-500">{transaction.time}</span>
                          </TableCell>
                          <TableCell className="py-3 text-right flex gap-2 justify-end">
                            {transaction.status === "pending_approval" ? (
                              <>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleViewDetails(transaction)}
                                  aria-label={`Approve transaction ${transaction.id}`}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleViewDetails(transaction)}
                                  aria-label={`Reject transaction ${transaction.id}`}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewDetails(transaction)}
                                aria-label={`View details for ${transaction.id}`}
                              >
                                <Clock className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </motion.div>

            {paginatedTransactions.length > 0 && (
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="text-sm text-gray-600">
                  Showing {paginatedTransactions.length} of {filteredTransactions.length} transactions
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => setItemsPerPage(Number(value))}
                  >
                    <SelectTrigger className="h-10 w-24">
                      <SelectValue placeholder="Items per page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 per page</SelectItem>
                      <SelectItem value="10">10 per page</SelectItem>
                      <SelectItem value="20">20 per page</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transaction Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="bg-white rounded-xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Transaction Details
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                View details and manage the selected transaction.
              </DialogDescription>
            </DialogHeader>
            {selectedTransaction && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <span className="font-medium text-gray-700">Transaction ID:</span> {selectedTransaction.id}
                </div>
                <div className="grid gap-2">
                  <span className="font-medium text-gray-700">Type:</span> {selectedTransaction.type.charAt(0).toUpperCase() + selectedTransaction.type.slice(1)}
                </div>
                <div className="grid gap-2">
                  <span className="font-medium text-gray-700">Amount:</span> ${selectedTransaction.amount} {selectedTransaction.token}
                </div>
                <div className="grid gap-2">
                  <span className="font-medium text-gray-700">Status:</span> {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                </div>
                <div className="grid gap-2">
                  <span className="font-medium text-gray-700">From:</span> {selectedTransaction.from}
                </div>
                <div className="grid gap-2">
                  <span className="font-medium text-gray-700">To:</span> {selectedTransaction.to}
                </div>
                <div className="grid gap-2">
                  <span className="font-medium text-gray-700">User:</span> {selectedTransaction.user}
                </div>
                <div className="grid gap-2">
                  <span className="font-medium text-gray-700">Date & Time:</span> {selectedTransaction.date} {selectedTransaction.time}
                </div>
                <div className="grid gap-2">
                  <span className="font-medium text-gray-700">Blockchain Hash:</span> {selectedTransaction.blockchainHash || "N/A"}
                </div>
                <div className="grid gap-2">
                  <span className="font-medium text-gray-700">Notes:</span> {selectedTransaction.notes || "None"}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                className="border-gray-300 hover:bg-gray-100"
                onClick={() => setShowDetailsDialog(false)}
              >
                Close
              </Button>
              {selectedTransaction?.status === "pending_approval" && (
                <>
                  <Button variant="destructive" onClick={handleRejectTransaction}>
                    Reject
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700" onClick={handleApproveTransaction}>
                    Approve
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}