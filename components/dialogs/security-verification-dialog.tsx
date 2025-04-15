"use client"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface SecurityVerificationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SecurityVerificationDialog({ open, onOpenChange }: SecurityVerificationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Security Verification</DialogTitle>
          <DialogDescription>Please choose your multi-factor authentication method</DialogDescription>
          <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800 flex items-start gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M12 8H12.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-sm">For the security of your account, please set up at least one MFA method.</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                </div>
                <div>
                  <div className="font-medium">Google Authenticator</div>
                </div>
              </div>
              <Button>Set Up</Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      fill="#6366F1"
                    />
                    <path
                      d="M15 9H9V15H15V9Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Security Key</div>
                </div>
              </div>
              <Button>Set Up</Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 11.9999C13.1046 11.9999 14 11.1045 14 9.99994C14 8.89537 13.1046 7.99994 12 7.99994C10.8954 7.99994 10 8.89537 10 9.99994C10 11.1045 10.8954 11.9999 12 11.9999Z"
                      fill="white"
                    />
                    <path d="M12 12C9.79086 12 8 13.7909 8 16H16C16 13.7909 14.2091 12 12 12Z" fill="white" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Ryzer Guard</div>
                </div>
              </div>
              <Button>Set Up</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
