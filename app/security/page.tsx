"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Shield, Copy, Edit, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SecurityPage() {
  const [showGoogleAuthenticator, setShowGoogleAuthenticator] = useState(false)
  const [showSecurityVerification, setShowSecurityVerification] = useState(false)
  const [showEmergencyPolicy, setShowEmergencyPolicy] = useState(false)
  const [showCreatePolicy, setShowCreatePolicy] = useState(false)
  const [showCreateList, setShowCreateList] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [emergencyPolicy, setEmergencyPolicy] = useState<"rejection" | "quorum">("rejection")
  const [policyName, setPolicyName] = useState("")
  const [listName, setListName] = useState("")
  const [listAddresses, setListAddresses] = useState("")
  const [searchPolicyQuery, setSearchPolicyQuery] = useState("")
  const [searchListQuery, setSearchListQuery] = useState("")

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleSetupMFA = () => {
    // Implement MFA setup logic here
    setShowGoogleAuthenticator(false)
    setVerificationCode("")
  }

  const handleEmergencyPolicySubmit = () => {
    // Implement emergency policy update logic here
    setShowEmergencyPolicy(false)
  }

  const handleCreatePolicy = () => {
    // Implement policy creation logic here
    setShowCreatePolicy(false)
    setPolicyName("")
  }

  const handleCreateList = () => {
    // Implement address list creation logic here
    setShowCreateList(false)
    setListName("")
    setListAddresses("")
  }

  // Mock data for policies and address lists
  const policies = [
    {
      priority: "#1",
      type: "Default",
      name: "Default policy",
      wallets: "All Wallets",
      conditions: "Message Type",
      action: "Auto Rejection",
    },
    {
      priority: "#2",
      type: "Default",
      name: "Default policy",
      wallets: "All Wallets",
      conditions: "Any Transaction",
      action: "Auto Approval",
    },
  ]

  const addressLists = [
    {
      name: "Whitelist",
      addresses: 0,
      creator: "Default",
      createdTime: "2025-04-14 12:57:45",
    },
  ]

  const filteredPolicies = policies.filter((policy) =>
    policy.name.toLowerCase().includes(searchPolicyQuery.toLowerCase())
  )

  const filteredLists = addressLists.filter((list) =>
    list.name.toLowerCase().includes(searchListQuery.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Security</h1>
          <p className="text-sm text-muted-foreground">Manage your account security settings and transaction policies</p>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-start gap-4">
            <div className="rounded-full bg-primary/10 p-2">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-medium">Account Security Level</CardTitle>
              <CardDescription className="text-sm">
                Your current security level is <span className="text-red-500 font-medium">Low</span>
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Login</h3>
              <p className="text-sm text-muted-foreground">
                To change your password or modify your login methods, please{" "}
                <Link href="#" className="text-primary hover:underline font-medium">
                  Go to Ryzer Accounts
                </Link>
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Multi-Factor Authentication (MFA)</h3>
              <p className="text-sm text-muted-foreground">
                We recommend setting up all MFA methods to secure your account.
              </p>

              <div className="grid gap-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 11.9999C13.1046 11.9999 14 11.1045 14 9.99994C14 8.89537 13.1046 7.99994 12 7.99994C10.8954 7.99994 10 8.89537 10 9.99994C10 11.1045 10.8954 11.9999 12 11.9999Z"
                          fill="white"
                        />
                        <path d="M12 12C9.79086 12 8 13.7909 8 16H16C16 13.7909 14.2091 12 12 12Z" fill="white" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Ryzer Guard</div>
                      <div className="text-sm text-muted-foreground">
                        A mobile application used to approve transactions, store key shares, etc.
                      </div>
                      <div className="text-xs text-primary mt-1">Recommended</div>
                    </div>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button onClick={() => setShowGoogleAuthenticator(true)} className="h-10">
                          Set Up
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Ryzer Guard Setup</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M20.91 11.12C20.91 10.56 20.86 10.01 20.75 9.47H12V13.24H17.07C16.87 14.33 16.22 15.28 15.26 15.92V18.35H18.25C20.02 16.7 20.91 14.13 20.91 11.12Z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 21C14.43 21 16.47 20.15 18.25 18.35L15.26 15.92C14.47 16.45 13.39 16.77 12 16.77C9.47 16.77 7.33 15.09 6.56 12.78H3.47V15.29C5.24 18.68 8.39 21 12 21Z"
                          fill="#34A853"
                        />
                        <path
                          d="M6.56 12.78C6.38 12.24 6.28 11.66 6.28 11.06C6.28 10.46 6.38 9.88 6.56 9.34V6.83H3.47C2.84 8.11 2.5 9.53 2.5 11.06C2.5 12.59 2.84 14.01 3.47 15.29L6.56 12.78Z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.35C13.39 5.35 14.64 5.82 15.65 6.77L18.29 4.13C16.47 2.45 14.43 1.5 12 1.5C8.39 1.5 5.24 3.82 3.47 7.21L6.56 9.72C7.33 7.41 9.47 5.73 12 5.73V5.35Z"
                          fill="#EA4335"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Google Authenticator</div>
                      <div className="text-sm text-muted-foreground">A software-based authenticator by Google.</div>
                    </div>
                  </div>
                  <Button className="h-10" onClick={() => setShowGoogleAuthenticator(true)}>
                    Set Up
                  </Button>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                          fill="#6366F1"
                        />
                        <path
                          d="M15 9H9V15H15V9Z"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Security Key</div>
                      <div className="text-sm text-muted-foreground">
                        A physical device used to verify your identity.
                      </div>
                    </div>
                  </div>
                  <Button className="h-10">Set Up</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-medium">Transaction Policies</CardTitle>
            <CardDescription className="text-sm">
              Define parameters like amounts and spenders to easily manage every aspect of transactions flowing in and out
              of your organization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="policies">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="policies">Transaction Policies</TabsTrigger>
                <TabsTrigger value="lists">Address Lists</TabsTrigger>
              </TabsList>
              <TabsContent value="policies" className="space-y-4 pt-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative w-full sm:w-80">
                    <Input
                      placeholder="Search by policy name"
                      value={searchPolicyQuery}
                      onChange={(e) => setSearchPolicyQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      variant="outline"
                      className="h-10"
                      onClick={() => setShowEmergencyPolicy(true)}
                    >
                      Manage Emergency Policy
                    </Button>
                    <Button variant="outline" className="h-10">
                      Adjust Priorities
                    </Button>
                    <Button className="h-10" onClick={() => setShowCreatePolicy(true)}>
                      Create Policy
                    </Button>
                  </div>
                </div>

                <div className="overflow-hidden rounded-lg border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="p-3 text-left text-sm font-medium">Priority</th>
                          <th className="p-3 text-left text-sm font-medium">Type</th>
                          <th className="p-3 text-left text-sm font-medium">Name</th>
                          <th className="p-3 text-left text-sm font-medium">Wallets</th>
                          <th className="p-3 text-left text-sm font-medium">Conditions</th>
                          <th className="p-3 text-left text-sm font-medium">Action</th>
                          <th className="p-3 text-left text-sm font-medium">Operations</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPolicies.length > 0 ? (
                          filteredPolicies.map((policy, index) => (
                            <tr key={index} className="border-t">
                              <td className="p-3">{policy.priority}</td>
                              <td className="p-3">{policy.type}</td>
                              <td className="p-3">{policy.name}</td>
                              <td className="p-3">{policy.wallets}</td>
                              <td className="p-3">{policy.conditions}</td>
                              <td className="p-3">{policy.action}</td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Edit policy</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                          <Trash className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Delete policy</TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="p-3 text-center text-muted-foreground">
                              No policies found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="lists" className="space-y-4 pt-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative w-full sm:w-80">
                    <Input
                      placeholder="Search by Address List name"
                      value={searchListQuery}
                      onChange={(e) => setSearchListQuery(e.target.value)}
                    />
                  </div>
                  <Button className="h-10" onClick={() => setShowCreateList(true)}>
                    Create List
                  </Button>
                </div>

                <div className="overflow-hidden rounded-lg border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="p-3 text-left text-sm font-medium">Lists</th>
                          <th className="p-3 text-left text-sm font-medium">Number of Addresses</th>
                          <th className="p-3 text-left text-sm font-medium">Creator</th>
                          <th className="p-3 text-left text-sm font-medium">Created Time</th>
                          <th className="p-3 text-left text-sm font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLists.length > 0 ? (
                          filteredLists.map((list, index) => (
                            <tr key={index} className="border-t">
                              <td className="p-3">{list.name}</td>
                              <td className="p-3">{list.addresses}</td>
                              <td className="p-3">{list.creator}</td>
                              <td className="p-3">{list.createdTime}</td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Edit list</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                          <Trash className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Delete list</TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="p-3 text-center text-muted-foreground">
                              No lists found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Dialog open={showGoogleAuthenticator} onOpenChange={setShowGoogleAuthenticator}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Set Up Google Authenticator</DialogTitle>
              <DialogDescription>Follow these steps to set up Google Authenticator for your account</DialogDescription>
            </DialogHeader>
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">1</div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Download App</h4>
                    <p className="text-sm text-muted-foreground">
                      Search in app stores or hover over the store button to scan its QR code
                    </p>
                    <div className="mt-2 flex gap-3">
                      <Button variant="outline" className="h-10 flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M20.91 11.12C20.91 10.56 20.86 10.01 20.75 9.47H12V13.24H17.07C16.87 14.33 16.22 15.28 15.26 15.92V18.35H18.25C20.02 16.7 20.91 14.13 20.91 11.12Z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 21C14.43 21 16.47 20.15 18.25 18.35L15.26 15.92C14.47 16.45 13.39 16.77 12 16.77C9.47 16.77 7.33 15.09 6.56 12.78H3.47V15.29C5.24 18.68 8.39 21 12 21Z"
                            fill="#34A853"
                          />
                          <path
                            d="M6.56 12.78C6.38 12.24 6.28 11.66 6.28 11.06C6.28 10.46 6.38 9.88 6.56 9.34V6.83H3.47C2.84 8.11 2.5 9.53 2.5 11.06C2.5 12.59 2.84 14.01 3.47 15.29L6.56 12.78Z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.35C13.39 5.35 14.64 5.82 15.65 6.77L18.29 4.13C16.47 2.45 14.43 1.5 12 1.5C8.39 1.5 5.24 3.82 3.47 7.21L6.56 9.72C7.33 7.41 9.47 5.73 12 5.73V5.35Z"
                            fill="#EA4335"
                          />
                        </svg>
                        Google Play
                      </Button>
                      <Button variant="outline" className="h-10 flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M17.0349 12.5C17.0349 9.1 20.0449 7.7 20.0849 7.7C18.6749 5.5 16.5749 5.2 15.8049 5.2C13.9549 5 12.1749 6.3 11.2249 6.3C10.2249 6.3 8.76488 5.2 7.16488 5.2C5.06488 5.2 3.06488 6.6 1.96488 8.8C-0.335117 13.2 1.36488 19.5 3.56488 22.9C4.66488 24.5 5.96488 26.4 7.66488 26.3C9.26488 26.2 9.86488 25.2 11.7649 25.2C13.6649 25.2 14.2249 26.3 15.8649 26.2C17.5649 26.1 18.6649 24.4 19.7649 22.8C21.0649 21 21.5649 19.2 21.5649 19.1C21.5649 19 17.0349 17.4 17.0349 12.5Z"
                            fill="black"
                          />
                          <path
                            d="M14.3349 3.8C15.2349 2.7 15.8349 1.2 15.6349 0C14.3349 0.1 12.7349 0.9 11.7349 2C10.8349 3 10.1349 4.5 10.3349 5.7C11.7349 5.8 13.3349 4.9 14.3349 3.8Z"
                            fill="black"
                          />
                        </svg>
                        App Store
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">2</div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Scan QR code</h4>
                    <p className="text-sm text-muted-foreground">Open Google Authenticator and scan the QR code</p>
                    <div className="mt-2 flex justify-center rounded-lg bg-muted/50 p-4">
                      <div className="bg-white p-2">
                        <img src="/abstract-qr-code.png" alt="QR Code" width={144} height={144} />
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">Or manually enter the following code</p>
                      <div className="mt-2 flex items-center">
                        <Input
                          value="NEQQ7ETCDWYWXZCNW7ANQX6L3UI6RT25VBROCVH4IHCIOUQZ43CA"
                          readOnly
                          className="h-10 pr-10"
                          aria-label="Authentication code"
                        />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="-ml-10 h-10 w-10"
                                onClick={() =>
                                  copyToClipboard("NEQQ7ETCDWYWXZCNW7ANQX6L3UI6RT25VBROCVH4IHCIOUQZ43CA")
                                }
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copy to clipboard</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">3</div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Complete Verification</h4>
                    <p className="text-sm text-muted-foreground">Enter the 6-digit code from Google Authenticator</p>
                    <div className="mt-2">
                      <Label htmlFor="verification-code">Verification Code</Label>
                      <Input
                        id="verification-code"
                        placeholder="Enter the 6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="mt-1 h-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  className="h-10"
                  onClick={() => setShowGoogleAuthenticator(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="h-10"
                  onClick={handleSetupMFA}
                  disabled={verificationCode.length !== 6}
                >
                  Submit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showSecurityVerification} onOpenChange={setShowSecurityVerification}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Security Verification</DialogTitle>
              <DialogDescription>Please choose your multi-factor authentication method</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-start gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 16V12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 8H12.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-sm">For the security of your account, please set up at least one MFA method.</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M20.91 11.12C20.91 10.56 20.86 10.01 20.75 9.47H12V13.24H17.07C16.87 14.33 16.22 15.28 15.26 15.92V18.35H18.25C20.02 16.7 20.91 14.13 20.91 11.12Z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 21C14.43 21 16.47 20.15 18.25 18.35L15.26 15.92C14.47 16.45 13.39 16.77 12 16.77C9.47 16.77 7.33 15.09 6.56 12.78H3.47V15.29C5.24 18.68 8.39 21 12 21Z"
                          fill="#34A853"
                        />
                        <path
                          d="M6.56 12.78C6.38 12.24 6.28 11.66 6.28 11.06C6.28 10.46 6.38 9.88 6.56 9.34V6.83H3.47C2.84 8.11 2.5 9.53 2.5 11.06C2.5 12.59 2.84 14.01 3.47 15.29L6.56 12.78Z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.35C13.39 5.35 14.64 5.82 15.65 6.77L18.29 4.13C16.47 2.45 14.43 1.5 12 1.5C8.39 1.5 5.24 3.82 3.47 7.21L6.56 9.72C7.33 7.41 9.47 5.73 12 5.73V5.35Z"
                          fill="#EA4335"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Google Authenticator</div>
                    </div>
                  </div>
                  <Button className="h-10" onClick={() => setShowGoogleAuthenticator(true)}>
                    Set Up
                  </Button>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                          fill="#6366F1"
                        />
                        <path
                          d="M15 9H9V15H15V9Z"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Security Key</div>
                    </div>
                  </div>
                  <Button className="h-10">Set Up</Button>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 11.9999C13.1046 11.9999 14 11.1045 14 9.99994C14 8.89537 13.1046 7.99994 12 7.99994C10.8954 7.99994 10 8.89537 10 9.99994C10 11.1045 10.8954 11.9999 12 11.9999Z"
                          fill="white"
                        />
                        <path d="M12 12C9.79086 12 8 13.7909 8 16H16C16 13.7909 14.2091 12 12 12Z" fill="white" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Ryzer Guard</div>
                    </div>
                  </div>
                  <Button className="h-10" onClick={() => setShowGoogleAuthenticator(true)}>
                    Set Up
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showEmergencyPolicy} onOpenChange={setShowEmergencyPolicy}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Manage Emergency Policy</DialogTitle>
              <DialogDescription>Implement a one-click emergency policy</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
                <Check className="mt-0.5 h-5 w-5" />
                <p className="text-sm">This policy requires no approval and takes effect immediately.</p>
              </div>

              <RadioGroup value={emergencyPolicy} onValueChange={(value: "rejection" | "quorum") => setEmergencyPolicy(value)}>
                <div className="flex items-start gap-4 rounded-lg border p-4">
                  <RadioGroupItem value="rejection" id="rejection" className="mt-1" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="rejection" className="font-medium">
                      Auto Rejection
                    </Label>
                    <p className="text-sm text-muted-foreground">Any transaction will be automatically rejected.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-lg border p-4">
                  <RadioGroupItem value="quorum" id="quorum" className="mt-1" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="quorum" className="font-medium">
                      Approval Quorum
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Any transaction will require a specified number of approvals to proceed.
                    </p>
                  </div>
                </div>
              </RadioGroup>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  className="h-10"
                  onClick={() => setShowEmergencyPolicy(false)}
                >
                  Cancel
                </Button>
                <Button className="h-10" onClick={handleEmergencyPolicySubmit}>
                  Submit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showCreatePolicy} onOpenChange={setShowCreatePolicy}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Transaction Policy</DialogTitle>
              <DialogDescription>Define a new transaction policy for your organization</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="policy-name">Policy Name</Label>
                <Input
                  id="policy-name"
                  placeholder="Enter policy name"
                  value={policyName}
                  onChange={(e) => setPolicyName(e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="policy-type">Policy Type</Label>
                <Select>
                  <SelectTrigger id="policy-type" className="h-10">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground">
                This policy will be applied to all selected wallets based on the specified conditions.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="h-10"
                onClick={() => setShowCreatePolicy(false)}
              >
                Cancel
              </Button>
              <Button
                className="h-10"
                onClick={handleCreatePolicy}
                disabled={!policyName}
              >
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showCreateList} onOpenChange={setShowCreateList}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Address List</DialogTitle>
              <DialogDescription>Create a new address list for transaction policies</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="list-name">List Name</Label>
                <Input
                  id="list-name"
                  placeholder="Enter list name"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="list-addresses">Addresses (one per line)</Label>
                <textarea
                  id="list-addresses"
                  placeholder="Enter addresses"
                  value={listAddresses}
                  onChange={(e) => setListAddresses(e.target.value)}
                  className="h-32 w-full rounded-md border p-2 text-sm"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Add addresses to this list to allow or restrict transactions based on your policies.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="h-10"
                onClick={() => setShowCreateList(false)}
              >
                Cancel
              </Button>
              <Button
                className="h-10"
                onClick={handleCreateList}
                disabled={!listName || !listAddresses}
              >
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}