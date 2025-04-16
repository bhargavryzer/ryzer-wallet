"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import dynamic from "next/dynamic"
import { Bell, Menu } from "lucide-react"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { SidebarProvider, useSidebar } from "@/components/sidebar-provider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const PageTransition = dynamic(() => import("@/components/page-transition").then(mod => mod.PageTransition), {
  ssr: false
})

const Sidebar = dynamic(() => import("@/components/sidebar").then(mod => mod.Sidebar), {
  ssr: false
})

const Breadcrumbs = dynamic(() => import("@/components/breadcrumbs").then(mod => mod.Breadcrumbs), {
  ssr: false
})

interface DashboardLayoutProps {
  children: React.ReactNode
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const pathname = usePathname()
  const { isCollapsed, setCollapsed, isMobile } = useSidebar()

  // Close mobile nav when pathname changes
  useEffect(() => {
    setIsMobileNavOpen(false)
  }, [pathname])

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Navigation */}
      <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
        <SheetContent side="left" className="p-0 w-[260px]">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className={`hidden md:block transition-all duration-300 ${isCollapsed ? "w-[70px]" : "w-[260px]"}`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileNavOpen(true)}
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <Breadcrumbs />
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" aria-label="User menu">
                  <img src="/vibrant-street-market.png" alt="User" className="rounded-full" width={32} height={32} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>User Profile</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  )
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  )
}
