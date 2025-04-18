"use client"

import { useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Archive,
  ArrowDown,
  ArrowUp,
  Copy,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  MoreHorizontal,
  Pencil,
  Send,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Check,
  X,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { WalletTransactionList } from "@/components/wallet-transaction-list"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"

// Interfaces
interface Token {
  symbol: string
  name: string
  balance: string
  value: string
}

interface Transaction {
  id: string
  type: "sent" | "received"
  token: string
  amount: string
  value: string
  address: string
  date: string
  status: "pending" | "approved" | "rejected"
}

interface Policy {
  id: string
  name: string
  type: string
  conditions: string
  action: string
  status: "active" | "inactive"
}

interface Wallet {
  id: string
  name: string
  type: "custodial" | "mpc" | "smart-contract"
  balance: string
  tokens: Token[]
  address: string
  blockchain: string
  createdAt: string
  policies: Policy[]
  transactions: Transaction[]
}

// Sample wallet data
const walletData: { [key: string]: Wallet } = {
  "wallet-1": {
    id: "wallet-1",
    name: "Main Wallet",
    type: "custodial",
    balance: "$12,450.00",
    tokens: [
      { symbol: "ETH", name: "Ethereum", balance: "4.25", value: "$8,245.00" },
      { symbol: "USDC", name: "USD Coin", balance: "4,205.00", value: "$4,205.00" },
    ],
    address: "0x1a2b3c4d5e6f7g8h9i0j",
    blockchain: "Ethereum",
    createdAt: "2023-10-15",
    policies: [
      {
        id: "policy-1",
        name: "Default Policy",
        type: "Default",
        conditions: "Message Type",
        action: "Auto Rejection",
        status: "active",
      },
    ],
    transactions: [
      {
        id: "tx-1",
        type: "sent",
        token: "ETH",
        amount: "0.5",
        value: "$1,000.00",
        address: "0x9i8h7g6f5e4d3c2b1a0",
        date: "2025-04-16",
        status: "approved",
      },
      {
        id: "tx-2",
        type: "received",
        token: "USDC",
        amount: "500.00",
        value: "$500.00",
        address: "0x5e4d3c2b1a09i8h7g6f",
        date: "2025-04-15",
        status: "pending",
      },
    ],
  },
  "wallet-2": {
    id: "wallet-2",
    name: "Investment Wallet",
    type: "mpc",
    balance: "$45,230.50",
    tokens: [
      { symbol: "BTC", name: "Bitcoin", balance: "0.75", value: "$25,125.00" },
      { symbol: "ETH", name: "Ethereum", balance: "10.25", value: "$19,855.50" },
      { symbol: "LINK", name: "Chainlink", balance: "50.00", value: "$250.00" },
    ],
    address: "0x9i8h7g6f5e4d3c2b1a0",
    blockchain: "Multi-chain",
    createdAt: "2023-11-20",
    policies: [
      {
        id: "policy-2",
        name: "Transaction Approval",
        type: "Default",
        conditions: "Any Transaction",
        action: "Auto Approval",
        status: "active",
      },
    ],
    transactions: [
      {
        id: "tx-3",
        type: "sent",
        token: "BTC",
        amount: "0.1",
        value: "$3,500.00",
        address: "0x1a2b3c4d5e6f7g8h9i0j",
        date: "2025-04-14",
        status: "rejected",
      },
    ],
  },
}

export default function WalletDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const walletId = params?.id ?? ''
  const wallet = walletData[walletId as keyof typeof walletData]
  const { toast } = useToast()

  const [hideBalance, setHideBalance] = useState(false)
  const [showSendDialog, setShowSendDialog] = useState(false)
  const [showReceiveDialog, setShowReceiveDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [selectedToken, setSelectedToken] = useState(wallet?.tokens[0]?.symbol || "")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [walletName, setWalletName] = useState(wallet?.name || "")
  const [transactionToApprove, setTransactionToApprove] = useState<Transaction | null>(null)
  const [transactionFilter, setTransactionFilter] = useState<"all" | "sent" | "received" | "pending">("all")
  const [transactionStatusFilter, setTransactionStatusFilter] = useState<string>("all")
  const [transactionSort, setTransactionSort] = useState<{ key: keyof Transaction; direction: "asc" | "desc" }>({
    key: "date",
    direction: "desc",
  })
  const [transactionPage, setTransactionPage] = useState(1)
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const itemsPerPage = 5

  // Redirect if wallet doesn't exist
  if (!wallet) {
    router.push("/wallets")
    return null
  }

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let result = wallet.transactions.filter(
      (tx) =>
        (transactionFilter === "all" ||
          tx.type === transactionFilter ||
          (transactionFilter === "pending" && tx.status === "pending")) &&
        (transactionStatusFilter === "all" || tx.status === transactionStatusFilter)
    )

    result.sort((a, b) => {
      const key = transactionSort.key
      const direction = transactionSort.direction === "asc" ? 1 : -1
      return String(a[key]).localeCompare(String(b[key])) * direction
    })

    return result
  }, [transactionFilter, transactionStatusFilter, transactionSort, wallet.transactions])

  // Pagination
  const totalTransactionPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = filteredTransactions.slice(
    (transactionPage - 1) * itemsPerPage,
    transactionPage * itemsPerPage
  )

  // Handlers
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to Clipboard",
      description: "Wallet address copied successfully.",
    })
  }

  const shortAddress = `${wallet.address.substring(0, 6)}...${wallet.address.substring(wallet.address.length - 4)}`

  const handleSend = () => {
    toast({
      title: "Transaction Initiated",
      description: `Sent ${amount} ${selectedToken} to ${shortAddress}.`,
    })
    setShowSendDialog(false)
    setRecipientAddress("")
    setAmount("")
  }

  const handleEdit = () => {
    toast({
      title: "Wallet Updated",
      description: `Wallet "${walletName}" details updated.`,
    })
    setShowEditDialog(false)
  }

  const handleSelectAllTransactions = (checked: boolean) => {
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
    setSelectedTransactions([])
  }

  const handleBulkReject = () => {
    toast({
      title: "Transactions Rejected",
      description: `${selectedTransactions.length} transaction(s) rejected.`,
    })
    setSelectedTransactions([])
  }

  const handleOpenApprovalDialog = (tx: Transaction) => {
    setTransactionToApprove(tx)
    setShowApprovalDialog(true)
  }

  const handleApproveTransaction = () => {
    if (transactionToApprove) {
      toast({
        title: "Transaction Approved",
        description: `Transaction ${transactionToApprove.id} approved.`,
      })
    }
    setShowApprovalDialog(false)
    setTransactionToApprove(null)
  }

  const handleRejectTransaction = () => {
    if (transactionToApprove) {
      toast({
        title: "Transaction Rejected",
        description: `Transaction ${transactionToApprove.id} rejected.`,
      })
    }
    setShowApprovalDialog(false)
    setTransactionToApprove(null)
  }

  const handleSort = (key: keyof Transaction) => {
    setTransactionSort((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }))
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
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                Admin: {wallet.name}
              </h1>
              <Badge className="bg-blue-100 text-blue-800">
                {wallet.type === "custodial"
                  ? "Custodial"
                  : wallet.type === "mpc"
                  ? "MPC"
                  : "Smart Contract"}
              </Badge>
              <Badge className="bg-purple-100 text-purple-800">Admin</Badge>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span>{shortAddress}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(wallet.address)}
                      aria-label="Copy address"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy address</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => window.open(`https://explorer.example.com/address/${wallet.address}`, "_blank")}
                      aria-label="View on explorer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View on explorer</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-10" onClick={() => setShowReceiveDialog(true)}>
              <Download className="mr-2 h-4 w-4" />
              Receive
            </Button>
            <Button className="h-10 bg-blue-600 hover:bg-blue-700" onClick={() => setShowSendDialog(true)}>
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Wallet Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Wallet
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => window.open(`https://explorer.example.com/address/${wallet.address}`, "_blank")}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on Explorer
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    toast({
                      title: "Wallet Archived",
                      description: `Wallet "${wallet.name}" archived.`,
                    })
                  }}
                >
                  <Archive className="mr-2 h-4 w-4" />
                  Archive Wallet
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        {/* Summary Dashboard */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
          <Card className="bg-white border-gray-200 shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Wallet Overview</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-4">
                <Image
                  src="/placeholder.svg?height=48&width=48&query=balance"
                  alt="Wallet Balance"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <div className="text-3xl font-bold text-gray-900">{hideBalance ? "••••••" : wallet.balance}</div>
                  <div className="text-sm text-gray-600">Total Balance</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Image
                  src="/placeholder.svg?height=48&width=48&query=tokens"
                  alt="Tokens"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <div className="text-3xl font-bold text-gray-900">{wallet.tokens.length}</div>
                  <div className="text-sm text-gray-600">Tokens</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Image
                  src="/placeholder.svg?height=48&width=48&query=transactions"
                  alt="Transactions"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <div className="text-3xl font-bold text-gray-900">{wallet.transactions.length}</div>
                  <div className="text-sm text-gray-600">Transactions</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Image
                  src="/placeholder.svg?height=48&width=48&query=pending"
                  alt="Pending Transactions"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {wallet.transactions.filter((tx) => tx.status === "pending").length}
                  </div>
                  <div className="text-sm text-gray-600">Pending Transactions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Wallet Info and Balance */}
        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="bg-white border-gray-200 shadow-lg rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Balance</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setHideBalance(!hideBalance)}
                      aria-label={hideBalance ? "Show balance" : "Hide balance"}
                    >
                      {hideBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{hideBalance ? "Show balance" : "Hide balance"}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-gray-900">{hideBalance ? "••••••" : wallet.balance}</div>
              <p className="mt-1 text-sm text-gray-600">{wallet.blockchain}</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Wallet Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Type</span>
                  <span className="text-sm font-medium">
                    {wallet.type === "custodial"
                      ? "Custodial Wallet"
                      : wallet.type === "mpc"
                      ? "MPC Wallet"
                      : "Smart Contract Wallet"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="text-sm font-medium">{wallet.createdAt}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Network</span>
                  <span className="text-sm font-medium">{wallet.blockchain}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assets */}
        <Card className="bg-white border-gray-200 shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Assets</CardTitle>
            <CardDescription className="text-sm">Tokens held in this wallet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 pl-4 text-left text-sm font-medium">Token</th>
                    <th className="py-3 text-right text-sm font-medium">Balance</th>
                    <th className="py-3 text-right text-sm font-medium">Value</th>
                    <th className="py-3 pr-4 text-right text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {wallet.tokens.map((token) => (
                    <tr key={token.symbol} className="border-t hover:bg-gray-50">
                      <td className="py-3 pl-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-medium">
                            {token.symbol[0]}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{token.name}</div>
                            <div className="text-xs text-gray-600">{token.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-right text-sm">{hideBalance ? "••••••" : token.balance}</td>
                      <td className="py-3 text-right text-sm">{hideBalance ? "••••••" : token.value}</td>
                      <td className="py-3 pr-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-sm"
                            onClick={() => {
                              setSelectedToken(token.symbol)
                              setShowSendDialog(true)
                            }}
                          >
                            <ArrowUp className="mr-1 h-3 w-3" />
                            Send
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-sm"
                            onClick={() => setShowReceiveDialog(true)}
                          >
                            <ArrowDown className="mr-1 h-3 w-3" />
                            Receive
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Policies */}
        <Card className="bg-white border-gray-200 shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Wallet Policies</CardTitle>
            <CardDescription className="text-sm">Policies applied to this wallet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 pl-4 text-left text-sm font-medium">Name</th>
                    <th className="py-3 text-left text-sm font-medium">Type</th>
                    <th className="py-3 text-left text-sm font-medium">Conditions</th>
                    <th className="py-3 text-left text-sm font-medium">Action</th>
                    <th className="py-3 text-left text-sm font-medium">Status</th>
                    <th className="py-3 pr-4 text-right text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {wallet.policies.length > 0 ? (
                    wallet.policies.map((policy) => (
                      <tr key={policy.id} className="border-t hover:bg-gray-50">
                        <td className="py-3 pl-4 text-sm">{policy.name}</td>
                        <td className="py-3 text-sm">{policy.type}</td>
                        <td className="py-3 text-sm">{policy.conditions}</td>
                        <td className="py-3 text-sm">{policy.action}</td>
                        <td className="py-3 text-sm">
                          <Badge
                            variant={policy.status === "active" ? "default" : "secondary"}
                            className="px-2 py-1"
                          >
                            {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-sm"
                            onClick={() => {
                              toast({
                                title: "Policy Updated",
                                description: `Policy "${policy.name}" updated.`,
                              })
                            }}
                          >
                            <Pencil className="mr-1 h-3 w-3" />
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-3 text-center text-gray-600">
                        No policies applied to this wallet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                className="h-10 bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  toast({
                    title: "Policy Assigned",
                    description: "New policy assigned to wallet.",
                  })
                }}
              >
                Assign Policy
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card className="bg-white border-gray-200 shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Transaction History</CardTitle>
            <CardDescription className="text-sm">Recent transactions for this wallet</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Bulk Actions */}
            {selectedTransactions.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between bg-gray-100 p-4 rounded-md mb-6"
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

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <Tabs value={transactionFilter} onValueChange={(value) => setTransactionFilter(value as any)} className="w-full sm:w-auto">
                <TabsList className="grid w-full max-w-md grid-cols-4 bg-gray-100 rounded-lg">
                  <TabsTrigger value="all" className="text-sm">All</TabsTrigger>
                  <TabsTrigger value="sent" className="text-sm">Sent</TabsTrigger>
                  <TabsTrigger value="received" className="text-sm">Received</TabsTrigger>
                  <TabsTrigger value="pending" className="text-sm">Pending</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search transactions"
                    className="h-10 pl-10 focus:ring-2 focus:ring-purple-600"
                    aria-label="Search transactions"
                  />
                </div>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="h-10">Filters</Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Advanced Filters</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-6 py-4">
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={transactionStatusFilter} onValueChange={setTransactionStatusFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
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
                  <Button
                    className="h-10 bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-transform"
                    onClick={() => setShowSendDialog(true)}
                  >
                    Initiate Transaction
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-3 pl-4 w-12">
                          <Checkbox
                            checked={selectedTransactions.length === paginatedTransactions.length && paginatedTransactions.length > 0}
                            onCheckedChange={handleSelectAllTransactions}
                            aria-label="Select all transactions"
                          />
                        </th>
                        <th className="py-3 text-left text-sm font-medium cursor-pointer" onClick={() => handleSort("type")}>
                          Type {transactionSort.key === "type" && <ArrowUpDown className="inline h-4 w-4" />}
                        </th>
                        <th className="py-3 text-left text-sm font-medium">Token</th>
                        <th className="py-3 text-right text-sm font-medium">Amount</th>
                        <th className="py-3 text-right text-sm font-medium">Value</th>
                        <th className="py-3 text-left text-sm font-medium">Address</th>
                        <th className="py-3 text-left text-sm font-medium cursor-pointer" onClick={() => handleSort("date")}>
                          Date {transactionSort.key === "date" && <ArrowUpDown className="inline h-4 w-4" />}
                        </th>
                        <th className="py-3 text-left text-sm font-medium cursor-pointer" onClick={() => handleSort("status")}>
                          Status {transactionSort.key === "status" && <ArrowUpDown className="inline h-4 w-4" />}
                        </th>
                        <th className="py-3 pr-4 text-right text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTransactions.map((tx) => (
                        <tr key={tx.id} className="border-t hover:bg-gray-50">
                          <td className="py-3 pl-4">
                            <Checkbox
                              checked={selectedTransactions.includes(tx.id)}
                              onCheckedChange={(checked) => handleSelectTransaction(tx.id, !!checked)}
                              aria-label={`Select transaction ${tx.id}`}
                            />
                          </td>
                          <td className="py-3 text-sm">{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</td>
                          <td className="py-3 text-sm">{tx.token}</td>
                          <td className="py-3 text-right text-sm">{hideBalance ? "••••••" : tx.amount}</td>
                          <td className="py-3 text-right text-sm">{hideBalance ? "••••••" : tx.value}</td>
                          <td className="py-3 text-sm">
                            {`${tx.address.substring(0, 6)}...${tx.address.substring(tx.address.length - 4)}`}
                          </td>
                          <td className="py-3 text-sm">{tx.date}</td>
                          <td className="py-3 text-sm">
                            <Badge
                              variant={
                                tx.status === "approved"
                                  ? "default"
                                  : tx.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="px-2 py-1"
                            >
                              {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3 pr-4 text-right">
                            {tx.status === "pending" ? (
                              <div className="flex justify-end gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => handleOpenApprovalDialog(tx)}
                                        aria-label={`Approve transaction ${tx.id}`}
                                      >
                                        <Check className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Approve transaction</TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => handleOpenApprovalDialog(tx)}
                                        aria-label={`Reject transaction ${tx.id}`}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Reject transaction</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-sm"
                                onClick={() => {
                                  toast({
                                    title: "Transaction Details",
                                    description: `Viewing details for transaction ${tx.id}.`,
                                  })
                                }}
                              >
                                View
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
            {paginatedTransactions.length > 0 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                  Showing {paginatedTransactions.length} of {filteredTransactions.length} transactions
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTransactionPage((prev) => Math.max(prev - 1, 1))}
                    disabled={transactionPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {transactionPage} of {totalTransactionPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTransactionPage((prev) => Math.min(prev + 1, totalTransactionPages))}
                    disabled={transactionPage === totalTransactionPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Send Dialog */}
        <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
          <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">Send Assets</DialogTitle>
              <DialogDescription className="text-gray-600">
                Initiate a token transfer from this wallet.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="token">Token</Label>
                <Select value={selectedToken} onValueChange={setSelectedToken}>
                  <SelectTrigger id="token" className="h-10">
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    {wallet.tokens.map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        {token.name} ({token.symbol}) - Balance: {token.balance}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient Address</Label>
                <Input
                  id="recipient"
                  placeholder="Enter recipient wallet address"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="h-10 focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="flex gap-2">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    className="flex-1 h-10"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    className="h-10 w-20"
                    onClick={() => {
                      const token = wallet.tokens.find((t) => t.symbol === selectedToken)
                      if (token) setAmount(token.balance)
                    }}
                  >
                    Max
                  </Button>
                </div>
                <p className="text-xs text-gray-600">
                  Available: {wallet.tokens.find((t) => t.symbol === selectedToken)?.balance || "0"}{" "}
                  {selectedToken}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Network Fee</span>
                  <span>~$2.50</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Amount</span>
                  <span>{amount ? `$${(parseFloat(amount) * 1.01).toFixed(2)}` : "$0.00"}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                className="h-10 border-gray-300 hover:bg-gray-100"
                onClick={() => {
                  setShowSendDialog(false)
                  setRecipientAddress("")
                  setAmount("")
                }}
              >
                Cancel
              </Button>
              <Button
                className="h-10 bg-blue-600 hover:bg-blue-700"
                onClick={handleSend}
                disabled={!amount || !recipientAddress}
              >
                Send
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Receive Dialog */}
        <Dialog open={showReceiveDialog} onOpenChange={setShowReceiveDialog}>
          <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">Receive Assets</DialogTitle>
              <DialogDescription className="text-gray-600">
                Share this address to receive tokens.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="flex flex-col items-center">
                <div className="mb-4 rounded-lg bg-white p-4 shadow-sm">
                  <Image
                    src="/placeholder.svg?height=180&width=180&query=qr-code"
                    alt="QR Code"
                    width={180}
                    height={180}
                  />
                </div>
                <p className="text-center text-sm text-gray-600">
                  Scan this QR code to get the wallet address.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wallet-address">Wallet Address</Label>
                <div className="flex gap-2">
                  <Input
                    id="wallet-address"
                    value={wallet.address}
                    readOnly
                    className="flex-1 h-10"
                  />
                  <Button
                    variant="outline"
                    className="h-10 w-10"
                    onClick={() => copyToClipboard(wallet.address)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-600">
                  Only send {wallet.blockchain} assets to this address.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Wallet Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">Edit Wallet</DialogTitle>
              <DialogDescription className="text-gray-600">
                Update wallet details for administrative purposes.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-wallet-name">Wallet Name</Label>
                <Input
                  id="edit-wallet-name"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                  className="h-10 focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                className="h-10 border-gray-300 hover:bg-gray-100"
                onClick={() => {
                  setShowEditDialog(false)
                  setWalletName(wallet.name)
                }}
              >
                Cancel
              </Button>
              <Button
                className="h-10 bg-blue-600 hover:bg-blue-700"
                onClick={handleEdit}
                disabled={!walletName}
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Transaction Approval Dialog */}
        <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
          <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Review Transaction
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Approve or reject the selected transaction.
              </DialogDescription>
            </DialogHeader>
            {transactionToApprove && (
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label>Transaction ID</Label>
                  <Input value={transactionToApprove.id} readOnly className="h-10" />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Input
                    value={transactionToApprove.type.charAt(0).toUpperCase() + transactionToApprove.type.slice(1)}
                    readOnly
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Token</Label>
                  <Input value={transactionToApprove.token} readOnly className="h-10" />
                </div>
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input value={transactionToApprove.amount} readOnly className="h-10" />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input value={transactionToApprove.address} readOnly className="h-10" />
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                className="h-10 border-gray-300 hover:bg-gray-100"
                onClick={() => setShowApprovalDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className="h-10 bg-red-600 hover:bg-red-700"
                onClick={handleRejectTransaction}
              >
                Reject
              </Button>
              <Button
                className="h-10 bg-green-600 hover:bg-green-700"
                onClick={handleApproveTransaction}
              >
                Approve
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}