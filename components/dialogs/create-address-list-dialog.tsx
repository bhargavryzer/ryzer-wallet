"use client"

import { useState } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface CreateAddressListDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateAddressListDialog({ open, onOpenChange }: CreateAddressListDialogProps) {
  const [listName, setListName] = useState("")
  const [addresses, setAddresses] = useState("")

  const handleCreate = () => {
    // Handle address list creation logic
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Address List</DialogTitle>
          <DialogDescription>Create a new address list for your transaction policies</DialogDescription>
          <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="list-name">List Name</Label>
            <Input
              id="list-name"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="Enter list name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="addresses">Addresses</Label>
            <Textarea
              id="addresses"
              value={addresses}
              onChange={(e) => setAddresses(e.target.value)}
              placeholder="Enter addresses (one per line)"
              rows={5}
            />
            <p className="text-xs text-muted-foreground">
              Enter one address per line. You can also add a label after the address, separated by a comma.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create List</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
