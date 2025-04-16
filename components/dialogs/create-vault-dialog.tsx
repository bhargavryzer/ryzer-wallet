"use client"

import { useState } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CreateVaultDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateVaultDialog({ open, onOpenChange }: CreateVaultDialogProps) {
  const [vaultName, setVaultName] = useState("")
  const [threshold, setThreshold] = useState("2")
  const [keyShares, setKeyShares] = useState("3")

  const handleCreate = () => {
    // Handle vault creation logic
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Vault</DialogTitle>
          <DialogDescription>Create a new vault for your organization-controlled MPC wallets</DialogDescription>
          <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="vault-name">Vault Name</Label>
            <Input
              id="vault-name"
              value={vaultName}
              onChange={(e) => setVaultName(e.target.value)}
              placeholder="Enter vault name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="threshold">Threshold</Label>
              <Select value={threshold} onValueChange={setThreshold}>
                <SelectTrigger id="threshold">
                  <SelectValue placeholder="Select threshold" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="key-shares">Key Shares</Label>
              <Select value={keyShares} onValueChange={setKeyShares}>
                <SelectTrigger id="key-shares">
                  <SelectValue placeholder="Select key shares" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            This will create a {threshold}-of-{keyShares} MPC vault, requiring {threshold} key shares to sign
            transactions.
          </p>
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
