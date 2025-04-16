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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  const [selectedToken, setSelectedToken] = useState(wallet?.tokens[0]?.symbol || "")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [walletName, setWalletName] = useState(wallet?.name || "")

  // If wallet doesn't exist, redirect to wallets page
  if (!wallet) {
    router.push("/wallets")
    return null
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const shortAddress = `${wallet.address.substring(0, 6)}...${wallet.address.substring(wallet.address.length - 4)}`

  const handleSend = () => {
    // Implement send logic here
    setShowSendDialog(false)
    setRecipientAddress("")
    setAmount("")
  }

  const handleEdit = () => {
    // Implement edit logic here
    setShowEditDialog(false)
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight">{wallet.name}</h1>
              <Badge variant="outline" className="text-sm">
                {wallet.type === "custodial"
                  ? "Custodial"
                  : wallet.type === "mpc"
                    ? "MPC"
                    : "Smart Contract"}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{shortAddress}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(wallet.address)}
                    >
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy address</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy address</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">View on explorer</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View on explorer</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-10" onClick={() => setShowReceiveDialog(true)}>
              <Download className="mr-2 h-4 w-4" />
              Receive
            </Button>
            <Button className="h-10" onClick={() => setShowSendDialog(true)}>
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10">
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

        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Balance</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setHideBalance(!hideBalance)}
                      aria-label={hideBalance ? "Show balance" : "Hide balance"}
                    >
                      {hideBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{hideBalance ? "Show balance" : "Hide balance"}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{hideBalance ? "••••••" : wallet.balance}</div>
              <p className="mt-1 text-sm text-muted-foreground">{wallet.blockchain}</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Wallet Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <span className="text-sm font-medium">
                    {wallet.type === "custodial"
                      ? "Custodial Wallet"
                      : wallet.type === "mpc"
                        ? "MPC Wallet"
                        : "Smart Contract Wallet"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm font-medium">{wallet.createdAt}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Network</span>
                  <span className="text-sm font-medium">{wallet.blockchain}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Assets</CardTitle>
            <CardDescription className="text-sm">Tokens in this wallet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="py-3 pl-4 text-left text-sm font-medium">Token</th>
                    <th className="py-3 text-right text-sm font-medium">Balance</th>
                    <th className="py-3 text-right text-sm font-medium">Value</th>
                    <th className="py-3 pr-4 text-right text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {wallet.tokens.map((token) => (
                    <tr key={token.symbol} className="border-t">
                      <td className="py-3 pl-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                            {token.symbol[0]}
                          </div>
                          <div>
                            <div className="font-medium">{token.name}</div>
                            <div className="text-xs text-muted-foreground">{token.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-right text-sm">
                        {hideBalance ? "••••••" : token.balance}
                      </td>
                      <td className="py-3 text-right text-sm">{hideBalance ? "••••••" : token.value}</td>
                      <td className="py-3 pr-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-sm"
                            onClick={() => {
                              setSelectedToken(token.symbol)
                              setShowSendDialog(true)
                            }}
                          >
                            <ArrowUp className="mr-1 h-3 w-3" />
                            Send
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-sm"
                            onClick={() => setShowReceiveDialog(true)}
                          >
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

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Transaction History</CardTitle>
            <CardDescription className="text-sm">Recent transactions for this wallet</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="all" className="text-sm">
                  All
                </TabsTrigger>
                <TabsTrigger value="sent" className="text-sm">
                  Sent
                </TabsTrigger>
                <TabsTrigger value="received" className="text-sm">
                  Received
                </TabsTrigger>
              </TabsList>
              <div className="mt-6">
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
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="token">Token</Label>
                <Select value={selectedToken} onValueChange={setSelectedToken}>
                  <SelectTrigger id="token" className="h-10">
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    {wallet.tokens.map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        {token.name} ({token.symbol}) - Balance: {token.balance}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient Address</Label>
                <Input
                  id="recipient"
                  placeholder="Enter recipient wallet address"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="flex gap-2">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    className="flex-1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    className="h-10 w-20"
                    onClick={() => {
                      const token = wallet.tokens.find((t) => t.symbol === selectedToken)
                      if (token) setAmount(token.balance)
                    }}
                  >
                    Max
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Available:{" "}
                  {wallet.tokens.find((t) => t.symbol === selectedToken)?.balance || "0"}{" "}
                  {selectedToken}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Network Fee</span>
                  <span>~$2.50</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span>
                    {amount ? `$${(parseFloat(amount) * 1.01).toFixed(2)}` : "$0.00"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                className="h-10"
                onClick={() => {
                  setShowSendDialog(false)
                  setRecipientAddress("")
                  setAmount("")
                }}
              >
                Cancel
              </Button>
              <Button className="h-10" onClick={handleSend} disabled={!amount || !recipientAddress}>
                Send
              </Button>
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
            <div className="space-y-6 py-4">
              <div className="flex flex-col items-center">
                <div className="mb-4 rounded-lg bg-white p-4 shadow-sm">
                  <img
                    src="/qr-code-placeholder.png"
                    alt="QR Code"
                    width={180}
                    height={180}
                    className="h-[180px] w-[180px]"
                  />
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Scan this QR code to get the wallet address
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wallet-address">Wallet Address</Label>
                <div className="flex gap-2">
                  <Input id="wallet-address" value={wallet.address} readOnly className="flex-1" />
                  <Button
                    variant="outline"
                    className="h-10 w-10"
                    onClick={() => copyToClipboard(wallet.address)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Only send {wallet.blockchain} assets to this address
                </p>
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
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-wallet-name">Wallet Name</Label>
                <Input
                  id="edit-wallet-name"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                className="h-10"
                onClick={() => {
                  setShowEditDialog(false)
                  setWalletName(wallet.name)
                }}
              >
                Cancel
              </Button>
              <Button className="h-10" onClick={handleEdit} disabled={!walletName}>
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}