"use client"

import type React from "react"

import Link from "next/link"
import { ArrowRight, Coins, Download, QrCode, Send } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface QuickActionProps {
  href: string
  icon: React.ReactNode
  title: string
  description: string
  actionText: string
}

function QuickActionCard({ href, icon, title, description, actionText }: QuickActionProps) {
  return (
    <Link href={href} className="block h-full">
      <div
        className={cn(
          "flex flex-col h-full p-4 rounded-lg border border-gray-200 dark:border-gray-800",
          "bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800",
          "hover:shadow-md transition-all duration-200 hover:border-primary/50 hover:translate-y-[-2px]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        )}
      >
        <div className="rounded-full bg-primary/10 p-2 w-10 h-10 flex items-center justify-center mb-3">{icon}</div>
        <h3 className="font-medium mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground mb-3">{description}</p>
        <div className="mt-auto flex items-center text-xs text-primary font-medium">
          <span>{actionText}</span>
          <ArrowRight className="ml-1 h-3 w-3" aria-hidden="true" />
        </div>
      </div>
    </Link>
  )
}

export function QuickActions() {
  const actions = [
    {
      href: "/wallets?action=send",
      icon: <Send className="h-5 w-5 text-primary" />,
      title: "Send Assets",
      description: "Transfer funds to another wallet",
      actionText: "Send now",
    },
    {
      href: "/wallets?action=receive",
      icon: <Download className="h-5 w-5 text-primary" />,
      title: "Receive Assets",
      description: "Get your deposit address",
      actionText: "Show QR code",
    },
    {
      href: "/wallets?action=buy",
      icon: <Coins className="h-5 w-5 text-primary" />,
      title: "Buy Crypto",
      description: "Purchase crypto with fiat",
      actionText: "Buy now",
    },
    {
      href: "/wallets?action=scan",
      icon: <QrCode className="h-5 w-5 text-primary" />,
      title: "Scan QR Code",
      description: "Scan to pay or connect",
      actionText: "Open scanner",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Manage your wallet operations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => (
            <QuickActionCard
              key={action.title}
              href={action.href}
              icon={action.icon}
              title={action.title}
              description={action.description}
              actionText={action.actionText}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
