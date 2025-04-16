"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
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

// Add styles for animations
import "./login.css"

// MetaMask integration
import { useEffect } from "react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isWeb3ModalOpen, setIsWeb3ModalOpen] = useState(false)
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false)
  const [account, setAccount] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Check if MetaMask is installed
  useEffect(() => {
    if (typeof window !== "undefined") {
      const { ethereum } = window as any
      setIsMetaMaskInstalled(!!ethereum && !!ethereum.isMetaMask)
    }
  }, [])

  // Handle account changes
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setAccount(accounts[0])
      } else {
        setAccount(null)
      }
    }

    if (typeof window !== "undefined") {
      const { ethereum } = window as any
      if (ethereum && ethereum.isMetaMask) {
        ethereum.on("accountsChanged", handleAccountsChanged)
      }
    }

    return () => {
      if (typeof window !== "undefined") {
        const { ethereum } = window as any
        if (ethereum && ethereum.isMetaMask) {
          ethereum.removeListener("accountsChanged", handleAccountsChanged)
        }
      }
    }
  }, [])

  // Handle successful connection
  useEffect(() => {
    if (account) {
      handleWeb3Success()
    }
  }, [account])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (email && password) {
      toast({
        title: "Login successful",
        description: "Redirecting to dashboard...",
      })

      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } else {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please enter valid credentials",
      })
    }
  }

  const handleWeb3Login = async () => {
    if (!isMetaMaskInstalled) {
      setIsWeb3ModalOpen(true)
      return
    }

    try {
      setIsConnecting(true)
      const { ethereum } = window as any
      const accounts = await ethereum.request({ method: "eth_requestAccounts" })
      
      if (accounts.length > 0) {
        setAccount(accounts[0])
      }
    } catch (error) {
      console.error("Error connecting to MetaMask", error)
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: "Could not connect to MetaMask",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleWeb3Success = () => {
    toast({
      title: "Web3 login successful",
      description: "Redirecting to dashboard...",
    })

    setTimeout(() => {
      setIsWeb3ModalOpen(false)
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex md:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-foreground/50 z-10"></div>
        <div className="relative z-20 flex flex-col justify-center items-start p-12 text-white">
          <h1 className="text-4xl font-bold mb-6 animate-fade-in">Your trusted digital asset wallet platform</h1>
          <p className="text-lg mb-8 animate-fade-in animation-delay-200">
            Secure, scalable, and compliant Wallet-as-a-Service for real estate tokenization
          </p>
          <div className="mt-auto animate-fade-in animation-delay-400">
            <Image
              src="/placeholder.svg?height=400&width=500"
              alt="Dashboard Preview"
              width={500}
              height={400}
              className="rounded-lg shadow-lg border border-white/10 hover:shadow-xl transition-all duration-300"
            />
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 animate-slide-in-right">
        <div className="w-full max-w-md login-container">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <div className="relative w-12 h-12 mr-3 animate-subtle-bounce">
                <Image
                  src="/1024p.png"
                  alt="Ryzer Logo"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-semibold text-primary">Ryzer</span>
            </div>
            <div className="text-sm text-muted-foreground px-3 py-1 border border-gray-200 rounded-md shadow-sm hover:shadow transition-all duration-300">Prod</div>
          </div>

          <h1 className="text-3xl font-bold mb-6 animate-fade-in">Log In</h1>

          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 shadow-sm rounded-lg overflow-hidden">
              <TabsTrigger value="email" className="transition-all duration-300 py-3">Email</TabsTrigger>
              <TabsTrigger value="guard" className="transition-all duration-300 py-3">Ryzer Guard</TabsTrigger>
              <TabsTrigger value="passkey" className="transition-all duration-300 py-3">Passkey</TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="animate-fade-in">
              <form onSubmit={handleLogin} className="space-y-6 login-form-animate">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="transition-all duration-300 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 h-11"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label htmlFor="password" className="block text-sm font-medium">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="transition-all duration-300 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 h-11"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div className="text-right">
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline transition-all duration-200">
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <Button type="submit" className="w-full h-11 mt-2 font-medium transition-all duration-300 hover:shadow-md">
                  Log In
                </Button>
              </form>

              <div className="mt-10 flex items-center justify-center">
                <div className="relative w-full text-center mb-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-center">
                <button
                  onClick={handleWeb3Login}
                  className="flex items-center space-x-3 px-5 py-3 rounded-md border border-gray-200 hover:bg-gray-50 hover:shadow-sm transition-all duration-300 w-full justify-center"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full shadow-inner">
                    <svg width="20" height="20" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M32.9582 1L19.8241 10.7183L22.2665 5.09082L32.9582 1Z" fill="#E17726" stroke="#E17726" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2.04183 1L15.0252 10.809L12.7336 5.09082L2.04183 1Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M28.2292 23.5334L24.7346 28.872L32.2175 30.9324L34.3611 23.6569L28.2292 23.5334Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M0.650299 23.6569L2.78262 30.9324L10.2655 28.872L6.77094 23.5334L0.650299 23.6569Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9.89306 14.5149L7.82764 17.6507L15.2334 17.9977L14.9864 9.95752L9.89306 14.5149Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M25.1069 14.5149L19.9406 9.86401L19.8241 17.9977L27.2298 17.6507L25.1069 14.5149Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Connect with MetaMask</span>
                </button>
              </div>

              <div className="mt-8 text-center text-sm text-muted-foreground">
                <p>
                  By logging in, you agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline transition-colors duration-200">
                    Ryzer Account General Terms and Conditions
                  </Link>{" "}
                  and acknowledge that you have read and accept our{" "}
                  <Link href="/privacy" className="text-primary hover:underline transition-colors duration-200">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-primary font-medium hover:underline transition-colors duration-200">
                    Request Access
                  </Link>
                </p>
              </div>
            </TabsContent>

            <TabsContent value="guard">
              <div className="text-center p-8 login-form-animate">
                <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 shadow-inner transition-all duration-500 hover:shadow-md hover:bg-primary/15">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 16V12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 8H12.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Use Ryzer Guard App</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Open the Ryzer Guard app on your mobile device to scan the QR code and approve your login.
                </p>
                <div className="bg-gray-100 p-4 rounded-lg mb-6 mx-auto w-48 h-48 flex items-center justify-center">
                  <Image src="/placeholder.svg?height=160&width=160" alt="QR Code" width={160} height={160} />
                </div>
                <p className="text-sm text-muted-foreground">
                  Don't have the Ryzer Guard app?{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Download now
                  </Link>
                </p>
              </div>
            </TabsContent>

            <TabsContent value="passkey">
              <div className="text-center p-6">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 animate-pulse-slow">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15 9H9V15H15V9Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Use Passkey</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Use your device's biometric authentication or security key to securely log in.
                </p>
                <Button className="w-full mb-4">Continue with Passkey</Button>
                <p className="text-sm text-muted-foreground">
                  Don't have a passkey set up?{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Learn more
                  </Link>
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Web3 Wallet Connection Modal */}
      <Dialog open={isWeb3ModalOpen} onOpenChange={setIsWeb3ModalOpen}>
        <DialogContent className="sm:max-w-md animate-fade-in-scale">
          <DialogHeader>
            <DialogTitle>Connect Web3 Wallet</DialogTitle>
            <DialogDescription>
              {isMetaMaskInstalled 
                ? "Connect your MetaMask wallet to sign in" 
                : "MetaMask is not installed. Please install it to continue"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              {!isMetaMaskInstalled ? (
                <div className="text-center">
                  <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100">
                    <svg width="32" height="32" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M32.9582 1L19.8241 10.7183L22.2665 5.09082L32.9582 1Z" fill="#E17726" stroke="#E17726" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2.04183 1L15.0252 10.809L12.7336 5.09082L2.04183 1Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M28.2292 23.5334L24.7346 28.872L32.2175 30.9324L34.3611 23.6569L28.2292 23.5334Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M0.650299 23.6569L2.78262 30.9324L10.2655 28.872L6.77094 23.5334L0.650299 23.6569Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9.89306 14.5149L7.82764 17.6507L15.2334 17.9977L14.9864 9.95752L9.89306 14.5149Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M25.1069 14.5149L19.9406 9.86401L19.8241 17.9977L27.2298 17.6507L25.1069 14.5149Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">MetaMask Required</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    To connect with Web3, you need to install the MetaMask extension.
                  </p>
                  <Button 
                    onClick={() => window.open("https://metamask.io/download/", "_blank")} 
                    className="w-full mb-2"
                  >
                    Install MetaMask
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsWeb3ModalOpen(false)} 
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              ) : account ? (
                <div className="text-center">
                  <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 11.0857V12.0057C21.9988 14.1621 21.3005 16.2604 20.0093 17.9875C18.7182 19.7147 16.9033 20.9782 14.8354 21.5896C12.7674 22.201 10.5573 22.1276 8.53447 21.3803C6.51168 20.633 4.78465 19.2518 3.61096 17.4428C2.43727 15.6338 1.87979 13.4938 2.02168 11.342C2.16356 9.19029 2.99721 7.14205 4.39828 5.5028C5.79935 3.86354 7.69279 2.72111 9.79619 2.24587C11.8996 1.77063 14.1003 1.98806 16.07 2.86572" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 4L12 14.01L9 11.01" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Connected Successfully</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your wallet is connected. Redirecting to dashboard...
                  </p>
                  <div className="bg-gray-100 p-3 rounded-md mb-4 overflow-hidden">
                    <p className="text-sm font-mono truncate">{account}</p>
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <Button 
                    onClick={handleWeb3Login} 
                    className="w-full mb-4"
                    disabled={isConnecting}
                  >
                    {isConnecting ? "Connecting..." : "Connect MetaMask"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsWeb3ModalOpen(false)} 
                    className="w-full"
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