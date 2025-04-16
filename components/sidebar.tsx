"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  Activity,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  History,
  Home,
  Layers,
  Shield,
  Wallet,
  Code,
  LayoutGrid,
  BookMarked,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { useSidebar } from "@/components/sidebar-provider"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { VisuallyHidden } from "@/components/ui/visually-hidden"

interface SidebarProps {
  className?: string
}

interface NavItem {
  label: string
  icon?: React.ElementType
  href: string
  active?: boolean
  children?: NavItem[]
  isLogout?: boolean
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { isCollapsed, toggle } = useSidebar()
  const [isWalletsOpen, setIsWalletsOpen] = useState(false)

  const isWalletsActive = pathname.startsWith("/wallets")

  useEffect(() => {
    if (isWalletsActive && !isCollapsed) {
      setIsWalletsOpen(true)
    } else if (isCollapsed) {
      setIsWalletsOpen(false)
    }
  }, [isWalletsActive, isCollapsed])

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Wallets",
      icon: Wallet,
      href: "/wallets",
      active: pathname.startsWith("/wallets"),
      children: [
        {
          label: "Custodial Wallets",
          href: "/wallets/custodial",
          icon: CreditCard,
          active: pathname === "/wallets/custodial",
        },
        {
          label: "MPC Wallets",
          href: "/wallets/mpc",
          icon: Shield,
          active: pathname === "/wallets/mpc",
        },
        {
          label: "Smart Contract Wallets",
          href: "/wallets/smart-contract",
          icon: Layers,
          active: pathname === "/wallets/smart-contract",
        },
        {
          label: "Exchange Wallets",
          href: "/wallets/exchange",
          icon: Activity,
          active: pathname === "/wallets/exchange",
        },
      ],
    },
    {
      label: "Transaction Policies",
      icon: Shield,
      href: "/transaction-policies",
      active: pathname.startsWith("/transaction-policies"),
    },
    {
      label: "Transaction History",
      icon: History,
      href: "/transaction-history",
      active: pathname.startsWith("/transaction-history"),
    },
    {
      label: "Address Book",
      icon: BookOpen,
      href: "/address-book",
      active: pathname === "/address-book",
    },
    {
      label: "Apps",
      icon: LayoutGrid,
      href: "/apps",
      active: pathname === "/apps",
    },
    {
      label: "Security",
      icon: Shield,
      href: "/security",
      active: pathname === "/security",
    },
    {
      label: "Developer",
      icon: Code,
      href: "/developer",
      active: pathname === "/developer",
    },
    {
      label: "Guide",
      icon: BookMarked,
      href: "/guide",
      active: pathname === "/guide",
    },
  ]

  return (
    <div
      className={cn(
        "relative flex h-screen flex-col border-r bg-[#7B5CF0] text-white transition-all duration-300 ease-in-out z-20",
        isCollapsed ? "w-[70px]" : "w-[260px]",
        className,
      )}
      aria-label="Main navigation"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex h-16 items-center justify-between px-6 border-b border-[#6B4CE0]"
      >
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div className="relative h-8 w-8 shrink-0 rounded-full bg-white">
            <Image
              src="/placeholder-logo.svg"
              alt="Ryzer Logo"
              fill
              className="object-contain p-1.5"
              sizes="32px"
              priority
            />
          </div>
          {!isCollapsed && <span className="font-bold text-xl tracking-tight">Ryzer</span>}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-[#6B4CE0]"
          onClick={toggle}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </motion.div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1 py-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.nav
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex flex-col gap-4 px-4"
          >
            <div className="space-y-1">
              <nav className="flex flex-col gap-3">
                {navItems.map((item) => {
                  // Special handling for Wallets with children
                  if (item.label === "Wallets" && item.children) {
                    return (
                      <div className="mb-4" key={item.href}>
                        {isCollapsed ? (
                          <TooltipProvider delayDuration={300}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link
                                  href={item.href}
                                  className={cn(
                                    "flex h-10 items-center justify-center rounded-lg px-2 py-2 text-sm font-medium transition-colors",
                                    isWalletsActive ? "bg-[#6B4CE0]" : "hover:bg-[#6B4CE0]",
                                  )}
                                  aria-current={isWalletsActive ? "page" : undefined}
                                >
                                  <Wallet size={18} />
                                  <VisuallyHidden>Wallets</VisuallyHidden>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent side="right">Wallets</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <Collapsible open={isWalletsOpen} onOpenChange={setIsWalletsOpen}>
                            <CollapsibleTrigger
                              className={cn(
                                "flex h-10 items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[#6B4CE0]/80",
                                isWalletsActive ? "bg-[#6B4CE0]" : "hover:bg-[#6B4CE0]/80",
                              )}
                            >
                              <Wallet size={18} />
                              <span>Wallets</span>
                              <ChevronDown
                                size={16}
                                className={cn(
                                  "ml-auto transition-transform duration-200",
                                  isWalletsOpen && "rotate-180",
                                )}
                              />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-1 px-2 mt-2 overflow-hidden">
                              <div className="py-1">
                                {item.children.map((wallet) => (
                                  <Link
                                    key={wallet.href}
                                    href={wallet.href}
                                    className={cn(
                                      "flex justify-between items-center h-9 rounded-md px-3 py-2 text-sm transition-colors",
                                      pathname === wallet.href
                                        ? "bg-[#6B4CE0]"
                                        : "hover:bg-[#6B4CE0]/80",
                                    )}
                                  >
                                    <div className="flex items-center gap-2">
                                      {wallet.icon ? <wallet.icon size={16} /> : null}
                                      <span>{wallet.label}</span>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        )}
                      </div>
                    )
                  }

                  // Regular nav items
                  return (
                    <div key={item.href}>
                      <TooltipProvider delayDuration={300}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            {item.isLogout ? (
                              <button
                                onClick={() => console.log("Logout clicked")}
                                className={cn(
                                  "flex h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[#6B4CE0]/80",
                                  isCollapsed,
                                  isCollapsed && "justify-center px-3",
                                )}
                              >
                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M9 21H5C4.47 21 3.96 20.79 3.59 20.41C3.21 20.04 3 19.53 3 19V5C3 4.47 3.21 3.96 3.59 3.59C3.96 3.21 4.47 3 5 3H9"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M16 17L21 12L16 7"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M21 12H9"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                {!isCollapsed && <span>{item.label}</span>}
                                {isCollapsed && <VisuallyHidden>{item.label}</VisuallyHidden>}
                              </button>
                            ) : (
                              <Link
                                href={item.href}
                                className={cn(
                                  "flex h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[#6B4CE0]/80",
                                  item.active ? "bg-[#6B4CE0]" : "hover:bg-[#6B4CE0]/80",
                                  isCollapsed && "justify-center px-3",
                                )}
                                aria-current={item.active ? "page" : undefined}
                              >
                                {item.label === "Profile" ? (
                                  <div className="relative h-4 w-4 shrink-0 rounded-full overflow-hidden">
                                    <Image
                                      src="/vibrant-street-market.png"
                                      alt="Profile"
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ) : (
                                  item.icon && <item.icon size={18} />
                                )}
                                {!isCollapsed && <span>{item.label}</span>}
                                {isCollapsed && <VisuallyHidden>{item.label}</VisuallyHidden>}
                              </Link>
                            )}
                          </TooltipTrigger>
                          {isCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
                        </Tooltip>
                      </TooltipProvider>
                      {/* Add divider below Security */}
                      {item.label === "Security" && !isCollapsed && (
                        <hr className="my-2 border-[#6B4CE0]" />
                      )}
                    </div>
                  )
                })}
              </nav>
            </div>
          </motion.nav>
        </AnimatePresence>
      </ScrollArea>
    </div>
  )
}