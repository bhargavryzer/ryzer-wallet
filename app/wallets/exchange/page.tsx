"use client"

import type React from "react"

import { useState } from "react"
import { Info, LayoutGrid, List, Search, X } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function ExchangeWalletsPage() {
  const [showAddAccount, setShowAddAccount] = useState(false)
  const [showSelectExchange, setShowSelectExchange] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Exchange Wallets</h1>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">Developer</span>
            </div>
            <p className="text-muted-foreground">Manage your exchange wallets</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Accounts:</span> 0<span className="mx-2">|</span>
              <span className="font-medium">Total Balance:</span> $0
            </div>
            <Button onClick={() => setShowSelectExchange(true)}>+ Exchange Account</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>What are Exchange Wallets?</CardTitle>
                <CardDescription>
                  Exchange Wallets bring all your exchange accounts into a single interface.
                </CardDescription>
              </div>
              <Button variant="outline" className="text-primary self-start">
                <Info className="mr-2 h-4 w-4" />
                How to Link Exchange Accounts?
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by account name" className="pl-8 w-full md:w-[300px]" />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Search className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline">
                  <Info className="mr-2 h-4 w-4" />
                  Sort
                </Button>
                <div className="border rounded-md flex">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    className="rounded-none border-0"
                    onClick={() => setViewMode("grid")}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    className="rounded-none border-0"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-6">
                <Image
                  src="/placeholder.svg?height=80&width=80&query=search"
                  alt="No data"
                  width={80}
                  height={80}
                  className="text-muted-foreground"
                />
              </div>
              <h3 className="text-lg font-medium mb-2">No Data to Display</h3>
            </div>
          </CardContent>
        </Card>

        {/* Select Exchange Modal */}
        <Dialog open={showSelectExchange} onOpenChange={setShowSelectExchange}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Select Exchange</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                onClick={() => setShowSelectExchange(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Exchange</Label>
                <div className="relative">
                  <Input placeholder="Select exchange" className="pr-8" />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                <ExchangeOption
                  name="Binance"
                  logo="/placeholder.svg?height=24&width=24&query=binance logo"
                  accountType="Sub Account & Trading Account"
                  onClick={() => {
                    setShowSelectExchange(false)
                    setShowAddAccount(true)
                  }}
                />
                <ExchangeOption
                  name="OKX"
                  logo="/placeholder.svg?height=24&width=24&query=okx logo"
                  accountType="Sub Account & Trading Account"
                  onClick={() => {
                    setShowSelectExchange(false)
                    setShowAddAccount(true)
                  }}
                />
                <ExchangeOption
                  name="Deribit"
                  logo="/placeholder.svg?height=24&width=24&query=deribit logo"
                  accountType="Sub Account"
                  onClick={() => {
                    setShowSelectExchange(false)
                    setShowAddAccount(true)
                  }}
                />
                <ExchangeOption
                  name="Bybit"
                  logo="/placeholder.svg?height=24&width=24&query=bybit logo"
                  accountType="Sub Account & Trading Account"
                  onClick={() => {
                    setShowSelectExchange(false)
                    setShowAddAccount(true)
                  }}
                />
                <ExchangeOption
                  name="Gate"
                  logo="/placeholder.svg?height=24&width=24&query=gate logo"
                  accountType="Sub Account & Trading Account"
                  onClick={() => {
                    setShowSelectExchange(false)
                    setShowAddAccount(true)
                  }}
                />
                <ExchangeOption
                  name="Bitget"
                  logo="/placeholder.svg?height=24&width=24&query=bitget logo"
                  accountType="Sub Account & Trading Account"
                  onClick={() => {
                    setShowSelectExchange(false)
                    setShowAddAccount(true)
                  }}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

interface ExchangeOptionProps {
  name: string
  logo: string
  accountType: string
  onClick: () => void
}

function ExchangeOption({ name, logo, accountType, onClick }: ExchangeOptionProps) {
  return (
    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-md cursor-pointer" onClick={onClick}>
      <Image src={logo || "/placeholder.svg"} alt={`${name} logo`} width={24} height={24} className="rounded-full" />
      <div className="flex-1">
        <div className="font-medium">{name}</div>
        <div className="text-xs text-muted-foreground">{accountType}</div>
      </div>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      {children}
    </div>
  )
}

function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
