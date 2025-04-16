"use client"

import { useState, useMemo } from "react"
import { ChevronRight, Search } from "lucide-react"
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
  Tooltip,
  Legend,
} from "chart.js"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { DashboardLayout } from "@/components/dashboard-layout"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

// Mock data for simulation
const mockApiKeys = [
  { id: "1", name: "Production Key", key: "prod_abc123", created: "2025-04-10" },
  { id: "2", name: "Staging Key", key: "stage_def456", created: "2025-04-08" },
]

const mockWebhooks = [
  { id: "1", url: "https://api.example.com/webhook1", event: "transaction.created", created: "2025-04-12" },
  { id: "2", url: "https://api.example.com/webhook2", event: "user.updated", created: "2025-04-11" },
]

const mockApiLogs = [
  { id: "1", endpoint: "/v1/transactions", method: "GET", status: 200, timestamp: "2025-04-14T12:00:00Z" },
  { id: "2", endpoint: "/v1/users", method: "POST", status: 201, timestamp: "2025-04-14T12:01:00Z" },
]

export default function DeveloperConsolePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [apiRequests] = useState([
    { date: "2025-04-10", count: 120 },
    { date: "2025-04-11", count: 150 },
    { date: "2025-04-12", count: 200 },
    { date: "2025-04-13", count: 180 },
    { date: "2025-04-14", count: 220 },
  ])

  // Filter data based on search query
  const filteredApiKeys = useMemo(() => {
    return mockApiKeys.filter(
      (key) =>
        key.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        key.key.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const filteredWebhooks = useMemo(() => {
    return mockWebhooks.filter(
      (webhook) =>
        webhook.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        webhook.event.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const filteredApiLogs = useMemo(() => {
    return mockApiLogs.filter(
      (log) =>
        log.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.method.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  // Chart data for API requests (Bar Chart)
  const barChartData = {
    labels: apiRequests.map((req) => req.date.split("-").slice(1).join("-")),
    datasets: [
      {
        label: "API Requests",
        data: apiRequests.map((req) => req.count),
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
        data: [60, 30, 10],
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

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
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
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
              Developer Console
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Manage your API keys, webhooks, and monitor API usage with Ryzer Wallet.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-purple-600 text-purple-600 hover:bg-purple-50 transition-colors focus:ring-2 focus:ring-purple-600"
            aria-label="View API documentation"
          >
            View Documentation
          </Button>
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
                              This Month
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="grid grid-cols-2 gap-6">
                            <div className="flex items-center gap-4">
                              <Image
                                src="/placeholder.svg?height=48&width=48&query=api"
                                alt="API Requests"
                                width={48}
                                height={48}
                                className="rounded-full"
                              />
                              <div>
                                <div className="text-3xl font-bold text-gray-900">
                                  {apiRequests.reduce((sum, req) => sum + req.count, 0)}
                                </div>
                                <div className="text-sm text-gray-600">Total API Requests</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Image
                                src="/placeholder.svg?height=48&width=48&query=error"
                                alt="Errors"
                                width={48}
                                height={48}
                                className="rounded-full"
                              />
                              <div>
                                <div className="text-3xl font-bold text-gray-900">2</div>
                                <div className="text-sm text-gray-600">Total Errors</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.4 }}
                      >
                        <Card className="bg-white hover:shadow-lg transition-shadow rounded-lg">
                          <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-semibold text-gray-900">
                              Recent Errors
                            </CardTitle>
                            <Button
                              variant="link"
                              size="sm"
                              className="text-sm text-purple-600 hover:text-purple-700"
                              aria-label="View more errors"
                            >
                              More <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="text-sm text-gray-600">
                              404 - /v1/invalid - 2025-04-14
                            </div>
                            <div className="text-sm text-gray-600">
                              500 - /v1/server - 2025-04-13
                            </div>
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
                            API Requests
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex gap-2 mb-6">
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
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 text-gray-600 hover:text-purple-600 focus:ring-2 focus:ring-purple-600"
                              aria-label="View monthly API requests"
                            >
                              Monthly
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
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 text-gray-600 hover:text-purple-600 focus:ring-2 focus:ring-purple-600"
                                aria-label="View monthly distribution"
                              >
                                Monthly
                              </Button>
                              <div className="ml-auto">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-9 border-gray-300 text-gray-600 hover:bg-gray-100 focus:ring-2 focus:ring-purple-600"
                                  aria-label="Filter by method"
                                >
                                  By Method
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="ml-2"
                                  >
                                    <path d="m6 9 6 6 6-6" />
                                  </svg>
                                </Button>
                              </div>
                            </div>
                            <div className="h-[250px] w-full">
                              <Chart
                                type="doughnut"
                                data={doughnutChartData}
                                
                              />
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
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 text-gray-600 hover:text-purple-600 focus:ring-2 focus:ring-purple-600"
                                aria-label="View monthly endpoints"
                              >
                                Monthly
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
                        <div className="relative w-full max-w-md">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <Input
                            type="search"
                            placeholder="Search by key name or related keyword"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-lg border-gray-300 bg-white text-gray-900 pl-12 pr-4 py-3 text-base focus:border-purple-600 focus:ring-2 focus:ring-purple-600"
                            aria-label="Search API keys"
                          />
                        </div>
                        <Button
                          className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-6 py-3 focus:ring-2 focus:ring-purple-600"
                          aria-label="Create new API key"
                        >
                          Create API Key
                        </Button>
                      </div>
                      <AnimatePresence>
                        {filteredApiKeys.length > 0 ? (
                          <motion.ul
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-3"
                          >
                            {filteredApiKeys.map((key) => (
                              <motion.li
                                key={key.id}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                className="p-5 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="text-base font-medium text-gray-900">
                                      {key.name}
                                    </div>
                                    <div className="text-sm text-gray-600">{key.key}</div>
                                  </div>
                                  <div className="text-sm text-gray-500">{key.created}</div>
                                </div>
                              </motion.li>
                            ))}
                          </motion.ul>
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
                        <div className="relative w-full max-w-md">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <Input
                            type="search"
                            placeholder="Search by webhook URL or event"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-lg border-gray-300 bg-white text-gray-900 pl-12 pr-4 py-3 text-base focus:border-purple-600 focus:ring-2 focus:ring-purple-600"
                            aria-label="Search webhooks"
                          />
                        </div>
                        <Button
                          className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-6 py-3 focus:ring-2 focus:ring-purple-600"
                          aria-label="Create new webhook"
                        >
                          Create Webhook
                        </Button>
                      </div>
                      <AnimatePresence>
                        {filteredWebhooks.length > 0 ? (
                          <motion.ul
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-3"
                          >
                            {filteredWebhooks.map((webhook) => (
                              <motion.li
                                key={webhook.id}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                className="p-5 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="text-base font-medium text-gray-900">
                                      {webhook.url}
                                    </div>
                                    <div className="text-sm text-gray-600">{webhook.event}</div>
                                  </div>
                                  <div className="text-sm text-gray-500">{webhook.created}</div>
                                </div>
                              </motion.li>
                            ))}
                          </motion.ul>
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
                        <div className="relative w-full max-w-md">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <Input
                            type="search"
                            placeholder="Search API logs"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-lg border-gray-300 bg-white text-gray-900 pl-12 pr-4 py-3 text-base focus:border-purple-600 focus:ring-2 focus:ring-purple-600"
                            aria-label="Search API logs"
                          />
                        </div>
                        <Button
                          variant="outline"
                          className="border-gray-300 text-gray-600 hover:bg-gray-100 rounded-lg px-6 py-3 focus:ring-2 focus:ring-purple-600"
                          aria-label="Export API logs"
                        >
                          Export
                        </Button>
                      </div>
                      <AnimatePresence>
                        {filteredApiLogs.length > 0 ? (
                          <motion.ul
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-3"
                          >
                            {filteredApiLogs.map((log) => (
                              <motion.li
                                key={log.id}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                className="p-5 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="text-base font-medium text-gray-900">
                                      {log.endpoint}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {log.method} - {log.status}
                                    </div>
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {new Date(log.timestamp).toLocaleString()}
                                  </div>
                                </div>
                              </motion.li>
                            ))}
                          </motion.ul>
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
                        <div className="relative w-full max-w-md">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <Input
                            type="search"
                            placeholder="Search webhook events"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-lg border-gray-300 bg-white text-gray-900 pl-12 pr-4 py-3 text-base focus:border-purple-600 focus:ring-2 focus:ring-purple-600"
                            aria-label="Search webhook events"
                          />
                        </div>
                        <Button
                          variant="outline"
                          className="border-gray-300 text-gray-600 hover:bg-gray-100 rounded-lg px-6 py-3 focus:ring-2 focus:ring-purple-600"
                          aria-label="Export webhook events"
                        >
                          Export
                        </Button>
                      </div>
                      <div className="flex flex-col items-center justify-center py-16 text-gray-600">
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
                          Webhook events are notifications sent to your specified endpoints when
                          specific events occur in your Ryzer Wallet account.
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Developer Resources Section */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Developer Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Quick Start",
                description:
                  "Get up and running with Ryzer Wallet APIs in minutes with our step-by-step guide.",
                linkText: "Start Now",
                ariaLabel: "Go to Quick Start guide",
              },
              {
                title: "API Reference",
                description:
                  "Explore detailed documentation for all Ryzer Wallet API endpoints and parameters.",
                linkText: "View Docs",
                ariaLabel: "Go to API Reference",
              },
              {
                title: "SDKs",
                description:
                  "Integrate faster with Ryzer Wallet SDKs for JavaScript, Python, and more.",
                linkText: "Download SDKs",
                ariaLabel: "Go to SDKs",
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