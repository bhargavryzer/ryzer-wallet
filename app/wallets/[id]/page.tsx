"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowDown,
  ArrowUp,
  Copy,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  MoreHorizontal,
  Pencil,
  Send,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { WalletTransactionList } from "@/components/wallet-transaction-list"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Sample wallet data - in a real app, this would come from an API
const walletData = {
  "wallet-1": {
    id: "wallet-1",
    name: "Main Wallet",
    type: "custodial",
    balance: "$12,450.00",
    tokens: [
      { symbol: "ETH", name: "Ethereum", balance: "4.25", value: "$8,245.00" },
      { symbol: "USDC", name: "USD Coin", balance: "4,205.00", value: "$4,205.00" },
    ],
    address: "0x1a2b3c4d5e6f7g8h9i0j",
    blockchain: "Ethereum",
    createdAt: "2023-10-15",
  },
  "wallet-2": {
    id: "wallet-2",
    name: "Investment Wallet",
    type: "mpc",
    balance: "$45,230.50",
    tokens: [
      { symbol: "BTC", name: "Bitcoin", balance: "0.75", value: "$25,125.00" },
      { symbol: "ETH", name: "Ethereum", balance: "10.25", value: "$19,855.50" },
      { symbol: "LINK", name: "Chainlink", balance: "50.00", value: "$250.00" },
    ],
    address: "0x9i8h7g6f5e4d3c2b1a0",
    blockchain: "Multi-chain",
    createdAt: "2023-11-20",
  },
}

export default function WalletDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const walletId = params.id as string
  const wallet = walletData[walletId as keyof typeof walletData]

  const [hideBalance, setHideBalance] = useState(false)
  const [showSendDialog, setShowSendDialog] = useState(false)
  const [showReceiveDialog, setShowReceiveDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)

  // If wallet doesn't exist, redirect to wallets page
  if (!wallet) {
    router.push("/wallets")
    return null
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const shortAddress = `${wallet.address.substring(0, 6)}...${wallet.address.substring(wallet.address.length - 4)}`

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{wallet.name}</h1>
              <Badge variant="outline" className="ml-2">
                {wallet.type === "custodial" ? "Custodial" : wallet.type === "mpc" ? "MPC" : "Smart Contract"}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <span>{shortAddress}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(wallet.address)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span className="sr-only">Copy address</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy address</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span className="sr-only">View on explorer</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View on explorer</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => setShowReceiveDialog(true)}>
              <Download className="mr-2 h-4 w-4" />
              Receive
            </Button>
            <Button onClick={() => setShowSendDialog(true)}>
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Wallet Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Wallet
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on Explorer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">Balance</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setHideBalance(!hideBalance)}>
                {hideBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{hideBalance ? "••••••" : wallet.balance}</div>
              <p className="text-sm text-muted-foreground">{wallet.blockchain}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Wallet Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span>
                    {wallet.type === "custodial"
                      ? "Custodial Wallet"
                      : wallet.type === "mpc"
                        ? "MPC Wallet"
                        : "Smart Contract Wallet"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{wallet.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network</span>
                  <span>{wallet.blockchain}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Assets</CardTitle>
            <CardDescription>Tokens in this wallet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 text-sm font-medium">Token</th>
                    <th className="text-right p-3 text-sm font-medium">Balance</th>
                    <th className="text-right p-3 text-sm font-medium">Value</th>
                    <th className="text-right p-3 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {wallet.tokens.map((token) => (
                    <tr key={token.symbol} className="border-t">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                            {token.symbol.substring(0, 1)}
                          </div>
                          <div>
                            <div className="font-medium">{token.name}</div>
                            <div className="text-xs text-muted-foreground">{token.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-right">{hideBalance ? "••••••" : token.balance}</td>
                      <td className="p-3 text-right">{hideBalance ? "••••••" : token.value}</td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setShowSendDialog(true)}>
                            <ArrowUp className="mr-1 h-3 w-3" />
                            Send
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setShowReceiveDialog(true)}>
                            <ArrowDown className="mr-1 h-3 w-3" />
                            Receive
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Recent transactions for this wallet</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="sent">Sent</TabsTrigger>
                <TabsTrigger value="received">Received</TabsTrigger>
              </TabsList>
              <div className="mt-4">
                <WalletTransactionList />
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Send Dialog */}
        <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Send Assets</DialogTitle>
              <DialogDescription>Send tokens from your wallet to another address</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="token">Token</Label>
                <select
                  id="token"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {wallet.tokens.map((token) => (
                    <option key={token.symbol} value={token.symbol}>
                      {token.name} ({token.symbol}) - Balance: {token.balance}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient Address</Label>
                <Input id="recipient" placeholder="Enter recipient wallet address" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="flex gap-2">
                  <Input id="amount" type="number" placeholder="0.00" className="flex-1" />
                  <Button variant="outline" className="w-20">
                    Max
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Available: {wallet.tokens[0].balance} {wallet.tokens[0].symbol}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Network Fee</span>
                  <span>~$2.50</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span>$0.00</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSendDialog(false)}>
                Cancel
              </Button>
              <Button>Send</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Receive Dialog */}
        <Dialog open={showReceiveDialog} onOpenChange={setShowReceiveDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Receive Assets</DialogTitle>
              <DialogDescription>Share your address to receive tokens</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center justify-center">
                <div className="bg-white p-4 rounded-lg mb-4">
                  <img src="/qr-code-placeholder.png" alt="QR Code" width={200} height={200} />
                </div>
                <p className="text-sm text-center mb-4">Scan this QR code to get the wallet address</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wallet-address">Wallet Address</Label>
                <div className="flex">
                  <Input id="wallet-address" value={wallet.address} readOnly className="flex-1" />
                  <Button variant="outline" className="ml-2" onClick={() => copyToClipboard(wallet.address)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Only send {wallet.blockchain} assets to this address</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Wallet Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Wallet</DialogTitle>
              <DialogDescription>Update your wallet details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-wallet-name">Wallet Name</Label>
                <Input id="edit-wallet-name" defaultValue={wallet.name} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
