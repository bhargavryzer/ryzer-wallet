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
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transaction Policies</h1>
            <p className="text-muted-foreground">Manage your transaction policies and address lists</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            {showInfoBanner && (
              <div className="flex items-start justify-between bg-blue-50 p-4 rounded-lg mb-4">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-800">Manage Transaction Policies</h4>
                    <p className="text-sm text-blue-700">
                      Define parameters like amounts and spenders to easily manage every aspect of transactions flowing
                      in and out of your organization.
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowInfoBanner(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="text-primary">
                <Info className="mr-2 h-4 w-4" />
                How to Set Up Transaction Policies?
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="policies">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="policies">Transaction Policies</TabsTrigger>
                <TabsTrigger value="lists">Address Lists</TabsTrigger>
              </TabsList>
              <TabsContent value="policies" className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="relative w-full md:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by policy name" className="pl-8 w-full md:w-[300px]" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" onClick={() => setShowEmergencyPolicy(true)}>
                      Manage Emergency Policy
                    </Button>
                    <Button variant="outline">Adjust Priorities</Button>
                    <Button onClick={() => setShowSecurityVerification(true)}>Create Policy</Button>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 text-sm font-medium">Priority</th>
                          <th className="text-left p-3 text-sm font-medium">Type</th>
                          <th className="text-left p-3 text-sm font-medium">Name</th>
                          <th className="text-left p-3 text-sm font-medium">Wallets</th>
                          <th className="text-left p-3 text-sm font-medium">Conditions</th>
                          <th className="text-left p-3 text-sm font-medium">Action</th>
                          <th className="text-left p-3 text-sm font-medium">Operations</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="p-3">#1</td>
                          <td className="p-3">Default</td>
                          <td className="p-3">Default policy</td>
                          <td className="p-3">All Wallets</td>
                          <td className="p-3">Message Type</td>
                          <td className="p-3">Auto Rejection</td>
                          <td className="p-3">
                            <Button variant="ghost" size="icon">
                              <Info className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-3">#2</td>
                          <td className="p-3">Default</td>
                          <td className="p-3">Default policy</td>
                          <td className="p-3">All Wallets</td>
                          <td className="p-3">Any Transaction</td>
                          <td className="p-3">Auto Approval</td>
                          <td className="p-3">
                            <Button variant="ghost" size="icon">
                              <Info className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="lists" className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="relative w-full md:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by Address List name" className="pl-8 w-full md:w-[300px]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button>Create List</Button>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 text-sm font-medium">Lists</th>
                          <th className="text-left p-3 text-sm font-medium">Number of Addresses</th>
                          <th className="text-left p-3 text-sm font-medium">Creator</th>
                          <th className="text-left p-3 text-sm font-medium">Created Time</th>
                          <th className="text-left p-3 text-sm font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="p-3">Whitelist</td>
                          <td className="p-3">0</td>
                          <td className="p-3">Default</td>
                          <td className="p-3">2025-04-14 12:57:45</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon">
                                <Info className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Security Verification Dialog */}
        <SecurityVerificationDialog open={showSecurityVerification} onOpenChange={setShowSecurityVerification} />

        {/* Emergency Policy Dialog */}
        <EmergencyPolicyDialog open={showEmergencyPolicy} onOpenChange={setShowEmergencyPolicy} />
      </div>
    </DashboardLayout>
  )
}
