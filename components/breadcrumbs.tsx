"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

export function Breadcrumbs() {
  const pathname = usePathname()

  if (pathname === "/") return null

  const pathSegments = pathname.split("/").filter(Boolean)

  // Map path segments to more readable names
  const pathMap: Record<string, string> = {
    dashboard: "Dashboard",
    wallets: "Wallets",
    custodial: "Custodial",
    mpc: "MPC",
    "smart-contract": "Smart Contract",
    exchange: "Exchange",
    "transaction-policies": "Transaction Policies",
    "address-lists": "Address Lists",
    "transaction-history": "Transaction History",
    "address-book": "Address Book",
    security: "Security",
    "guard-app": "Guard App",
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm">
      <ol className="flex items-center space-x-1">
        <li>
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {pathSegments.map((segment, index) => {
          const path = `/${pathSegments.slice(0, index + 1).join("/")}`
          const isLast = index === pathSegments.length - 1

          return (
            <li key={path} className="flex items-center">
              <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {isLast ? (
                <span className="ml-1 font-medium" aria-current="page">
                  {pathMap[segment] || segment}
                </span>
              ) : (
                <Link href={path} className="ml-1 text-muted-foreground hover:text-foreground">
                  {pathMap[segment] || segment}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
