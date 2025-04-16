"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, ArrowUpRight, Clock, Filter, Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardLayout } from "@/components/dashboard-layout"

interface Transaction {
  id: string
  type: "deposit" | "withdrawal" | "transfer"
  amount: string
  token: string
  status: "completed" | "pending" | "failed"
  from: string
  to: string
  date: string
  time: string
}

const transactions: Transaction[] = [
  {
    id: "TX123456789",
    type: "deposit",
    amount: "5,000.00",
    token: "USDC",
    status: "completed",
    from: "0x1a2...3b4c",
    to: "0x5d6...7e8f",
    date: "2025-04-14",
    time: "09:45 AM",
  },
  {
    id: "TX123456790",
    type: "withdrawal",
    amount: "2,500.00",
    token: "USDC",
    status: "pending",
    from: "0x5d6...7e8f",
    to: "0x9g0...1h2i",
    date: "2025-04-13",
    time: "03:22 PM",
  },
  {
    id: "TX123456791",
    type: "transfer",
    amount: "10,000.00",
    token: "USDC",
    status: "completed",
    from: "0x5d6...7e8f",
    to: "0x3j4...5k6l",
    date: "2025-04-12",
    time: "11:15 AM",
  },
]

export default function TransactionHistoryPage() {
  const [selectedWallet, setSelectedWallet] = useState<string>("all")
  const [dateRange, setDateRange] = useState<string>("all")

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Transaction History</h1>
          <p className="text-sm text-muted-foreground">View and manage your transaction history</p>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-medium">Transactions</CardTitle>
            <CardDescription className="text-sm">View all transactions across your wallets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search transactions..." className="h-10 pl-10" />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Select value={selectedWallet} onValueChange={setSelectedWallet}>
                  <SelectTrigger className="h-10 w-44">
                    <SelectValue placeholder="Select wallet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Wallets</SelectItem>
                    <SelectItem value="custodial">Custodial Wallets</SelectItem>
                    <SelectItem value="mpc">MPC Wallets</SelectItem>
                    <SelectItem value="smart">Smart Contract Wallets</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="h-10 w-44">
                    <SelectValue placeholder="Date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">Last 30 Days</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="h-10">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="py-3 text-sm font-medium">Transaction ID</TableHead>
                    <TableHead className="py-3 text-sm font-medium">Type</TableHead>
                    <TableHead className="py-3 text-sm font-medium">Amount</TableHead>
                    <TableHead className="py-3 text-sm font-medium">Status</TableHead>
                    <TableHead className="py-3 text-sm font-medium">From</TableHead>
                    <TableHead className="py-3 text-sm font-medium">To</TableHead>
                    <TableHead className="py-3 text-sm font-medium">Date & Time</TableHead>
                    <TableHead className="py-3 text-sm font-medium text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="py-3 text-sm font-medium">{transaction.id}</TableCell>
                      <TableCell className="py-3">
                        {transaction.type === "deposit" && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <ArrowDown className="mr-1 h-3 w-3" />
                            Deposit
                          </Badge>
                        )}
                        {transaction.type === "withdrawal" && (
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                            <ArrowUp className="mr-1 h-3 w-3" />
                            Withdrawal
                          </Badge>
                        )}
                        {transaction.type === "transfer" && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            <ArrowUpRight className="mr-1 h-3 w-3" />
                            Transfer
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="py-3 text-sm">
                        ${transaction.amount} {transaction.token}
                      </TableCell>
                      <TableCell className="py-3 text-sm">
                        {transaction.status === "completed" && (
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                            Completed
                          </div>
                        )}
                        {transaction.status === "pending" && (
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-yellow-500" />
                            Pending
                          </div>
                        )}
                        {transaction.status === "failed" && (
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                            Failed
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="py-3 text-sm">{transaction.from}</TableCell>
                      <TableCell className="py-3 text-sm">{transaction.to}</TableCell>
                      <TableCell className="py-3 text-sm">
                        {transaction.date}
                        <span className="ml-2 text-xs text-muted-foreground">{transaction.time}</span>
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <Button variant="ghost" size="icon">
                          <Clock className="h-4 w-4" />
                          <span className="sr-only">View Details</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="text-sm text-muted-foreground">
                Showing <strong>3</strong> of <strong>24</strong> transactions
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}