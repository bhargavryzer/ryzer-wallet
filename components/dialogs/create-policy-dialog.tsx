"use client"

import { useState } from "react"
import { ArrowRight, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CreatePolicyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreatePolicyDialog({ open, onOpenChange }: CreatePolicyDialogProps) {
  const [policyName, setPolicyName] = useState("")
  const [network, setNetwork] = useState("")
  const [wallets, setWallets] = useState("")
  const [action, setAction] = useState("auto-approval")

  const handleNext = () => {
    // Handle policy creation logic
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Message Signing Policy</DialogTitle>
          <DialogDescription>Define rules for message signing operations</DialogDescription>
          <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="policy-name">Policy Name</Label>
            <Input
              id="policy-name"
              value={policyName}
              onChange={(e) => setPolicyName(e.target.value)}
              placeholder="Enter a name (30 characters max)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="network">Applicable Network</Label>
            <Select value={network} onValueChange={setNetwork}>
              <SelectTrigger id="network">
                <SelectValue placeholder="Select a network" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="polygon">Polygon</SelectItem>
                <SelectItem value="bnb">BNB Chain</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="wallets">Applicable Wallets</Label>
            <Select value={wallets} onValueChange={setWallets}>
              <SelectTrigger id="wallets">
                <SelectValue placeholder="Select one or more wallets" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Wallets</SelectItem>
                <SelectItem value="mpc">MPC Wallets</SelectItem>
                <SelectItem value="smart">Smart Contract Wallets</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-2 border rounded-lg bg-muted/20">
            <div className="flex items-center justify-between p-2">
              <div className="font-medium">If</div>
              <Button variant="outline" size="sm" className="h-8">
                <Plus className="mr-1 h-3 w-3" />
                Add Condition
              </Button>
            </div>
          </div>

          <div className="p-2 border rounded-lg bg-muted/20">
            <div className="font-medium p-2">Then</div>
            <div className="space-y-2 p-2">
              <Label>Action</Label>
              <RadioGroup value={action} onValueChange={setAction}>
                <div className="flex items-start gap-2 p-3 border rounded-md bg-background">
                  <RadioGroupItem value="auto-approval" id="auto-approval" className="mt-1" />
                  <div>
                    <Label htmlFor="auto-approval" className="font-medium">
                      Auto Approval
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Message signing meeting the above conditions will be automatically approved
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 border rounded-md bg-background">
                  <RadioGroupItem value="auto-rejection" id="auto-rejection" className="mt-1" />
                  <div>
                    <Label htmlFor="auto-rejection" className="font-medium">
                      Auto Rejection
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Message signing meeting the above conditions will be automatically rejected
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 border rounded-md bg-background">
                  <RadioGroupItem value="approval-quorum" id="approval-quorum" className="mt-1" />
                  <div>
                    <Label htmlFor="approval-quorum" className="font-medium">
                      Approval Quorum
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Message signing meeting the above conditions will require a specified number of approvals to
                      proceed
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
