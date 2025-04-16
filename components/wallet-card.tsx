"use client"

import { useState } from "react"
import { Eye, EyeOff, ExternalLink, MoreHorizontal } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface WalletCardProps {
  name: string
  type: string
  balance: string
  tokens: number
  address: string
}

export function WalletCard({ name, type, balance, tokens, address }: WalletCardProps) {
  const [hideBalance, setHideBalance] = useState(false)
  const shortAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "custodial":
        return "Custodial Wallet"
      case "mpc":
        return "MPC Wallet"
      case "smart":
        return "Smart Contract Wallet"
      case "exchange":
        return "Exchange Wallet"
      default:
        return "Wallet"
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className="overflow-hidden hover:shadow-md transition-all h-full border-2 hover:border-primary/20">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-medium text-lg">{name}</h3>
            <p className="text-sm text-muted-foreground">{tokens} Tokens</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setHideBalance(!hideBalance)}>
            {hideBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Type</span>
            <span className="text-sm font-medium">{getTypeLabel(type)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Balance</span>
            <span className="text-sm font-medium">{hideBalance ? "••••••" : balance}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Address</span>
            <div className="flex items-center gap-1">
              <span className="text-xs">{shortAddress}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.preventDefault()
                        copyToClipboard(address)
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                  <TooltipContent>Copy address</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/20 p-4 flex justify-between">
        <Button variant="ghost" size="sm" className="text-sm">
          <ExternalLink className="mr-2 h-4 w-4" />
          View on Explorer
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Wallet Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Send</DropdownMenuItem>
            <DropdownMenuItem>Receive</DropdownMenuItem>
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit Wallet</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
    </motion.div>
  )
}
