"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EmailLoginFormData } from "@/types/auth"

// Email Login Form Component
interface EmailLoginFormProps {
  isLoading: boolean
  onSubmit: (email: string, password: string) => Promise<void>
}

export function EmailLoginForm({ isLoading, onSubmit }: EmailLoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value) ? "" : "Please enter a valid email address"
  }

  const validatePassword = (value: string) => {
    if (!value) return "Password is required"
    if (value.length < 8) return "Password must be at least 8 characters"
    return ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const emailValidation = validateEmail(email)
    const passwordValidation = validatePassword(password)

    setEmailError(emailValidation)
    setPasswordError(passwordValidation)

    if (!emailValidation && !passwordValidation) {
      await onSubmit(email, password)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.comiiii"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setEmailError(validateEmail(e.target.value))
          }}
          required
          aria-invalid={!!emailError}
          aria-describedby={emailError ? "email-error" : undefined}
          className="h-12 rounded-lg border-gray-300 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
        />
        {emailError && (
          <p id="email-error" className="text-xs text-red-600">
            {emailError}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </Label>
          <Link
            href="/forgot-password"
            className="text-xs text-purple-600 hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setPasswordError(validatePassword(e.target.value))
            }}
            required
            aria-invalid={!!passwordError}
            aria-describedby={passwordError ? "password-error" : undefined}
            className="h-12 rounded-lg border-gray-300 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {passwordError && (
          <p id="password-error" className="text-xs text-red-600">
            {passwordError}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="h-12 w-full rounded-lg bg-purple-600 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50 focus:ring-2 focus:ring-purple-500"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          "Log In"
        )}
      </Button>
    </form>
  )
}