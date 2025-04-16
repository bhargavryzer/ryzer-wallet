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
  // Define the type for the vault
  type Vault = {
    name: string;
    type: string;
    status: string;
    created: string;
    mainGroupCreated: boolean;
  }
  
  const [activeVault, setActiveVault] = useState<Vault | null>(null)
  const [activeTab, setActiveTab] = useState("organization")
  const [keyShareTab, setKeyShareTab] = useState("main")

  // Mock data for the vault view
  const mockVault = {
    name: "test vault",
    type: "Organization-Controlled",
    status: "Active",
    created: "2023-10-15",
    mainGroupCreated: false
  }

  const handleVaultCreated = () => {
    setActiveVault(mockVault)
    setShowCreateVault(false)
  }

  const handleMainGroupCreated = () => {
    setShowCreateMainGroup(false)
    // Update the mock vault to show main group is created
    if (activeVault) {
      setActiveVault({...activeVault, mainGroupCreated: true})
    } else {
      setActiveVault({...mockVault, mainGroupCreated: true})
    }
  }

  // Render the vault details view when a vault is active
  const renderVaultDetails = () => {
    return (
      <div className="space-y-6">
        {/* Vault Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Key className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{mockVault.name}</h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{mockVault.type}</Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {mockVault.status}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit Vault
            </Button>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Create Wallet
            </Button>
          </div>
        </div>

        {/* Extended Public Keys */}
        <Card>
          <CardHeader>
            <CardTitle>Extended Public Keys</CardTitle>
          </CardHeader>
          <CardContent>
            {!mockVault.mainGroupCreated ? (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">Not yet created. Please create a Main Group first.</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    The public and private keys for all wallets within this vault are derived from the corresponding extended public and private keys.
                  </p>
                  <Button variant="link" className="text-amber-600 p-0 h-auto mt-1">
                    Learn More
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-md">
                  <div>
                    <p className="text-sm font-medium">Extended Public Key (xpub)</p>
                    <p className="text-xs text-muted-foreground mt-1">xpub6CUGRUo...truncated...HTDM</p>
                  </div>
                  <div className="flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Copy to clipboard</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
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

        {/* Key Share Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Key Share Management</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-auto"
                onClick={() => setShowKeyShareVerification(true)}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Key Share Verification
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={keyShareTab} onValueChange={setKeyShareTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="main" className="flex items-center gap-1">
                  <Key className="h-4 w-4" />
                  Main Group
                </TabsTrigger>
                <TabsTrigger value="signing" className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Signing Groups
                </TabsTrigger>
                <TabsTrigger value="recovery" className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  Recovery Groups
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="main">
                {!mockVault.mainGroupCreated ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Image
                      src="/digital-wallet-batch.png"
                      alt="Main Group"
                      width={80}
                      height={80}
                      className="mb-6"
                    />
                    <h3 className="text-lg font-medium mb-2">Please create a Main Group first.</h3>
                    <Button 
                      onClick={() => setShowCreateMainGroup(true)} 
                      className="mb-8 hover:scale-105 transition-transform"
                    >
                      Create Main Group
                    </Button>

                    {showMainGroupInfo && (
                      <div className="w-full max-w-2xl bg-muted/20 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium flex items-center">
                            <Info className="h-4 w-4 mr-2" />
                            What is a Main Group?
                          </h4>
                          <Button variant="ghost" size="sm" onClick={() => setShowMainGroupInfo(false)}>
                            Collapse <ChevronDown className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm mb-2">
                          The Main Group is used to sign transactions and to create Signing Groups and Recovery Groups.
                        </p>
                        <p className="text-sm mb-2">
                          It operates on a 2-of-2 scheme, where Cobo and the organization each hold one key share. The organization's key share can be an API node or a Cobo Guard node.
                        </p>
                        <Button variant="link" className="text-sm p-0 h-auto">
                          Learn More
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-800">Main Group Created Successfully</h4>
                        <p className="text-sm text-green-700 mt-1">
                          Your Main Group is now active and can be used to create wallets and manage key shares.
                        </p>
                      </div>
                    </div>
                    
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
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Active
                            </Badge>
                          </TableCell>
                          <TableCell>Just now</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Organization</TableCell>
                          <TableCell>API Node</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
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
              
              <TabsContent value="signing">
                <div className="flex flex-col items-center justify-center py-12">
                  <Image
                    src="/interconnected-growth.png"
                    alt="Signing Groups"
                    width={80}
                    height={80}
                    className="mb-6"
                  />
                  <h3 className="text-lg font-medium mb-2">No Signing Groups Created Yet</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-4">
                    Signing Groups allow you to delegate transaction signing capabilities to specific groups of users.
                  </p>
                  <Button 
                    disabled={!mockVault.mainGroupCreated}
                    onClick={() => !mockVault.mainGroupCreated && setShowMainGroupRequired(true)}
                  >
                    Create Signing Group
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="recovery">
                <div className="flex flex-col items-center justify-center py-12">
                  <Image
                    src="/digital-invoice-flow.png"
                    alt="Recovery Groups"
                    width={80}
                    height={80}
                    className="mb-6"
                  />
                  <h3 className="text-lg font-medium mb-2">No Recovery Groups Created Yet</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-4">
                    Recovery Groups provide a secure way to recover access to your wallets in case of emergency.
                  </p>
                  <Button 
                    disabled={!mockVault.mainGroupCreated}
                    onClick={() => !mockVault.mainGroupCreated && setShowMainGroupRequired(true)}
                  >
                    Create Recovery Group
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render the initial vault creation view
  const renderVaultCreation = () => {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>What are MPC Wallets?</CardTitle>
              <CardDescription>
                MPC Wallets use multi-party computation (MPC) technology to eliminate single points of failure.
              </CardDescription>
            </div>
            <Button 
              variant="ghost" 
              className="text-primary self-start"
              onClick={() => setShowHelpTopics(true)}
            >
              <Info className="mr-2 h-4 w-4" />
              Introduction and Demo for Creating MPC Wallets
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="organization">Organization-Controlled Wallets</TabsTrigger>
              <TabsTrigger value="user">User-Controlled Wallets</TabsTrigger>
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
                    className="text-muted-foreground"
                  />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg font-medium mb-2"
                >
                  Please create a vault first
                </motion.h3>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    onClick={() => setShowCreateVault(true)}
                    className="mb-8 hover:scale-105 transition-transform"
                  >
                    Create Vault
                  </Button>
                </motion.div>

                {showVaultInfo && (
                  <div className="w-full max-w-2xl bg-muted/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium flex items-center">
                        <Info className="h-4 w-4 mr-2" />
                        What is a vault?
                      </h4>
                      <Button variant="ghost" size="sm" onClick={() => setShowVaultInfo(false)}>
                        Collapse <ChevronDown className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm mb-2">
                      A group of key shares will be generated for each vault. After the key shares are generated, you
                      can create multiple MPC wallets and addresses within this vault.
                    </p>
                    <p className="text-sm mb-2">
                      For an organization-controlled vault, clients (including enterprises or institutions)
                      participate in the management of key shares.
                    </p>
                    <Button variant="link" className="text-sm p-0 h-auto">
                      Learn More
                    </Button>
                  </div>
                )}
              </motion.div>
            </TabsContent>
            <TabsContent value="user" className="pt-6">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="mb-6">
                  <Image
                    src="/team-brainstorm.png"
                    alt="Project icon"
                    width={80}
                    height={80}
                    className="text-muted-foreground"
                  />
                </div>
                <h3 className="text-lg font-medium mb-2">Please create a project first</h3>
                <Button onClick={() => setShowCreateProject(true)} className="mb-8">
                  Create Project
                </Button>

                {showProjectInfo && (
                  <div className="w-full max-w-2xl bg-muted/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium flex items-center">
                        <Info className="h-4 w-4 mr-2" />
                        What is a User-Controlled Project?
                      </h4>
                      <Button variant="ghost" size="sm" onClick={() => setShowProjectInfo(false)}>
                        Collapse <ChevronDown className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm mb-2">
                      You can manage your end users' key shares and wallets within each project. When creating a
                      project, you need to set up a threshold signature scheme among the key share holders.
                    </p>
                    <Button variant="link" className="text-sm p-0 h-auto">
                      Learn More
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">MPC Wallets</h1>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">Developer</span>
            </div>
            <p className="text-muted-foreground">Manage your MPC wallets</p>
          </div>
        </div>

        {activeVault ? renderVaultDetails() : renderVaultCreation()}

        {/* Create Vault Modal */}
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
            <div className="space-y-4 py-4">
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
                <Select defaultValue="2/2" value={threshold} onValueChange={setThreshold}>
                  <SelectTrigger id="threshold">
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
              <Button variant="outline" onClick={() => setShowCreateVault(false)}>
                Cancel
              </Button>
              <Button onClick={handleVaultCreated}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Create Main Group Modal */}
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
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Key Share Holders</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Shield className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Cobo</p>
                        <p className="text-xs text-muted-foreground">TSS Test Node</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Ready
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Organization</p>
                        <p className="text-xs text-muted-foreground">API Node</p>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => setShowSecurityVerification(true)}>Set Up</Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowCreateMainGroup(false)}>
                Cancel
              </Button>
              <Button onClick={handleMainGroupCreated}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Security Verification Dialog */}
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
            <div className="space-y-4 py-4">
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">You have not set up Cobo Guard yet. For the security of your assets, please set up Cobo Guard first.</h4>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">Cobo Guard</div>
                  </div>
                </div>
                <Button>Set Up</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Main Group Required Dialog */}
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
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <p>Please set up the Main Group before creating Recovery Groups.</p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setShowMainGroupRequired(false)}>OK</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Key Share Verification Modal */}
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
              <div className="flex justify-end mb-4">
                <Button variant="outline" size="sm">
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
                  {/* Empty state */}
                  <TableRow>
                    <TableCell colSpan={5} className="h-40 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-4">
                          <Image
                            src="/digital-wallet-batch.png"
                            alt="No Data"
                            width={60}
                            height={60}
                          />
                        </div>
                        <p className="text-muted-foreground">No Data to Display</p>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>

        {/* Help Topics Dialog */}
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
                <div className="p-2 bg-primary/10 rounded-md text-primary font-medium">
                  Introduction and Demo for Creating MPC Wallets
                </div>
              </div>
              <div className="col-span-3">
                <h3 className="text-lg font-medium mb-4">Introduction and Demo for Creating MPC Wallets</h3>
                <div className="aspect-video bg-black rounded-md overflow-hidden mb-4">
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
                  <Button variant="outline">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Guide
                  </Button>
                  <Button onClick={() => setShowHelpTopics(false)}>Got It</Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Create Project Modal */}
        <Dialog open={showCreateProject} onOpenChange={setShowCreateProject}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Create Project</DialogTitle>
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
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="vault-name">Vault Name</Label>
                <Input
                  id="vault-name"
                  placeholder="Enter a name for your vault"
                  defaultValue="test vault"
                />
              </div>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  After creating a vault, you'll need to set up a Main Group to generate key shares before you can create wallets.
                </AlertDescription>
              </Alert>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateVault(false)}>
                Cancel
              </Button>
              <Button onClick={handleVaultCreated}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Main Group Modal */}
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
            <div className="space-y-4 py-4">
              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-500" />
                <AlertTitle className="text-blue-700">Cobo provides Server Co-Signers with a TSS test node</AlertTitle>
                <AlertDescription className="text-blue-600">
                  <ol className="list-decimal pl-4 space-y-2 mt-2">
                    <li>You can use it directly to generate key shares and test wallet functions.</li>
                    <li>You can also build your own node using our TSS program and explore key share management functions.</li>
                  </ol>
                  <Button variant="link" className="text-blue-600 p-0 h-auto mt-2">
                    Learn More
                  </Button>
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <h4 className="font-medium">Select Key Share Holders</h4>
                <div className="border rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>Key Share Holder 1</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="cobo-holder" className="rounded border-gray-300" checked readOnly />
                      <label htmlFor="cobo-holder">Cobo</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateMainGroup(false)}>
                Cancel
              </Button>
              <Button onClick={handleMainGroupCreated}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create User-Controlled Project Modal */}
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
            <div className="space-y-4 py-4">
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
                  <SelectTrigger id="threshold">
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
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateProject(false)}>
                Cancel
              </Button>
              <Button>Next</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
