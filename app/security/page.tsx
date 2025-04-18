"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { X,Check, Shield, Copy, Edit, Trash, Search, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

// Interfaces
interface Policy {
  id: string
  priority: string
  type: string
  name: string
  wallets: string
  conditions: string
  action: string
  status: "pending" | "approved" | "rejected"
  creator: string
}

interface AddressList {
  id: string
  name: string
  addressCount: number
  creator: string
  createdTime: string
  status: "pending" | "approved" | "rejected"
}

// Sample data
const policies: Policy[] = [
  {
    id: "policy-1",
    priority: "#1",
    type: "Default",
    name: "Default Policy",
    wallets: "All Wallets",
    conditions: "Message Type",
    action: "Auto Rejection",
    status: "approved",
    creator: "admin@example.com",
  },
  {
    id: "policy-2",
    priority: "#2",
    type: "Default",
    name: "Transaction Approval",
    wallets: "All Wallets",
    conditions: "Any Transaction",
    action: "Auto Approval",
    status: "pending",
    creator: "user1@example.com",
  },
]

const addressLists: AddressList[] = [
  {
    id: "list-1",
    name: "Whitelist",
    addressCount: 0,
    creator: "admin@example.com",
    createdTime: "2025-04-14 12:57:45",
    status: "approved",
  },
  {
    id: "list-2",
    name: "Blacklist",
    addressCount: 5,
    creator: "user2@example.com",
    createdTime: "2025-04-15 09:30:00",
    status: "pending",
  },
]

export default function SecurityPage() {
  const [showGoogleAuthenticator, setShowGoogleAuthenticator] = useState(false)
  const [showSecurityVerification, setShowSecurityVerification] = useState(false)
  const [showEmergencyPolicy, setShowEmergencyPolicy] = useState(false)
  const [showCreatePolicy, setShowCreatePolicy] = useState(false)
  const [showCreateList, setShowCreateList] = useState(false)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [itemToApprove, setItemToApprove] = useState<Policy | AddressList | null>(null)
  const [verificationCode, setVerificationCode] = useState("")
  const [emergencyPolicy, setEmergencyPolicy] = useState<"rejection" | "quorum">("rejection")
  const [policyName, setPolicyName] = useState("")
  const [listName, setListName] = useState("")
  const [listAddresses, setListAddresses] = useState("")
  const [searchPolicyQuery, setSearchPolicyQuery] = useState("")
  const [searchListQuery, setSearchListQuery] = useState("")
  const [policyStatusFilter, setPolicyStatusFilter] = useState<string>("all")
  const [listStatusFilter, setListStatusFilter] = useState<string>("all")
  const [policySort, setPolicySort] = useState<{ key: keyof Policy; direction: "asc" | "desc" }>({
    key: "priority",
    direction: "asc",
  })
  const [listSort, setListSort] = useState<{ key: keyof AddressList; direction: "asc" | "desc" }>({
    key: "createdTime",
    direction: "desc",
  })
  const [policyPage, setPolicyPage] = useState(1)
  const [listPage, setListPage] = useState(1)
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([])
  const [selectedLists, setSelectedLists] = useState<string[]>([])
  const itemsPerPage = 5
  const { toast } = useToast()

  // Filter and sort policies
  const filteredPolicies = useMemo(() => {
    let result = policies.filter(
      (policy) =>
        (searchPolicyQuery === "" ||
          policy.name.toLowerCase().includes(searchPolicyQuery.toLowerCase()) ||
          policy.creator.toLowerCase().includes(searchPolicyQuery.toLowerCase())) &&
        (policyStatusFilter === "all" || policy.status === policyStatusFilter)
    )

    result.sort((a, b) => {
      const key = policySort.key
      const direction = policySort.direction === "asc" ? 1 : -1
      if (key === "priority") return (parseInt(a[key].slice(1)) - parseInt(b[key].slice(1))) * direction
      return String(a[key]).localeCompare(String(b[key])) * direction
    })

    return result
  }, [searchPolicyQuery, policyStatusFilter, policySort])

  // Filter and sort address lists
  const filteredLists = useMemo(() => {
    let result = addressLists.filter(
      (list) =>
        (searchListQuery === "" ||
          list.name.toLowerCase().includes(searchListQuery.toLowerCase()) ||
          list.creator.toLowerCase().includes(searchListQuery.toLowerCase())) &&
        (listStatusFilter === "all" || list.status === listStatusFilter)
    )

    result.sort((a, b) => {
      const key = listSort.key
      const direction = listSort.direction === "asc" ? 1 : -1
      if (key === "addressCount") return (a[key] - b[key]) * direction
      return String(a[key]).localeCompare(String(b[key])) * direction
    })

    return result
  }, [searchListQuery, listStatusFilter, listSort])

  // Pagination
  const totalPolicyPages = Math.ceil(filteredPolicies.length / itemsPerPage)
  const paginatedPolicies = filteredPolicies.slice(
    (policyPage - 1) * itemsPerPage,
    policyPage * itemsPerPage
  )

  const totalListPages = Math.ceil(filteredLists.length / itemsPerPage)
  const paginatedLists = filteredLists.slice(
    (listPage - 1) * itemsPerPage,
    listPage * itemsPerPage
  )

  // Handlers
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to Clipboard",
      description: "Authentication code copied successfully.",
    })
  }

  const handleSetupMFA = () => {
    toast({
      title: "MFA Enabled",
      description: "Google Authenticator has been set up for the platform.",
    })
    setShowGoogleAuthenticator(false)
    setVerificationCode("")
  }

  const handleEmergencyPolicySubmit = () => {
    toast({
      title: "Emergency Policy Updated",
      description: `Emergency policy set to ${emergencyPolicy === "rejection" ? "Auto Rejection" : "Approval Quorum"}.`,
    })
    setShowEmergencyPolicy(false)
  }

  const handleCreatePolicy = () => {
    toast({
      title: "Policy Created",
      description: `Policy "${policyName}" has been created and is pending approval.`,
    })
    setShowCreatePolicy(false)
    setPolicyName("")
  }

  const handleCreateList = () => {
    toast({
      title: "Address List Created",
      description: `List "${listName}" has been created and is pending approval.`,
    })
    setShowCreateList(false)
    setListName("")
    setListAddresses("")
  }

  const handleSelectAllPolicies = (checked: boolean) => {
    if (checked) {
      setSelectedPolicies(paginatedPolicies.map((policy) => policy.id))
    } else {
      setSelectedPolicies([])
    }
  }

  const handleSelectPolicy = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedPolicies([...selectedPolicies, id])
    } else {
      setSelectedPolicies(selectedPolicies.filter((itemId) => itemId !== id))
    }
  }

  const handleSelectAllLists = (checked: boolean) => {
    if (checked) {
      setSelectedLists(paginatedLists.map((list) => list.id))
    } else {
      setSelectedLists([])
    }
  }

  const handleSelectList = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedLists([...selectedLists, id])
    } else {
      setSelectedLists(selectedLists.filter((itemId) => itemId !== id))
    }
  }

  const handleBulkApprove = (type: "policy" | "list") => {
    const selected = type === "policy" ? selectedPolicies : selectedLists
    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)}s Approved`,
      description: `${selected.length} ${type}(s) approved.`,
    })
    console.log(`Approving ${type}s:`, selected)
    if (type === "policy") setSelectedPolicies([])
    else setSelectedLists([])
  }

  const handleBulkReject = (type: "policy" | "list") => {
    const selected = type === "policy" ? selectedPolicies : selectedLists
    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)}s Rejected`,
      description: `${selected.length} ${type}(s) rejected.`,
    })
    console.log(`Rejecting ${type}s:`, selected)
    if (type === "policy") setSelectedPolicies([])
    else setSelectedLists([])
  }

  const handleOpenApprovalDialog = (item: Policy | AddressList) => {
    setItemToApprove(item)
    setShowApprovalDialog(true)
  }

  const handleApproveItem = () => {
    if (itemToApprove) {
      toast({
        title: "Item Approved",
        description: `${itemToApprove.name} has been approved.`,
      })
      console.log("Approving item:", itemToApprove.id)
    }
    setShowApprovalDialog(false)
    setItemToApprove(null)
  }

  const handleRejectItem = () => {
    if (itemToApprove) {
      toast({
        title: "Item Rejected",
        description: `${itemToApprove.name} has been rejected.`,
      })
      console.log("Rejecting item:", itemToApprove.id)
    }
    setShowApprovalDialog(false)
    setItemToApprove(null)
  }

  const handleSort = (key: keyof Policy | keyof AddressList, type: "policy" | "list") => {
    if (type === "policy") {
      setPolicySort((prev) => ({
        key: key as keyof Policy,
        direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
      }))
    } else {
      setListSort((prev) => ({
        key: key as keyof AddressList,
        direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
      }))
    }
  }

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start justify-between gap-4"
        >
        </motion.div>

        {/* Summary Dashboard */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
          <Card className="bg-white border-gray-200 shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Security Overview</CardTitle>
              <div className="space-y-1">
            
            <p className="text-sm text-gray-600">
              Manage platform-wide security settings, MFA compliance, and transaction policies.
            </p>
          </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-4">
                <Image
                  src="/placeholder.svg?height=48&width=48&query=mfa"
                  alt="MFA Users"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <div className="text-3xl font-bold text-gray-900">75%</div>
                  <div className="text-sm text-gray-600">MFA Adoption</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Image
                  src="/placeholder.svg?height=48&width=48&query=policies"
                  alt="Pending Policies"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {policies.filter((p) => p.status === "pending").length}
                  </div>
                  <div className="text-sm text-gray-600">Pending Policies</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Image
                  src="/placeholder.svg?height=48&width=48&query=lists"
                  alt="Address Lists"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <div className="text-3xl font-bold text-gray-900">{addressLists.length}</div>
                  <div className="text-sm text-gray-600">Address Lists</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Image
                  src="/placeholder.svg?height=48&width=48&query=creators"
                  alt="Creators"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {new Set([...policies.map((p) => p.creator), ...addressLists.map((l) => l.creator)]).size}
                  </div>
                  <div className="text-sm text-gray-600">Unique Creators</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Security */}
        <Card className="bg-white border-gray-200 shadow-lg rounded-xl">
          <CardHeader className="flex flex-row items-start gap-4">
            <div className="rounded-full bg-blue-100 p-2">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-medium">Platform Security Settings</CardTitle>
              <CardDescription className="text-sm">
                Manage MFA enforcement and login policies for all users.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Admin Login Management</h3>
              <p className="text-sm text-gray-600">
                Configure login policies or reset passwords for users via{" "}
                <Link href="#" className="text-blue-600 hover:underline font-medium">
                  Ryzer Admin Console
                </Link>
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Multi-Factor Authentication (MFA) Enforcement</h3>
              <p className="text-sm text-gray-600">
                Enforce MFA for all platform users to enhance security. Current MFA adoption: <span className="text-red-500 font-medium">75%</span>.
              </p>

              <div className="grid gap-4">
                <div className="flex items-center justify-between rounded-lg border p-4 hover:shadow-sm transition-shadow">
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
                      <div className="text-sm text-gray-600">
                        Mobile app for transaction approvals and key management.
                      </div>
                      <div className="text-xs text-blue-600 mt-1">Recommended</div>
                    </div>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button onClick={() => setShowGoogleAuthenticator(true)} className="h-10 bg-blue-600 hover:bg-blue-700">
                          Configure
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Configure Ryzer Guard</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4 hover:shadow-sm transition-shadow">
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
                      <div className="text-sm text-gray-600">Software-based authenticator by Google.</div>
                    </div>
                  </div>
                  <Button className="h-10 bg-blue-600 hover:bg-blue-700" onClick={() => setShowGoogleAuthenticator(true)}>
                    Configure
                  </Button>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4 hover:shadow-sm transition-shadow">
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
                      <div className="text-sm text-gray-600">Physical device for identity verification.</div>
                    </div>
                  </div>
                  <Button className="h-10 bg-blue-600 hover:bg-blue-700">Configure</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Policies */}
        <Card className="bg-white border-gray-200 shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl font-medium">Transaction Policies</CardTitle>
            <CardDescription className="text-sm">
              Manage platform-wide transaction policies and address lists to control transaction flows.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Bulk Actions */}
            {(selectedPolicies.length > 0 || selectedLists.length > 0) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between bg-gray-100 p-4 rounded-md mb-6"
              >
                <div className="text-sm text-gray-700">
                  <span className="font-medium">
                    {selectedPolicies.length} policies, {selectedLists.length} lists selected
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      if (selectedPolicies.length > 0) handleBulkApprove("policy")
                      if (selectedLists.length > 0) handleBulkApprove("list")
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Approve Selected
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      if (selectedPolicies.length > 0) handleBulkReject("policy")
                      if (selectedLists.length > 0) handleBulkReject("list")
                    }}
                    variant="destructive"
                  >
                    Reject Selected
                  </Button>
                </div>
              </motion.div>
            )}

            <Tabs defaultValue="policies">
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-100 rounded-lg">
                <TabsTrigger value="policies" className="text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Transaction Policies
                </TabsTrigger>
                <TabsTrigger value="lists" className="text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Address Lists
                </TabsTrigger>
              </TabsList>
              <TabsContent value="policies" className="space-y-4 pt-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search by policy name or creator"
                      value={searchPolicyQuery}
                      onChange={(e) => setSearchPolicyQuery(e.target.value)}
                      className="h-10 pl-10 focus:ring-2 focus:ring-purple-600"
                      aria-label="Search policies"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" className="h-10">
                          Advanced Filters
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Advanced Filters</SheetTitle>
                        </SheetHeader>
                        <div className="space-y-6 py-4">
                          <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={policyStatusFilter} onValueChange={setPolicyStatusFilter}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                    <Button
                      variant="outline"
                      className="h-10"
                      onClick={() => setShowEmergencyPolicy(true)}
                    >
                      Manage Emergency Policy
                    </Button>
                    <Button
                      variant="outline"
                      className="h-10"
                      onClick={() => {
                        toast({
                          title: "Priorities Adjusted",
                          description: "Policy priorities have been updated.",
                        })
                      }}
                    >
                      Adjust Priorities
                    </Button>
                    <Button
                      className="h-10 bg-purple-600 hover:bg-purple-700"
                      onClick={() => setShowCreatePolicy(true)}
                    >
                      Create Policy
                    </Button>
                  </div>
                </div>

                <motion.div variants={cardVariants} initial="hidden" animate="visible">
                  {paginatedPolicies.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-600">
                      <Image
                        src="/placeholder.svg?height=80&width=80&query=no-policies"
                        alt="No Policies"
                        width={80}
                        height={80}
                        className="mb-6"
                      />
                      <h3 className="text-lg font-medium mb-4">No transaction policies found.</h3>
                      <Button
                        className="h-10 bg-purple-600 hover:bg-purple-700 hover:scale-105 transition-transform"
                        onClick={() => setShowCreatePolicy(true)}
                      >
                        Create Policy
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-md border">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="py-3 pl-4 w-12">
                              <Checkbox
                                checked={selectedPolicies.length === paginatedPolicies.length && paginatedPolicies.length > 0}
                                onCheckedChange={handleSelectAllPolicies}
                                aria-label="Select all policies"
                              />
                            </th>
                            <th className="py-3 text-left text-sm font-medium cursor-pointer" onClick={() => handleSort("priority", "policy")}>
                              Priority {policySort.key === "priority" && <ArrowUpDown className="inline h-4 w-4" />}
                            </th>
                            <th className="py-3 text-left text-sm font-medium cursor-pointer" onClick={() => handleSort("type", "policy")}>
                              Type {policySort.key === "type" && <ArrowUpDown className="inline h-4 w-4" />}
                            </th>
                            <th className="py-3 text-left text-sm font-medium cursor-pointer" onClick={() => handleSort("name", "policy")}>
                              Name {policySort.key === "name" && <ArrowUpDown className="inline h-4 w-4" />}
                            </th>
                            <th className="py-3 text-left text-sm font-medium">Wallets</th>
                            <th className="py-3 text-left text-sm font-medium">Conditions</th>
                            <th className="py-3 text-left text-sm font-medium">Action</th>
                            <th className="py-3 text-left text-sm font-medium cursor-pointer" onClick={() => handleSort("status", "policy")}>
                              Status {policySort.key === "status" && <ArrowUpDown className="inline h-4 w-4" />}
                            </th>
                            <th className="py-3 pr-4 text-left text-sm font-medium">Operations</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedPolicies.map((policy) => (
                            <tr key={policy.id} className="border-t hover:bg-gray-50">
                              <td className="py-3 pl-4">
                                <Checkbox
                                  checked={selectedPolicies.includes(policy.id)}
                                  onCheckedChange={(checked) => handleSelectPolicy(policy.id, !!checked)}
                                  aria-label={`Select policy ${policy.name}`}
                                />
                              </td>
                              <td className="py-3 text-sm">{policy.priority}</td>
                              <td className="py-3 text-sm">{policy.type}</td>
                              <td className="py-3 text-sm">{policy.name}</td>
                              <td className="py-3 text-sm">{policy.wallets}</td>
                              <td className="py-3 text-sm">{policy.conditions}</td>
                              <td className="py-3 text-sm">{policy.action}</td>
                              <td className="py-3 text-sm">
                                <Badge
                                  variant={
                                    policy.status === "approved"
                                      ? "default"
                                      : policy.status === "rejected"
                                      ? "destructive"
                                      : "secondary"
                                  }
                                  className="px-2 py-1"
                                >
                                  {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                                </Badge>
                              </td>
                              <td className="py-3 pr-4 flex gap-2">
                                {policy.status === "pending" ? (
                                  <>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => handleOpenApprovalDialog(policy)}
                                            aria-label={`Approve policy ${policy.name}`}
                                          >
                                            <Check className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Approve policy</TooltipContent>
                                      </Tooltip>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => handleOpenApprovalDialog(policy)}
                                            aria-label={`Reject policy ${policy.name}`}
                                          >
                                            <X className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Reject policy</TooltipContent>
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
                                            onClick={() => {
                                              toast({
                                                title: "Policy Edited",
                                                description: `Policy "${policy.name}" edited.`,
                                              })
                                            }}
                                            aria-label={`Edit policy ${policy.name}`}
                                          >
                                            <Edit className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Edit policy</TooltipContent>
                                      </Tooltip>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => {
                                              toast({
                                                title: "Policy Deleted",
                                                description: `Policy "${policy.name}" deleted.`,
                                              })
                                            }}
                                            aria-label={`Delete policy ${policy.name}`}
                                          >
                                            <Trash className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Delete policy</TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
                {paginatedPolicies.length > 0 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-600">
                      Showing {paginatedPolicies.length} of {filteredPolicies.length} policies
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPolicyPage((prev) => Math.max(prev - 1, 1))}
                        disabled={policyPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-gray-600">
                        Page {policyPage} of {totalPolicyPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPolicyPage((prev) => Math.min(prev + 1, totalPolicyPages))}
                        disabled={policyPage === totalPolicyPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="lists" className="space-y-4 pt-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search by list name or creator"
                      value={searchListQuery}
                      onChange={(e) => setSearchListQuery(e.target.value)}
                      className="h-10 pl-10 focus:ring-2 focus:ring-purple-600"
                      aria-label="Search address lists"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" className="h-10">
                          Advanced Filters
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Advanced Filters</SheetTitle>
                        </SheetHeader>
                        <div className="space-y-6 py-4">
                          <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={listStatusFilter} onValueChange={setListStatusFilter}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                    <Button
                      className="h-10 bg-purple-600 hover:bg-purple-700"
                      onClick={() => setShowCreateList(true)}
                    >
                      Create List
                    </Button>
                  </div>
                </div>

                <motion.div variants={cardVariants} initial="hidden" animate="visible">
                  {paginatedLists.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-600">
                      <Image
                        src="/placeholder.svg?height=80&width=80&query=no-lists"
                        alt="No Address Lists"
                        width={80}
                        height={80}
                        className="mb-6"
                      />
                      <h3 className="text-lg font-medium mb-4">No address lists found.</h3>
                      <Button
                        className="h-10 bg-purple-600 hover:bg-purple-700 hover:scale-105 transition-transform"
                        onClick={() => setShowCreateList(true)}
                      >
                        Create List
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-md border">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="py-3 pl-4 w-12">
                              <Checkbox
                                checked={selectedLists.length === paginatedLists.length && paginatedLists.length > 0}
                                onCheckedChange={handleSelectAllLists}
                                aria-label="Select all lists"
                              />
                            </th>
                            <th className="py-3 text-left text-sm font-medium cursor-pointer" onClick={() => handleSort("name", "list")}>
                              Lists {listSort.key === "name" && <ArrowUpDown className="inline h-4 w-4" />}
                            </th>
                            <th className="py-3 text-left text-sm font-medium cursor-pointer" onClick={() => handleSort("addressCount", "list")}>
                              Addresses {listSort.key === "addressCount" && <ArrowUpDown className="inline h-4 w-4" />}
                            </th>
                            <th className="py-3 text-left text-sm font-medium cursor-pointer" onClick={() => handleSort("creator", "list")}>
                              Creator {listSort.key === "creator" && <ArrowUpDown className="inline h-4 w-4" />}
                            </th>
                            <th className="py-3 text-left text-sm font-medium cursor-pointer" onClick={() => handleSort("createdTime", "list")}>
                              Created {listSort.key === "createdTime" && <ArrowUpDown className="inline h-4 w-4" />}
                            </th>
                            <th className="py-3 text-left text-sm font-medium cursor-pointer" onClick={() => handleSort("status", "list")}>
                              Status {listSort.key === "status" && <ArrowUpDown className="inline h-4 w-4" />}
                            </th>
                            <th className="py-3 pr-4 text-left text-sm font-medium">Operations</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedLists.map((list) => (
                            <tr key={list.id} className="border-t hover:bg-gray-50">
                              <td className="py-3 pl-4">
                                <Checkbox
                                  checked={selectedLists.includes(list.id)}
                                  onCheckedChange={(checked) => handleSelectList(list.id, !!checked)}
                                  aria-label={`Select list ${list.name}`}
                                />
                              </td>
                              <td className="py-3 text-sm">{list.name}</td>
                              <td className="py-3 text-sm">{list.addressCount}</td>
                              <td className="py-3 text-sm">{list.creator}</td>
                              <td className="py-3 text-sm">{list.createdTime}</td>
                              <td className="py-3 text-sm">
                                <Badge
                                  variant={
                                    list.status === "approved"
                                      ? "default"
                                      : list.status === "rejected"
                                      ? "destructive"
                                      : "secondary"
                                  }
                                  className="px-2 py-1"
                                >
                                  {list.status.charAt(0).toUpperCase() + list.status.slice(1)}
                                </Badge>
                              </td>
                              <td className="py-3 pr-4 flex gap-2">
                                {list.status === "pending" ? (
                                  <>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => handleOpenApprovalDialog(list)}
                                            aria-label={`Approve list ${list.name}`}
                                          >
                                            <Check className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Approve list</TooltipContent>
                                      </Tooltip>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => handleOpenApprovalDialog(list)}
                                            aria-label={`Reject list ${list.name}`}
                                          >
                                            <X className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Reject list</TooltipContent>
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
                                            onClick={() => {
                                              toast({
                                                title: "List Edited",
                                                description: `List "${list.name}" edited.`,
                                              })
                                            }}
                                            aria-label={`Edit list ${list.name}`}
                                          >
                                            <Edit className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Edit list</TooltipContent>
                                      </Tooltip>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => {
                                              toast({
                                                title: "List Deleted",
                                                description: `List "${list.name}" deleted.`,
                                              })
                                            }}
                                            aria-label={`Delete list ${list.name}`}
                                          >
                                            <Trash className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Delete list</TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
                {paginatedLists.length > 0 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-600">
                      Showing {paginatedLists.length} of {filteredLists.length} address lists
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setListPage((prev) => Math.max(prev - 1, 1))}
                        disabled={listPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-gray-600">
                        Page {listPage} of {totalListPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setListPage((prev) => Math.min(prev + 1, totalListPages))}
                        disabled={listPage === totalListPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Dialogs */}
        <Dialog open={showGoogleAuthenticator} onOpenChange={setShowGoogleAuthenticator}>
          <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Configure Google Authenticator
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Set up Google Authenticator for platform-wide MFA enforcement.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">1</div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Download App</h4>
                    <p className="text-sm text-gray-600">
                      Install Google Authenticator from the app store.
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
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">2</div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Scan QR Code</h4>
                    <p className="text-sm text-gray-600">Open Google Authenticator and scan the QR code.</p>
                    <div className="mt-2 flex justify-center rounded-lg bg-gray-100 p-4">
                      <div className="bg-white p-2">
                        <Image
                          src="/placeholder.svg?height=144&width=144&query=qr-code"
                          alt="QR Code"
                          width={144}
                          height={144}
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Or manually enter the following code:</p>
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
                                onClick={() => copyToClipboard("NEQQ7ETCDWYWXZCNW7ANQX6L3UI6RT25VBROCVH4IHCIOUQZ43CA")}
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
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">3</div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Complete Verification</h4>
                    <p className="text-sm text-gray-600">Enter the 6-digit code from Google Authenticator.</p>
                    <div className="mt-2">
                      <Label htmlFor="verification-code">Verification Code</Label>
                      <Input
                        id="verification-code"
                        placeholder="Enter 6-digit code"
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
                  className="h-10 border-gray-300 hover:bg-gray-100"
                  onClick={() => setShowGoogleAuthenticator(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="h-10 bg-blue-600 hover:bg-blue-700"
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
          <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                MFA Enforcement Options
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Choose MFA methods to enforce for all platform users.
              </DialogDescription>
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
                <p className="text-sm">Require at least one MFA method for all users to enhance security.</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-4 hover:shadow-sm transition-shadow">
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
                  <Button className="h-10 bg-blue-600 hover:bg-blue-700" onClick={() => setShowGoogleAuthenticator(true)}>
                    Configure
                  </Button>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4 hover:shadow-sm transition-shadow">
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
                  <Button className="h-10 bg-blue-600 hover:bg-blue-700">Configure</Button>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4 hover:shadow-sm transition-shadow">
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
                  <Button className="h-10 bg-blue-600 hover:bg-blue-700" onClick={() => setShowGoogleAuthenticator(true)}>
                    Configure
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showEmergencyPolicy} onOpenChange={setShowEmergencyPolicy}>
          <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Manage Emergency Policy
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Configure platform-wide emergency transaction policies.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
                <Check className="mt-0.5 h-5 w-5" />
                <p className="text-sm">This policy takes effect immediately and requires no approval.</p>
              </div>

              <RadioGroup value={emergencyPolicy} onValueChange={(value: "rejection" | "quorum") => setEmergencyPolicy(value)}>
                <div className="flex items-start gap-4 rounded-lg border p-4 hover:shadow-sm transition-shadow">
                  <RadioGroupItem value="rejection" id="rejection" className="mt-1" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="rejection" className="font-medium text-gray-900">
                      Auto Rejection
                    </Label>
                    <p className="text-sm text-gray-600">All transactions will be automatically rejected.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-lg border p-4 hover:shadow-sm transition-shadow">
                  <RadioGroupItem value="quorum" id="quorum" className="mt-1" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="quorum" className="font-medium text-gray-900">
                      Approval Quorum
                    </Label>
                    <p className="text-sm text-gray-600">
                      Transactions require a specified number of admin approvals.
                    </p>
                  </div>
                </div>
              </RadioGroup>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  className="h-10 border-gray-300 hover:bg-gray-100"
                  onClick={() => setShowEmergencyPolicy(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="h-10 bg-blue-600 hover:bg-blue-700"
                  onClick={handleEmergencyPolicySubmit}
                >
                  Submit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showCreatePolicy} onOpenChange={setShowCreatePolicy}>
          <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Create Transaction Policy
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Define a new transaction policy for the platform.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="policy-name">Policy Name</Label>
                <Input
                  id="policy-name"
                  placeholder="Enter policy name"
                  value={policyName}
                  onChange={(e) => setPolicyName(e.target.value)}
                  className="h-10 focus:ring-2 focus:ring-purple-600"
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
              <p className="text-sm text-gray-600">
                This policy will be applied to selected wallets based on the specified conditions.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="h-10 border-gray-300 hover:bg-gray-100"
                onClick={() => setShowCreatePolicy(false)}
              >
                Cancel
              </Button>
              <Button
                className="h-10 bg-blue-600 hover:bg-blue-700"
                onClick={handleCreatePolicy}
                disabled={!policyName}
              >
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showCreateList} onOpenChange={setShowCreateList}>
          <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Create Address List
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Create a new address list for transaction policies.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="list-name">List Name</Label>
                <Input
                  id="list-name"
                  placeholder="Enter list name"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  className="h-10 focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="list-addresses">Addresses (one per line)</Label>
                <textarea
                  id="list-addresses"
                  placeholder="Enter addresses"
                  value={listAddresses}
                  onChange={(e) => setListAddresses(e.target.value)}  
                  className="h-24 w-full border rounded-md focus:ring-2 focus:ring-purple-600"
                ></textarea>
              </div>
              <p className="text-sm text-gray-600">
                This list will be used for transaction policies.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="h-10 border-gray-300 hover:bg-gray-100"
                onClick={() => setShowCreateList(false)}
              >
                Cancel  
                </Button>
              <Button
                className="h-10 bg-blue-600 hover:bg-blue-700"
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
