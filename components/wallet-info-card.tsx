"use client"

import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface WalletInfoCardProps {
  name: string
  type: string
  balance: string
  tokens: number
  id: string
}

export function WalletInfoCard({ name, type, balance, tokens, id }: WalletInfoCardProps) {
  const [hideBalance, setHideBalance] = useState(false)
  const shortId = id.substring(0, 8) + "..." + id.substring(id.length - 8)

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
            <span className="text-sm font-medium">{type}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Balance</span>
            <span className="text-sm font-medium">{hideBalance ? "••••••" : balance}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">ID</span>
            <div className="flex items-center gap-1">
              <span className="text-xs">{shortId}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6">
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
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/20 p-4 flex justify-between">
        <Button variant="ghost" size="sm">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Details
        </Button>
        <Button variant="ghost" size="sm">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
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
          Edit
        </Button>
      </CardFooter>
    </Card>
    </motion.div>
  )
}
