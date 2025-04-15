"use client"

import { useState } from "react"
import { X } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface GoogleAuthenticatorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GoogleAuthenticatorDialog({ open, onOpenChange }: GoogleAuthenticatorDialogProps) {
  const [verificationCode, setVerificationCode] = useState("")

  const handleSubmit = () => {
    // Handle Google Authenticator setup logic
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Set Up Google Authenticator</DialogTitle>
          <DialogDescription>Follow these steps to set up Google Authenticator for your account</DialogDescription>
          <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        <div className="space-y-8 py-4">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">1</div>
              <div className="space-y-2">
                <h4 className="font-medium">Download App</h4>
                <p className="text-sm text-muted-foreground">
                  Search in app stores or hover over the store button to scan its QR code
                </p>
                <div className="flex gap-4 mt-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M20.91 11.12C20.91 10.56 20.86 10.01 20.75 9.47H12V13.24H17.07C16.87 14.33 16.22 15.28 15.26 15.92V18.35H18.25C20.02 16.7 20.91 14.13 20.91 11.12Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 21C14.43 21 16.47 20.15 18.25 18.35L15.26 15.92C14.47 16.45 13.39 16.77 12 16.77C9.47 16.77 7.33 15.09 6.56 12.78H3.47V15.29C5.24 18.68 8.39 21 12 21Z"
                        fill="#34A853"
                      />
                      <path
                        d="M6.56 12.78C6.38 12.24 6.28 11.66 6.28 11.06C6.28 10.46 6.38 9.88 6.56 9.34V6.83H3.47C2.84 8.11 2.5 9.53 2.5 11.06C2.5 12.59 2.84 14.01 3.47 15.29L6.56 12.78Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.35C13.39 5.35 14.64 5.82 15.65 6.77L18.29 4.13C16.47 2.45 14.43 1.5 12 1.5C8.39 1.5 5.24 3.82 3.47 7.21L6.56 9.72C7.33 7.41 9.47 5.73 12 5.73V5.35Z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google Play
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M17.0349 12.5C17.0349 9.1 20.0449 7.7 20.0849 7.7C18.6749 5.5 16.5749 5.2 15.8049 5.2C13.9549 5 12.1749 6.3 11.2249 6.3C10.2249 6.3 8.76488 5.2 7.16488 5.2C5.06488 5.2 3.06488 6.6 1.96488 8.8C-0.335117 13.2 1.36488 19.5 3.56488 22.9C4.66488 24.5 5.96488 26.4 7.66488 26.3C9.26488 26.2 9.86488 25.2 11.7649 25.2C13.6649 25.2 14.2249 26.3 15.8649 26.2C17.5649 26.1 18.6649 24.4 19.7649 22.8C21.0649 21 21.5649 19.2 21.5649 19.1C21.5649 19 17.0349 17.4 17.0349 12.5Z"
                        fill="black"
                      />
                      <path
                        d="M14.3349 3.8C15.2349 2.7 15.8349 1.2 15.6349 0C14.3349 0.1 12.7349 0.9 11.7349 2C10.8349 3 10.1349 4.5 10.3349 5.7C11.7349 5.8 13.3349 4.9 14.3349 3.8Z"
                        fill="black"
                      />
                    </svg>
                    App Store
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">2</div>
              <div className="space-y-2">
                <h4 className="font-medium">Scan QR code</h4>
                <p className="text-sm text-muted-foreground">Open Google Authenticator and scan the QR code</p>
                <div className="bg-muted/50 p-4 rounded-lg flex justify-center mt-2">
                  <div className="w-40 h-40 bg-white p-2">
                    <Image src="/placeholder.svg?height=144&width=144" alt="QR Code" width={144} height={144} />
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">Or manually enter the following code</p>
                  <div className="flex mt-2">
                    <Input value="NEQQ7ETCDWYWXZCNW7ANQX6L3UI6RT25VBROCVH4IHCIOUQZ43CA" readOnly className="pr-10" />
                    <Button variant="ghost" size="icon" className="-ml-10">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">3</div>
              <div className="space-y-2">
                <h4 className="font-medium">Complete Verification</h4>
                <p className="text-sm text-muted-foreground">Enter the 6-digit code from Google Authenticator</p>
                <div className="mt-2">
                  <Label htmlFor="verification-code">Verification Code</Label>
                  <Input
                    id="verification-code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter the 6-digit code from Google Authenticator"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
