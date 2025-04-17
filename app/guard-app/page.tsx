"use client"

import { useState } from "react"
import { Check, Download, QrCode, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function GuardAppPage() {
  const [showSetupGuard, setShowSetupGuard] = useState(false)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ryzer Guard App</h1>
          <p className="text-muted-foreground">
            Secure your transactions with the Ryzer Guard mobile application
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ryzer Guard App</CardTitle>
            <CardDescription>
              A mobile application used to approve transactions, store key shares, and enhance your wallet security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Enhanced Security</h3>
                    <p className="text-sm text-muted-foreground">
                      Securely store your MPC key share and approve transactions with biometric authentication
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Transaction Approval</h3>
                    <p className="text-sm text-muted-foreground">
                      Review and approve transactions from anywhere, anytime
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <QrCode className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Easy Setup</h3>
                    <p className="text-sm text-muted-foreground">
                      Simple QR code scanning for quick and secure setup
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4 p-6 border rounded-lg bg-muted/20">
                <div className="text-center">
                  <h3 className="font-medium text-lg mb-2">Download Ryzer Guard App</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Scan the QR code or download directly from app stores
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg mb-4">
                  <img 
                    src="/placeholder.svg?height=160&width=160" 
                    alt="QR Code" 
                    width={160} 
                    height={160} 
                  />
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.91 11.12C20.91 10.56 20.86 10.01 20.75 9.47H12V13.24H17.07C16.87 14.33 16.22 15.28 15.26 15.92V18.35H18.25C20.02 16.7 20.91 14.13 20.91 11.12Z" fill="#4285F4"/>
                      <path d="M12 21C14.43 21 16.47 20.15 18.25 18.35L15.26 15.92C14.47 16.45 13.39 16.77 12 16.77C9.47 16.77 7.33 15.09 6.56 12.78H3.47V15.29C5.24 18.68 8.39 21 12 21Z" fill="#34A853"/>
                      <path d="M6.56 12.78C6.38 12.24 6.28 11.66 6.28 11.06C6.28 10.46 6.38 9.88 6.56 9.34V6.83H3.47C2.84 8.11 2.5 9.53 2.5 11.06C2.5 12.59 2.84 14.01 3.47 15.29L6.56 12.78Z" fill="#FBBC05"/>
                      <path d="M12 5.35C13.39 5.35 14.64 5.82 15.65 6.77L18.29 4.13C16.47 2.45 14.43 1.5 12 1.5C8.39 1.5 5.24 3.82 3.47 7.21L6.56 9.72C7.33 7.41 9.47 5.73 12 5.73V5.35Z" fill="#EA4335"/>
                    </svg>
                    Google Play
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.0349 12.5C17.0349 9.1 20.0449 7.7 20.0849 7.7C18.6749 5.5 16.5749 5.2 15.8049 5.2C13.9549 5 12.1749 6.3 11.2249 6.3C10.2249 6.3 8.76488 5.2 7.16488 5.2C5.06488 5.2 3.06488 6.6 1.96488 8.8C-0.335117 13.2 1.36488 19.5 3.56488 22.9C4.66488 24.5 5.96488 26.4 7.66488 26.3C9.26488 26.2 9.86488 25.2 11.7649 25.2C13.6649 25.2 14.2249 26.3 15.8649 26.2C17.5649 26.1 18.6649 24.4 19.7649 22.8C21.0649 21 21.5649 19.2 21.5649 19.1C21.5649 19 17.0349 17.4 17.0349 12.5Z" fill="black"/>
                      <path d="M14.3349 3.8C15.2349 2.7 15.8349 1.2 15.6349 0C14.3349 0.1 12.7349 0.9 11.7349 2C10.8349 3 10.1349 4.5 10.3349 5.7C11.7349 5.8 13.3349 4.9 14.3349 3.8Z" fill="black"/>
                    </svg>
                    App Store
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button size="lg" onClick={() => setShowSetupGuard(true)}>
                <Download className="mr-2 h-5 w-5" />
                Set Up Ryzer Guard
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>
              Learn how Ryzer Guard App enhances your wallet security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="mpc">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="mpc">MPC Key Sharing</TabsTrigger>
                <TabsTrigger value="approval">Transaction Approval</TabsTrigger>
                <TabsTrigger value="recovery">Key Recovery</TabsTrigger>
              </TabsList>
              <TabsContent value="mpc" className="space-y-4 pt-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                        <path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="font-medium mb-2">Key Generation</h3>
                    <p className="text-sm text-muted-foreground">
                      When you create an MPC wallet, your private key is split into three shares using a Threshold Signature Scheme (TSS).
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="font-medium mb-2">Key Distribution</h3>
                    <p className="text-sm text-muted-foreground">
                      One key share is stored on your device in the Ryzer Guard App, one on Ryzer's secure server, and one in a Hardware Security Module (HSM).
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="font-medium mb-2">Secure Signing</h3>
                    <p className="text-sm text-muted-foreground">
                      When you initiate a transaction, at least 2 of the 3 key shares must participate in the signing process, ensuring no single point of failure.
                    </p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="approval" className="space-y-4 pt-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                        <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20 8V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M23 11H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="font-medium mb-2">Transaction Request</h3>
                    <p className="text-sm text-muted-foreground">
                      When a transaction is initiated, you receive a push notification on your Ryzer Guard App.
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                        <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="font-medium mb-2">Review & Approve</h3>
                    <p className="text-sm text-muted-foreground">
                      Review transaction details including recipient, amount, and gas fees before approving with biometric authentication.
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="font-medium mb-2">Policy Enforcement</h3>
                    <p className="text-sm text-muted-foreground">
                      Transactions are automatically checked against your configured policies for spending limits, whitelisted addresses, and more.
                    </p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="recovery" className="space-y-4 pt-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                        <path d="M4 4V10H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20 20V14H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20 4L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M4 20L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="font-medium mb-2">Device Loss</h3>
                    <p className="text-sm text-muted-foreground">
                      If you lose your device, your key share can be securely regenerated using the 2-of-3 MPC scheme.
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.5C18.7626 2.23735 19.1131 2.08901 19.4775 2.08901C19.8419 2.08901 20.1924 2.23735 20.455 2.5C20.7176 2.76264 20.866 3.11315 20.866 3.47755C20.866 3.84196 20.7176 4.19247 20.455 4.45511L12 13.0001L8 14.0001L9 10.0001L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="font-medium mb-2">Recovery Process</h3>
                    <p className="text-sm text-muted-foreground">
                      Install Ryzer Guard on your new device and complete identity verification to restore your key share.
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="font-medium mb-2">Continuous Access</h3>
                    <p className="text-sm text-muted-foreground">
                      Your funds remain accessible throughout the recovery process thanks to the 2-of-3 MPC scheme.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Setup Guard Dialog */}
        <Dialog open={showSetupGuard} onOpenChange={setShowSetupGuard}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Set Up Ryzer Guard App</DialogTitle>
              <DialogDescription>
                Follow these steps to set up the Ryzer Guard App on your mobile device
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                    1
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Download App</h4>
                    <p className="text-sm text-muted-foreground">
                      Download the Ryzer Guard App from the App Store or Google Play
                    </p>
                    <div className="flex gap-4 mt-2">
                      <Button variant="outline" className="flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20.91 11.12C20.91 10.56 20.86 10.01 20.75 9.47H12V13.24H17.07C16.87 14.33 16.22 15.28 15.26 15.92V18.35H18.25C20.02 16.7 20.91 14.13 20.91 11.12Z" fill="#4285F4"/>
                          <path d="M12 21C14.43 21 16.47 20.15 18.25 18.35L15.26 15.92C14.47 16.45 13.39 16.77 12 16.77C9.47 16.77 7.33 15.09 6.56 12.78H3.47V15.29C5.24 18.68 8.39 21 12 21Z" fill="#34A853"/>
                          <path d="M6.56 12.78C6.38 12.24 6.28 11.66 6.28 11.06C6.28 10.46 6.38 9.88 6.56 9.34V6.83H3.47C2.84 8.11 2.5 9.53 2.5 11.06C2.5 12.59 2.84 14.01 3.47 15.29L6.56 12.78Z" fill="#FBBC05"/>
                          <path d="M12 5.35C13.39 5.35 14.64 5.82 15.65 6.77L18.29 4.13C16.47 2.45 14.43 1.5 12 1.5C8.39 1.5 5.24 3.82 3.47 7.21L6.56 9.72C7.33 7.41 9.47 5.73 12 5.73V5.35Z" fill="#EA4335"/>
                        </svg>
                        Google Play
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.0349 12.5C17.0349 9.1 20.0449 7.7 20.0849 7.7C18.6749 5.5 16.5749 5.2 15.8049 5.2C13.9549 5 12.1749 6.3 11.2249 6.3C10.2249 6.3 8.76488 5.2 7.16488 5.2C5.06488 5.2 3.06488 6.6 1.96488 8.8C-0.335117 13.2 1.36488 19.5 3.56488 22.9C4.66488 24.5 5.96488 26.4 7.66488 26.3C9.26488 26.2 9.86488 25.2 11.7649 25.2C13.6649 25.2 14.2249 26.3 15.8649 26.2C17.5649 26.1 18.6649 24.4 19.7649 22.8C21.0649 21 21.5649 19.2 21.5649 19.1C21.5649 19 17.0349 17.4 17.0349 12.5Z" fill="black"/>
                          <path d="M14.3349 3.8C15.2349 2.7 15.8349 1.2 15.6349 0C14.3349 0.1 12.7349 0.9 11.7349 2C10.8349 3 10.1349 4.5 10.3349 5.7C11.7349 5.8 13.3349 4.9 14.3349 3.8Z" fill="black"/>
                        </svg>
                        App Store
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
