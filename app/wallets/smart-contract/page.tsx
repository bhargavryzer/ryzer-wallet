"use client"

import { useState } from "react"
import { Info, X } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function SmartContractWalletsPage() {
  const [showCreateWallet, setShowCreateWallet] = useState(false)
  const [showImportWallet, setShowImportWallet] = useState(false)
  const [walletType, setWalletType] = useState<"safe" | "aa" | null>(null)
  const [walletName, setWalletName] = useState("")
  const [walletAddress, setWalletAddress] = useState("")

  const handleCreateWallet = () => {
    // Implement wallet creation logic here
    setShowCreateWallet(false)
    setWalletName("")
    setWalletType(null)
  }

  const handleImportWallet = () => {
    // Implement wallet import logic here
    setShowImportWallet(false)
    setWalletAddress("")
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-semibold tracking-tight">Smart Contract Wallets</h1>
              <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">Developer</span>
            </div>
            <p className="text-sm text-muted-foreground">Manage your smart contract wallets</p>
          </div>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl font-medium">What are Smart Contract Wallets?</CardTitle>
                <CardDescription className="text-sm">
                  Smart Contract Wallets provide granular on-chain access control for Safe.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" className="h-9 text-primary">
                        <Info className="mr-2 h-4 w-4" />
                        What is Cobo Safe?
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Cobo Safe Guide</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" className="h-9 text-primary">
                        <Info className="mr-2 h-4 w-4" />
                        How to Set Up?
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Setup Guide</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardHeader>
          <CardContent>
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
                  src="/interconnected-contracts.png"
                  alt="Smart Contract Wallet icon"
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
                Please create or import a Smart Contract Wallet first.
              </motion.h3>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-4 mb-8"
              >
                <Button
                  variant="outline"
                  className="h-10 hover:scale-105 transition-transform"
                  onClick={() => setShowImportWallet(true)}
                >
                  Import
                </Button>
                <Button
                  className="h-10 hover:scale-105 transition-transform"
                  onClick={() => setShowCreateWallet(true)}
                >
                  Create
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>

        <Dialog open={showCreateWallet} onOpenChange={setShowCreateWallet}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Create Smart Contract Wallet</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                onClick={() => {
                  setShowCreateWallet(false)
                  setWalletType(null)
                  setWalletName("")
                }}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {!walletType ? (
                <>
                  <h3 className="text-lg font-medium">Select a wallet to create</h3>
                  <div className="space-y-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      className="flex cursor-pointer items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
                      onClick={() => setWalletType("safe")}
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-teal-100 p-2">
                          <Image src="/secure-digital-wallet.png" alt="Safe Wallet" width={24} height={24} />
                        </div>
                        <div>
                          <div className="font-medium">Safe{"{Wallet}"}</div>
                          <div className="inline-block rounded bg-green-100 px-2 py-0.5 text-xs text-green-800">
                            With Cobo Safe Enabled
                          </div>
                        </div>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                              <Info className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Safe Wallet Info</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </motion.div>

                    <div className="flex items-center justify-between rounded-lg border bg-gray-50 p-4 opacity-50">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-blue-100 p-2">
                          <Image src="/abstract-wallet-design.png" alt="AA Wallet" width={24} height={24} />
                        </div>
                        <div>
                          <div className="font-medium">AA Wallets</div>
                          <div className="text-xs font-medium text-orange-500">Coming Soon</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-medium">Configure SafeWallet</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="wallet-name">Wallet Name</Label>
                      <Input
                        id="wallet-name"
                        placeholder="Enter wallet name"
                        value={walletName}
                        onChange={(e) => setWalletName(e.target.value)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      This wallet will be created with Cobo Safe enabled for enhanced security.
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="h-10"
                onClick={() => {
                  if (walletType) {
                    setWalletType(null)
                    setWalletName("")
                  } else {
                    setShowCreateWallet(false)
                  }
                }}
              >
                {walletType ? "Back" : "Cancel"}
              </Button>
              {walletType && (
                <Button
                  className="h-10"
                  onClick={handleCreateWallet}
                  disabled={!walletName}
                >
                  Create
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showImportWallet} onOpenChange={setShowImportWallet}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Import Smart Contract Wallet</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                onClick={() => setShowImportWallet(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <h3 className="text-lg font-medium">Import an existing wallet</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="wallet-address">Wallet Address</Label>
                  <Input
                    id="wallet-address"
                    placeholder="Enter wallet contract address"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Ensure the address belongs to a supported smart contract wallet (e.g., SafeWallet).
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="h-10"
                onClick={() => setShowImportWallet(false)}
              >
                Cancel
              </Button>
              <Button
                className="h-10"
                onClick={handleImportWallet}
                disabled={!walletAddress}
              >
                Import
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}