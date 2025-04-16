"use client"

import { ArrowDown, ArrowUp, ArrowUpRight, Check, Clock, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
  {
    id: "TX123456792",
    type: "deposit",
    amount: "7,500.00",
    token: "USDC",
    status: "completed",
    from: "0x7m8...9n0o",
    to: "0x5d6...7e8f",
    date: "2025-04-11",
    time: "02:30 PM",
  },
  {
    id: "TX123456793",
    type: "withdrawal",
    amount: "1,000.00",
    token: "USDC",
    status: "failed",
    from: "0x5d6...7e8f",
    to: "0x1p2...3q4r",
    date: "2025-04-10",
    time: "10:05 AM",
  },
]

interface WalletTransactionListProps {
  type?: "deposit" | "withdrawal" | "transfer"
}

export function WalletTransactionList({ type }: WalletTransactionListProps) {
  const filteredTransactions = type ? transactions.filter((transaction) => transaction.type === type) : transactions

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.id}</TableCell>
                <TableCell>
                  {transaction.type === "deposit" && (
                    <Badge variant="outline" className="status-badge status-badge-success">
                      <ArrowDown className="h-3 w-3" />
                      Deposit
                    </Badge>
                  )}
                  {transaction.type === "withdrawal" && (
                    <Badge variant="outline" className="status-badge status-badge-warning">
                      <ArrowUp className="h-3 w-3" />
                      Withdrawal
                    </Badge>
                  )}
                  {transaction.type === "transfer" && (
                    <Badge variant="outline" className="status-badge status-badge-info">
                      <ArrowUpRight className="h-3 w-3" />
                      Transfer
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  ${transaction.amount} {transaction.token}
                </TableCell>
                <TableCell>
                  {transaction.status === "completed" && (
                    <div className="flex items-center gap-2">
                      <span className="status-dot status-dot-success" aria-hidden="true" />
                      <span>Completed</span>
                    </div>
                  )}
                  {transaction.status === "pending" && (
                    <div className="flex items-center gap-2">
                      <span className="status-dot status-dot-warning" aria-hidden="true" />
                      <span>Pending</span>
                    </div>
                  )}
                  {transaction.status === "failed" && (
                    <div className="flex items-center gap-2">
                      <span className="status-dot status-dot-error" aria-hidden="true" />
                      <span>Failed</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help">{transaction.from}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy address to clipboard</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help">{transaction.to}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy address to clipboard</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{transaction.date}</span>
                    <span className="text-muted-foreground text-xs">{transaction.time}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {transaction.status === "pending" && (
                      <>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Check className="h-4 w-4" />
                                <span className="sr-only">Approve</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Approve transaction</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <X className="h-4 w-4" />
                                <span className="sr-only">Reject</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Reject transaction</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </>
                    )}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Clock className="h-4 w-4" />
                            <span className="sr-only">View Details</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View transaction details</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No transactions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
