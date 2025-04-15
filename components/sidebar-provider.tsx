"use client"

import type * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"

type SidebarState = "expanded" | "collapsed"

interface SidebarContextType {
  state: SidebarState
  toggle: () => void
  isCollapsed: boolean
  isExpanded: boolean
  isMobile: boolean
  setCollapsed: (collapsed: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [state, setState] = useState<SidebarState>("expanded")

  // Load sidebar state from cookie on mount
  useEffect(() => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`))
      ?.split("=")[1]

    if (cookieValue === "collapsed") {
      setState("collapsed")
    }
  }, [])

  // Save sidebar state to cookie when it changes
  useEffect(() => {
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${state}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
  }, [state])

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setState("collapsed")
    }
  }, [isMobile])

  // Add keyboard shortcut to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "b" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggle()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const toggle = () => {
    setState((prev) => {
      const newState = prev === "expanded" ? "collapsed" : "expanded"
      // Announce state change for screen readers
      if (typeof window !== "undefined" && document.getElementById("sidebar-status")) {
        document.getElementById("sidebar-status")!.textContent = `Sidebar ${newState}`
      }
      return newState
    })
  }

  const setCollapsed = (collapsed: boolean) => {
    setState(collapsed ? "collapsed" : "expanded")
  }

  const value = {
    state,
    toggle,
    isCollapsed: state === "collapsed",
    isExpanded: state === "expanded",
    isMobile,
    setCollapsed,
  }

  return (
    <SidebarContext.Provider value={value}>
      <div id="sidebar-status" className="sr-only" aria-live="polite"></div>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
