"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function DeveloperConsolePage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Developer Console</h1>
            <p className="text-muted-foreground">Manage your API keys, webhooks, and monitor API usage</p>
          </div>
        </div>

        {/* What is Cobo Wallet-as-a-Service (WaaS) 2.0? */}
        <Card className="bg-muted/20 border">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <div className="mt-1 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/>
                  <path d="M12 8h.01"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium">What is Cobo Wallet-as-a-Service (WaaS) 2.0?</h3>
                <p className="text-xs text-muted-foreground mt-1">Integrate Cobo's full suite of crypto wallet technologies with powerful access controls.</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button variant="outline" size="sm" className="h-7 text-xs rounded-md">
                    Help Topics
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs rounded-md">
                    Get Started with Cobo CLI
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs rounded-md">
                    Use Cobo's TSS Node or Build Your Own
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs rounded-md">
                    Developer Resources
                  </Button>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/>
                  <path d="m6 6 12 12"/>
                </svg>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-64 space-y-4">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-lg">WaaS 2.0</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <div className="flex-1">
            <Card>
              <CardHeader className="border-b p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-6 h-auto p-0 bg-transparent">
                    <TabsTrigger
                      value="overview"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none py-3"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="api-keys"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none py-3"
                    >
                      API Keys
                    </TabsTrigger>
                    <TabsTrigger
                      value="webhooks"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none py-3"
                    >
                      Webhooks
                    </TabsTrigger>
                    <TabsTrigger
                      value="api-logs"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none py-3"
                    >
                      API Logs
                    </TabsTrigger>
                    <TabsTrigger
                      value="webhook-events"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none py-3"
                    >
                      Webhook Events
                    </TabsTrigger>
                    <TabsTrigger
                      value="callback-messages"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none py-3"
                    >
                      Callback Messages
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsContent value="overview" className="mt-0 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                      >
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">This Month</CardTitle>
                          </CardHeader>
                          <CardContent className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                              <Image
                                src="/placeholder.svg?height=40&width=40&query=api"
                                alt="API Requests"
                                width={40}
                                height={40}
                              />
                              <div>
                                <div className="text-2xl font-bold">0</div>
                                <div className="text-xs text-muted-foreground">Total API Requests</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Image
                                src="/placeholder.svg?height=40&width=40&query=error"
                                alt="Errors"
                                width={40}
                                height={40}
                              />
                              <div>
                                <div className="text-2xl font-bold">0</div>
                                <div className="text-xs text-muted-foreground">Total Errors</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                      >
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Recent Errors</CardTitle>
                            <Button variant="link" size="sm" className="text-xs">
                              More <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                          </CardHeader>
                          <CardContent className="flex flex-col items-center justify-center py-8">
                            <Image
                              src="/placeholder.svg?height=60&width=60&query=no data"
                              alt="No Data"
                              width={60}
                              height={60}
                            />
                            <div className="mt-4 text-sm text-muted-foreground">No Data to Display</div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                    >
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">API Requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex gap-2 mb-4">
                            <Button variant="default" size="sm" className="h-8 text-xs">
                              Daily
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 text-xs">
                              Weekly
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 text-xs">
                              Monthly
                            </Button>
                          </div>

                          <div className="h-[300px] flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground mb-2">No API requests data available</div>
                              <div className="text-xs text-muted-foreground">
                                Note: Data is calculated at 2025-04-14 14:00:00 UTC+8 and may experience slight delays
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 }}
                      >
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">API Request Distribution</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex gap-2 mb-4">
                              <Button variant="default" size="sm" className="h-8 text-xs">
                                Daily
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 text-xs">
                                Weekly
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 text-xs">
                                Monthly
                              </Button>
                              <div className="ml-auto">
                                <Button variant="outline" size="sm" className="h-8 text-xs">
                                  By Method
                                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                                    <path d="m6 9 6 6 6-6"/>
                                  </svg>
                                </Button>
                              </div>
                            </div>
                            <div className="h-[200px] flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-sm text-muted-foreground mb-2">No data available</div>
                                <div className="text-xs text-muted-foreground">
                                  Note: Data is calculated at 2025-04-14 14:00:00 UTC+8 and may experience slight delays
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.7 }}
                      >
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Top 5 API Endpoints</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex gap-2 mb-4">
                              <Button variant="default" size="sm" className="h-8 text-xs">
                                Daily
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 text-xs">
                                Weekly
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 text-xs">
                                Monthly
                              </Button>
                            </div>
                            <div className="h-[200px] flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-sm text-muted-foreground mb-2">No data available</div>
                                <div className="text-xs text-muted-foreground">
                                  Note: Data is calculated at 2025-04-14 14:00:00 UTC+8 and may experience slight delays
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.8 }}
                      >
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Webhook Events</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex gap-2 mb-4">
                              <Button variant="default" size="sm" className="h-8 text-xs">
                                Daily
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 text-xs">
                                Weekly
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 text-xs">
                                Monthly
                              </Button>
                            </div>
                            <div className="h-[200px] flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-sm text-muted-foreground mb-2">No data available</div>
                                <div className="text-xs text-muted-foreground">
                                  Note: Data is calculated at 2025-04-14 14:00:00 UTC+8 and may experience slight delays
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.9 }}
                      >
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Callback Messages</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex gap-2 mb-4">
                              <Button variant="default" size="sm" className="h-8 text-xs">
                                Daily
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 text-xs">
                                Weekly
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 text-xs">
                                Monthly
                              </Button>
                            </div>
                            <div className="h-[200px] flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-sm text-muted-foreground mb-2">No data available</div>
                                <div className="text-xs text-muted-foreground">
                                  Note: Data is calculated at 2025-04-14 14:00:00 UTC+8 and may experience slight delays
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                  </TabsContent>

                  <TabsContent value="api-keys" className="mt-0">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="relative w-full max-w-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                          </svg>
                          <input
                            type="search"
                            placeholder="Search by key name or related keyword"
                            className="w-full rounded-md border border-input pl-10 pr-4 py-2 text-sm"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Button>
                            Create API Key
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center py-12">
                        <Image
                          src="/placeholder.svg?height=60&width=60&query=no data"
                          alt="No Data"
                          width={60}
                          height={60}
                        />
                        <div className="mt-4 text-sm text-muted-foreground">No API Keys Found</div>
                        <div className="mt-2 text-xs text-muted-foreground max-w-md text-center">
                          API keys allow you to authenticate and authorize your applications to access Cobo's API services.
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="webhooks" className="mt-0">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="relative w-full max-w-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                          </svg>
                          <input
                            type="search"
                            placeholder="Search by webhook URL"
                            className="w-full rounded-md border border-input pl-10 pr-4 py-2 text-sm"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Button>
                            Create Webhook
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center py-12">
                        <Image
                          src="/placeholder.svg?height=60&width=60&query=no data"
                          alt="No Data"
                          width={60}
                          height={60}
                        />
                        <div className="mt-4 text-sm text-muted-foreground">No Webhooks Found</div>
                        <div className="mt-2 text-xs text-muted-foreground max-w-md text-center">
                          Webhooks allow you to receive real-time notifications when specific events occur in your Cobo account.
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="api-logs" className="mt-0">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="relative w-full max-w-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                          </svg>
                          <input
                            type="search"
                            placeholder="Search API logs"
                            className="w-full rounded-md border border-input pl-10 pr-4 py-2 text-sm"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline">
                            Export
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center py-12">
                        <Image
                          src="/placeholder.svg?height=60&width=60&query=no data"
                          alt="No Data"
                          width={60}
                          height={60}
                        />
                        <div className="mt-4 text-sm text-muted-foreground">No API Logs Found</div>
                        <div className="mt-2 text-xs text-muted-foreground max-w-md text-center">
                          API logs record all requests made to Cobo's API services, helping you monitor and troubleshoot your integrations.
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="webhook-events" className="mt-0">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="relative w-full max-w-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                          </svg>
                          <input
                            type="search"
                            placeholder="Search webhook events"
                            className="w-full rounded-md border border-input pl-10 pr-4 py-2 text-sm"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline">
                            Export
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center py-12">
                        <Image
                          src="/placeholder.svg?height=60&width=60&query=no data"
                          alt="No Data"
                          width={60}
                          height={60}
                        />
                        <div className="mt-4 text-sm text-muted-foreground">No Webhook Events Found</div>
                        <div className="mt-2 text-xs text-muted-foreground max-w-md text-center">
                          Webhook events are notifications sent to your specified endpoints when specific events occur in your Cobo account.
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="callback-messages" className="mt-0">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="relative w-full max-w-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                          </svg>
                          <input
                            type="search"
                            placeholder="Search callback messages"
                            className="w-full rounded-md border border-input pl-10 pr-4 py-2 text-sm"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline">
                            Export
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center py-12">
                        <Image
                          src="/placeholder.svg?height=60&width=60&query=no data"
                          alt="No Data"
                          width={60}
                          height={60}
                        />
                        <div className="mt-4 text-sm text-muted-foreground">No Callback Messages Found</div>
                        <div className="mt-2 text-xs text-muted-foreground max-w-md text-center">
                          Callback messages are responses received from your servers after webhook events are delivered.
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
