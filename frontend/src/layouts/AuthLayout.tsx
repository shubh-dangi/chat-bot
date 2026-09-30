import { Link } from "react-router-dom"
import { ArrowLeft, Sun, Moon, Laptop } from "lucide-react"
import { useTheme } from "@/shared/hooks/useTheme"
import { FadeIn } from "@/shared/components/motion/FadeIn"
import { BrandLogo } from "@/shared/components/ui/Logo"
import { ROUTES } from "@/shared/config/routes"

export function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode
  title: string
  subtitle?: string
}) {
  const { theme, setTheme } = useTheme()

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  return (
    <div className="min-h-screen-dvh w-full max-w-full overflow-x-hidden bg-bg-secondary text-text-primary px-page-x py-4 sm:py-6 flex flex-col justify-between select-none animate-page-enter">
      {/* Top Header */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between gap-3 shrink-0">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors min-h-[44px] px-1 -ml-1 rounded-md"
        >
          <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Back to College AI</span>
        </Link>
        <button
          type="button"
          onClick={cycleTheme}
          className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-interactive-hover transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0"
          aria-label="Toggle visual theme"
        >
          {theme === "dark" ? (
            <Moon className="w-4 h-4" />
          ) : theme === "light" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Laptop className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Centered Auth Card */}
      <div className="w-full max-w-[min(100%,420px)] mx-auto my-auto py-6 sm:py-8">
        <FadeIn delay={40} className="flex flex-col items-center mb-5 sm:mb-6 text-center">
          <Link to={ROUTES.HOME} className="mb-3 hover:opacity-95 transition-opacity">
            <BrandLogo size="md" subtitle="Institutional Access" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tight text-balance break-words">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-xs text-text-secondary max-w-xs mx-auto leading-relaxed text-pretty break-words">
              {subtitle}
            </p>
          )}
        </FadeIn>

        <FadeIn delay={100} className="bg-bg-elevated border border-border-default rounded-2xl shadow-md p-4 sm:p-6 lg:p-8">
          {children}
        </FadeIn>
      </div>

      {/* Footer copyright */}
      <div className="text-center text-[11px] sm:text-xs text-text-muted shrink-0 pb-[env(safe-area-inset-bottom)]">
        © 2026 College AI. Institutional Access System.
      </div>
    </div>
  )
}
