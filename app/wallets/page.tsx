"use client"

import { useState } from "react"
import { ArrowRight, CreditCard, Plus, Search, Shield, Wallet } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { EmptyState } from "@/components/empty-state"
import { WalletCard } from "@/components/wallet-card"

// Sample wallet data
const wallets = [
  {
    id: "wallet-1",
    name: "Main Wallet",
    type: "custodial",
    balance: "$12,450.00",
    tokens: 3,
    address: "0x1a2b3c4d5e6f7g8h9i0j",
  },
  {
    id: "wallet-2",
    name: "Investment Wallet",
    type: "mpc",
    balance: "$45,230.50",
    tokens: 5,
    address: "0x9i8h7g6f5e4d3c2b1a0",
  },
]

export default function WalletsPage() {
  const [showCreateWallet, setShowCreateWallet] = useState(false)
  const [walletType, setWalletType] = useState("mpc")
  const [walletName, setWalletName] = useState("")
  const [blockchain, setBlockchain] = useState("")

  const handleCreateWallet = () => {
    // In a real app, this would create a wallet and add it to the list
    setShowCreateWallet(false)
    setWalletName("")
    setBlockchain("")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Wallets</h1>
            <p className="text-muted-foreground">Manage your custodial, MPC, and smart contract wallets</p>
          </div>
          <Button onClick={() => setShowCreateWallet(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Wallet
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Custodial Wallets</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,450.00</div>
              <p className="text-xs text-muted-foreground">1 wallet</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">MPC Wallets</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,230.50</div>
              <p className="text-xs text-muted-foreground">1 wallet</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Smart Contract Wallets</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0</div>
              <p className="text-xs text-muted-foreground">0 wallets</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Exchange Wallets</CardTitle>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-muted-foreground"
              >
                <path
                  d="M18 7L12 13L6 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18 17L12 11L6 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0</div>
              <p className="text-xs text-muted-foreground">0 wallets</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Wallets</CardTitle>
            <CardDescription>View and manage all your wallets</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="custodial">Custodial</TabsTrigger>
                <TabsTrigger value="mpc">MPC</TabsTrigger>
                <TabsTrigger value="smart">Smart Contract</TabsTrigger>
                <TabsTrigger value="exchange">Exchange</TabsTrigger>
              </TabsList>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search wallets..." className="pl-8 w-full md:w-[300px]" />
                </div>
                <Button variant="outline">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2"
                  >
                    <path
                      d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Filter
                </Button>
              </div>
              <TabsContent value="all" className="mt-0">
                {wallets.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {wallets.map((wallet) => (
                      <Link href={`/wallets/${wallet.id}`} key={wallet.id}>
                        <WalletCard
                          name={wallet.name}
                          type={wallet.type}
                          balance={wallet.balance}
                          tokens={wallet.tokens}
                          address={wallet.address}
                        />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<Wallet className="h-8 w-8 text-muted-foreground" />}
                    title="No wallets found"
                    description="You haven't created any wallets yet. Create your first wallet to get started."
                    actionLabel="Create Wallet"
                    onAction={() => setShowCreateWallet(true)}
                  />
                )}
              </TabsContent>
              <TabsContent value="custodial" className="mt-0">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {wallets
                    .filter((wallet) => wallet.type === "custodial")
                    .map((wallet) => (
                      <Link href={`/wallets/${wallet.id}`} key={wallet.id}>
                        <WalletCard
                          name={wallet.name}
                          type={wallet.type}
                          balance={wallet.balance}
                          tokens={wallet.tokens}
                          address={wallet.address}
                        />
                      </Link>
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="mpc" className="mt-0">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {wallets
                    .filter((wallet) => wallet.type === "mpc")
                    .map((wallet) => (
                      <Link href={`/wallets/${wallet.id}`} key={wallet.id}>
                        <WalletCard
                          name={wallet.name}
                          type={wallet.type}
                          balance={wallet.balance}
                          tokens={wallet.tokens}
                          address={wallet.address}
                        />
                      </Link>
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="smart" className="mt-0">
                <EmptyState
                  icon={<Wallet className="h-8 w-8 text-muted-foreground" />}
                  title="No smart contract wallets found"
                  description="You haven't created any smart contract wallets yet."
                  actionLabel="Create Smart Contract Wallet"
                  onAction={() => setShowCreateWallet(true)}
                />
              </TabsContent>
              <TabsContent value="exchange" className="mt-0">
                <EmptyState
                  icon={
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-muted-foreground"
                    >
                      <path
                        d="M18 7L12 13L6 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18 17L12 11L6 17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }
                  title="No exchange wallets found"
                  description="You haven't created any exchange wallets yet."
                  actionLabel="Create Exchange Wallet"
                  onAction={() => setShowCreateWallet(true)}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Create Wallet Dialog */}
        <Dialog open={showCreateWallet} onOpenChange={setShowCreateWallet}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Wallet</DialogTitle>
              <DialogDescription>Choose the type of wallet you want to create</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <RadioGroup value={walletType} onValueChange={setWalletType}>
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <RadioGroupItem value="mpc" id="mpc" className="mt-1" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="mpc" className="font-medium">
                      MPC Wallet
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Create a wallet secured by Multi-Party Computation (MPC) technology. Your private key is split
                      into multiple shares, with no single party having access to the complete key.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <RadioGroupItem value="smart" id="smart" className="mt-1" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="smart" className="font-medium">
                      Smart Contract Wallet
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Create an ERC-4337 compliant smart contract wallet with modular plugins for enhanced functionality
                      and security.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <RadioGroupItem value="custodial" id="custodial" className="mt-1" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="custodial" className="font-medium">
                      Custodial Wallet
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Create a wallet where Ryzer manages the private keys on your behalf, providing a simpler user
                      experience.
                    </p>
                  </div>
                </div>
              </RadioGroup>

              <div className="space-y-2">
                <Label htmlFor="wallet-name">Wallet Name</Label>
                <Input
                  id="wallet-name"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                  placeholder="Enter a name for your wallet"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="blockchain">Blockchain</Label>
                <Select value={blockchain} onValueChange={setBlockchain}>
                  <SelectTrigger id="blockchain">
                    <SelectValue placeholder="Select a blockchain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ethereum">Ethereum</SelectItem>
                    <SelectItem value="polygon">Polygon</SelectItem>
                    <SelectItem value="bnb">BNB Chain</SelectItem>
                    <SelectItem value="solana">Solana</SelectItem>
                    <SelectItem value="avalanche">Avalanche</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateWallet(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateWallet}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
