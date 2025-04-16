import { cn } from "@/lib/utils"
import type React from "react"

interface VisuallyHiddenProps {
  children: React.ReactNode
  className?: string
}

export function VisuallyHidden({ children, className, ...props }: VisuallyHiddenProps) {
  return (
    <span
      className={cn(
        "absolute h-px w-px p-0 overflow-hidden whitespace-nowrap border-0",
        "clip-[rect(0px,0px,0px,0px)]",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
