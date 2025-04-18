"use client"

import { useState, useEffect, useCallback, useRef, lazy, Suspense } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, X, Loader2 } from "lucide-react"
import type { ExternalProvider } from "@ethersproject/providers"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Constants
const RYZER_GUARD_CODE_LENGTH = 6
const TOAST_DURATION = 3000
const API_SIMULATION_DELAY = 1000

// Types
interface EthereumProvider extends ExternalProvider {
  isMetaMask?: boolean
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
  on: (event: "accountsChanged", callback: (accounts: string[]) => void) => void
  removeListener: (event: "accountsChanged", callback: (accounts: string[]) => void) => void
}

// Email Login Form Component
interface EmailLoginFormProps {
  isLoading: boolean
  onSubmit: (email: string, password: string) => Promise<void>
}

// Lazy load components with consistent loading skeletons
const EmailLoginForm = dynamic(() => import('@/components/login/email-login-form').then(mod => mod.EmailLoginForm), {
  loading: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-5 w-16 animate-pulse rounded bg-gray-200"></div>
        <div className="h-12 w-full animate-pulse rounded-lg bg-gray-200"></div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-5 w-16 animate-pulse rounded bg-gray-200"></div>
          <div className="h-5 w-24 animate-pulse rounded bg-gray-200"></div>
        </div>
        <div className="h-12 w-full animate-pulse rounded-lg bg-gray-200"></div>
      </div>
      <div className="h-12 w-full animate-pulse rounded-lg bg-gray-200"></div>
    </div>
  ),
  ssr: false
})

const RyzerGuardLogin = dynamic(() => import('@/components/login/ryzer-guard-login').then(mod => mod.RyzerGuardLogin), {
  loading: () => (
    <div className="space-y-6 text-center">
      <div className="space-y-1">
        <div className="h-6 w-32 mx-auto animate-pulse rounded bg-gray-200"></div>
        <div className="h-5 w-64 mx-auto animate-pulse rounded bg-gray-200"></div>
      </div>
      <div className="h-40 w-40 mx-auto animate-pulse rounded-lg bg-gray-200"></div>
      <div className="space-y-2">
        <div className="h-5 w-24 mx-auto animate-pulse rounded bg-gray-200"></div>
        <div className="h-12 w-full animate-pulse rounded-lg bg-gray-200"></div>
      </div>
      <div className="h-12 w-full animate-pulse rounded-lg bg-gray-200"></div>
    </div>
  ),
  ssr: false
})

const PasskeyLogin = dynamic(() => import('@/components/login/passkey-login').then(mod => mod.PasskeyLogin), {
  loading: () => (
    <div className="space-y-6 text-center">
      <div className="h-12 w-12 mx-auto animate-pulse rounded-full bg-gray-200"></div>
      <div className="h-6 w-32 mx-auto animate-pulse rounded bg-gray-200"></div>
      <div className="h-5 w-64 mx-auto animate-pulse rounded bg-gray-200"></div>
      <div className="h-12 w-full animate-pulse rounded-lg bg-gray-200"></div>
      <div className="h-4 w-32 mx-auto animate-pulse rounded bg-gray-200"></div>
    </div>
  ),
  ssr: false
})


// Ryzer Guard Login Component
interface RyzerGuardLoginProps {
  isLoading: boolean
  onSubmit: (code: string) => Promise<void>
}

// function RyzerGuardLogin({ isLoading, onSubmit }: RyzerGuardLoginProps) {
//   const [code, setCode] = useState("")
//   const [codeError, setCodeError] = useState("")

//   const validateCode = (value: string) => {
//     const codeRegex = /^\d{6}$/
//     return codeRegex.test(value) ? "" : "Please enter a valid 6-digit code"
//   }

//   const handleSubmit = async () => {
//     const codeValidation = validateCode(code)
//     setCodeError(codeValidation)
//     if (!codeValidation) {
//       await onSubmit(code)
//     }
//   }

//   return (
//     <div className="space-y-6 text-center">
//       <div>
//         <h3 className="text-lg font-semibold text-gray-900">Ryzer Guard</h3>
//         <p className="mt-1 text-sm text-gray-500">
//           Scan the QR code or enter the code from the Ryzer Guard app.
//         </p>
//       </div>
//       <div className="flex justify-center rounded-lg bg-gray-100 p-4">
//         <Image
//           src="/qr-code-placeholder.png"
//           alt="Ryzer Guard QR Code"
//           width={140}
//           height={140}
//           className="rounded-md"
//         />
//       </div>
//       <div className="space-y-2">
//         <Label htmlFor="guard-code" className="text-sm font-medium text-gray-700">
//           Guard Code
//         </Label>
//         <Input
//           id="guard-code"
//           placeholder="Enter 6-digit code"
//           value={code}
//           onChange={(e) => {
//             setCode(e.target.value)
//             setCodeError(validateCode(e.target.value))
//           }}
//           maxLength={RYZER_GUARD_CODE_LENGTH}
//           inputMode="numeric"
//           aria-invalid={!!codeError}
//           aria-describedby={codeError ? "guard-error" : undefined}
//           className="h-12 rounded-lg border-gray-300 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
//         />
//         {codeError && (
//           <p id="guard-error" className="text-xs text-red-600">
//             {codeError}
//           </p>
//         )}
//       </div>
//       <Button
//         onClick={handleSubmit}
//         disabled={isLoading}
//         className="h-12 w-full rounded-lg bg-purple-600 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50 focus:ring-2 focus:ring-purple-500"
//       >
//         {isLoading ? (
//           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//         ) : (
//           "Log In"
//         )}
//       </Button>
//       <p className="text-xs text-gray-500">
//         Need the app?{" "}
//         <Link
//           href="/download-ryzer-guard"
//           className="text-purple-600 hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500"
//         >
//           Download Ryzer Guard
//         </Link>
//       </p>
//     </div>
//   )
// }

// Passkey Login Component
interface PasskeyLoginProps {
  isLoading: boolean
  onSubmit: () => Promise<void>
}


// Main Login Page Component
export default function LoginPage() {
  const [isWeb3ModalOpen, setIsWeb3ModalOpen] = useState(false)
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false)
  const [account, setAccount] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const dialogRef = useRef<HTMLDivElement>(null)

  // Check MetaMask installation
  useEffect(() => {
    const checkMetaMask = () => {
      const ethereum = (window as any).ethereum as EthereumProvider | undefined
      setIsMetaMaskInstalled(!!ethereum && !!ethereum.isMetaMask)
    }
    checkMetaMask()
    window.addEventListener("load", checkMetaMask)
    return () => window.removeEventListener("load", checkMetaMask)
  }, [])

  // Handle MetaMask account changes
  useEffect(() => {
    const ethereum = (window as any).ethereum as EthereumProvider | undefined
    if (!ethereum || !ethereum.isMetaMask) return

    const handleAccountsChanged = (accounts: string[]) => {
      setAccount(accounts.length > 0 ? accounts[0] : null)
    }

    ethereum.on("accountsChanged", handleAccountsChanged)
    return () => {
      ethereum.removeListener("accountsChanged", handleAccountsChanged)
    }
  }, [])

  // Handle successful Web3 connection
  useEffect(() => {
    if (account) {
      toast({
        title: "Wallet connected",
        description: "Successfully connected to MetaMask. Redirecting...",
        duration: TOAST_DURATION,
      })
      setTimeout(() => {
        setIsWeb3ModalOpen(false)
        router.push("/dashboard")
      }, TOAST_DURATION)
    }
  }, [account, router, toast])

  // Focus trap for Web3 dialog
  useEffect(() => {
    if (isWeb3ModalOpen && dialogRef.current) {
      const focusableElements = dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Tab") {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }

      document.addEventListener("keydown", handleKeyDown)
      firstElement?.focus()
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isWeb3ModalOpen])

  const handleEmailLogin = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, API_SIMULATION_DELAY))
        toast({
          title: "Login successful",
          description: "Welcome back! Redirecting to your dashboard...",
          duration: TOAST_DURATION,
        })
        router.push("/dashboard")
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid credentials. Please try again.",
          duration: TOAST_DURATION,
        })
      } finally {
        setIsLoading(false)
      }
    },
    [router, toast]
  )

  const handleWeb3Login = useCallback(async () => {
    if (!isMetaMaskInstalled) {
      setIsWeb3ModalOpen(true)
      return
    }

    setIsLoading(true)
    try {
      const ethereum = (window as any).ethereum as EthereumProvider
      const accounts = (await ethereum.request({
        method: "eth_requestAccounts",
      })) as string[]
      if (accounts.length > 0) {
        setAccount(accounts[0])
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: "Could not connect to MetaMask. Please try again.",
        duration: TOAST_DURATION,
      })
    } finally {
      setIsLoading(false)
    }
  }, [isMetaMaskInstalled, toast])

  const handleRyzerGuardLogin = useCallback(
    async (code: string) => {
      setIsLoading(true)
      try {
        // Simulate Ryzer Guard verification
        await new Promise((resolve) => setTimeout(resolve, API_SIMULATION_DELAY))
        toast({
          title: "Ryzer Guard login successful",
          description: "Redirecting to dashboard...",
          duration: TOAST_DURATION,
        })
        router.push("/dashboard")
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid code. Please try again.",
          duration: TOAST_DURATION,
        })
      } finally {
        setIsLoading(false)
      }
    },
    [router, toast]
  )

  const handlePasskeyLogin = useCallback(async () => {
    setIsLoading(true)
    try {
      // Simulate passkey authentication
      await new Promise((resolve) => setTimeout(resolve, API_SIMULATION_DELAY))
      toast({
        title: "Passkey login successful",
        description: "Redirecting to dashboard...",
        duration: TOAST_DURATION,
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Authentication failed. Please try again.",
        duration: TOAST_DURATION,
      })
    } finally {
      setIsLoading(false)
    }
  }, [router, toast])

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Panel (Hidden on Mobile) */}
<div className="hidden lg:flex lg:w-1/2 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900/90">
  <div className="flex flex-col justify-center px-12 py-16 text-white max-w-2xl space-y-6">
    <h1 className="text-4xl font-bold tracking-tight leading-tight">
      Powering Real Estate Tokenization with Scalable Wallet-as-a-Service
    </h1>
    <p className="text-lg leading-relaxed">
      Unlock the potential of real estate tokenization with our robust Ryzer wallet, designed for security, scalability, and seamless management of digital assets across the entire investment lifecycle.
    </p>
    <ul className="space-y-3 text-base">
      <li className="flex items-center">
        <svg
          className="w-6 h-6 mr-2 text-green-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        Bank-grade security
      </li>
      <li className="flex items-center">
        <svg
          className="w-6 h-6 mr-2 text-green-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        Regulatory compliance
      </li>
      <li className="flex items-center">
        <svg
          className="w-6 h-6 mr-2 text-green-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        Seamless integration
      </li>
    </ul>
    <div>
      <Image
        src="/dashboard-preview.png"
        alt="Dashboard Preview"
        width={500}
        height={400}
        loading="lazy"
        className="rounded-lg border border-white/10 shadow-xl hover:shadow-2xl transition-shadow"
      />
    </div>
  </div>
</div>

      {/* Right Panel (Login Form) */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative mr-3 h-12 w-12">
                <Image
                  src="/logo.png"
                  alt="Ryzer Logo"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Ryzer Wallet</h2>
            </div>
            <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 shadow-sm hover:shadow">
              Production
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="mb-8 grid w-full grid-cols-3 rounded-xl bg-gray-100 p-1">
              <TabsTrigger
                value="email"
                className="py-3 text-sm font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Email
              </TabsTrigger>
              <TabsTrigger
                value="guard"
                className="py-3 text-sm font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Ryzer Guard
              </TabsTrigger>
              <TabsTrigger
                value="passkey"
                className="py-3 text-sm font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Passkey
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <EmailLoginForm isLoading={isLoading} onSubmit={handleEmailLogin} />
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-gray-50 px-2 text-gray-500">Or continue with</span>
                </div>
              </div>
              <Button
                onClick={handleWeb3Login}
                disabled={isLoading}
                className="h-12 w-full rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:ring-2 focus:ring-purple-500"
              >
                <div className="flex items-center space-x-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100">
                    <svg width="16" height="16" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M32.9582 1L19.8241 10.7183L22.2665 5.09082L32.9582 1Z"
                        fill="#E17726"
                        stroke="#E17726"
                        strokeWidth="0.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2.04183 1L15.0252 10.809L12.7336 5.09082L2.04183 1Z"
                        fill="#E27625"
                        stroke="#E27625"
                        strokeWidth="0.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M28.2292 23.5334L24.7346 28.872L32.2175 30.9324L34.3611 23.6569L28.2292 23.5334Z"
                        fill="#E27625"
                        stroke="#E27625"
                        strokeWidth="0.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M0.650299 23.6569L2.78262 30.9324L10.2655 28.872L6.77094 23.5334L0.650299 23.6569Z"
                        fill="#E27625"
                        stroke="#E27625"
                        strokeWidth="0.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.89306 14.5149L7.82764 17.6507L15.2334 17.9977L14.9864 9.95752L9.89306 14.5149Z"
                        fill="#E27625"
                        stroke="#E27625"
                        strokeWidth="0.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M25.1069 14.5149L19.9406 9.86401L19.8241 17.9977L27.2298 17.6507L25.1069 14.5149Z"
                        fill="#E27625"
                        stroke="#E27625"
                        strokeWidth="0.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span>Connect with MetaMask</span>
                </div>
              </Button>
              <div className="mt-6 text-center text-xs text-gray-500">
                <p>
                  By logging in, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="text-purple-600 hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-purple-600 hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    Privacy Policy
                  </Link>.
                </p>
              </div>
              <div className="mt-4 text-center">
                <p className="text-xs">
                  New to Ryzer?{" "}
                  <Link
                    href="/register"
                    className="text-purple-600 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    Request Access
                  </Link>
                </p>
              </div>
            </TabsContent>
            <TabsContent value="guard">
              <RyzerGuardLogin isLoading={isLoading} onSubmit={handleRyzerGuardLogin} />
            </TabsContent>
            <TabsContent value="passkey">
              <PasskeyLogin {...{ isLoading, onSubmit: handlePasskeyLogin }} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Web3 Dialog */}
      <Dialog open={isWeb3ModalOpen} onOpenChange={setIsWeb3ModalOpen}>
        <DialogContent className="sm:max-w-md rounded-lg" ref={dialogRef}>
          <DialogHeader>
            <DialogTitle>Connect Web3 Wallet</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {isMetaMaskInstalled
                ? "Connect your MetaMask wallet to sign in securely."
                : "MetaMask is required for Web3 login. Install it to proceed."}
            </DialogDescription>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-3 rounded-full focus:ring-2 focus:ring-purple-500"
              onClick={() => setIsWeb3ModalOpen(false)}
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="py-4">
            <div className="flex flex-col items-center space-y-4">
              {!isMetaMaskInstalled ? (
                <div className="text-center space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                    <svg width="24" height="24" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M32.9582 1L19.8241 10.7183L22.2665 5.09082L32.9582 1Z"
                        fill="#E17726"
                        stroke="#E17726"
                        strokeWidth="0.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2.04183 1L15.0252 10.809L12.7336 5.09082L2.04183 1Z"
                        fill="#E27625"
                        stroke="#E27625"
                        strokeWidth="0.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M28.2292 23.5334L24.7346 28.872L32.2175 30.9324L34.3611 23.6569L28.2292 23.5334Z"
                        fill="#E27625"
                        stroke="#E27625"
                        strokeWidth="0.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M0.650299 23.6569L2.78262 30.9324L10.2655 28.872L6.77094 23.5334L0.650299 23.6569Z"
                        fill="#E27625"
                        stroke="#E27625"
                        strokeWidth="0.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.89306 14.5149L7.82764 17.6507L15.2334 17.9977L14.9864 9.95752L9.89306 14.5149Z"
                        fill="#E27625"
                        stroke="#E27625"
                        strokeWidth="0.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M25.1069 14.5149L19.9406 9.86401L19.8241 17.9977L27.2298 17.6507L25.1069 14.5149Z"
                        fill="#E27625"
                        stroke="#E27625"
                        strokeWidth="0.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Install MetaMask</h3>
                  <p className="text-sm text-gray-500">
                    MetaMask is required for secure Web3 authentication.
                  </p>
                  <Button
                    onClick={() => window.open("https://metamask.io/download/", "_blank")}
                    className="h-12 w-full rounded-lg bg-purple-600 text-sm font-medium text-white hover:bg-purple-700 focus:ring-2 focus:ring-purple-500"
                  >
                    Get MetaMask
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsWeb3ModalOpen(false)}
                    className="h-12 w-full rounded-lg border-gray-300 text-sm focus:ring-2 focus:ring-purple-500"
                  >
                    Cancel
                  </Button>
                </div>
              ) : account ? (
                <div className="text-center space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M22 11.0857V12.0057C21.9988 14.1621 21.3005 16.2604 20.0093 17.9875C18.7182 19.7147 16.9033 20.9782 14.8354 21.5896C12.7674 22.201 10.5573 22.1276 8.53447 21.3803C6.51168 20.633 4.78465 19.2518 3.61096 17.4428C2.43727 15.6338 1.87979 13.4938 2.02168 11.342C2.16356 9.19029 2.99721 7.14205 4.39828 5.5028C5.79935 3.86354 7.69279 2.72111 9.79619 2.24587C11.8996 1.77063 14.1003 1.98806 16.07 2.86572"
                        stroke="#22C55E"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M22 4L12 14.01L9 11.01"
                        stroke="#22C55E"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Wallet Connected</h3>
                  <p className="text-sm text-gray-500">
                    Your wallet is connected. Redirecting to dashboard...
                  </p>
                  <div className="rounded-lg bg-gray-100 p-2">
                    <p className="truncate text-xs font-mono text-gray-600">{account}</p>
                  </div>
                </div>
              ) : (
                <div className="w-full space-y-3">
                  <Button
                    onClick={handleWeb3Login}
                    disabled={isLoading}
                    className="h-12 w-full rounded-lg bg-purple-600 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50 focus:ring-2 focus:ring-purple-500"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Connect MetaMask"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsWeb3ModalOpen(false)}
                    className="h-12 w-full rounded-lg border-gray-300 text-sm focus:ring-2 focus:ring-purple-500"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
