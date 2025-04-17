"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminTransactionsRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the transaction history page
    router.push("/admin/transaction-history")
  }, [])

  return null
}