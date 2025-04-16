"use client"

import type React from "react"
import { useState } from "react"
import { Info, LayoutGrid, List, Search, X, ChevronDown } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function ExchangeWalletsPage() {
  const [showAddAccount, setShowAddAccount] = useState(false)
  const [showSelectExchange, setShowSelectExchange] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [selectedExchange, setSelectedExchange] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState("")
  const [apiSecret, setApiSecret] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const exchanges = [
    { name: "Binance", logo: "/placeholder.svg?height=24&width=24&query=binance logo", accountType: "Sub Account & Trading Account" },
    { name: "OKX", logo: "/placeholder.svg?height=24&width=24&query=okx logo", accountType: "Sub Account & Trading Account" },
    { name: "Deribit", logo: "/placeholder.svg?height=24&width=24&query=deribit logo", accountType: "Sub Account" },
    { name: "Bybit", logo: "/placeholder.svg?height=24&width=24&query=bybit logo", accountType: "Sub Account & Trading Account" },
    { name: "Gate", logo: "/placeholder.svg?height=24&width=24&query=gate logo", accountType: "Sub Account & Trading Account" },
    { name: "Bitget", logo: "/placeholder.svg?height=24&width=24&query=bitget logo", accountType: "Sub Account & Trading Account" },
  ]

  const handleAddAccount = () => {
    // Implement account linking logic here
    setShowAddAccount(false)
    setSelectedExchange(null)
    setApiKey("")
    setApiSecret("")
  }

  const filteredExchanges = exchanges.filter((exchange) =>
    exchange.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-semibold tracking-tight">Exchange Wallets</h1>
              <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">Developer</span>
            </div>
            <p className="text-sm text-muted-foreground">Manage your exchange wallets</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Accounts:</span> 0<span className="mx-2">|</span>
              <span className="font-medium">Total Balance:</span> $0
            </div>
            <Button className="h-10" onClick={() => setShowSelectExchange(true)}>
              + Exchange Account
            </Button>
          </div>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl font-medium">What are Exchange Wallets?</CardTitle>
                <CardDescription className="text-sm">
                  Exchange Wallets bring all your exchange accounts into a single interface.
                </CardDescription>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" className="h-9 text-primary">
                      <Info className="mr-2 h-4 w-4" />
                      How to Link Exchange Accounts?
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Link Exchange Guide</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by account name"
                  className="h-10 pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="h-10">
                  <Search className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" className="h-10">
                  <Info className="mr-2 h-4 w-4" />
                  Sort
                </Button>
                <div className="flex rounded-md border">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    className="h-10 w-10 rounded-none border-0"
                    onClick={() => setViewMode("grid")}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    className="h-10 w-10 rounded-none border-0"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center py-12">
              <Image
                src="/placeholder.svg?height=80&width=80&query=search"
                alt="No data"
                width={80}
                height={80}
                className="mb-6 text-muted-foreground"
              />
              <h3 className="text-lg font-medium mb-2">No Data to Display</h3>
            </div>
          </CardContent>
        </Card>

        <Dialog open={showSelectExchange} onOpenChange={setShowSelectExchange}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Select Exchange</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                onClick={() => setShowSelectExchange(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Exchange</Label>
                <Select
                  onValueChange={(value) => {
                    setSelectedExchange(value)
                    setShowSelectExchange(false)
                    setShowAddAccount(true)
                  }}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select exchange" />
                  </SelectTrigger>
                  <SelectContent>
                    {exchanges.map((exchange) => (
                      <SelectItem key={exchange.name} value={exchange.name}>
                        {exchange.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {filteredExchanges.map((exchange) => (
                  <ExchangeOption
                    key={exchange.name}
                    name={exchange.name}
                    logo={exchange.logo}
                    accountType={exchange.accountType}
                    onClick={() => {
                      setSelectedExchange(exchange.name)
                      setShowSelectExchange(false)
                      setShowAddAccount(true)
                    }}
                  />
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showAddAccount} onOpenChange={setShowAddAccount}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Add {selectedExchange} Account</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                onClick={() => {
                  setShowAddAccount(false)
                  setSelectedExchange(null)
                  setApiKey("")
                  setApiSecret("")
                }}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-secret">API Secret</Label>
                <Input
                  id="api-secret"
                  placeholder="Enter your API secret"
                  type="password"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Ensure your API key has the necessary permissions for trading and account management.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="h-10"
                onClick={() => {
                  setShowAddAccount(false)
                  setSelectedExchange(null)
                  setApiKey("")
                  setApiSecret("")
                }}
              >
                Cancel
              </Button>
              <Button
                className="h-10"
                onClick={handleAddAccount}
                disabled={!apiKey || !apiSecret}
              >
                Add Account
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

interface ExchangeOptionProps {
  name: string
  logo: string
  accountType: string
  onClick: () => void
}

function ExchangeOption({ name, logo, accountType, onClick }: ExchangeOptionProps) {
  return (
    <div
      className="flex cursor-pointer items-center gap-3 rounded-md p-3 hover:bg-gray-50"
      onClick={onClick}
    >
      <Image src={logo} alt={`${name} logo`} width={24} height={24} className="rounded-full" />
      <div className="flex-1">
        <div className="font-medium">{name}</div>
        <div className="text-xs text-muted-foreground">{accountType}</div>
      </div>
    </div>
  )
}