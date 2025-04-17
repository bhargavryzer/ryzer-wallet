"use client"

import { useState } from "react"
import { ArrowRight, CreditCard, Download, Filter, Plus, RefreshCw, Search, Shield, Trash2, UserPlus, Users } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Sample user wallet data for admin panel
const userWallets = [
  {
    id: "user-1",
    name: "John Smith",
    email: "john.smith@example.com",
    wallets: [
      { id: "wallet-1", name: "Main Wallet", type: "custodial", balance: "$12,450.00", status: "active" },
      { id: "wallet-2", name: "Investment Wallet", type: "mpc", balance: "$45,230.50", status: "active" },
    ],
    totalBalance: "$57,680.50",
    lastActive: "2023-12-15",
    status: "active",
  },
  {
    id: "user-2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    wallets: [
      { id: "wallet-3", name: "Personal Wallet", type: "custodial", balance: "$8,320.75", status: "active" },
    ],
    totalBalance: "$8,320.75",
    lastActive: "2023-12-10",
    status: "active",
  },
  {
    id: "user-3",
    name: "Michael Brown",
    email: "m.brown@example.com",
    wallets: [
      { id: "wallet-4", name: "Business Wallet", type: "mpc", balance: "$124,500.00", status: "active" },
      { id: "wallet-5", name: "Savings Wallet", type: "custodial", balance: "$35,750.25", status: "frozen" },
    ],
    totalBalance: "$160,250.25",
    lastActive: "2023-12-14",
    status: "active",
  },
  {
    id: "user-4",
    name: "Emily Davis",
    email: "emily.d@example.com",
    wallets: [
      { id: "wallet-6", name: "Main Wallet", type: "custodial", balance: "$5,120.30", status: "active" },
    ],
    totalBalance: "$5,120.30",
    lastActive: "2023-12-01",
    status: "inactive",
  },
  {
    id: "user-5",
    name: "Robert Wilson",
    email: "r.wilson@example.com",
    wallets: [
      { id: "wallet-7", name: "Investment Wallet", type: "mpc", balance: "$78,900.00", status: "active" },
      { id: "wallet-8", name: "Trading Wallet", type: "custodial", balance: "$12,340.50", status: "active" },
    ],
    totalBalance: "$91,240.50",
    lastActive: "2023-12-12",
    status: "active",
  },
]

export default function AdminWalletsPage() {
  const [showAssignWallet, setShowAssignWallet] = useState(false)
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [walletTypeFilter, setWalletTypeFilter] = useState("all")

  // New user form state
  const [newUserName, setNewUserName] = useState("")
  const [newUserEmail, setNewUserEmail] = useState("")
  
  // New wallet assignment state
  const [walletType, setWalletType] = useState("custodial")
  const [walletName, setWalletName] = useState("")
  const [assignToUser, setAssignToUser] = useState("")

  const handleSelectAllUsers = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(userWallets.map(user => user.id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId])
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId))
    }
  }

  const handleCreateUser = () => {
    // In a real app, this would create a new user
    setShowCreateUser(false)
    setNewUserName("")
    setNewUserEmail("")
  }

  const handleAssignWallet = () => {
    // In a real app, this would assign a wallet to a user
    setShowAssignWallet(false)
    setWalletName("")
    setWalletType("custodial")
    setAssignToUser("")
  }

  // Filter users based on search query and filters
  const filteredUsers = userWallets.filter(user => {
    // Search filter
    const matchesSearch = 
      searchQuery === "" || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Status filter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    
    // Wallet type filter (checks if user has at least one wallet of the selected type)
    const matchesWalletType = walletTypeFilter === "all" || 
      user.wallets.some(wallet => wallet.type === walletTypeFilter)
    
    return matchesSearch && matchesStatus && matchesWalletType
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Wallet Management</h1>
            <p className="text-muted-foreground">Manage user wallets, assign new wallets, and monitor wallet status</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => setShowCreateUser(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
            <Button onClick={() => setShowAssignWallet(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Assign Wallet
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userWallets.length}</div>
              <p className="text-xs text-muted-foreground">Managing {userWallets.reduce((acc, user) => acc + user.wallets.length, 0)} wallets</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {"$" + userWallets.reduce((acc, user) => {
                  const balance = parseFloat(user.totalBalance.replace(/[^0-9.]/g, ""))
                  return acc + balance
                }, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Across all user wallets</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userWallets.filter(user => user.status === "active").length}
              </div>
              <p className="text-xs text-muted-foreground">Out of {userWallets.length} total users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Frozen Wallets</CardTitle>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-muted-foreground"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 8V16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 12H16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userWallets.reduce((acc, user) => {
                  return acc + user.wallets.filter(wallet => wallet.status === "frozen").length
                }, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Requires admin attention</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>User Wallet Management</CardTitle>
                <CardDescription>View and manage all user wallets</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="h-9">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button variant="outline" className="h-9">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search users..." 
                    className="pl-8 w-full sm:w-[300px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={walletTypeFilter} onValueChange={setWalletTypeFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by wallet type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Wallet Types</SelectItem>
                    <SelectItem value="custodial">Custodial</SelectItem>
                    <SelectItem value="mpc">MPC</SelectItem>
                    <SelectItem value="smart">Smart Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-9"
                  disabled={selectedUsers.length === 0}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="h-9 w-9">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Advanced Filters</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedUsers.length === userWallets.length}
                        onCheckedChange={handleSelectAllUsers}
                      />
                    </TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Wallets</TableHead>
                    <TableHead>Total Balance</TableHead>
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
                          <Checkbox 
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {user.wallets.map((wallet) => (
                              <div key={wallet.id} className="flex items-center gap-2">
                                <Badge variant={wallet.status === "active" ? "outline" : "destructive"} className="text-xs">
                                  {wallet.type === "custodial" ? "Custodial" : wallet.type === "mpc" ? "MPC" : "Smart"}
                                </Badge>
                                <span className="text-sm">{wallet.name}</span>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{user.totalBalance}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === "active" ? "default" : "secondary"}>
                            {user.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.lastActive}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/admin/users/${user.id}`}>
                              <Button variant="ghost" size="sm">
                                <ArrowRight className="h-4 w-4" />
                                <span className="sr-only">View Details</span>
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No users found matching your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing <strong>{filteredUsers.length}</strong> of <strong>{userWallets.length}</strong> users
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
      </div>

      {/* Create User Dialog */}
      <Dialog open={showCreateUser} onOpenChange={setShowCreateUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account. The user will receive an email invitation to set up their password.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="Enter user's full name" 
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="user@example.com" 
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>User Role</Label>
              <RadioGroup defaultValue="user">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="user" id="user" />
                  <Label htmlFor="user">Standard User</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="admin" id="admin" />
                  <Label htmlFor="admin">Administrator</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateUser(false)}>Cancel</Button>
            <Button onClick={handleCreateUser}>Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Wallet Dialog */}
      <Dialog open={showAssignWallet} onOpenChange={setShowAssignWallet}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign New Wallet</DialogTitle>
            <DialogDescription>
              Create and assign a new wallet to a user. The user will be notified via email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="user">Select User</Label>
              <Select value={assignToUser} onValueChange={setAssignToUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {userWallets.map((user) => (
                    <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="wallet-name">Wallet Name</Label>
              <Input 
                id="wallet-name" 
                placeholder="Enter wallet name" 
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Wallet Type</Label>
              <RadioGroup value={walletType} onValueChange={setWalletType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custodial" id="custodial" />
                  <Label htmlFor="custodial">Custodial Wallet</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mpc" id="mpc" />
                  <Label htmlFor="mpc">MPC Wallet</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="smart" id="smart" />
                  <Label htmlFor="smart">Smart Contract Wallet</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignWallet(false)}>Cancel</Button>
            <Button onClick={handleAssignWallet}>Assign Wallet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}