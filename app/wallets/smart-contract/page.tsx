"use client"

import { useState } from "react"
import { Info, X } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function SmartContractWalletsPage() {
  const [showCreateWallet, setShowCreateWallet] = useState(false)
  const [showImportWallet, setShowImportWallet] = useState(false)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Smart Contract Wallets</h1>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">Developer</span>
            </div>
            <p className="text-muted-foreground">Manage your smart contract wallets</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>What are Smart Contract Wallets?</CardTitle>
                <CardDescription>
                  Smart Contract Wallets provide granular on-chain access control for Safe.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="text-primary">
                  <Info className="mr-2 h-4 w-4" />
                  What is Cobo Safe?
                </Button>
                <Button variant="outline" className="text-primary">
                  <Info className="mr-2 h-4 w-4" />
                  How to Set Up a Smart Contract Wallet?
                </Button>
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
                  className="text-muted-foreground"
                />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg font-medium mb-2"
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
                  onClick={() => setShowImportWallet(true)}
                  className="hover:scale-105 transition-transform"
                >
                  Import
                </Button>
                <Button
                  onClick={() => setShowCreateWallet(true)}
                  className="hover:scale-105 transition-transform"
                >
                  Create
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>

        {/* Create Smart Contract Wallet Modal */}
        <Dialog open={showCreateWallet} onOpenChange={setShowCreateWallet}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Create Smart Contract Wallet</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                onClick={() => setShowCreateWallet(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <h3 className="text-lg font-medium">Select a wallet to create</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="bg-teal-100 p-2 rounded-full">
                      <Image src="/secure-digital-wallet.png" alt="Safe Wallet" width={24} height={24} />
                    </div>
                    <div>
                      <div className="font-medium">Safe{"{Wallet}"}</div>
                      <div className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded inline-block">
                        With Cobo Safe Enabled
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Info className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 cursor-not-allowed">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Image src="/abstract-wallet-design.png" alt="AA Wallet" width={24} height={24} />
                    </div>
                    <div>
                      <div className="font-medium">AA Wallets</div>
                      <div className="text-xs text-orange-500 font-medium">Coming Soon</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowCreateWallet(false)}>
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
