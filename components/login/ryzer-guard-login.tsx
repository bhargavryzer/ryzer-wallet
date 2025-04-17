"use client"

import { useState } from "react"
import Image from "next/image"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Constants
const RYZER_GUARD_CODE_LENGTH = 6

// Ryzer Guard Login Component
interface RyzerGuardLoginProps {
  isLoading: boolean
  onSubmit: (code: string) => Promise<void>
}

export function RyzerGuardLogin({ isLoading, onSubmit }: RyzerGuardLoginProps) {
  const [code, setCode] = useState("")
  const [codeError, setCodeError] = useState("")

  const validateCode = (value: string) => {
    const codeRegex = /^\d{6}$/
    return codeRegex.test(value) ? "" : "Please enter a valid 6-digit code"
  }

  const handleSubmit = async () => {
    const codeValidation = validateCode(code)
    setCodeError(codeValidation)
    if (!codeValidation) {
      await onSubmit(code)
    }
  }

  return (
    <div className="space-y-6 text-center">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Ryzer Guard</h3>
        <p className="mt-1 text-sm text-gray-500">
          Scan the QR code or enter the code from the Ryzer Guard app.
        </p>
      </div>
      <div className="flex justify-center rounded-lg bg-gray-100 p-4">
        <Image
          src="/qr-code-placeholder.png"
          alt="Ryzer Guard QR Code"
          width={140}
          height={140}
          loading="lazy"
          className="rounded-md"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="guard-code" className="text-sm font-medium text-gray-700">
          Guard Code
        </Label>
        <Input
          id="guard-code"
          placeholder="Enter 6-digit code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value)
            setCodeError(validateCode(e.target.value))
          }}
          maxLength={RYZER_GUARD_CODE_LENGTH}
          inputMode="numeric"
          aria-invalid={!!codeError}
          aria-describedby={codeError ? "guard-error" : undefined}
          className="h-12 rounded-lg border-gray-300 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
        />
        {codeError && (
          <p id="guard-error" className="text-xs text-red-600">
            {codeError}
          </p>
        )}
      </div>
      <Button
        onClick={handleSubmit}
        disabled={isLoading}
        className="h-12 w-full rounded-lg bg-purple-600 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50 focus:ring-2 focus:ring-purple-500"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          "Log In"
        )}
      </Button>
      <p className="text-xs text-gray-500">
        Need the app?{" "}
        <a
          href="/download-ryzer-guard"
          className="text-purple-600 hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Download Ryzer Guard
        </a>
      </p>
    </div>
  )
}