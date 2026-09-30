import { Link } from "react-router-dom"
import { Link2Off } from "lucide-react"
import { Button } from "@/shared/components/ui/Button"
import { ROUTES } from "@/shared/config/routes"

export function InvalidShareState() {
  return (
    <div className="min-h-screen-dvh w-full max-w-full flex flex-col items-center justify-center px-page-x py-fluid-6 bg-bg-primary text-text-primary text-center select-none">
      <div className="w-12 h-12 rounded-full bg-bg-secondary border border-border-default flex items-center justify-center text-text-muted mb-4 shadow-xs">
        <Link2Off className="w-6 h-6" />
      </div>

      <h1 className="text-xl font-semibold text-text-primary mb-2 text-balance break-words">
        Link not available
      </h1>

      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-sm mb-6">
        This conversation share link is invalid, has expired, or was revoked by the original author.
      </p>

      <Link to={ROUTES.HOME}>
        <Button variant="primary" size="md">
          Go to College AI
        </Button>
      </Link>
    </div>
  )
}
