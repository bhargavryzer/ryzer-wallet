"use client"

import type React from "react"

import NextImage, { type ImageProps as NextImageProps } from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface ImageProps extends NextImageProps {
  fallbackSrc?: string
}

export function Image({ alt, src, fallbackSrc = "/placeholder.svg", className, onError, ...props }: ImageProps) {
  const [error, setError] = useState(false)

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setError(true)
    if (onError) {
      onError(e)
    }
  }

  return (
    <NextImage
      src={error ? fallbackSrc : src}
      alt={alt}
      className={cn("transition-opacity", className)}
      onError={handleError}
      {...props}
    />
  )
}
