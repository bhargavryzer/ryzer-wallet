"use client"

import type React from "react"

export default function Loading() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{
        background: "linear-gradient(90deg, rgba(13, 12, 12, 1) 0%, rgba(54, 54, 54, 1) 84%, rgba(48, 41, 41, 1) 92%)",
      }}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-t-purple-600 border-gray-700"></div>
        </div>
        <p className="text-sm font-medium text-white animate-pulse">
          Loading Ryzer...
        </p>
      </div>
    </div>
  )
}