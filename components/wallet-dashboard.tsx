"use client"

import { useState } from "react"
import { ArrowUpRight, CreditCard, Eye, EyeOff, Filter, Plus, RefreshCw, Search, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletBalanceChart } from "@/components/wallet-balance-chart"
import { WalletTransactionList } from "@/components/wallet-transaction-list"
import { QuickActions } from "@/components/quick-actions"
import { VisuallyHidden } from "@/components/ui/visually-hidden"

export function WalletDashboard() {
  const [hideBalance, setHideBalance] = useState(false)

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage your wallets, assets, and transactions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10">
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
            Refresh
          </Button>
          <Button className="h-10">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Create Wallet
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setHideBalance(!hideBalance)}
              aria-label={hideBalance ? "Show balance" : "Hide balance"}
            >
              {hideBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold" aria-live="polite">
              {hideBalance ? (
                <>
                  <VisuallyHidden>Balance hidden</VisuallyHidden>
                  <span aria-hidden="true">••••••</span>
                </>
              ) : (
                "$48,493,931"
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {hideBalance ? (
                <>
                  <VisuallyHidden>Balance hidden</VisuallyHidden>
                  <span aria-hidden="true">••••••</span>
                </>
              ) : (
                "$37,842,498"
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Wallets</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">24</div>
            <p className="mt-1 text-xs text-muted-foreground">+3 since last month</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">12</div>
            <p className="mt-1 text-xs text-muted-foreground">-2 since yesterday</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="border-none shadow-sm lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Assets Trend</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">Your asset value over time</CardDescription>
          </CardHeader>
          <CardContent>
            <WalletBalanceChart />
          </CardContent>
        </Card>
        <div className="lg:col-span-3">
          <QuickActions />
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <CardTitle className="text-lg font-medium">Recent Transactions</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                View and manage your recent transactions
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
                  className="h-10 pl-10"
                  aria-label="Search transactions"
                />
              </div>
              <Button variant="outline" size="icon" className="h-10 w-10" aria-label="Filter transactions">
                <Filter className="h-4 w-4" />
                <VisuallyHidden>Filter</VisuallyHidden>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="all" className="text-sm">All</TabsTrigger>
              <TabsTrigger value="deposits" className="text-sm">Deposits</TabsTrigger>
              <TabsTrigger value="withdrawals" className="text-sm">Withdrawals</TabsTrigger>
              <TabsTrigger value="transfers" className="text-sm">Transfers</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              <WalletTransactionList />
            </TabsContent>
            <TabsContent value="deposits" className="mt-6">
              <WalletTransactionList type="deposit" />
            </TabsContent>
            <TabsContent value="withdrawals" className="mt-6">
              <WalletTransactionList type="withdrawal" />
            </TabsContent>
            <TabsContent value="transfers" className="mt-6">
              <WalletTransactionList type="transfer" />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-between gap-4 border-t px-6 py-4 sm:flex-row">
          <div className="text-sm text-muted-foreground">
            Showing <strong>10</strong> of <strong>24</strong> transactions
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}