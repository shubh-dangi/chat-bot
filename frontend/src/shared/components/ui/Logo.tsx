import React from "react"
import { GraduationCap } from "lucide-react"
import { cn } from "@/shared/utils/cn"

export type LogoSize = "xs" | "sm" | "md" | "lg" | "xl"

export interface LogoProps {
  size?: LogoSize
  className?: string
  iconClassName?: string
}

const SIZE_MAP: Record<LogoSize, { box: string; icon: string }> = {
  xs: { box: "w-6 h-6 rounded-md", icon: "w-3.5 h-3.5" },
  sm: { box: "w-7 h-7 rounded-lg", icon: "w-4 h-4" },
  md: { box: "w-8 h-8 rounded-lg", icon: "w-4.5 h-4.5" },
  lg: { box: "w-10 h-10 rounded-xl", icon: "w-5 h-5" },
  xl: { box: "w-12 h-12 rounded-2xl", icon: "w-6 h-6" },
}

/**
 * Standardized institutional Logo emblem for College AI.
 * Renders identically across all headers, navigation sidebars, landing pages, and auth layouts.
 */
export function Logo({ size = "md", className, iconClassName }: LogoProps) {
  const { box, icon } = SIZE_MAP[size]

  return (
    <div
      className={cn(
        "bg-brand text-brand-contrast flex items-center justify-center shadow-sm select-none shrink-0 transition-transform",
        box,
        className
      )}
      aria-hidden="true"
    >
      <GraduationCap className={cn(icon, "stroke-[2.2]", iconClassName)} />
    </div>
  )
}

export interface BrandLogoProps {
  size?: LogoSize
  subtitle?: string
  className?: string
  compact?: boolean
  onClick?: () => void
}

/**
 * Full Brand lockup with Logo emblem, title, and optional institutional subtitle.
 */
export function BrandLogo({
  size = "md",
  subtitle = "Campus Assistant",
  className,
  compact = false,
  onClick,
}: BrandLogoProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 min-w-0 select-none",
        onClick && "cursor-pointer group",
        className
      )}
      onClick={onClick}
    >
      <Logo size={size} className={onClick ? "group-hover:scale-105 transition-transform" : undefined} />
      {!compact && (
        <div className="flex flex-col min-w-0 leading-tight">
          <span className="font-semibold text-sm sm:text-base tracking-tight text-text-primary truncate">
            College AI
          </span>
          {subtitle && (
            <span className="text-[10px] text-text-muted truncate -mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
