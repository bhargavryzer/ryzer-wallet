"use client"

import { useState, useMemo } from "react"
import { ChevronRight, Search, Check, X, Copy, Trash, Edit, Shield } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Chart } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Legend,
} from "chart.js"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title,  Legend)

// Interfaces
interface ApiKey {
  id: string
  name: string
  key: string
  status: "active" | "pending" | "revoked"
  created: string
  userId: string
  userName: string
  userEmail: string
}

interface Webhook {
  id: string
  url: string
  event: string
  status: "active" | "pending" | "disabled"
  created: string
  userId: string
  userName: string
  userEmail: string
}

interface ApiLog {
  id: string
  endpoint: string
  method: string
  status: number
  timestamp: string
  userId: string
  userName: string
  userEmail: string
}

interface User {
  id: string
  name: string
  email: string
}

interface ApiRequest {
  date: string
  count: number
  userId: string
}

// Mock data
const users: User[] = [
  { id: "all", name: "All Users", email: "" },
  { id: "user-1", name: "John Smith", email: "john.smith@example.com" },
  { id: "user-2", name: "Sarah Johnson", email: "sarah.j@example.com" },
  { id: "user-3", name: "Michael Brown", email: "m.brown@example.com" },
]

const mockApiKeys: ApiKey[] = [
  {
    id: "1",
    name: "Production Key",
    key: "prod_abc123",
    status: "active",
    created: "2025-04-10",
    userId: "user-1",
    userName: "John Smith",
    userEmail: "john.smith@example.com",
  },
  {
    id: "2",
    name: "Staging Key",
    key: "stage_def456",
    status: "pending",
    created: "2025-04-08",
    userId: "user-2",
    userName: "Sarah Johnson",
    userEmail: "sarah.j@example.com",
  },
]

const mockWebhooks: Webhook[] = [
  {
    id: "1",
    url: "https://api.example.com/webhook1",
    event: "transaction.created",
    status: "active",
    created: "2025-04-12",
    userId: "user-1",
    userName: "John Smith",
    userEmail: "john.smith@example.com",
  },
  {
    id: "2",
    url: "https://api.example.com/webhook2",
    event: "user.updated",
    status: "pending",
    created: "2025-04-11",
    userId: "user-3",
    userName: "Michael Brown",
    userEmail: "m.brown@example.com",
  },
]

const mockApiLogs: ApiLog[] = [
  {
    id: "1",
    endpoint: "/v1/transactions",
    method: "GET",
    status: 200,
    timestamp: "2025-04-14T12:00:00Z",
    userId: "user-1",
    userName: "John Smith",
    userEmail: "john.smith@example.com",
  },
  {
    id: "2",
    endpoint: "/v1/users",
    method: "POST",
    status: 201,
    timestamp: "2025-04-14T12:01:00Z",
    userId: "user-2",
    userName: "Sarah Johnson",
    userEmail: "sarah.j@example.com",
  },
]

const mockApiRequests: ApiRequest[] = [
  { date: "2025-04-10", count: 120, userId: "user-1" },
  { date: "2025-04-11", count: 150, userId: "user-1" },
  { date: "2025-04-12", count: 200, userId: "user-2" },
  { date: "2025-04-13", count: 180, userId: "user-2" },
  { date: "2025-04-14", count: 220, userId: "user-3" },
]

export default function AdminDeveloperConsolePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<string>("all")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showCreateKeyDialog, setShowCreateKeyDialog] = useState(false)
  const [showApproveWebhookDialog, setShowApproveWebhookDialog] = useState(false)
  const [webhookToApprove, setWebhookToApprove] = useState<Webhook | null>(null)
  const [newKeyName, setNewKeyName] = useState("")
  const [assignToUser, setAssignToUser] = useState<string>("user-1")

  // Filter data
  const filteredApiKeys = useMemo(() => {
    return mockApiKeys.filter(
      (key) =>
        (key.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          key.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
          key.userName.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedUser === "all" || key.userId === selectedUser)
    )
  }, [searchQuery, selectedUser])

  const filteredWebhooks = useMemo(() => {
    return mockWebhooks.filter(
      (webhook) =>
        (webhook.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
          webhook.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
          webhook.userName.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedUser === "all" || webhook.userId === selectedUser)
    )
  }, [searchQuery, selectedUser])

  const filteredApiLogs = useMemo(() => {
    return mockApiLogs.filter(
      (log) =>
        (log.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.userName.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedUser === "all" || log.userId === selectedUser)
    )
  }, [searchQuery, selectedUser])

  // Chart data for API requests (Bar Chart)
  const barChartData = {
    labels: mockApiRequests
      .filter((req) => selectedUser === "all" || req.userId === selectedUser)
      .map((req) => req.date.split("-").slice(1).join("-"))
      .filter((value, index, self) => self.indexOf(value) === index),
    datasets: [
      {
        label: "API Requests",
        data: mockApiRequests
          .filter((req) => selectedUser === "all" || req.userId === selectedUser)
          .reduce((acc, req) => {
            const date = req.date.split("-").slice(1).join("-")
            const index = acc.findIndex((item) => item.date === date)
            if (index === -1) {
              acc.push({ date, count: req.count })
            } else {
              acc[index].count += req.count
            }
            return acc
          }, [] as { date: string; count: number }[])
          .map((item) => item.count),
        backgroundColor: "rgba(147, 51, 234, 0.6)",
        borderColor: "rgba(147, 51, 234, 1)",
        borderWidth: 1,
      },
    ],
  }

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: "#1f2937", titleFont: { size: 14 }, bodyFont: { size: 12 } },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Requests", font: { size: 14 } } },
      x: { title: { display: true, text: "Date", font: { size: 14 } } },
    },
  }

  // Chart data for API request distribution (Doughnut Chart)
  const doughnutChartData = {
    labels: ["GET", "POST", "PUT"],
    datasets: [
      {
        data: filteredApiLogs.reduce(
          (acc, log) => {
            if (log.method === "GET") acc[0] += 1
            if (log.method === "POST") acc[1] += 1
            if (log.method === "PUT") acc[2] += 1
            return acc
          },
          [0, 0, 0]
        ),
        backgroundColor: [
          "rgba(147, 51, 234, 0.6)",
          "rgba(216, 180, 254, 0.6)",
          "rgba(243, 232, 255, 0.6)",
        ],
        borderColor: ["rgba(147, 51, 234, 1)", "rgba(216, 180, 254, 1)", "rgba(243, 232, 255, 1)"],
        borderWidth: 1,
      },
    ],
  }

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", labels: { font: { size: 12 } } },
      tooltip: { backgroundColor: "#1f2937", titleFont: { size: 14 }, bodyFont: { size: 12 } },
    },
  }

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  // Handlers
  const handleSelectAllItems = (checked: boolean, items: any[]) => {
    if (checked) {
      setSelectedItems(items.map((item) => item.id))
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

  const handleBulkRevokeKeys = () => {
    console.log("Revoking API keys:", selectedItems)
    setSelectedItems([])
  }

  const handleBulkDeleteWebhooks = () => {
    console.log("Deleting webhooks:", selectedItems)
    setSelectedItems([])
  }

  const handleCreateKey = () => {
    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name: newKeyName || "New API Key",
      key: `api_${Math.random().toString(36).slice(2, 10)}`,
      status: "pending",
      created: new Date().toISOString().split("T")[0],
      userId: assignToUser,
      userName: users.find((u) => u.id === assignToUser)?.name || "Unknown",
      userEmail: users.find((u) => u.id === assignToUser)?.email || "unknown@example.com",
    }
    console.log("Creating API key:", newKey)
    setShowCreateKeyDialog(false)
    setNewKeyName("")
    setAssignToUser("user-1")
  }

  const handleApproveWebhook = () => {
    if (webhookToApprove) {
      console.log("Approving webhook:", webhookToApprove.id)
    }
    setShowApproveWebhookDialog(false)
    setWebhookToApprove(null)
  }

  const handleRejectWebhook = () => {
    if (webhookToApprove) {
      console.log("Rejecting webhook:", webhookToApprove.id)
    }
    setShowApproveWebhookDialog(false)
    setWebhookToApprove(null)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6 min-h-screen bg-background">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                Admin: Developer Console
              </h1>
              <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">Admin</span>
            </div>
            <p className="mt-2 text-lg text-gray-600">
              Manage API keys, webhooks, and monitor platform-wide API usage for Ryzer Wallet.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-purple-600 text-purple-600 hover:bg-purple-50 transition-colors focus:ring-2 focus:ring-purple-600"
            aria-label="View admin API documentation"
          >
            View Admin Documentation
          </Button>
        </motion.div>

        {/* Summary Card */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
          <Card className="bg-white border-gray-200 shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Platform Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-4">
                <Image
                  src="/placeholder.svg?height=48&width=48&query=keys"
                  alt="API Keys"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <div className="text-3xl font-bold text-gray-900">{mockApiKeys.length}</div>
                  <div className="text-sm text-gray-600">Total API Keys</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Image
                  src="/placeholder.svg?height=48&width=48&query=webhooks"
                  alt="Webhooks"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <div className="text-3xl font-bold text-gray-900">{mockWebhooks.length}</div>
                  <div className="text-sm text-gray-600">Total Webhooks</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Image
                  src="/placeholder.svg?height=48&width=48&query=users"
                  alt="Users"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <div className="text-3xl font-bold text-gray-900">{new Set(mockApiKeys.map((k) => k.userId)).size}</div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Image
                  src="/placeholder.svg?height=48&width=48&query=requests"
                  alt="Requests"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {mockApiRequests.reduce((sum, req) => sum + req.count, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Requests</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1">
          <motion.div variants={cardVariants} initial="hidden" animate="visible">
            <Card className="bg-white border-gray-200 shadow-lg rounded-xl">
              <CardHeader className="border-b border-gray-200 p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-5 h-auto p-0 bg-transparent">
                    {["overview", "api-keys", "webhooks", "api-logs", "webhook-events"].map(
                      (tab) => (
                        <TabsTrigger
                          key={tab}
                          value={tab}
                          className="data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:font-semibold rounded-none py-4 text-gray-600 hover:text-purple-600 capitalize transition-all focus:ring-2 focus:ring-purple-600"
                        >
                          {tab.replace("-", " ")}
                        </TabsTrigger>
                      )
                    )}
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="p-8">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  {/* Overview Tab */}
                  <TabsContent value="overview" className="mt-0 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.3 }}
                      >
                        <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow rounded-lg">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-semibold text-gray-900">
                              Recent Errors
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="text-sm text-gray-600">
                              404 - /v1/invalid - 2025-04-14 (John Smith)
                            </div>
                            <div className="text-sm text-gray-600">
                              500 - /v1/server - 2025-04-13 (Sarah Johnson)
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button
                              variant="link"
                              size="sm"
                              className="text-sm text-purple-600 hover:text-purple-700"
                              aria-label="View more errors"
                            >
                              More <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>

                      <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.4 }}
                      >
                        <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow rounded-lg">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-semibold text-gray-900">
                              Top Users by Requests
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {users
                              .filter((u) => u.id !== "all")
                              .map((user, index) => (
                                <div key={user.id} className="flex justify-between text-sm text-gray-600">
                                  <span>{user.name}</span>
                                  <span className="font-medium">
                                    {mockApiRequests
                                      .filter((req) => req.userId === user.id)
                                      .reduce((sum, req) => sum + req.count, 0)} requests
                                  </span>
                                </div>
                              ))}
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>

                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.5 }}
                    >
                      <Card className="bg-white hover:shadow-lg transition-shadow rounded-lg">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg font-semibold text-gray-900">
                            Platform API Requests
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex gap-2 mb-6">
                            <Select value={selectedUser} onValueChange={setSelectedUser}>
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by user" />
                              </SelectTrigger>
                              <SelectContent>
                                {users.map((user) => (
                                  <SelectItem key={user.id} value={user.id}>
                                    {user.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              className="h-9 bg-purple-600 hover:bg-purple-700 text-white focus:ring-2 focus:ring-purple-600"
                              aria-label="View daily API requests"
                            >
                              Daily
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 text-gray-600 hover:text-purple-600 focus:ring-2 focus:ring-purple-600"
                              aria-label="View weekly API requests"
                            >
                              Weekly
                            </Button>
                          </div>
                          <div className="h-[350px] w-full">
                            <Chart type="bar" data={barChartData} options={barChartOptions} />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.6 }}
                      >
                        <Card className="bg-white hover:shadow-lg transition-shadow rounded-lg">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-semibold text-gray-900">
                              API Request Distribution
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex gap-2 mb-6">
                              <Button
                                size="sm"
                                className="h-9 bg-purple-600 hover:bg-purple-700 text-white focus:ring-2 focus:ring-purple-600"
                                aria-label="View daily distribution"
                              >
                                Daily
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 text-gray-600 hover:text-purple-600 focus:ring-2 focus:ring-purple-600"
                                aria-label="View weekly distribution"
                              >
                                Weekly
                              </Button>
                            </div>
                            <div className="h-[250px] w-full">
                              <Chart type="doughnut" data={doughnutChartData}  />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.7 }}
                      >
                        <Card className="bg-white hover:shadow-lg transition-shadow rounded-lg">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-semibold text-gray-900">
                              Top 5 API Endpoints
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex gap-2 mb-6">
                              <Button
                                size="sm"
                                className="h-9 bg-purple-600 hover:bg-purple-700 text-white focus:ring-2 focus:ring-purple-600"
                                aria-label="View daily endpoints"
                              >
                                Daily
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 text-gray-600 hover:text-purple-600 focus:ring-2 focus:ring-purple-600"
                                aria-label="View weekly endpoints"
                              >
                                Weekly
                              </Button>
                            </div>
                            <ul className="space-y-3 text-sm text-gray-600">
                              <li className="flex justify-between">
                                <span>/v1/transactions</span>
                                <span className="font-medium">320 requests</span>
                              </li>
                              <li className="flex justify-between">
                                <span>/v1/users</span>
                                <span className="font-medium">200 requests</span>
                              </li>
                              <li className="flex justify-between">
                                <span>/v1/wallets</span>
                                <span className="font-medium">150 requests</span>
                              </li>
                              <li className="flex justify-between">
                                <span>/v1/balances</span>
                                <span className="font-medium">100 requests</span>
                              </li>
                              <li className="flex justify-between">
                                <span>/v1/auth</span>
                                <span className="font-medium">80 requests</span>
                              </li>
                            </ul>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                  </TabsContent>

                  {/* API Keys Tab */}
                  <TabsContent value="api-keys" className="mt-0">
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <Input
                              type="search"
                              placeholder="Search by key name or user"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full pl-12"
                              aria-label="Search API keys"
                            />
                          </div>
                          <Select value={selectedUser} onValueChange={setSelectedUser}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Filter by user" />
                            </SelectTrigger>
                            <SelectContent>
                              {users.map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                          onClick={() => setShowCreateKeyDialog(true)}
                          aria-label="Create new API key"
                        >
                          Create API Key
                        </Button>
                      </div>
                      {selectedItems.length > 0 && (
                        <div className="flex items-center justify-between bg-muted p-4 rounded-md">
                          <div className="text-sm">
                            <span className="font-medium">{selectedItems.length}</span> key(s) selected
                          </div>
                          <Button size="sm" variant="destructive" onClick={handleBulkRevokeKeys}>
                            Revoke Selected
                          </Button>
                        </div>
                      )}
                      <AnimatePresence>
                        {filteredApiKeys.length > 0 ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="overflow-x-auto rounded-md border"
                          >
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-12">
                                    <Checkbox
                                      checked={filteredApiKeys.length > 0 && selectedItems.length === filteredApiKeys.length}
                                      onCheckedChange={(checked) => handleSelectAllItems(checked === true, filteredApiKeys)}
                                      aria-label="Select all API keys"
                                    />
                                  </TableHead>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Key</TableHead>
                                  <TableHead>User</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Created</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredApiKeys.map((key) => (
                                  <TableRow key={key.id}>
                                    <TableCell>
                                      <Checkbox
                                        checked={selectedItems.includes(key.id)}
                                        onCheckedChange={(checked) => handleSelectItem(key.id, !!checked)}
                                        aria-label={`Select API key ${key.name}`}
                                      />
                                    </TableCell>
                                    <TableCell>{key.name}</TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <span className="font-mono">{key.key}</span>
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => copyToClipboard(key.key)}
                                              >
                                                <Copy className="h-4 w-4" />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Copy key</TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="space-y-1">
                                        <Link href={`/admin/users/${key.userId}`} className="font-medium hover:underline">
                                          {key.userName}
                                        </Link>
                                        <div className="text-sm text-muted-foreground">{key.userEmail}</div>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Badge
                                        variant={
                                          key.status === "active"
                                            ? "default"
                                            : key.status === "pending"
                                            ? "secondary"
                                            : "destructive"
                                        }
                                      >
                                        {key.status.charAt(0).toUpperCase() + key.status.slice(1)}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>{key.created}</TableCell>
                                    <TableCell>
                                      <div className="flex gap-2">
                                        {key.status === "pending" ? (
                                          <>
                                            <TooltipProvider>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => console.log("Approve key:", key.id)}
                                                  >
                                                    <Check className="h-4 w-4" />
                                                  </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Approve key</TooltipContent>
                                              </Tooltip>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => console.log("Reject key:", key.id)}
                                                  >
                                                    <X className="h-4 w-4" />
                                                  </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Reject key</TooltipContent>
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
                                                    onClick={() => console.log("Revoke key:", key.id)}
                                                  >
                                                    <Trash className="h-4 w-4" />
                                                  </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Revoke key</TooltipContent>
                                              </Tooltip>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <Link href={`/admin/api-keys/${key.id}`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                      <Edit className="h-4 w-4" />
                                                    </Button>
                                                  </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>Edit key</TooltipContent>
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
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-16 text-gray-600"
                          >
                            <Image
                              src="/placeholder.svg?height=80&width=80&query=no data"
                              alt="No Data"
                              width={80}
                              height={80}
                              className="opacity-70"
                            />
                            <div className="mt-4 text-base font-medium">
                              No API Keys Found
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </TabsContent>

                  {/* Webhooks Tab */}
                  <TabsContent value="webhooks" className="mt-0">
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <Input
                              type="search"
                              placeholder="Search by URL, event, or user"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full pl-12"
                              aria-label="Search webhooks"
                            />
                          </div>
                          <Select value={selectedUser} onValueChange={setSelectedUser}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Filter by user" />
                            </SelectTrigger>
                            <SelectContent>
                              {users.map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                          onClick={() => console.log("Create webhook")}
                          aria-label="Create new webhook"
                        >
                          Create Webhook
                        </Button>
                      </div>
                      {selectedItems.length > 0 && (
                        <div className="flex items-center justify-between bg-muted p-4 rounded-md">
                          <div className="text-sm">
                            <span className="font-medium">{selectedItems.length}</span> webhook(s) selected
                          </div>
                          <Button size="sm" variant="destructive" onClick={handleBulkDeleteWebhooks}>
                            Delete Selected
                          </Button>
                        </div>
                      )}
                      <AnimatePresence>
                        {filteredWebhooks.length > 0 ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="overflow-x-auto rounded-md border"
                          >
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-12">
                                    <Checkbox
                                      checked={filteredWebhooks.length > 0 && selectedItems.length === filteredWebhooks.length}
                                      onCheckedChange={(checked) => handleSelectAllItems(checked === true, filteredWebhooks)}
                                      aria-label="Select all webhooks"
                                    />
                                  </TableHead>
                                  <TableHead>URL</TableHead>
                                  <TableHead>Event</TableHead>
                                  <TableHead>User</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Created</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredWebhooks.map((webhook) => (
                                  <TableRow key={webhook.id}>
                                    <TableCell>
                                      <Checkbox
                                        checked={selectedItems.includes(webhook.id)}
                                        onCheckedChange={(checked) => handleSelectItem(webhook.id, !!checked)}
                                        aria-label={`Select webhook ${webhook.url}`}
                                      />
                                    </TableCell>
                                    <TableCell>{webhook.url}</TableCell>
                                    <TableCell>{webhook.event}</TableCell>
                                    <TableCell>
                                      <div className="space-y-1">
                                        <Link href={`/admin/users/${webhook.userId}`} className="font-medium hover:underline">
                                          {webhook.userName}
                                        </Link>
                                        <div className="text-sm text-muted-foreground">{webhook.userEmail}</div>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Badge
                                        variant={
                                          webhook.status === "active"
                                            ? "default"
                                            : webhook.status === "pending"
                                            ? "secondary"
                                            : "destructive"
                                        }
                                      >
                                        {webhook.status.charAt(0).toUpperCase() + webhook.status.slice(1)}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>{webhook.created}</TableCell>
                                    <TableCell>
                                      <div className="flex gap-2">
                                        {webhook.status === "pending" ? (
                                          <>
                                            <TooltipProvider>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => {
                                                      setWebhookToApprove(webhook)
                                                      setShowApproveWebhookDialog(true)
                                                    }}
                                                  >
                                                    <Check className="h-4 w-4" />
                                                  </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Approve webhook</TooltipContent>
                                              </Tooltip>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => {
                                                      setWebhookToApprove(webhook)
                                                      setShowApproveWebhookDialog(true)
                                                    }}
                                                  >
                                                    <X className="h-4 w-4" />
                                                  </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Reject webhook</TooltipContent>
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
                                                      webhook.status === "active"
                                                        ? console.log("Disable webhook:", webhook.id)
                                                        : console.log("Enable webhook:", webhook.id)
                                                    }
                                                  >
                                                    <Shield className="h-4 w-4" />
                                                  </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                  {webhook.status === "active" ? "Disable webhook" : "Enable webhook"}
                                                </TooltipContent>
                                              </Tooltip>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <Link href={`/admin/webhooks/${webhook.id}`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                      <Edit className="h-4 w-4" />
                                                    </Button>
                                                  </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>Edit webhook</TooltipContent>
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
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-16 text-gray-600"
                          >
                            <Image
                              src="/placeholder.svg?height=80&width=80&query=no data"
                              alt="No Data"
                              width={80}
                              height={80}
                              className="opacity-70"
                            />
                            <div className="mt-4 text-base font-medium">
                              No Webhooks Found
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </TabsContent>

                  {/* API Logs Tab */}
                  <TabsContent value="api-logs" className="mt-0">
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <Input
                              type="search"
                              placeholder="Search by endpoint, method, or user"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full pl-12"
                              aria-label="Search API logs"
                            />
                          </div>
                          <Select value={selectedUser} onValueChange={setSelectedUser}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Filter by user" />
                            </SelectTrigger>
                            <SelectContent>
                              {users.map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          variant="outline"
                          className="border-gray-300 text-gray-600 hover:bg-gray-100"
                          aria-label="Export API logs"
                        >
                          Export
                        </Button>
                      </div>
                      <AnimatePresence>
                        {filteredApiLogs.length > 0 ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="overflow-x-auto rounded-md border"
                          >
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Endpoint</TableHead>
                                  <TableHead>Method</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>User</TableHead>
                                  <TableHead>Timestamp</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredApiLogs.map((log) => (
                                  <TableRow key={log.id}>
                                    <TableCell>{log.endpoint}</TableCell>
                                    <TableCell>{log.method}</TableCell>
                                    <TableCell>{log.status}</TableCell>
                                    <TableCell>
                                      <div className="space-y-1">
                                        <Link href={`/admin/users/${log.userId}`} className="font-medium hover:underline">
                                          {log.userName}
                                        </Link>
                                        <div className="text-sm text-muted-foreground">{log.userEmail}</div>
                                      </div>
                                    </TableCell>
                                    <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-16 text-gray-600"
                          >
                            <Image
                              src="/placeholder.svg?height=80&width=80&query=no data"
                              alt="No Data"
                              width={80}
                              height={80}
                              className="opacity-70"
                            />
                            <div className="mt-4 text-base font-medium">
                              No API Logs Found
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </TabsContent>

                  {/* Webhook Events Tab */}
                  <TabsContent value="webhook-events" className="mt-0">
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <Input
                              type="search"
                              placeholder="Search webhook events or user"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full pl-12"
                              aria-label="Search webhook events"
                            />
                          </div>
                          <Select value={selectedUser} onValueChange={setSelectedUser}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Filter by user" />
                            </SelectTrigger>
                            <SelectContent>
                              {users.map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          variant="outline"
                          className="border-gray-300 text-gray-600 hover:bg-gray-100"
                          aria-label="Export webhook events"
                        >
                          Export
                        </Button>
                      </div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-16 text-gray-600"
                      >
                        <Image
                          src="/placeholder.svg?height=80&width=80&query=no data"
                          alt="No Data"
                          width={80}
                          height={80}
                          className="opacity-70"
                        />
                        <div className="mt-4 text-base font-medium">
                          No Webhook Events Found
                        </div>
                        <div className="mt-2 text-sm max-w-lg text-center">
                          Webhook events are notifications sent to specified endpoints when specific events occur across Ryzer Wallet accounts.
                        </div>
                      </motion.div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Dialogs */}
        <Dialog open={showCreateKeyDialog} onOpenChange={setShowCreateKeyDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Create API Key</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="key-name">Key Name</Label>
                <Input
                  id="key-name"
                  placeholder="Enter key name"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user">Assign to User</Label>
                <Select value={assignToUser} onValueChange={setAssignToUser}>
                  <SelectTrigger id="user" className="h-10">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.filter((u) => u.id !== "all").map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground">
                The API key will be created in pending status and requires approval.
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateKeyDialog(false)
                  setNewKeyName("")
                  setAssignToUser("user-1")
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateKey} disabled={!newKeyName || !assignToUser}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showApproveWebhookDialog} onOpenChange={setShowApproveWebhookDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve Webhook</DialogTitle>
              <DialogDescription>
                Review and approve or reject the webhook configuration.
              </DialogDescription>
            </DialogHeader>
            {webhookToApprove && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <span className="font-medium">URL:</span> {webhookToApprove.url}
                </div>
                <div className="grid gap-2">
                  <span className="font-medium">Event:</span> {webhookToApprove.event}
                </div>
                <div className="grid gap-2">
                  <span className="font-medium">User:</span>{" "}
                  <Link href={`/admin/users/${webhookToApprove.userId}`} className="hover:underline">
                    {webhookToApprove.userName}
                  </Link> ({webhookToApprove.userEmail})
                </div>
                <div className="grid gap-2">
                  <span className="font-medium">Created:</span> {webhookToApprove.created}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowApproveWebhookDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleRejectWebhook}>
                Reject
              </Button>
              <Button onClick={handleApproveWebhook}>Approve</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Admin Resources Section */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Admin Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Admin Guide",
                description:
                  "Learn how to manage API keys, webhooks, and monitor platform usage with our admin guide.",
                linkText: "Start Now",
                ariaLabel: "Go to Admin Guide",
              },
              {
                title: "API Management",
                description:
                  "Detailed documentation for managing Ryzer Wallet API keys and webhooks.",
                linkText: "View Docs",
                ariaLabel: "Go to API Management",
              },
              {
                title: "Security Best Practices",
                description:
                  "Ensure secure API usage with our recommended security practices for admins.",
                linkText: "Learn More",
                ariaLabel: "Go to Security Best Practices",
              },
            ].map((resource, index) => (
              <motion.div
                key={resource.title}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow rounded-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-semibold text-gray-900">
                      {resource.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                    <Button
                      variant="link"
                      className="text-purple-600 hover:text-purple-700 p-0 font-medium focus:ring-2 focus:ring-purple-600"
                      aria-label={resource.ariaLabel}
                    >
                      {resource.linkText} <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}