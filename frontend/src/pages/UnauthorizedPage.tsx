import { Link } from "react-router-dom"
import { ShieldAlert, ArrowLeft, Home } from "lucide-react"
import { Button } from "@/shared/components/ui/Button"
import { ROUTES } from "@/shared/config/routes"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-bg-primary text-text-primary text-center select-none animate-page-enter">
      <div className="w-14 h-14 rounded-2xl bg-status-warning-surface border border-status-warning-border flex items-center justify-center text-status-warning-text mb-4 shadow-xs">
        <ShieldAlert className="w-7 h-7" />
      </div>

      <h1 className="text-2xl font-semibold text-text-primary mb-2">403 — Restricted Campus Access</h1>

      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-md mb-6">
        You do not have the required institutional credentials or clearance to access this console. Please sign in with an administrator account.
      </p>

      <div className="flex items-center gap-3">
        <Link to={ROUTES.LOGIN}>
          <Button variant="secondary" size="md" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Sign In As Admin</span>
          </Button>
        </Link>
        <Link to={ROUTES.HOME}>
          <Button variant="primary" size="md" className="gap-2">
            <Home className="w-4 h-4" />
            <span>Back to Safety</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
