import { Link } from "react-router-dom"
import { FileQuestion, Home } from "lucide-react"
import { Button } from "@/shared/components/ui/Button"
import { BrandLogo } from "@/shared/components/ui/Logo"
import { PageTransition } from "@/shared/components/motion/PageTransition"
import { ROUTES } from "@/shared/config/routes"

export default function NotFoundPage() {
  return (
    <PageTransition>
      <div className="min-h-screen-dvh w-full max-w-full flex flex-col items-center justify-center px-page-x py-fluid-5 bg-bg-primary text-text-primary text-center select-none">
        <Link to={ROUTES.HOME} className="mb-6 hover:opacity-90 transition-opacity">
          <BrandLogo size="md" subtitle="Campus Knowledge Assistant" />
        </Link>
        <div className="w-14 h-14 rounded-2xl bg-bg-secondary border border-border-default flex items-center justify-center text-text-muted mb-4 shadow-xs">
          <FileQuestion className="w-7 h-7" />
        </div>

        <h1 className="text-2xl font-semibold text-text-primary mb-2 text-balance">404 — Page Not Found</h1>

        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-sm mb-6 text-pretty">
          The requested page or resource could not be found. Check the URL or return to the main application.
        </p>

        <Link to={ROUTES.HOME} className="w-full xs:w-auto">
          <Button variant="primary" size="md" className="gap-2 shadow-xs w-full justify-center">
            <Home className="w-4 h-4 shrink-0" />
            <span>Return to College AI</span>
          </Button>
        </Link>
      </div>
    </PageTransition>
  )
}
