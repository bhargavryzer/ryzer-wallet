"use client"

import { useState } from "react"
import { Eye, EyeOff, Filter, LayoutGrid, List, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CreateWalletDialog } from "@/components/dialogs/create-wallet-dialog"
import { WalletInfoCard } from "@/components/wallet-info-card"

export default function CustodialWalletsPage() {
  const [showCreateWallet, setShowCreateWallet] = useState(false)
  const [hideBalance, setHideBalance] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [searchQuery, setSearchQuery] = useState("")

  const wallets = [
    {
      name: "Default Wallet",
      type: "Asset Wallet",
      balance: "$0",
      tokens: 0,
      id: "c1273b26-4915-45d9-a856-bf765e5c82c9",
    },
  ]

  const filteredWallets = wallets.filter((wallet) =>
    wallet.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-semibold tracking-tight">Custodial Wallets</h1>
              <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">Developer</span>
            </div>
            <p className="text-sm text-muted-foreground">Manage your custodial wallets</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              <span className="font-medium">Wallets:</span> {wallets.length}
            </span>
            <span className="hidden sm:inline">|</span>
            <span>
              <span className="font-medium">Tokens:</span> {wallets.reduce((sum, w) => sum + w.tokens, 0)}
            </span>
            <span className="hidden sm:inline">|</span>
            <span>
              <span className="font-medium">Addresses:</span> {wallets.length}
            </span>
            <span className="hidden sm:inline">|</span>
            <span>
              <span className="font-medium">Total Value:</span>{" "}
              {hideBalance ? "••••••" : `$${wallets.reduce((sum, w) => sum + parseFloat(w.balance.replace(/[^0-9.-]+/g, "")), 0).toLocaleString()}`}
            </span>
          </div>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl font-medium">What are Custodial Wallets?</CardTitle>
                <CardDescription className="text-sm">
                  Custodial Wallets offer bank-grade security with private key storage managed by Cobo, ensuring robust
                  protection and ease of use.
                </CardDescription>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" className="h-9 text-primary">
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      How to Create a Custodial Wallet?
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Create a wallet guide</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" className="h-9 text-primary">
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      How to Check Withdrawal Status?
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Withdrawal status guide</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by wallet name"
                  className="h-10 pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10"
                        onClick={() => setHideBalance(!hideBalance)}
                        aria-label={hideBalance ? "Show balance" : "Hide balance"}
                      >
                        {hideBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{hideBalance ? "Show balance" : "Hide balance"}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button variant="outline" className="h-10">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <div className="flex rounded-md border">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={viewMode === "grid" ? "default" : "ghost"}
                          size="icon"
                          className="h-10 w-10 rounded-none border-0"
                          onClick={() => setViewMode("grid")}
                        >
                          <LayoutGrid className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Grid view</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={viewMode === "list" ? "default" : "ghost"}
                          size="icon"
                          className="h-10 w-10 rounded-none border-0"
                          onClick={() => setViewMode("list")}
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>List view</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Button className="h-10" onClick={() => setShowCreateWallet(true)}>
                  Create Wallet
                </Button>
              </div>
            </div>

            {filteredWallets.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No wallets found matching your search.
              </div>
            ) : viewMode === "list" ? (
              <div className="overflow-x-auto rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="py-3 pl-4 text-left text-sm font-medium">Wallet</th>
                      <th className="py-3 text-left text-sm font-medium">Wallet ID</th>
                      <th className="py-3 text-left text-sm font-medium">Value</th>
                      <th className="py-3 pr-4 text-left text-sm font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWallets.map((wallet) => (
                      <tr key={wallet.id} className="border-t">
                        <td className="py-3 pl-4">
                          <div className="space-y-1">
                            <div className="font-medium">{wallet.name}</div>
                            <div className="text-sm text-muted-foreground">{wallet.tokens} Tokens</div>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">WaaS</span>
                            <span className="text-sm text-muted-foreground font-mono">{wallet.id}</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => copyToClipboard(wallet.id)}
                                  >
                                    <svg
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M8 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H16C17.1046 21 18 20.1046 18 19V18M8 5C8 6.10457 8.89543 7 10 7H12C13.1046 7 14 6.10457 14 5M8 5C8 3.89543 8.89543 3 10 3H12C13.1046 3 14 3.89543 14 5M14 5H16C17.1046 5 18 5.89543 18 7V10M20 14H10M10 14L13 11M10 14L13 17"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Copy wallet ID</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="space-y-1">
                            <div className="text-sm font-medium">{wallet.type}</div>
                            <div className="text-sm font-medium">{hideBalance ? "••••••" : wallet.balance}</div>
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M12 16V12"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M12 8H12.01"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                    <span className="sr-only">Info</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>View details</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M11 4H4C3.44772 4 3 4.44772 3 5V20C3 20.5523 3.44772 21 4 21H19C19.5523 21 20 20.5523 20 20V13"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M18.5 2.5C18.7626 2.23735 19.1131 2.08901 19.4775 2.08901C19.8419 2.08901 20.1924 2.23735 20.455 2.5C20.7176 2.76264 20.866 3.11315 20.866 3.47755C20.866 3.84196 20.7176 4.19247 20.455 4.45511L12 13.0001L9 14.0001L10 11.0001L18.5 2.5Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit wallet</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M16 12L12 8M12 8L8 12M12 8V16"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                    <span className="sr-only">Share</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Share wallet</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredWallets.map((wallet) => (
                  <WalletInfoCard
                    key={wallet.id}
                    name={wallet.name}
                    type={wallet.type}
                    balance={hideBalance ? "••••••" : wallet.balance}
                    tokens={wallet.tokens}
                    id={wallet.id}
                  />
                ))}
              </div>
            )}
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredWallets.length} of {wallets.length} wallets
            </div>
          </CardContent>
        </Card>

        <CreateWalletDialog open={showCreateWallet} onOpenChange={setShowCreateWallet} />
      </div>
    </DashboardLayout>
  )
}