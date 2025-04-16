"use client"

import { useState } from "react"
import { ChevronDown, Info, X, Plus, Check, AlertCircle, Copy, ExternalLink, Edit, Key, Users, Shield, Filter } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function MPCWalletsPage() {
  const [showCreateVault, setShowCreateVault] = useState(false)
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [showCreateMainGroup, setShowCreateMainGroup] = useState(false)
  const [showVaultInfo, setShowVaultInfo] = useState(true)
  const [showProjectInfo, setShowProjectInfo] = useState(true)
  const [showMainGroupInfo, setShowMainGroupInfo] = useState(true)
  const [showSecurityVerification, setShowSecurityVerification] = useState(false)
  const [showMainGroupRequired, setShowMainGroupRequired] = useState(false)
  const [showKeyShareVerification, setShowKeyShareVerification] = useState(false)
  const [showHelpTopics, setShowHelpTopics] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [threshold, setThreshold] = useState("2/2")
  const [activeTab, setActiveTab] = useState("organization")
  const [keyShareTab, setKeyShareTab] = useState("main")

  type Vault = {
    name: string
    type: string
    status: string
    created: string
    mainGroupCreated: boolean
  }

  const [activeVault, setActiveVault] = useState<Vault | null>(null)

  // Mock data for the vault view
  const mockVault = {
    name: "Test Vault",
    type: "Organization-Controlled",
    status: "Active",
    created: "2023-10-15",
    mainGroupCreated: false,
  }

  const handleVaultCreated = () => {
    setActiveVault({ ...mockVault, name: projectName || mockVault.name })
    setShowCreateVault(false)
    setProjectName("")
  }

  const handleMainGroupCreated = () => {
    setShowCreateMainGroup(false)
    if (activeVault) {
      setActiveVault({ ...activeVault, mainGroupCreated: true })
    } else {
      setActiveVault({ ...mockVault, mainGroupCreated: true })
    }
  }

  const handleProjectCreated = () => {
    setShowCreateProject(false)
    setProjectName("")
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const renderVaultDetails = () => {
    return (
      <div className="space-y-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-2">
              <Key className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{activeVault?.name}</h2>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  {activeVault?.type}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  {activeVault?.status}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-10">
              <Edit className="mr-2 h-4 w-4" />
              Edit Vault
            </Button>
            <Button className="h-10">
              <Plus className="mr-2 h-4 w-4" />
              Create Wallet
            </Button>
          </div>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Extended Public Keys</CardTitle>
          </CardHeader>
          <CardContent>
            {!activeVault?.mainGroupCreated ? (
              <Alert variant="default">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Main Group Required</AlertTitle>
                <AlertDescription>
                  Please create a Main Group to generate extended public keys.
                  <Button
                    variant="link"
                    className="p-0 text-amber-600 h-auto mt-2"
                    onClick={() => setShowCreateMainGroup(true)}
                  >
                    Create Now
                  </Button>
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-md bg-muted/30 p-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Extended Public Key (xpub)</p>
                    <p className="text-xs text-muted-foreground">
                      xpub6CUGRUo...HTDM
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => copyToClipboard("xpub6CUGRUo...HTDM")}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Copy to clipboard</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View on explorer</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Key Share Management</CardTitle>
              <Button
                variant="outline"
                className="h-10"
                onClick={() => setShowKeyShareVerification(true)}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Key Share Verification
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={keyShareTab} onValueChange={setKeyShareTab} className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="main" className="text-sm">
                  <Key className="mr-2 h-4 w-4" />
                  Main Group
                </TabsTrigger>
                <TabsTrigger value="signing" className="text-sm">
                  <Users className="mr-2 h-4 w-4" />
                  Signing Groups
                </TabsTrigger>
                <TabsTrigger value="recovery" className="text-sm">
                  <Shield className="mr-2 h-4 w-4" />
                  Recovery Groups
                </TabsTrigger>
              </TabsList>

              <TabsContent value="main" className="mt-6">
                {!activeVault?.mainGroupCreated ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center justify-center py-12"
                  >
                    <Image
                      src="/digital-wallet-batch.png"
                      alt="Main Group"
                      width={80}
                      height={80}
                      className="mb-6"
                    />
                    <h3 className="text-lg font-medium mb-4">
                      Please create a Main Group first
                    </h3>
                    <Button
                      className="mb-8 hover:scale-105 transition-transform"
                      onClick={() => setShowCreateMainGroup(true)}
                    >
                      Create Main Group
                    </Button>

                    {showMainGroupInfo && (
                      <div className="w-full max-w-2xl rounded-lg bg-muted/20 p-5">
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="flex items-center text-base font-medium">
                            <Info className="mr-2 h-4 w-4" />
                            What is a Main Group?
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowMainGroupInfo(false)}
                          >
                            Collapse <ChevronDown className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                        <p className="mb-2 text-sm text-muted-foreground">
                          The Main Group is used to sign transactions and to create Signing Groups and Recovery Groups.
                        </p>
                        <p className="mb-2 text-sm text-muted-foreground">
                          It operates on a 2-of-2 scheme, where Cobo and the organization each hold one key share. The organization's key share can be an API node or a Cobo Guard node.
                        </p>
                        <Button
                          variant="link"
                          className="h-auto p-0 text-sm text-primary"
                        >
                          Learn More
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    <Alert variant="default">
                      <Check className="h-5 w-5" />
                      <AlertTitle>Main Group Created</AlertTitle>
                      <AlertDescription>
                        Your Main Group is active and ready for wallet creation and key share management.
                      </AlertDescription>
                    </Alert>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Key Share Holder</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Last Active</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Cobo</TableCell>
                          <TableCell>TSS Test Node</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              Active
                            </Badge>
                          </TableCell>
                          <TableCell>Just now</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Organization</TableCell>
                          <TableCell>API Node</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              Active
                            </Badge>
                          </TableCell>
                          <TableCell>Just now</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="signing" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center justify-center py-12"
                >
                  <Image
                    src="/interconnected-growth.png"
                    alt="Signing Groups"
                    width={80}
                    height={80}
                    className="mb-6"
                  />
                  <h3 className="text-lg font-medium mb-4">
                    No Signing Groups Created
                  </h3>
                  <p className="mb-4 max-w-md text-center text-sm text-muted-foreground">
                    Signing Groups allow you to delegate transaction signing capabilities to specific groups of users.
                  </p>
                  <Button
                    disabled={!activeVault?.mainGroupCreated}
                    onClick={() => !activeVault?.mainGroupCreated && setShowMainGroupRequired(true)}
                  >
                    Create Signing Group
                  </Button>
                </motion.div>
              </TabsContent>

              <TabsContent value="recovery" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center justify-center py-12"
                >
                  <Image
                    src="/digital-invoice-flow.png"
                    alt="Recovery Groups"
                    width={80}
                    height={80}
                    className="mb-6"
                  />
                  <h3 className="text-lg font-medium mb-4">
                    No Recovery Groups Created
                  </h3>
                  <p className="mb-4 max-w-md text-center text-sm text-muted-foreground">
                    Recovery Groups provide a secure way to recover access to your wallets in case of emergency.
                  </p>
                  <Button
                    disabled={!activeVault?.mainGroupCreated}
                    onClick={() => !activeVault?.mainGroupCreated && setShowMainGroupRequired(true)}
                  >
                    Create Recovery Group
                  </Button>
                </motion.div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderVaultCreation = () => {
    return (
      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl font-medium">What are MPC Wallets?</CardTitle>
              <CardDescription className="text-sm">
                MPC Wallets use multi-party computation (MPC) technology to eliminate single points of failure.
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              className="h-9 text-primary"
              onClick={() => setShowHelpTopics(true)}
            >
              <Info className="mr-2 h-4 w-4" />
              Introduction and Demo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="organization" className="text-sm">
                Organization-Controlled
              </TabsTrigger>
              <TabsTrigger value="user" className="text-sm">
                User-Controlled
              </TabsTrigger>
            </TabsList>
            <TabsContent value="organization" className="pt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="mb-6"
                >
                  <Image
                    src="/leather-wallet-contents.png"
                    alt="Vault icon"
                    width={80}
                    height={80}
                  />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg font-medium mb-4"
                >
                  Please create a vault first
                </motion.h3>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    className="mb-8 hover:scale-105 transition-transform"
                    onClick={() => setShowCreateVault(true)}
                  >
                    Create Vault
                  </Button>
                </motion.div>

                {showVaultInfo && (
                  <div className="w-full max-w-2xl rounded-lg bg-muted/20 p-5">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="flex items-center text-base font-medium">
                        <Info className="mr-2 h-4 w-4" />
                        What is a vault?
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowVaultInfo(false)}
                      >
                        Collapse <ChevronDown className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                    <p className="mb-2 text-sm text-muted-foreground">
                      A group of key shares will be generated for each vault. After the key shares are generated, you can create multiple MPC wallets and addresses within this vault.
                    </p>
                    <p className="mb-2 text-sm text-muted-foreground">
                      For an organization-controlled vault, clients (including enterprises or institutions) participate in the management of key shares.
                    </p>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-sm text-primary"
                    >
                      Learn More
                    </Button>
                  </div>
                )}
              </motion.div>
            </TabsContent>
            <TabsContent value="user" className="pt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="mb-6"
                >
                  <Image
                    src="/team-brainstorm.png"
                    alt="Project icon"
                    width={80}
                    height={80}
                  />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg font-medium mb-4"
                >
                  Please create a project first
                </motion.h3>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    className="mb-8 hover:scale-105 transition-transform"
                    onClick={() => setShowCreateProject(true)}
                  >
                    Create Project
                  </Button>
                </motion.div>

                {showProjectInfo && (
                  <div className="w-full max-w-2xl rounded-lg bg-muted/20 p-5">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="flex items-center text-base font-medium">
                        <Info className="mr-2 h-4 w-4" />
                        What is a User-Controlled Project?
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowProjectInfo(false)}
                      >
                        Collapse <ChevronDown className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                    <p className="mb-2 text-sm text-muted-foreground">
                      You can manage your end users' key shares and wallets within each project. When creating a project, you need to set up a threshold signature scheme among the key share holders.
                    </p>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-sm text-primary"
                    >
                      Learn More
                    </Button>
                  </div>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-semibold tracking-tight">MPC Wallets</h1>
              <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">Developer</span>
            </div>
            <p className="text-sm text-muted-foreground">Manage your MPC wallets</p>
          </div>
        </div>

        {activeVault ? renderVaultDetails() : renderVaultCreation()}

        <Dialog open={showCreateVault} onOpenChange={setShowCreateVault}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Create Vault</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                onClick={() => setShowCreateVault(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="vault-name">Vault Name</Label>
                <Input
                  id="vault-name"
                  placeholder="Enter vault name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="threshold">Threshold Signature Scheme</Label>
                <Select value={threshold} onValueChange={setThreshold}>
                  <SelectTrigger id="threshold" className="h-10">
                    <SelectValue placeholder="Select threshold" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2/2">2-of-2</SelectItem>
                    <SelectItem value="2/3">2-of-3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground">
                This will create a vault with a {threshold} threshold signature scheme, requiring multiple parties to sign transactions.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="h-10"
                onClick={() => setShowCreateVault(false)}
              >
                Cancel
              </Button>
              <Button
                className="h-10"
                onClick={handleVaultCreated}
                disabled={!projectName}
              >
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showCreateMainGroup} onOpenChange={setShowCreateMainGroup}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Create Main Group</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                onClick={() => setShowCreateMainGroup(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-3">
                <Label>Key Share Holders</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-md bg-muted/30 p-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Shield className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Cobo</p>
                        <p className="text-xs text-muted-foreground">TSS Test Node</p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      Ready
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-md bg-muted/30 p-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Organization</p>
                        <p className="text-xs text-muted-foreground">API Node</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSecurityVerification(true)}
                    >
                      Set Up
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="h-10"
                onClick={() => setShowCreateMainGroup(false)}
              >
                Cancel
              </Button>
              <Button className="h-10" onClick={handleMainGroupCreated}>
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showSecurityVerification} onOpenChange={setShowSecurityVerification}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Security Verification</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                onClick={() => setShowSecurityVerification(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <Alert variant="default">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Cobo Guard Setup Required</AlertTitle>
                <AlertDescription>
                  For the security of your assets, please set up Cobo Guard first.
                </AlertDescription>
              </Alert>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">Cobo Guard</div>
                  </div>
                </div>
                <Button variant="outline" className="h-10">
                  Set Up
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showMainGroupRequired} onOpenChange={setShowMainGroupRequired}>
          <DialogContent className="sm:max-w-xs">
            <DialogHeader>
              <DialogTitle className="text-xl">Main Group Required</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                onClick={() => setShowMainGroupRequired(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogHeader>
            <div className="py-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-amber-500" />
                <p className="text-sm">
                  Please set up the Main Group before creating Recovery Groups.
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                className="h-10"
                onClick={() => setShowMainGroupRequired(false)}
              >
                OK
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showKeyShareVerification} onOpenChange={setShowKeyShareVerification}>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-xl">Key Share Verification</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                onClick={() => setShowKeyShareVerification(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogHeader>
            <div className="py-4">
              <div className="mb-4 flex justify-end">
                <Button variant="outline" className="h-10">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Group</TableHead>
                    <TableHead>Key Share Holder</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verification Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5} className="h-40 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Image
                          src="/digital-wallet-batch.png"
                          alt="No Data"
                          width={60}
                          height={60}
                          className="mb-4"
                        />
                        <p className="text-sm text-muted-foreground">
                          No Data to Display
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showHelpTopics} onOpenChange={setShowHelpTopics}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl">Help Topics</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                onClick={() => setShowHelpTopics(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogHeader>
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1 border-r pr-4">
                <div className="rounded-md bg-primary/10 p-2 text-sm font-medium text-primary">
                  Introduction and Demo for Creating MPC Wallets
                </div>
              </div>
              <div className="col-span-3 space-y-4">
                <h3 className="text-lg font-medium">
                  Introduction and Demo for Creating MPC Wallets
                </h3>
                <div className="aspect-video overflow-hidden rounded-md bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="Introduction to Cobo's MPC Wallets"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" className="h-10">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Guide
                  </Button>
                  <Button
                    className="h-10"
                    onClick={() => setShowHelpTopics(false)}
                  >
                    Got It
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showCreateProject} onOpenChange={setShowCreateProject}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Create User-Controlled Project</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                onClick={() => setShowCreateProject(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter a name for your project"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="threshold">Threshold of Signing Group</Label>
                <Select value={threshold} onValueChange={setThreshold}>
                  <SelectTrigger id="threshold" className="h-10">
                    <SelectValue placeholder="Select threshold" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2/2">2/2</SelectItem>
                    <SelectItem value="2/3">2/3</SelectItem>
                    <SelectItem value="3/3">3/3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground">
                When creating a project, you need to set up a threshold signature scheme among the key share holders.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="h-10"
                onClick={() => setShowCreateProject(false)}
              >
                Cancel
              </Button>
              <Button
                className="h-10"
                onClick={handleProjectCreated}
                disabled={!projectName}
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