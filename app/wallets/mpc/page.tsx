"use client"

import { useState } from "react"
import { ChevronDown, Info, X } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function MPCWalletsPage() {
  const [showCreateVault, setShowCreateVault] = useState(false)
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [showVaultInfo, setShowVaultInfo] = useState(true)
  const [showProjectInfo, setShowProjectInfo] = useState(true)
  const [projectName, setProjectName] = useState("")
  const [threshold, setThreshold] = useState("2/2")

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

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>What are MPC Wallets?</CardTitle>
                <CardDescription>
                  MPC Wallets use multi-party computation (MPC) technology to eliminate single points of failure.
                </CardDescription>
              </div>
              <Button variant="ghost" className="text-primary self-start">
                <Info className="mr-2 h-4 w-4" />
                Introduction and Demo for Creating MPC Wallets
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="organization">
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
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowCreateProject(false)}>
                Cancel
              </Button>
              <Button>Next</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
