import * as React from "react"
import { cn } from "@/shared/utils/cn"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
  size?: "sm" | "md" | "lg" | "xl"
}

export function Avatar({
  className,
  src,
  alt = "User avatar",
  fallback,
  size = "md",
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false)

  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-lg",
    xl: "w-20 h-20 text-xl",
  }

  const getInitials = (text?: string) => {
    if (!text) return "U"
    const parts = text.trim().split(" ")
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return text.slice(0, 2).toUpperCase()
  }

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden bg-bg-tertiary border border-border-default select-none font-medium text-text-primary",
        sizes[size],
        className
      )}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{getInitials(fallback || alt)}</span>
      )}
    </div>
  )
}
