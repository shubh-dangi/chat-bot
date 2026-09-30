import { Link } from "react-router-dom"
import { ShieldAlert, ArrowLeft, Home } from "lucide-react"
import { Button } from "@/shared/components/ui/Button"
import { BrandLogo } from "@/shared/components/ui/Logo"
import { ROUTES } from "@/shared/config/routes"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen-dvh w-full max-w-full flex flex-col items-center justify-center px-page-x py-fluid-5 bg-bg-primary text-text-primary text-center select-none animate-page-enter">
      <Link to={ROUTES.HOME} className="mb-6 hover:opacity-90 transition-opacity">
        <BrandLogo size="md" subtitle="Campus Access Control" />
      </Link>
      <div className="w-14 h-14 rounded-2xl bg-status-warning-surface border border-status-warning-border flex items-center justify-center text-status-warning-text mb-4 shadow-xs">
        <ShieldAlert className="w-7 h-7" />
      </div>

      <h1 className="text-2xl font-semibold text-text-primary mb-2 text-balance">403 — Restricted Campus Access</h1>

      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-md mb-6 text-pretty">
        You do not have the required institutional credentials or clearance to access this console. Please sign in with an administrator account.
      </p>

      <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-center gap-3 w-full sm:w-auto">
        <Link to={ROUTES.LOGIN} className="w-full xs:w-auto">
          <Button variant="secondary" size="md" className="gap-2 w-full justify-center">
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>Sign In As Admin</span>
          </Button>
        </Link>
        <Link to={ROUTES.HOME} className="w-full xs:w-auto">
          <Button variant="primary" size="md" className="gap-2 w-full justify-center">
            <Home className="w-4 h-4 shrink-0" />
            <span>Back to Safety</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
