"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, Download, Edit, Eye, EyeOff, Lock, Plus, RefreshCw, Shield, Trash2, Unlock } from "lucide-react"

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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

// Sample user data for admin panel
const usersData = {
  "user-1": {
    id: "user-1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    role: "Standard User",
    wallets: [
      { 
        id: "wallet-1", 
        name: "Main Wallet", 
        type: "custodial", 
        balance: "$12,450.00", 
        status: "active",
        address: "0x1a2b3c4d5e6f7g8h9i0j",
        blockchain: "Ethereum",
        createdAt: "2023-10-15",
      },
      { 
        id: "wallet-2", 
        name: "Investment Wallet", 
        type: "mpc", 
        balance: "$45,230.50", 
        status: "active",
        address: "0x9i8h7g6f5e4d3c2b1a0",
        blockchain: "Multi-chain",
        createdAt: "2023-11-20",
      },
    ],
    totalBalance: "$57,680.50",
    lastActive: "2023-12-15",
    status: "active",
    createdAt: "2023-05-10",
    transactions: [
      { id: "tx-1", type: "deposit", amount: "$5,000.00", date: "2023-12-10", status: "completed" },
      { id: "tx-2", type: "withdrawal", amount: "$1,200.00", date: "2023-12-08", status: "completed" },
      { id: "tx-3", type: "transfer", amount: "$3,500.00", date: "2023-12-05", status: "completed" },
      { id: "tx-4", type: "deposit", amount: "$10,000.00", date: "2023-11-28", status: "completed" },
    ],
    securitySettings: {
      twoFactorEnabled: true,
      lastPasswordChange: "2023-11-15",
      loginAttempts: 0,
      recoveryEmail: "john.backup@example.com",
    }
  },
  "user-2": {
    id: "user-2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 (555) 987-6543",
    role: "Standard User",
    wallets: [
      { 
        id: "wallet-3", 
        name: "Personal Wallet", 
        type: "custodial", 
        balance: "$8,320.75", 
        status: "active",
        address: "0x2b3c4d5e6f7g8h9i0j1a",
        blockchain: "Ethereum",
        createdAt: "2023-09-05",
      },
    ],
    totalBalance: "$8,320.75",
    lastActive: "2023-12-10",
    status: "active",
    createdAt: "2023-06-22",
    transactions: [
      { id: "tx-5", type: "deposit", amount: "$2,000.00", date: "2023-12-09", status: "completed" },
      { id: "tx-6", type: "withdrawal", amount: "$500.00", date: "2023-12-01", status: "completed" },
    ],
    securitySettings: {
      twoFactorEnabled: false,
      lastPasswordChange: "2023-10-30",
      loginAttempts: 0,
      recoveryEmail: "sarah.backup@example.com",
    }
  },
  "user-3": {
    id: "user-3",
    name: "Michael Brown",
    email: "m.brown@example.com",
    phone: "+1 (555) 456-7890",
    role: "Administrator",
    wallets: [
      { 
        id: "wallet-4", 
        name: "Business Wallet", 
        type: "mpc", 
        balance: "$124,500.00", 
        status: "active",
        address: "0x3c4d5e6f7g8h9i0j1a2b",
        blockchain: "Multi-chain",
        createdAt: "2023-08-12",
      },
      { 
        id: "wallet-5", 
        name: "Savings Wallet", 
        type: "custodial", 
        balance: "$35,750.25", 
        status: "frozen",
        address: "0x4d5e6f7g8h9i0j1a2b3c",
        blockchain: "Ethereum",
        createdAt: "2023-10-01",
      },
    ],
    totalBalance: "$160,250.25",
    lastActive: "2023-12-14",
    status: "active",
    createdAt: "2023-03-15",
    transactions: [
      { id: "tx-7", type: "deposit", amount: "$50,000.00", date: "2023-12-12", status: "completed" },
      { id: "tx-8", type: "transfer", amount: "$15,000.00", date: "2023-12-10", status: "completed" },
      { id: "tx-9", type: "withdrawal", amount: "$5,000.00", date: "2023-12-05", status: "completed" },
    ],
    securitySettings: {
      twoFactorEnabled: true,
      lastPasswordChange: "2023-12-01",
      loginAttempts: 0,
      recoveryEmail: "michael.backup@example.com",
    }
  },
}

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  const user = usersData[userId as keyof typeof usersData]

  const [hideBalance, setHideBalance] = useState(false)
  const [showEditUser, setShowEditUser] = useState(false)
  const [showAssignWallet, setShowAssignWallet] = useState(false)
  
  // Edit user form state
  const [editName, setEditName] = useState(user?.name || "")
  const [editEmail, setEditEmail] = useState(user?.email || "")
  const [editPhone, setEditPhone] = useState(user?.phone || "")
  const [editRole, setEditRole] = useState(user?.role === "Administrator" ? "admin" : "user")
  
  // New wallet assignment state
  const [walletType, setWalletType] = useState("custodial")
  const [walletName, setWalletName] = useState("")

  // If user doesn't exist, redirect to admin wallets page
  if (!user) {
    router.push("/admin/wallets")
    return null
  }

  const handleEditUser = () => {
    // In a real app, this would update the user details
    setShowEditUser(false)
  }

  const handleAssignWallet = () => {
    // In a real app, this would assign a wallet to the user
    setShowAssignWallet(false)
    setWalletName("")
    setWalletType("custodial")
  }

  const handleToggleUserStatus = () => {
    // In a real app, this would toggle the user's active status
    alert(`User status would be changed to ${user.status === "active" ? "inactive" : "active"}`)
  }

  const handleToggleWalletStatus = (walletId: string) => {
    // In a real app, this would toggle the wallet's frozen status
    const wallet = user.wallets.find(w => w.id === walletId)
    if (wallet) {
      alert(`Wallet ${wallet.name} would be ${wallet.status === "active" ? "frozen" : "activated"}`)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => router.push("/admin/wallets")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => setShowEditUser(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit User
            </Button>
            <Button 
              variant={user.status === "active" ? "destructive" : "default"}
              onClick={handleToggleUserStatus}
            >
              {user.status === "active" ? (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Deactivate User
                </>
              ) : (
                <>
                  <Unlock className="mr-2 h-4 w-4" />
                  Activate User
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p>{user.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p>{user.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Role</p>
                  <p>{user.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={user.status === "active" ? "default" : "secondary"}>
                    {user.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                  <p>{user.createdAt}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Account Balance</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setHideBalance(!hideBalance)}
                aria-label={hideBalance ? "Show balance" : "Hide balance"}
              >
                {hideBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
                <p className="text-2xl font-bold">
                  {hideBalance ? "••••••" : user.totalBalance}
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium">Wallets ({user.wallets.length})</p>
                {user.wallets.map((wallet) => (
                  <div key={wallet.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={wallet.status === "active" ? "outline" : "destructive"} className="text-xs">
                        {wallet.type === "custodial" ? "Custodial" : wallet.type === "mpc" ? "MPC" : "Smart"}
                      </Badge>
                      <span>{wallet.name}</span>
                    </div>
                    <span>{hideBalance ? "••••••" : wallet.balance}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => setShowAssignWallet(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Assign New Wallet
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Wallet Management</CardTitle>
            <CardDescription>Manage user's wallets and their settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Wallet Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.wallets.map((wallet) => {
                  const shortAddress = `${wallet.address.substring(0, 6)}...${wallet.address.substring(wallet.address.length - 4)}`
                  return (
                    <TableRow key={wallet.id}>
                      <TableCell className="font-medium">{wallet.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {wallet.type === "custodial" ? "Custodial" : wallet.type === "mpc" ? "MPC" : "Smart"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{shortAddress}</TableCell>
                      <TableCell>{hideBalance ? "••••••" : wallet.balance}</TableCell>
                      <TableCell>
                        <Badge variant={wallet.status === "active" ? "default" : "destructive"}>
                          {wallet.status === "active" ? "Active" : "Frozen"}
                        </Badge>
                      </TableCell>
                      <TableCell>{wallet.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleToggleWalletStatus(wallet.id)}
                                >
                                  {wallet.status === "active" ? (
                                    <Lock className="h-4 w-4" />
                                  ) : (
                                    <Unlock className="h-4 w-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {wallet.status === "active" ? "Freeze Wallet" : "Unfreeze Wallet"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>View user's recent transaction history</CardDescription>
              </div>
              <Button variant="outline" className="h-9">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="deposits">Deposits</TabsTrigger>
                <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
                <TabsTrigger value="transfers">Transfers</TabsTrigger>
              </TabsList>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-xs">{tx.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{hideBalance ? "••••••" : tx.amount}</TableCell>
                      <TableCell>{tx.date}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{tx.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing <strong>{user.transactions.length}</strong> recent transactions
            </div>
            <Button variant="outline" size="sm">
              View All Transactions
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Manage user's security and access settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Two-Factor Authentication</p>
                <Badge variant={user.securitySettings.twoFactorEnabled ? "default" : "outline"}>
                  {user.securitySettings.twoFactorEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Password Change</p>
                <p>{user.securitySettings.lastPasswordChange}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed Login Attempts</p>
                <p>{user.securitySettings.loginAttempts}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recovery Email</p>
                <p>{user.securitySettings.recoveryEmail}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset Password
              </Button>
              <Button variant="outline" size="sm">
                {user.securitySettings.twoFactorEnabled ? (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Disable 2FA
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Enable 2FA
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={showEditUser} onOpenChange={setShowEditUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and settings.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input 
                id="edit-name" 
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email Address</Label>
              <Input 
                id="edit-email" 
                type="email" 
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input 
                id="edit-phone" 
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>User Role</Label>
              <RadioGroup value={editRole} onValueChange={setEditRole}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="user" id="edit-user" />
                  <Label htmlFor="edit-user">Standard User</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="admin" id="edit-admin" />
                  <Label htmlFor="edit-admin">Administrator</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditUser(false)}>Cancel</Button>
            <Button onClick={handleEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Wallet Dialog */}
      <Dialog open={showAssignWallet} onOpenChange={setShowAssignWallet}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign New Wallet</DialogTitle>
            <DialogDescription>
              Create and assign a new wallet to {user.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
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