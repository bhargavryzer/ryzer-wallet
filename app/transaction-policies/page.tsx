"use client"

import { useState } from "react"
import { Info, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SecurityVerificationDialog } from "@/components/dialogs/security-verification-dialog"
import { EmergencyPolicyDialog } from "@/components/dialogs/emergency-policy-dialog"

export default function TransactionPoliciesPage() {
  const [showSecurityVerification, setShowSecurityVerification] = useState(false)
  const [showEmergencyPolicy, setShowEmergencyPolicy] = useState(false)
  const [showInfoBanner, setShowInfoBanner] = useState(true)

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">Transaction Policies</h1>
            <p className="text-sm text-muted-foreground">Manage your transaction policies and address lists</p>
          </div>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-4">
            {showInfoBanner && (
              <div className="flex items-start justify-between rounded-lg bg-blue-50 p-4">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 flex-shrink-0 text-blue-500" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-blue-800">Manage Transaction Policies</h4>
                    <p className="text-sm text-blue-700">
                      Define parameters like amounts and spenders to easily manage every aspect of transactions flowing in
                      and out of your organization.
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowInfoBanner(false)}>
                  <X className="h-4 w-4 text-blue-700" />
                </Button>
              </div>
            )}
            <div className="mt-4">
              <Button variant="outline" className="h-9 text-primary">
                <Info className="mr-2 h-4 w-4" />
                How to Set Up Transaction Policies?
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="policies" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="policies" className="text-sm">
                  Transaction Policies
                </TabsTrigger>
                <TabsTrigger value="lists" className="text-sm">
                  Address Lists
                </TabsTrigger>
              </TabsList>
              <TabsContent value="policies" className="mt-6 space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search by policy name" className="h-10 pl-10" />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="outline" className="h-10" onClick={() => setShowEmergencyPolicy(true)}>
                      Manage Emergency Policy
                    </Button>
                    <Button variant="outline" className="h-10">
                      Adjust Priorities
                    </Button>
                    <Button className="h-10" onClick={() => setShowSecurityVerification(true)}>
                      Create Policy
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="py-3 pl-4 text-left text-sm font-medium">Priority</th>
                        <th className="py-3 text-left text-sm font-medium">Type</th>
                        <th className="py-3 text-left text-sm font-medium">Name</th>
                        <th className="py-3 text-left text-sm font-medium">Wallets</th>
                        <th className="py-3 text-left text-sm font-medium">Conditions</th>
                        <th className="py-3 text-left text-sm font-medium">Action</th>
                        <th className="py-3 pr-4 text-left text-sm font-medium">Operations</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="py-3 pl-4 text-sm">#1</td>
                        <td className="py-3 text-sm">Default</td>
                        <td className="py-3 text-sm">Default policy</td>
                        <td className="py-3 text-sm">All Wallets</td>
                        <td className="py-3 text-sm">Message Type</td>
                        <td className="py-3 text-sm">Auto Rejection</td>
                        <td className="py-3 pr-4">
                          <Button variant="ghost" size="icon">
                            <Info className="h-4 w-4" />
                            <span className="sr-only">View Details</span>
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="py-3 pl-4 text-sm">#2</td>
                        <td className="py-3 text-sm">Default</td>
                        <td className="py-3 text-sm">Default policy</td>
                        <td className="py-3 text-sm">All Wallets</td>
                        <td className="py-3 text-sm">Any Transaction</td>
                        <td className="py-3 text-sm">Auto Approval</td>
                        <td className="py-3 pr-4">
                          <Button variant="ghost" size="icon">
                            <Info className="h-4 w-4" />
                            <span className="sr-only">View Details</span>
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              <TabsContent value="lists" className="mt-6 space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search by Address List name" className="h-10 pl-10" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Button className="h-10">Create List</Button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="py-3 pl-4 text-left text-sm font-medium">Lists</th>
                        <th className="py-3 text-left text-sm font-medium">Number of Addresses</th>
                        <th className="py-3 text-left text-sm font-medium">Creator</th>
                        <th className="py-3 text-left text-sm font-medium">Created Time</th>
                        <th className="py-3 pr-4 text-left text-sm font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="py-3 pl-4 text-sm">Whitelist</td>
                        <td className="py-3 text-sm">0</td>
                        <td className="py-3 text-sm">Default</td>
                        <td className="py-3 text-sm">2025-04-14 12:57:45</td>
                        <td className="py-3 pr-4">
                          <Button variant="ghost" size="icon">
                            <Info className="h-4 w-4" />
                            <span className="sr-only">View Details</span>
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <SecurityVerificationDialog open={showSecurityVerification} onOpenChange={setShowSecurityVerification} />
        <EmergencyPolicyDialog open={showEmergencyPolicy} onOpenChange={setShowEmergencyPolicy} />
      </div>
    </DashboardLayout>
  )
}