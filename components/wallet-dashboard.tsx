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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage your wallets, assets, and transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
            Refresh
          </Button>
          <Button size="sm" className="h-9">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Create Wallet
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
            <div className="text-2xl font-bold" aria-live="polite">
              {hideBalance ? (
                <>
                  <VisuallyHidden>Balance hidden</VisuallyHidden>
                  <span aria-hidden="true">••••••</span>
                </>
              ) : (
                "$48,493,931"
              )}
            </div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hideBalance ? (
                <>
                  <VisuallyHidden>Balance hidden</VisuallyHidden>
                  <span aria-hidden="true">••••••</span>
                </>
              ) : (
                "$37,842,498"
              )}
            </div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Wallets</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">-2 since yesterday</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Assets Trend</CardTitle>
            <CardDescription>Your asset value over time</CardDescription>
          </CardHeader>
          <CardContent>
            <WalletBalanceChart />
          </CardContent>
        </Card>
        <div className="md:col-span-3">
          <QuickActions />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>View and manage your recent transactions</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
                  className="w-full rounded-md pl-8 md:w-[300px]"
                  aria-label="Search transactions"
                />
              </div>
              <Button variant="outline" size="icon" aria-label="Filter transactions">
                <Filter className="h-4 w-4" />
                <VisuallyHidden>Filter</VisuallyHidden>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="deposits">Deposits</TabsTrigger>
              <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
              <TabsTrigger value="transfers">Transfers</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <WalletTransactionList />
            </TabsContent>
            <TabsContent value="deposits" className="mt-4">
              <WalletTransactionList type="deposit" />
            </TabsContent>
            <TabsContent value="withdrawals" className="mt-4">
              <WalletTransactionList type="withdrawal" />
            </TabsContent>
            <TabsContent value="transfers" className="mt-4">
              <WalletTransactionList type="transfer" />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t px-6 py-4">
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
