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
                  </TabsContent>

                  <TabsContent value="api-keys" className="mt-0">
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="text-lg font-medium mb-2">API Keys Content</div>
                        <div className="text-sm text-muted-foreground">
                          This tab would contain API key management functionality
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="webhooks" className="mt-0">
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="text-lg font-medium mb-2">Webhooks Content</div>
                        <div className="text-sm text-muted-foreground">
                          This tab would contain webhook configuration functionality
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
