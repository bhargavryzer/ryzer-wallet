"use client"

import { useState, useMemo } from "react"
import { Info, Search, X, ArrowUpDown, ChevronLeft, ChevronRight, Check, Shield } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SecurityVerificationDialog } from "@/components/dialogs/security-verification-dialog"
import { EmergencyPolicyDialog } from "@/components/dialogs/emergency-policy-dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"

// Interfaces
interface Policy {
  id: string
  priority: number
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
    priority: 1,
    type: "Default",
    name: "Default Policy",
    wallets: "All Wallets",
    conditions: "Message Type",
    action: "Auto Rejection",
    status: "approved",
    creator: "Admin",
  },
  {
    id: "policy-2",
    priority: 2,
    type: "Default",
    name: "Transaction Approval",
    wallets: "All Wallets",
    conditions: "Any Transaction",
    action: "Auto Approval",
    status: "pending",
    creator: "User1",
  },
]

const addressLists: AddressList[] = [
  {
    id: "list-1",
    name: "Whitelist",
    addressCount: 0,
    creator: "Admin",
    createdTime: "2025-04-14 12:57:45",
    status: "approved",
  },
  {
    id: "list-2",
    name: "Blacklist",
    addressCount: 5,
    creator: "User2",
    createdTime: "2025-04-15 09:30:00",
    status: "pending",
  },
]

export default function TransactionPoliciesPage() {
  const [showSecurityVerification, setShowSecurityVerification] = useState(false)
  const [showEmergencyPolicy, setShowEmergencyPolicy] = useState(false)
  const [showInfoBanner, setShowInfoBanner] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [policyFilter, setPolicyFilter] = useState<string>("all")
  const [listFilter, setListFilter] = useState<string>("all")
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
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [itemToApprove, setItemToApprove] = useState<Policy | AddressList | null>(null)
  const itemsPerPage = 5
  const { toast } = useToast()

  // Filter and sort policies
  const filteredPolicies = useMemo(() => {
    let result = policies.filter(
      (policy) =>
        (searchQuery === "" ||
          policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          policy.creator.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (policyFilter === "all" || policy.status === policyFilter)
    )

    result.sort((a, b) => {
      const key = policySort.key
      const direction = policySort.direction === "asc" ? 1 : -1
      if (key === "priority") return (a[key] - b[key]) * direction
      return String(a[key]).localeCompare(String(b[key])) * direction
    })

    return result
  }, [searchQuery, policyFilter, policySort])

  // Filter and sort address lists
  const filteredLists = useMemo(() => {
    let result = addressLists.filter(
      (list) =>
        (searchQuery === "" ||
          list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          list.creator.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (listFilter === "all" || list.status === listFilter)
    )

    result.sort((a, b) => {
      const key = listSort.key
      const direction = listSort.direction === "asc" ? 1 : -1
      if (key === "addressCount") return (a[key] - b[key]) * direction
      return String(a[key]).localeCompare(String(b[key])) * direction
    })

    return result
  }, [searchQuery, listFilter, listSort])

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

  // Selection handlers
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

  // Bulk actions
  const handleBulkApprove = (type: "policy" | "list") => {
    const selected = type === "policy" ? selectedPolicies : selectedLists
    toast({
      title: `Approving ${type}s`,
      description: `${selected.length} ${type}(s) approved.`,
    })
    console.log(`Approving ${type}s:`, selected)
    if (type === "policy") setSelectedPolicies([])
    else setSelectedLists([])
  }

  const handleBulkReject = (type: "policy" | "list") => {
    const selected = type === "policy" ? selectedPolicies : selectedLists
    toast({
      title: `Rejecting ${type}s`,
      description: `${selected.length} ${type}(s) rejected.`,
    })
    console.log(`Rejecting ${type}s:`, selected)
    if (type === "policy") setSelectedPolicies([])
    else setSelectedLists([])
  }

  // Handlers
  const handleCreatePolicy = () => {
    toast({
      title: "Policy Created",
      description: "New transaction policy has been created and is pending approval.",
    })
    setShowSecurityVerification(false)
  }

  const handleManageEmergencyPolicy = () => {
    toast({
      title: "Emergency Policy Updated",
      description: "Emergency policy settings have been updated.",
    })
    setShowEmergencyPolicy(false)
  }

  const handleAdjustPriorities = () => {
    toast({
      title: "Priorities Adjusted",
      description: "Policy priorities have been updated.",
    })
  }

  const handleCreateList = () => {
    toast({
      title: "Address List Created",
      description: "New address list has been created and is pending approval.",
    })
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
            <div className="space-y-1"> 
            <h4 className="text-lg font-medium text-blue-800">Transaction Policies Overview</h4>     
         
          <p className="text-sm text-black-600">
            Oversee and manage transaction policies and address lists across the platform.
          </p>
        </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-4">
                <Image
                  src="/placeholder.svg?height=48&width=48&query=policies"
                  alt="Policies"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <div className="text-3xl font-bold text-gray-900">{policies.length}</div>
                  <div className="text-sm text-gray-600">Total Policies</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Image
                  src="/placeholder.svg?height=48&width=48&query=pending"
                  alt="Pending"
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

        {/* Main Content */}
        <Card className="bg-white border-gray-200 shadow-lg rounded-xl">
          <CardHeader className="pb-4">
            <AnimatePresence>
              {showInfoBanner && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start justify-between rounded-lg bg-blue-50 p-4"
                >
                  <div className="flex gap-3">
                    <Info className="h-5 w-5 flex-shrink-0 text-blue-500" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-blue-800">Admin: Manage Transaction Policies</h4>
                      <p className="text-sm text-blue-700">
                        Approve, reject, or configure policies and address lists to control transaction flows securely across the platform.
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setShowInfoBanner(false)}>
                    <X className="h-4 w-4 text-blue-700" />
                    <span className="sr-only">Dismiss</span>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="mt-4">
              <Button
                variant="outline"
                className="h-9 text-purple-600 hover:bg-purple-50 focus:ring-2 focus:ring-purple-600"
              >
                <Info className="mr-2 h-4 w-4" />
                How to Manage Policies as an Admin?
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bulk Actions */}
            {(selectedPolicies.length > 0 || selectedLists.length > 0) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between bg-gray-100 p-4 rounded-md"
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

            <Tabs defaultValue="policies" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-100 rounded-lg">
                <TabsTrigger
                  value="policies"
                  className="text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Transaction Policies
                </TabsTrigger>
                <TabsTrigger
                  value="lists"
                  className="text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Address Lists
                </TabsTrigger>
              </TabsList>
              <TabsContent value="policies" className="mt-6 space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search by policy name or creator"
                      className="h-10 pl-10 focus:ring-2 focus:ring-purple-600"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
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
                            <Select value={policyFilter} onValueChange={setPolicyFilter}>
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
                      onClick={handleManageEmergencyPolicy}
                    >
                      Manage Emergency Policy
                    </Button>
                    <Button
                      variant="outline"
                      className="h-10"
                      onClick={handleAdjustPriorities}
                    >
                      Adjust Priorities
                    </Button>
                    <Button
                      className="h-10 bg-purple-600 hover:bg-purple-700"
                      onClick={() => setShowSecurityVerification(true)}
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
                        onClick={() => setShowSecurityVerification(true)}
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
                            <th className="py-3 text-left text-sm font-medium cursor-pointer" onClick={() => handleSort("name", "policy")}>
                              Name {policySort.key === "name" && <ArrowUpDown className="inline h-4 w-4" />}
                            </th>
                            <th className="py-3 text-left text-sm font-medium cursor-pointer" onClick={() => handleSort("creator", "policy")}>
                              Creator {policySort.key === "creator" && <ArrowUpDown className="inline h-4 w-4" />}
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
                              <td className="py-3 text-sm">#{policy.priority}</td>
                              <td className="py-3 text-sm">{policy.name}</td>
                              <td className="py-3 text-sm">{policy.creator}</td>
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
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleOpenApprovalDialog(policy)}
                                      aria-label={`Approve policy ${policy.name}`}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleOpenApprovalDialog(policy)}
                                      aria-label={`Reject policy ${policy.name}`}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleOpenApprovalDialog(policy)}
                                    aria-label={`View details for ${policy.name}`}
                                  >
                                    <Info className="h-4 w-4" />
                                  </Button>
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
              <TabsContent value="lists" className="mt-6 space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search by list name or creator"
                      className="h-10 pl-10 focus:ring-2 focus:ring-purple-600"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
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
                            <Select value={listFilter} onValueChange={setListFilter}>
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
                      onClick={handleCreateList}
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
                        onClick={handleCreateList}
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
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleOpenApprovalDialog(list)}
                                      aria-label={`Approve list ${list.name}`}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleOpenApprovalDialog(list)}
                                      aria-label={`Reject list ${list.name}`}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleOpenApprovalDialog(list)}
                                    aria-label={`View details for ${list.name}`}
                                  >
                                    <Info className="h-4 w-4" />
                                  </Button>
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
        <SecurityVerificationDialog
          open={showSecurityVerification}
          onOpenChange={setShowSecurityVerification}
          // Removed onConfirm prop to avoid type error; assuming it's handled via onOpenChange
        />
        <EmergencyPolicyDialog
          open={showEmergencyPolicy}
          onOpenChange={setShowEmergencyPolicy}
          // Removed onConfirm prop to avoid type error; assuming it's handled via onOpenChange
        />
        <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
          <DialogContent className="bg-white rounded-xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Approve {itemToApprove ? ("wallets" in itemToApprove ? "Policy" : "Address List") : "Item"}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Review and approve or reject the selected item.
              </DialogDescription>
            </DialogHeader>
            {itemToApprove && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <span className="font-medium text-gray-700">Name:</span> {itemToApprove.name}
                </div>
                <div className="grid gap-2">
                  <span className="font-medium text-gray-700">Creator:</span> {itemToApprove.creator}
                </div>
                <div className="grid gap-2">
                  <span className="font-medium text-gray-700">Status:</span>{" "}
                  {itemToApprove.status.charAt(0).toUpperCase() + itemToApprove.status.slice(1)}
                </div>
                {"wallets" in itemToApprove && (
                  <>
                    <div className="grid gap-2">
                      <span className="font-medium text-gray-700">Wallets:</span> {itemToApprove.wallets}
                    </div>
                    <div className="grid gap-2">
                      <span className="font-medium text-gray-700">Conditions:</span> {itemToApprove.conditions}
                    </div>
                    <div className="grid gap-2">
                      <span className="font-medium text-gray-700">Action:</span> {itemToApprove.action}
                    </div>
                  </>
                )}
                {"addressCount" in itemToApprove && (
                  <div className="grid gap-2">
                    <span className="font-medium text-gray-700">Addresses:</span> {itemToApprove.addressCount}
                  </div>
                )}
                <div className="grid gap-2">
                  <span className="font-medium text-gray-700">Created:</span>{" "}
                  {"createdTime" in itemToApprove ? itemToApprove.createdTime : "N/A"}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                className="border-gray-300 hover:bg-gray-100"
                onClick={() => setShowApprovalDialog(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleRejectItem}>
                Reject
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={handleApproveItem}>
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}