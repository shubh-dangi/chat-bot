import { Link } from "react-router-dom"
import { FileQuestion, Home } from "lucide-react"
import { Button } from "@/shared/components/ui/Button"
import { PageTransition } from "@/shared/components/motion/PageTransition"
import { ROUTES } from "@/shared/config/routes"

export default function NotFoundPage() {
  return (
    <PageTransition>
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-bg-primary text-text-primary text-center select-none">
        <div className="w-14 h-14 rounded-2xl bg-bg-secondary border border-border-default flex items-center justify-center text-text-muted mb-4 shadow-xs">
          <FileQuestion className="w-7 h-7" />
        </div>

        <h1 className="text-2xl font-semibold text-text-primary mb-2">404 — Page Not Found</h1>

        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-sm mb-6">
          The requested page or resource could not be found. Check the URL or return to the main application.
        </p>

        <Link to={ROUTES.HOME}>
          <Button variant="primary" size="md" className="gap-2 shadow-xs">
            <Home className="w-4 h-4" />
            <span>Return to College AI</span>
          </Button>
        </Link>
      </div>
    </PageTransition>
  )
}
