"use client"

import { useState } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface CreateWalletDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateWalletDialog({ open, onOpenChange }: CreateWalletDialogProps) {
  const [walletName, setWalletName] = useState("")
  const [walletType, setWalletType] = useState("asset")

  const handleCreate = () => {
    // Handle wallet creation logic
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Wallet</DialogTitle>
          <DialogDescription>Create a new wallet to manage your assets</DialogDescription>
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
            <Label>Wallet Type</Label>
            <RadioGroup value={walletType} onValueChange={setWalletType}>
              <div className="flex items-start space-x-2 p-2 border rounded-md">
                <RadioGroupItem value="asset" id="asset" className="mt-1" />
                <div className="grid gap-1.5">
                  <Label htmlFor="asset" className="font-medium">
                    Asset Wallet
                  </Label>
                  <p className="text-sm text-muted-foreground">Used for transferring tokens only</p>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
