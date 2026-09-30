import { AlertTriangle, Home, RotateCcw } from "lucide-react"
import { Button } from "@/shared/components/ui/Button"
import { BrandLogo } from "@/shared/components/ui/Logo"
import { PageTransition } from "@/shared/components/motion/PageTransition"
import { ROUTES } from "@/shared/config/routes"

export default function ErrorPage() {
  return (
    <PageTransition>
      <div className="min-h-screen-dvh w-full max-w-full flex flex-col items-center justify-center px-page-x py-fluid-5 bg-bg-primary text-text-primary text-center select-none">
        <div className="mb-6">
          <BrandLogo size="md" subtitle="Institutional System Error" />
        </div>
        <div className="w-14 h-14 rounded-2xl bg-status-error-surface border border-status-error-border flex items-center justify-center text-status-error-text mb-4 shadow-xs">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h1 className="text-2xl font-semibold text-text-primary mb-2 text-balance">Unexpected Application Error</h1>

        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-sm mb-6 text-pretty">
          An unhandled issue occurred while rendering this view. You can reload the application or return to safety.
        </p>

        <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-center gap-3 w-full sm:w-auto">
          <Button variant="secondary" size="md" onClick={() => window.location.reload()} className="gap-2 w-full justify-center">
            <RotateCcw className="w-4 h-4 shrink-0" />
            <span>Reload Application</span>
          </Button>
          <Button variant="primary" size="md" onClick={() => (window.location.href = ROUTES.HOME)} className="gap-2 shadow-xs w-full justify-center">
            <Home className="w-4 h-4 shrink-0" />
            <span>Go Home</span>
          </Button>
        </div>
      </div>
    </PageTransition>
  )
}
