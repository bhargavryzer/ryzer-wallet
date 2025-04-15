"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface EmergencyPolicyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EmergencyPolicyDialog({ open, onOpenChange }: EmergencyPolicyDialogProps) {
  const [policyType, setPolicyType] = useState("rejection")

  const handleSubmit = () => {
    // Handle emergency policy creation logic
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Manage Emergency Policy</DialogTitle>
          <DialogDescription>Implement a one-click emergency policy</DialogDescription>
          <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 flex items-start gap-2">
            <Check className="h-5 w-5 mt-0.5" />
            <p className="text-sm">This policy requires no approval and takes effect immediately.</p>
          </div>

          <RadioGroup value={policyType} onValueChange={setPolicyType}>
            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <RadioGroupItem value="rejection" id="rejection" className="mt-1" />
              <div className="grid gap-1.5">
                <Label htmlFor="rejection" className="font-medium">
                  Auto Rejection
                </Label>
                <p className="text-sm text-muted-foreground">Any transaction will be automatically rejected.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <RadioGroupItem value="quorum" id="quorum" className="mt-1" />
              <div className="grid gap-1.5">
                <Label htmlFor="quorum" className="font-medium">
                  Approval Quorum
                </Label>
                <p className="text-sm text-muted-foreground">
                  Any transaction will require a specified number of approvals to proceed.
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
