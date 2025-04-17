"use client"

import { useState } from "react"
import { ArrowRight, CreditCard, Download, Plus, RefreshCw, Search, Shield, Users, Wallet, AlertTriangle, BarChart3 } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample data for admin dashboard
const dashboardData = {
  totalUsers: 125,
  activeUsers: 112,
  totalWallets: 287,
  totalAssets: "$322,571.80",
  frozenWallets: 3,
  pendingApprovals: 8,
  recentUsers: [
    { id: "user-1", name: "John Smith", email: "john.smith@example.com", wallets: 2, status: "active", lastActive: "2023-12-15" },
    { id: "user-2", name: "Sarah Johnson", email: "sarah.j@example.com", wallets: 1, status: "active", lastActive: "2023-12-10" },
    { id: "user-3", name: "Michael Brown", email: "m.brown@example.com", wallets: 2, status: "active", lastActive: "2023-12-14" },
    { id: "user-4", name: "Emily Davis", email: "emily.d@example.com", wallets: 1, status: "inactive", lastActive: "2023-12-01" },
    { id: "user-5", name: "Robert Wilson", email: "r.wilson@example.com", wallets: 2, status: "active", lastActive: "2023-12-12" },
  ],
  pendingActions: [
    { id: "action-1", type: "wallet_approval", user: "Michael Brown", description: "New MPC wallet creation", requestedAt: "2023-12-14" },
    { id: "action-2", type: "large_withdrawal", user: "Sarah Johnson", description: "Withdrawal of $25,000", requestedAt: "2023-12-13" },
    { id: "action-3", type: "wallet_approval", user: "Robert Wilson", description: "New custodial wallet creation", requestedAt: "2023-12-12" },
    { id: "action-4", type: "security_alert", user: "Emily Davis", description: "Multiple failed login attempts", requestedAt: "2023-12-10" },
  ]
}

export default function AdminDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter users based on search query
  const filteredUsers = dashboardData.recentUsers.filter(user => {
    return searchQuery === "" || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Monitor and manage all user wallets and platform activities</p>
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
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalUsers}</div>
              <p className="text-xs text-muted-foreground">{dashboardData.activeUsers} active users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Wallets</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalWallets}</div>
              <p className="text-xs text-muted-foreground">Across {dashboardData.totalUsers} users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalAssets}</div>
              <p className="text-xs text-muted-foreground">All managed assets</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">Requires admin attention</p>
            </CardContent>
          </Card>
        </div>

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
              <div className="rounded-md border">
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
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/admin/wallets">
                  View All Users
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Actions requiring administrator approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
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
                    {dashboardData.pendingActions.map((action) => (
                      <TableRow key={action.id}>
                        <TableCell>
                          <Badge variant="outline">
                            {action.type === "wallet_approval" ? "Wallet" : 
                             action.type === "large_withdrawal" ? "Withdrawal" : 
                             action.type === "security_alert" ? "Security" : "Other"}
                          </Badge>
                        </TableCell>
                        <TableCell>{action.user}</TableCell>
                        <TableCell>{action.description}</TableCell>
                        <TableCell>{action.requestedAt}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">Approve</Button>
                            <Button variant="ghost" size="sm">Deny</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Approvals
              </Button>
            </CardFooter>
          </Card>
        </div>

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
                    <p className="text-xs text-muted-foreground">Manage user wallets and assign new wallets to users</p>
                  </CardContent>
                </Card>
              </Link>
              
              <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">User Management</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Add, edit, or deactivate user accounts</p>
                </CardContent>
              </Card>
              
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
      </div>
    </DashboardLayout>
  )
}