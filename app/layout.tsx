import type React from "react"
import { Inter } from "next/font/google"
import { Providers } from "./providers"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Ryzer Wallet",
  description: "Secure, scalable, and compliant Wallet-as-a-Service platform for real estate tokenization",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Ryzer Wallet</title>
        <meta
          name="description"
          content="Secure, scalable, and compliant Wallet-as-a-Service platform for real estate tokenization"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
