"use client"

import { useState } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CreateSmartWalletDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateSmartWalletDialog({ open, onOpenChange }: CreateSmartWalletDialogProps) {
  const [walletName, setWalletName] = useState("")
  const [blockchain, setBlockchain] = useState("ethereum")
  const [owners, setOwners] = useState("1")

  const handleCreate = () => {
    // Handle smart wallet creation logic
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Smart Contract Wallet</DialogTitle>
          <DialogDescription>Create a new ERC-4337 compliant smart contract wallet</DialogDescription>
          <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="wallet-name">Wallet Name</Label>
            <Input
              id="wallet-name"
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
              placeholder="Enter wallet name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="blockchain">Blockchain</Label>
            <Select value={blockchain} onValueChange={setBlockchain}>
              <SelectTrigger id="blockchain">
                <SelectValue placeholder="Select blockchain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="polygon">Polygon</SelectItem>
                <SelectItem value="bnb">BNB Chain</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="owners">Number of Owners</Label>
            <Select value={owners} onValueChange={setOwners}>
              <SelectTrigger id="owners">
                <SelectValue placeholder="Select number of owners" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>Next</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
