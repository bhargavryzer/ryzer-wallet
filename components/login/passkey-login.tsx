"use client"

import { Loader2 } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

// Passkey Login Component
export interface PasskeyLoginProps {
  isLoading: boolean
  onSubmit: () => Promise<void>
}

export function PasskeyLogin({ isLoading, onSubmit }: PasskeyLoginProps) {
  return (
    <div className="space-y-6 text-center">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="#7C3AED"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 9H9V15H15V9Z"
            stroke="#7C3AED"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900">Passkey Login</h3>
      <p className="text-sm text-gray-500">
        Use your device's biometric authentication or security key.
      </p>
      <Button
        onClick={onSubmit}
        disabled={isLoading}
        variant="default"
        size="lg"
        className="w-full bg-purple-600 hover:bg-purple-700 focus-visible:ring-purple-500 disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          "Continue with Passkey"
        )}
      </Button>
      <p className="text-xs text-gray-500">
        No passkey?{" "}
        <Link
          href="/learn-passkey"
          className="text-purple-600 hover:underline focus-visible:ring-2 focus-visible:ring-purple-500"
        >
          Learn more
        </Link>
      </p>
    </div>
  )
}