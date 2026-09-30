import { Link } from "react-router-dom"
import { ArrowLeft, Sun, Moon, Laptop } from "lucide-react"
import { useTheme } from "@/shared/hooks/useTheme"
import { FadeIn } from "@/shared/components/motion/FadeIn"
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
    <div className="min-h-screen w-screen flex flex-col justify-between bg-bg-secondary text-text-primary px-4 py-6 select-none animate-page-enter">
      {/* Top Header */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to College AI</span>
        </Link>
        <button
          type="button"
          onClick={cycleTheme}
          className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-interactive-hover transition-colors"
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
      <div className="w-full max-w-[420px] mx-auto my-auto py-8">
        <FadeIn delay={40} className="flex flex-col items-center mb-6 text-center">
          <Link to={ROUTES.HOME} className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-text-primary text-bg-primary flex items-center justify-center font-bold text-sm shadow-xs">
              CA
            </div>
            <span className="font-semibold text-lg text-text-primary tracking-tight">
              College AI
            </span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tight">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-xs text-text-secondary max-w-xs leading-relaxed">{subtitle}</p>
          )}
        </FadeIn>

        <FadeIn delay={100} className="bg-bg-elevated border border-border-default rounded-2xl shadow-md p-6 sm:p-8">
          {children}
        </FadeIn>
      </div>

      {/* Footer copyright */}
      <div className="text-center text-xs text-text-muted">
        © 2026 College AI. Institutional Access System.
      </div>
    </div>
  )
}
