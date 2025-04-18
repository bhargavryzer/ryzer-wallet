"use client"

import { useState, useMemo } from "react"
import {
  Info,
  X,
  Check,
  Shield,
  Copy,
  Edit,
  Search,
  Filter,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

// Interfaces
interface Wallet {
  id: string
  name: string
  type: "safe" | "aa"
  status: "active" | "pending" | "frozen"
  created: string
  userId: string
  userName: string
  userEmail: string
  address: string
}

interface User {
  id: string
  name: string
  email: string
}

interface WalletInfoCardProps {
  name: string
  type: "safe" | "aa"
  status: "active" | "pending" | "frozen"
  created: string
  id: string
  userName: string
  userEmail: string
  address: string
  onApprove?: () => void
  onFreeze?: () => void
}

// Sample data
const wallets: Wallet[] = [
  {
    id: "wallet-1",
    name: "Main Safe Wallet",
    type: "safe",
    status: "active",
    created: "2025-03-10",
    userId: "user-1",
    userName: "John Smith",
    userEmail: "john.smith@example.com",
    address: "0x1234...5678",
  },
  {
    id: "wallet-2",
    name: "Pending AA Wallet",
    type: "aa",
    status: "pending",
    created: "2025-04-15",
    userId: "user-2",
    userName: "Sarah Johnson",
    userEmail: "sarah.j@example.com",
    address: "0x9876...5432",
  },
  {
    id: "wallet-3",
    name: "Frozen Safe Wallet",
    type: "safe",
    status: "frozen",
    created: "2025-04-01",
    userId: "user-3",
    userName: "Michael Brown",
    userEmail: "m.brown@example.com",
    address: "0x4567...8901",
  },
]

const users: User[] = [
  { id: "all", name: "All Users", email: "" },
  { id: "user-1", name: "John Smith", email: "john.smith@example.com" },
  { id: "user-2", name: "Sarah Johnson", email: "sarah.j@example.com" },
  { id: "user-3", name: "Michael Brown", email: "m.brown@example.com" },
]

// WalletInfoCard component
const WalletInfoCard: React.FC<WalletInfoCardProps> = ({
  name,
  type,
  status,
  created,
  id,
  userName,
  userEmail,
  address,
  onApprove,
  onFreeze,
}) => {
  const { toast } = useToast()

  const handleAction = (action: string, callback?: () => void) => {
    toast({
      title: `${action} Wallet`,
      description: `${action} action initiated for ${name}.`,
    })
    callback?.()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 hover:scale-[1.01]">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4">
          <CardTitle className="text-xl font-semibold font-poppins">{name}</CardTitle>
          <CardDescription className="text-sm text-gray-100 font-poppins">
            {type === "safe" ? "Safe Wallet" : "AA Wallet"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-gray-500 font-poppins">User</p>
              <div className="flex items-center gap-2">
                <Link href={`/admin/users/${id}`} className="text-indigo-600 hover:text-indigo-700 font-medium font-poppins">
                  {userName}
                </Link>
                <span className="text-sm text-gray-500 font-poppins">({userEmail})</span>
              </div>
            </div>
            <Badge
              variant={status === "active" ? "default" : status === "frozen" ? "destructive" : "secondary"}
              className="px-3 py-1 text-xs font-medium font-poppins"
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500 font-poppins">Created</p>
              <p className="font-medium font-poppins">{created}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500 font-poppins">Type</p>
              <p className="font-medium font-poppins">{type === "safe" ? "Safe Wallet" : "AA Wallet"}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500 font-poppins">Address</p>
            <div className="flex items-center gap-2">
              <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono font-poppins">{address}</code>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  navigator.clipboard.writeText(address)
                  toast({
                    title: "Address Copied",
                    description: "Wallet address copied to clipboard.",
                  })
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2 border-t border-gray-100 pt-4 bg-gray-50 dark:bg-gray-700">
          {status === "pending" && onApprove ? (
            <>
              <Button
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 transition-colors font-poppins"
                onClick={() => handleAction("Approve", onApprove)}
              >
                <Check className="mr-2 h-4 w-4" /> Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleAction("Reject", onApprove)}
                className="font-poppins"
              >
                <X className="mr-2 h-4 w-4" /> Reject
              </Button>
            </>
          ) : (
            onFreeze && (
              <Button
                size="sm"
                variant="outline"
                className="border-gray-300 hover:bg-gray-100 font-poppins"
                onClick={() => handleAction(status === "active" ? "Freeze" : "Unfreeze", onFreeze)}
              >
                <Shield className="mr-2 h-4 w-4" /> {status === "active" ? "Freeze" : "Unfreeze"}
              </Button>
            )
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default function AdminSmartContractWalletsPage() {
  const [showCreateWallet, setShowCreateWallet] = useState(false)
  const [showImportWallet, setShowImportWallet] = useState(false)
  const [walletType, setWalletType] = useState<"safe" | "aa" | null>(null)
  const [walletName, setWalletName] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [selectedUser, setSelectedUser] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [itemToApprove, setItemToApprove] = useState<Wallet | null>(null)
  const [createForUser, setCreateForUser] = useState<string>("user-1")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const { toast } = useToast()

  // Filter wallets
  const filteredWallets = useMemo(() => {
    return wallets.filter(
      (wallet) =>
        (searchQuery === "" ||
          wallet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          wallet.userName.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedUser === "all" || wallet.userId === selectedUser) &&
        (statusFilter === "all" || wallet.status === statusFilter)
    )
  }, [searchQuery, selectedUser, statusFilter])

  // Pagination
  const totalPages = Math.ceil(filteredWallets.length / itemsPerPage)
  const paginatedWallets = filteredWallets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Address copied to clipboard.",
    })
  }

  // Selection handlers
  const handleSelectAllItems = (checked: boolean) => {
    if (checked) {
      setSelectedItems(paginatedWallets.map((wallet) => wallet.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id])
    } else {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
    }
  }

  // Bulk actions
  const handleBulkFreeze = () => {
    toast({
      title: "Freezing Wallets",
      description: `Freezing ${selectedItems.length} wallet(s).`,
    })
    console.log("Freezing wallets:", selectedItems)
    setSelectedItems([])
  }

  const handleBulkUnfreeze = () => {
    toast({
      title: "Unfreezing Wallets",
      description: `Unfreezing ${selectedItems.length} wallet(s).`,
    })
    console.log("Unfreezing wallets:", selectedItems)
    setSelectedItems([])
  }

  // Approval actions
  const handleOpenApprovalDialog = (wallet: Wallet) => {
    setItemToApprove(wallet)
    setShowApprovalDialog(true)
  }

  const handleApproveItem = () => {
    if (itemToApprove) {
      toast({
        title: "Wallet Approved",
        description: `Wallet ${itemToApprove.name} has been approved.`,
      })
      console.log("Approving wallet:", itemToApprove.id)
    }
    setShowApprovalDialog(false)
    setItemToApprove(null)
  }

  const handleRejectItem = () => {
    if (itemToApprove) {
      toast({
        title: "Wallet Rejected",
        description: `Wallet ${itemToApprove.name} has been rejected.`,
      })
      console.log("Rejecting wallet:", itemToApprove.id)
    }
    setShowApprovalDialog(false)
    setItemToApprove(null)
  }

  const handleCreateWallet = () => {
    const newWallet: Wallet = {
      id: `wallet-${Date.now()}`,
      name: walletName || "New Wallet",
      type: walletType || "safe",
      status: "pending",
      created: new Date().toISOString().split("T")[0],
      userId: createForUser,
      userName: users.find((u) => u.id === createForUser)?.name || "Unknown",
      userEmail: users.find((u) => u.id === createForUser)?.email || "unknown@example.com",
      address: "0x" + Math.random().toString(16).slice(2, 10) + "...1234",
    }
    toast({
      title: "Wallet Created",
      description: `Wallet ${newWallet.name} created for ${newWallet.userName}.`,
    })
    console.log("Creating wallet:", newWallet)
    setShowCreateWallet(false)
    setWalletName("")
    setWalletType(null)
    setCreateForUser("user-1")
  }

  const handleImportWallet = () => {
    const newWallet: Wallet = {
      id: `wallet-${Date.now()}`,
      name: "Imported Wallet",
      type: "safe",
      status: "pending",
      created: new Date().toISOString().split("T")[0],
      userId: createForUser,
      userName: users.find((u) => u.id === createForUser)?.name || "Unknown",
      userEmail: users.find((u) => u.id === createForUser)?.email || "unknown@example.com",
      address: walletAddress,
    }
    toast({
      title: "Wallet Imported",
      description: `Wallet imported for ${newWallet.userName}.`,
    })
    console.log("Importing wallet:", newWallet)
    setShowImportWallet(false)
    setWalletAddress("")
    setCreateForUser("user-1")
  }

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 p-8 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 font-poppins">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
        </motion.div>

        {/* Main Content */}
        <Card className="bg-white dark:bg-gray-800 border-none shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-semibold text-white font-poppins">
                  Smart Contract Wallets Overview
                </CardTitle>
                <CardDescription className="text-sm text-gray-100 font-poppins">
                  Securely manage Safe and AA wallets with enhanced security.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                    <div className="flex items-center gap-4 text-sm text-white">
            <span className="font-medium">Wallets: {wallets.length}</span>
            
            <span className="font-medium">Users: {new Set(wallets.map((w) => w.userId)).size}</span>
          </div>
                    </TooltipTrigger>
            
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                    </TooltipTrigger>
                    <TooltipContent className="font-poppins">Approval Guide</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* Filters and Controls */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-500" />
                  <Input
                    placeholder="Search by name or user"
                    className="h-10 pl-10 rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 transition-all font-poppins"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search wallets"
                  />
                </div>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger className="w-full sm:w-48 h-10 rounded-lg border-gray-200 dark:border-gray-600 font-poppins">
                    <SelectValue placeholder="Filter by user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id} className="font-poppins">
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="h-10 border-gray-200 hover:bg-gray-100 font-poppins">
                      <Filter className="mr-2 h-4 w-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="bg-white dark:bg-gray-800">
                    <SheetHeader>
                      <SheetTitle className="font-poppins">Advanced Filters</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-6 py-6">
                      <div className="space-y-2">
                        <Label className="font-poppins">Status</Label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="h-10 font-poppins">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all" className="font-poppins">All</SelectItem>
                            <SelectItem value="active" className="font-poppins">Active</SelectItem>
                            <SelectItem value="pending" className="font-poppins">Pending</SelectItem>
                            <SelectItem value="frozen" className="font-poppins">Frozen</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex rounded-md border border-gray-200 dark:border-gray-600">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={viewMode === "grid" ? "default" : "ghost"}
                          size="icon"
                          className="h-10 w-10 rounded-l-md border-0"
                          onClick={() => setViewMode("grid")}
                          aria-label="Grid view"
                        >
                          <LayoutGrid className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="font-poppins">Grid view</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={viewMode === "list" ? "default" : "ghost"}
                          size="icon"
                          className="h-10 w-10 rounded-r-md border-0"
                          onClick={() => setViewMode("list")}
                          aria-label="List view"
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="font-poppins">List view</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Button
                  className="h-10 bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 font-poppins"
                  onClick={() => setShowCreateWallet(true)}
                  aria-label="Create wallet"
                >
                  Create Wallet
                </Button>
                <Button
                  variant="outline"
                  className="h-10 border-gray-200 hover:bg-gray-100 font-poppins"
                  onClick={() => setShowImportWallet(true)}
                  aria-label="Import wallet"
                >
                  Import Wallet
                </Button>
              </div>
            </motion.div>

            {/* Bulk Actions */}
            {selectedItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
              >
                <div className="text-sm text-gray-700 dark:text-gray-300 font-poppins">
                  <span className="font-medium">{selectedItems.length}</span> wallet(s) selected
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleBulkFreeze}
                    variant="outline"
                    className="border-gray-200 hover:bg-gray-100 font-poppins"
                  >
                    Freeze Selected
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleBulkUnfreeze}
                    variant="outline"
                    className="border-gray-200 hover:bg-gray-100 font-poppins"
                  >
                    Unfreeze Selected
                  </Button>
                </div>
              </motion.div>
            )}

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <TabsTrigger
                  value="all"
                  className="text-sm font-poppins data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:shadow-sm"
                >
                  All Wallets
                </TabsTrigger>
                <TabsTrigger
                  value="safe"
                  className="text-sm font-poppins data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:shadow-sm"
                >
                  Safe Wallets
                </TabsTrigger>
                <TabsTrigger
                  value="aa"
                  className="text-sm font-poppins data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:shadow-sm"
                >
                  AA Wallets
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="pt-6">
                <AnimatePresence>
                  {paginatedWallets.length === 0 ? (
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex flex-col items-center justify-center py-12 text-gray-600 dark:text-gray-300"
                    >
                      <Image
                        src="/interconnected-contracts.png"
                        alt="Smart Contract Wallet icon"
                        width={80}
                        height={80}
                        className="mb-6"
                      />
                      <h3 className="text-lg font-medium mb-4 font-poppins">No smart contract wallets found.</h3>
                      <Button
                        className="h-10 bg-indigo-600 hover:bg-indigo-700 hover:scale-105 transition-transform font-poppins"
                        onClick={() => setShowCreateWallet(true)}
                      >
                        Create Wallet
                      </Button>
                    </motion.div>
                  ) : viewMode === "list" ? (
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">
                              <Checkbox
                                checked={selectedItems.length === paginatedWallets.length && paginatedWallets.length > 0}
                                onCheckedChange={handleSelectAllItems}
                                aria-label="Select all wallets"
                              />
                            </TableHead>
                            <TableHead className="font-poppins">Wallet</TableHead>
                            <TableHead className="font-poppins">User</TableHead>
                            <TableHead className="font-poppins">Address</TableHead>
                            <TableHead className="font-poppins">Status</TableHead>
                            <TableHead className="font-poppins">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedWallets.map((wallet) => (
                            <TableRow key={wallet.id}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedItems.includes(wallet.id)}
                                  onCheckedChange={(checked) => handleSelectItem(wallet.id, !!checked)}
                                  aria-label={`Select wallet ${wallet.name}`}
                                />
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="font-medium text-gray-900 dark:text-white font-poppins">{wallet.name}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-300 font-poppins">
                                    {wallet.type === "safe" ? "Safe Wallet" : "AA Wallet"}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <Link
                                    href={`/admin/users/${wallet.userId}`}
                                    className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-poppins"
                                  >
                                    {wallet.userName}
                                  </Link>
                                  <div className="text-sm text-gray-500 dark:text-gray-300 font-poppins">{wallet.userEmail}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-mono text-gray-600 dark:text-gray-300 font-poppins">{wallet.address}</span>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-6 w-6"
                                          onClick={() => copyToClipboard(wallet.address)}
                                        >
                                          <Copy className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent className="font-poppins">Copy address</TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    wallet.status === "active"
                                      ? "default"
                                      : wallet.status === "frozen"
                                      ? "destructive"
                                      : "secondary"
                                  }
                                  className="px-2 py-1 font-poppins"
                                >
                                  {wallet.status.charAt(0).toUpperCase() + wallet.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {wallet.status === "pending" ? (
                                    <>
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="outline"
                                              size="icon"
                                              className="h-8 w-8 border-gray-200 hover:bg-gray-100"
                                              onClick={() => handleOpenApprovalDialog(wallet)}
                                            >
                                              <Check className="h-4 w-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent className="font-poppins">Approve wallet</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-8 w-8"
                                              onClick={() => handleOpenApprovalDialog(wallet)}
                                            >
                                              <X className="h-4 w-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent className="font-poppins">Reject wallet</TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </>
                                  ) : (
                                    <>
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-8 w-8"
                                              onClick={() =>
                                                wallet.status === "active"
                                                  ? console.log("Freeze wallet:", wallet.id)
                                                  : console.log("Unfreeze wallet:", wallet.id)
                                              }
                                            >
                                              <Shield className="h-4 w-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent className="font-poppins">
                                            {wallet.status === "active" ? "Freeze wallet" : "Unfreeze wallet"}
                                          </TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Link href={`/admin/wallets/${wallet.id}`}>
                                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Edit className="h-4 w-4" />
                                              </Button>
                                            </Link>
                                          </TooltipTrigger>
                                          <TooltipContent className="font-poppins">Edit wallet</TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </motion.div>
                  ) : (
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    >
                      {paginatedWallets.map((wallet) => (
                        <WalletInfoCard
                          key={wallet.id}
                          name={wallet.name}
                          type={wallet.type}
                          status={wallet.status}
                          created={wallet.created}
                          id={wallet.id}
                          userName={wallet.userName}
                          userEmail={wallet.userEmail}
                          address={wallet.address}
                          onApprove={() => handleOpenApprovalDialog(wallet)}
                          onFreeze={() =>
                            wallet.status === "active"
                              ? console.log("Freeze wallet:", wallet.id)
                              : console.log("Unfreeze wallet:", wallet.id)
                          }
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                {paginatedWallets.length > 0 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600 dark:text-gray-300 font-poppins">
                      Showing {paginatedWallets.length} of {filteredWallets.length} wallets
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="border-gray-200 hover:bg-gray-100 font-poppins"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-gray-600 dark:text-gray-300 font-poppins">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="border-gray-200 hover:bg-gray-100 font-poppins"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="safe" className="pt-6">
                <AnimatePresence>
                  {paginatedWallets.filter((w) => w.type === "safe").length === 0 ? (
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex flex-col items-center justify-center py-12 text-gray-600 dark:text-gray-300"
                    >
                      <Image
                        src="/secure-digital-wallet.png"
                        alt="Safe Wallet icon"
                        width={80}
                        height={80}
                        className="mb-6"
                      />
                      <h3 className="text-lg font-medium mb-4 font-poppins">No Safe wallets found.</h3>
                      <Button
                        className="h-10 bg-indigo-600 hover:bg-indigo-700 hover:scale-105 transition-transform font-poppins"
                        onClick={() => {
                          setWalletType("safe")
                          setShowCreateWallet(true)
                        }}
                      >
                        Create Safe Wallet
                      </Button>
                    </motion.div>
                  ) : viewMode === "list" ? (
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">
                              <Checkbox
                                checked={
                                  selectedItems.length ===
                                    paginatedWallets.filter((w) => w.type === "safe").length &&
                                  paginatedWallets.filter((w) => w.type === "safe").length > 0
                                }
                                onCheckedChange={handleSelectAllItems}
                                aria-label="Select all safe wallets"
                              />
                            </TableHead>
                            <TableHead className="font-poppins">Wallet</TableHead>
                            <TableHead className="font-poppins">User</TableHead>
                            <TableHead className="font-poppins">Address</TableHead>
                            <TableHead className="font-poppins">Status</TableHead>
                            <TableHead className="font-poppins">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedWallets
                            .filter((w) => w.type === "safe")
                            .map((wallet) => (
                              <TableRow key={wallet.id}>
                                <TableCell>
                                  <Checkbox
                                    checked={selectedItems.includes(wallet.id)}
                                    onCheckedChange={(checked) => handleSelectItem(wallet.id, !!checked)}
                                    aria-label={`Select wallet ${wallet.name}`}
                                  />
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    <div className="font-medium text-gray-900 dark:text-white font-poppins">{wallet.name}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-300 font-poppins">Safe Wallet</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    <Link
                                      href={`/admin/users/${wallet.userId}`}
                                      className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-poppins"
                                    >
                                      {wallet.userName}
                                    </Link>
                                    <div className="text-sm text-gray-500 dark:text-gray-300 font-poppins">{wallet.userEmail}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-mono text-gray-600 dark:text-gray-300 font-poppins">{wallet.address}</span>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => copyToClipboard(wallet.address)}
                                          >
                                            <Copy className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent className="font-poppins">Copy address</TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      wallet.status === "active"
                                        ? "default"
                                        : wallet.status === "frozen"
                                        ? "destructive"
                                        : "secondary"
                                    }
                                    className="px-2 py-1 font-poppins"
                                  >
                                    {wallet.status.charAt(0).toUpperCase() + wallet.status.slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {wallet.status === "pending" ? (
                                      <>
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 border-gray-200 hover:bg-gray-100"
                                                onClick={() => handleOpenApprovalDialog(wallet)}
                                              >
                                                <Check className="h-4 w-4" />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent className="font-poppins">Approve wallet</TooltipContent>
                                          </Tooltip>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => handleOpenApprovalDialog(wallet)}
                                              >
                                                <X className="h-4 w-4" />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent className="font-poppins">Reject wallet</TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      </>
                                    ) : (
                                      <>
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() =>
                                                  wallet.status === "active"
                                                    ? console.log("Freeze wallet:", wallet.id)
                                                    : console.log("Unfreeze wallet:", wallet.id)
                                                }
                                              >
                                                <Shield className="h-4 w-4" />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent className="font-poppins">
                                              {wallet.status === "active" ? "Freeze wallet" : "Unfreeze wallet"}
                                            </TooltipContent>
                                          </Tooltip>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Link href={`/admin/wallets/${wallet.id}`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                  <Edit className="h-4 w-4" />
                                                </Button>
                                              </Link>
                                            </TooltipTrigger>
                                            <TooltipContent className="font-poppins">Edit wallet</TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      </>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </motion.div>
                  ) : (
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    >
                      {paginatedWallets
                        .filter((w) => w.type === "safe")
                        .map((wallet) => (
                          <WalletInfoCard
                            key={wallet.id}
                            name={wallet.name}
                            type={wallet.type}
                            status={wallet.status}
                            created={wallet.created}
                            id={wallet.id}
                            userName={wallet.userName}
                            userEmail={wallet.userEmail}
                            address={wallet.address}
                            onApprove={() => handleOpenApprovalDialog(wallet)}
                            onFreeze={() =>
                              wallet.status === "active"
                                ? console.log("Freeze wallet:", wallet.id)
                                : console.log("Unfreeze wallet:", wallet.id)
                            }
                          />
                        ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                {paginatedWallets.filter((w) => w.type === "safe").length > 0 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600 dark:text-gray-300 font-poppins">
                      Showing {paginatedWallets.filter((w) => w.type === "safe").length} Safe wallets
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="border-gray-200 hover:bg-gray-100 font-poppins"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-gray-600 dark:text-gray-300 font-poppins">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="border-gray-200 hover:bg-gray-100 font-poppins"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="aa" className="pt-6">
                <AnimatePresence>
                  {paginatedWallets.filter((w) => w.type === "aa").length === 0 ? (
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex flex-col items-center justify-center py-12 text-gray-600 dark:text-gray-300"
                    >
                      <Image
                        src="/abstract-wallet-design.png"
                        alt="AA Wallet icon"
                        width={80}
                        height={80}
                        className="mb-6"
                      />
                      <h3 className="text-lg font-medium mb-4 font-poppins">No AA wallets found.</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 font-poppins">AA wallets are coming soon.</p>
                    </motion.div>
                  ) : viewMode === "list" ? (
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">
                              <Checkbox
                                checked={
                                  selectedItems.length ===
                                    paginatedWallets.filter((w) => w.type === "aa").length &&
                                  paginatedWallets.filter((w) => w.type === "aa").length > 0
                                }
                                onCheckedChange={handleSelectAllItems}
                                aria-label="Select all AA wallets"
                              />
                            </TableHead>
                            <TableHead className="font-poppins">Wallet</TableHead>
                            <TableHead className="font-poppins">User</TableHead>
                            <TableHead className="font-poppins">Address</TableHead>
                            <TableHead className="font-poppins">Status</TableHead>
                            <TableHead className="font-poppins">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedWallets
                            .filter((w) => w.type === "aa")
                            .map((wallet) => (
                              <TableRow key={wallet.id}>
                                <TableCell>
                                  <Checkbox
                                    checked={selectedItems.includes(wallet.id)}
                                    onCheckedChange={(checked) => handleSelectItem(wallet.id, !!checked)}
                                    aria-label={`Select wallet ${wallet.name}`}
                                  />
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    <div className="font-medium text-gray-900 dark:text-white font-poppins">{wallet.name}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-300 font-poppins">AA Wallet</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    <Link
                                      href={`/admin/users/${wallet.userId}`}
                                      className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-poppins"
                                    >
                                      {wallet.userName}
                                    </Link>
                                    <div className="text-sm text-gray-500 dark:text-gray-300 font-poppins">{wallet.userEmail}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-mono text-gray-600 dark:text-gray-300 font-poppins">{wallet.address}</span>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => copyToClipboard(wallet.address)}
                                          >
                                            <Copy className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent className="font-poppins">Copy address</TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      wallet.status === "active"
                                        ? "default"
                                        : wallet.status === "frozen"
                                        ? "destructive"
                                        : "secondary"
                                    }
                                    className="px-2 py-1 font-poppins"
                                  >
                                    {wallet.status.charAt(0).toUpperCase() + wallet.status.slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {wallet.status === "pending" ? (
                                      <>
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 border-gray-200 hover:bg-gray-100"
                                                onClick={() => handleOpenApprovalDialog(wallet)}
                                              >
                                                <Check className="h-4 w-4" />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent className="font-poppins">Approve wallet</TooltipContent>
                                          </Tooltip>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => handleOpenApprovalDialog(wallet)}
                                              >
                                                <X className="h-4 w-4" />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent className="font-poppins">Reject wallet</TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      </>
                                    ) : (
                                      <>
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() =>
                                                  wallet.status === "active"
                                                    ? console.log("Freeze wallet:", wallet.id)
                                                    : console.log("Unfreeze wallet:", wallet.id)
                                                }
                                              >
                                                <Shield className="h-4 w-4" />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent className="font-poppins">
                                              {wallet.status === "active" ? "Freeze wallet" : "Unfreeze wallet"}
                                            </TooltipContent>
                                          </Tooltip>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Link href={`/admin/wallets/${wallet.id}`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                  <Edit className="h-4 w-4" />
                                                </Button>
                                              </Link>
                                            </TooltipTrigger>
                                            <TooltipContent className="font-poppins">Edit wallet</TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      </>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </motion.div>
                  ) : (
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    >
                      {paginatedWallets
                        .filter((w) => w.type === "aa")
                        .map((wallet) => (
                          <WalletInfoCard
                            key={wallet.id}
                            name={wallet.name}
                            type={wallet.type}
                            status={wallet.status}
                            created={wallet.created}
                            id={wallet.id}
                            userName={wallet.userName}
                            userEmail={wallet.userEmail}
                            address={wallet.address}
                            onApprove={() => handleOpenApprovalDialog(wallet)}
                            onFreeze={() =>
                              wallet.status === "active"
                                ? console.log("Freeze wallet:", wallet.id)
                                : console.log("Unfreeze wallet:", wallet.id)
                            }
                          />
                        ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                {paginatedWallets.filter((w) => w.type === "aa").length > 0 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600 dark:text-gray-300 font-poppins">
                      Showing {paginatedWallets.filter((w) => w.type === "aa").length} AA wallets
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="border-gray-200 hover:bg-gray-100 font-poppins"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-gray-600 dark:text-gray-300 font-poppins">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="border-gray-200 hover:bg-gray-100 font-poppins"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Dialogs */}
        <Dialog open={showCreateWallet} onOpenChange={setShowCreateWallet}>
          <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white font-poppins">
                Create Smart Contract Wallet
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                onClick={() => {
                  setShowCreateWallet(false)
                  setWalletType(null)
                  setWalletName("")
                  setCreateForUser("user-1")
                }}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogHeader>
            <ScrollArea className="max-h-[80vh]">
              <div className="space-y-6 py-6 px-4">
                {!walletType ? (
                  <>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white font-poppins">Select a wallet to create</h3>
                    <div className="space-y-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 dark:border-gray-600 p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={() => setWalletType("safe")}
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-teal-100 p-2">
                            <Image src="/secure-digital-wallet.png" alt="Safe Wallet" width={24} height={24} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white font-poppins">Safe{"{Wallet}"}</div>
                            <div className="inline-block rounded bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900 dark:text-green-200 font-poppins">
                              With Cobo Safe Enabled
                            </div>
                          </div>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="rounded-full">
                                <Info className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="font-poppins">Safe Wallet Info</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </motion.div>

                      <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-4 opacity-50">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-blue-100 p-2">
                            <Image src="/abstract-wallet-design.png" alt="AA Wallet" width={24} height={24} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white font-poppins">AA Wallets</div>
                            <div className="text-xs font-medium text-orange-500 dark:text-orange-400 font-poppins">Coming Soon</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white font-poppins">Configure SafeWallet</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="wallet-name" className="text-gray-700 dark:text-gray-300 font-poppins">
                          Wallet Name
                        </Label>
                        <Input
                          id="wallet-name"
                          placeholder="Enter wallet name"
                          value={walletName}
                          onChange={(e) => setWalletName(e.target.value)}
                          className="h-10 focus:ring-2 focus:ring-indigo-500 font-poppins"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="user" className="text-gray-700 dark:text-gray-300 font-poppins">
                          Create for User
                        </Label>
                        <Select value={createForUser} onValueChange={setCreateForUser}>
                          <SelectTrigger id="user" className="h-10 focus:ring-2 focus:ring-indigo-500 font-poppins">
                            <SelectValue placeholder="Select user" />
                          </SelectTrigger>
                          <SelectContent>
                            {users
                              .filter((u) => u.id !== "all")
                              .map((user) => (
                                <SelectItem key={user.id} value={user.id} className="font-poppins">
                                  {user.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-300 font-poppins">
                        This wallet will be created with Cobo Safe enabled for enhanced security.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
              <Button
                variant="outline"
                className="h-10 border-gray-200 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 font-poppins"
                onClick={() => {
                  if (walletType) {
                    setWalletType(null)
                    setWalletName("")
                  } else {
                    setShowCreateWallet(false)
                    setCreateForUser("user-1")
                  }
                }}
              >
                {walletType ? "Back" : "Cancel"}
              </Button>
              {walletType && (
                <Button
                  className="h-10 bg-indigo-600 hover:bg-indigo-700 font-poppins"
                  onClick={handleCreateWallet}
                  disabled={!walletName || !createForUser}
                >
                  Create
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showImportWallet} onOpenChange={setShowImportWallet}>
          <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white font-poppins">
                Import Smart Contract Wallet
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                onClick={() => {
                  setShowImportWallet(false)
                  setCreateForUser("user-1")
                }}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogHeader>
            <ScrollArea className="max-h-[80vh]">
              <div className="space-y-6 py-6 px-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white font-poppins">Import an existing wallet</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="wallet-address" className="text-gray-700 dark:text-gray-300 font-poppins">
                      Wallet Address
                    </Label>
                    <Input
                      id="wallet-address"
                      placeholder="Enter wallet contract address"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      className="h-10 focus:ring-2 focus:ring-indigo-500 font-poppins"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user" className="text-gray-700 dark:text-gray-300 font-poppins">
                      Import for User
                    </Label>
                    <Select value={createForUser} onValueChange={setCreateForUser}>
                      <SelectTrigger id="user" className="h-10 focus:ring-2 focus:ring-indigo-500 font-poppins">
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users
                          .filter((u) => u.id !== "all")
                          .map((user) => (
                            <SelectItem key={user.id} value={user.id} className="font-poppins">
                              {user.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-300 font-poppins">
                    Ensure the address belongs to a supported smart contract wallet (e.g., SafeWallet).
                  </p>
                </div>
              </div>
            </ScrollArea>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
              <Button
                variant="outline"
                className="h-10 border-gray-200 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 font-poppins"
                onClick={() => {
                  setShowImportWallet(false)
                  setCreateForUser("user-1")
                }}
              >
                Cancel
              </Button>
              <Button
                className="h-10 bg-indigo-600 hover:bg-indigo-700 font-poppins"
                onClick={handleImportWallet}
                disabled={!walletAddress || !createForUser}
              >
                Import
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
          <DialogContent className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white font-poppins">
                Approve Wallet Creation
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-300 font-poppins">
                Review and approve or reject the creation of a new smart contract wallet.
              </DialogDescription>
            </DialogHeader>
            {itemToApprove && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300 font-poppins">Name:</span> {itemToApprove.name}
                </div>
                <div className="grid gap-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300 font-poppins">User:</span>{" "}
                  <Link
                    href={`/admin/users/${itemToApprove.userId}`}
                    className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-poppins"
                  >
                    {itemToApprove.userName}
                  </Link>{" "}
                  <span className="text-gray-500 dark:text-gray-300 font-poppins">({itemToApprove.userEmail})</span>
                </div>
                <div className="grid gap-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300 font-poppins">Type:</span>{" "}
                  {itemToApprove.type === "safe" ? "Safe Wallet" : "AA Wallet"}
                </div>
                <div className="grid gap-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300 font-poppins">Address:</span> {itemToApprove.address}
                </div>
                <div className="grid gap-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300 font-poppins">Created At:</span> {itemToApprove.created}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                className="border-gray-200 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 font-poppins"
                onClick={() => setShowApprovalDialog(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleRejectItem} className="font-poppins">
                Reject
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700 font-poppins" onClick={handleApproveItem}>
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
        </DashboardLayout>

   
  )
}

    