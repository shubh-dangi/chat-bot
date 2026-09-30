import * as React from "react"
import { Link } from "react-router-dom"
import { Sun, Moon, Laptop, ArrowRight, ChevronDown } from "lucide-react"
import { BrandLogo } from "@/shared/components/ui/Logo"
import { Button } from "@/shared/components/ui/Button"
import { useTheme } from "@/shared/hooks/useTheme"
import { ROUTES } from "@/shared/config/routes"
import { cn } from "@/shared/utils/cn"

interface LandingFooterProps {
  onOpenLegal: (docId: string) => void
}

export function LandingFooter({ onOpenLegal }: LandingFooterProps) {
  const { theme, setTheme } = useTheme()
  // Mobile accordion state for footer columns
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    product: true,
    resources: false,
    company: false,
    legal: false,
    support: false,
  })

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
      history.pushState(null, "", `#${id}`)
    }
  }

  return (
    <footer className="border-t border-border-default bg-bg-secondary/70 text-text-secondary text-xs select-none pb-[max(2rem,env(safe-area-inset-bottom))]">
      {/* 1. Top Brand & Launch Banner */}
      <div className="border-b border-border-default">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-md">
            <BrandLogo size="md" subtitle="Institutional Intelligence" />
            <p className="text-xs text-text-secondary leading-relaxed">
              Intelligent college information and conversation platform. Grounded in verified institutional documentation with strict FERPA privacy controls.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-text-muted">
              <span className="w-2 h-2 rounded-full bg-status-success-text" />
              <span>System Operational • Catalog v2.4 Grounded</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link to={ROUTES.LOGIN}>
              <Button variant="secondary" size="md" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
            <Link to={ROUTES.CHAT}>
              <Button variant="primary" size="md" className="w-full sm:w-auto gap-1.5 shadow-xs">
                <span>Launch Assistant</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Navigation Columns (5-column layout on Desktop, 2-3 on Tablet, Accordion on Mobile) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Column 1: Product */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-text-primary text-xs uppercase tracking-wider font-mono">
                Product
              </h4>
              <button
                type="button"
                onClick={() => toggleSection("product")}
                className="sm:hidden p-1 text-text-muted hover:text-text-primary min-h-[36px] min-w-[36px] flex items-center justify-center"
                aria-label="Toggle Product links"
              >
                <ChevronDown
                  className={cn("w-4 h-4 transition-transform", openSections.product && "rotate-180")}
                />
              </button>
            </div>

            <ul
              className={cn(
                "space-y-2 text-xs",
                !openSections.product && "hidden sm:block"
              )}
            >
              <li>
                <Link to={ROUTES.CHAT} className="hover:text-text-primary transition-colors block py-0.5">
                  AI Academic Chat
                </Link>
              </li>
              <li>
                <a
                  href="#product-preview"
                  onClick={(e) => handleSmoothScroll(e, "product-preview")}
                  className="hover:text-text-primary transition-colors block py-0.5"
                >
                  Interactive Sandbox
                </a>
              </li>
              <li>
                <Link to={ROUTES.SETTINGS} className="hover:text-text-primary transition-colors block py-0.5">
                  Workspace Settings
                </Link>
              </li>
              <li>
                <Link to={ROUTES.ADMIN} className="hover:text-text-primary transition-colors block py-0.5">
                  Administrator Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-text-primary text-xs uppercase tracking-wider font-mono">
                Resources
              </h4>
              <button
                type="button"
                onClick={() => toggleSection("resources")}
                className="sm:hidden p-1 text-text-muted hover:text-text-primary min-h-[36px] min-w-[36px] flex items-center justify-center"
                aria-label="Toggle Resources links"
              >
                <ChevronDown
                  className={cn("w-4 h-4 transition-transform", openSections.resources && "rotate-180")}
                />
              </button>
            </div>

            <ul
              className={cn(
                "space-y-2 text-xs",
                !openSections.resources && "hidden sm:block"
              )}
            >
              <li>
                <a
                  href="#features"
                  onClick={(e) => handleSmoothScroll(e, "features")}
                  className="hover:text-text-primary transition-colors block py-0.5"
                >
                  Core Capabilities
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => handleSmoothScroll(e, "how-it-works")}
                  className="hover:text-text-primary transition-colors block py-0.5"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#intelligence"
                  onClick={(e) => handleSmoothScroll(e, "intelligence")}
                  className="hover:text-text-primary transition-colors block py-0.5"
                >
                  College Intelligence
                </a>
              </li>
              <li>
                <a
                  href="#roles"
                  onClick={(e) => handleSmoothScroll(e, "roles")}
                  className="hover:text-text-primary transition-colors block py-0.5"
                >
                  Role-Based Access
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  onClick={(e) => handleSmoothScroll(e, "faq")}
                  className="hover:text-text-primary transition-colors block py-0.5"
                >
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-text-primary text-xs uppercase tracking-wider font-mono">
                Company
              </h4>
              <button
                type="button"
                onClick={() => toggleSection("company")}
                className="sm:hidden p-1 text-text-muted hover:text-text-primary min-h-[36px] min-w-[36px] flex items-center justify-center"
                aria-label="Toggle Company links"
              >
                <ChevronDown
                  className={cn("w-4 h-4 transition-transform", openSections.company && "rotate-180")}
                />
              </button>
            </div>

            <ul
              className={cn(
                "space-y-2 text-xs",
                !openSections.company && "hidden sm:block"
              )}
            >
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal("about")}
                  className="hover:text-text-primary transition-colors text-left block py-0.5 w-full min-h-[28px]"
                >
                  About Platform
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal("contact")}
                  className="hover:text-text-primary transition-colors text-left block py-0.5 w-full min-h-[28px]"
                >
                  Campus Contact &amp; Helpdesk
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal("accessibility")}
                  className="hover:text-text-primary transition-colors text-left block py-0.5 w-full min-h-[28px]"
                >
                  Accessibility Statement
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal("security")}
                  className="hover:text-text-primary transition-colors text-left block py-0.5 w-full min-h-[28px]"
                >
                  Security Architecture
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal (All opening Modal) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-text-primary text-xs uppercase tracking-wider font-mono">
                Legal &amp; Policy
              </h4>
              <button
                type="button"
                onClick={() => toggleSection("legal")}
                className="sm:hidden p-1 text-text-muted hover:text-text-primary min-h-[36px] min-w-[36px] flex items-center justify-center"
                aria-label="Toggle Legal links"
              >
                <ChevronDown
                  className={cn("w-4 h-4 transition-transform", openSections.legal && "rotate-180")}
                />
              </button>
            </div>

            <ul
              className={cn(
                "space-y-2 text-xs",
                !openSections.legal && "hidden sm:block"
              )}
            >
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal("privacy")}
                  className="hover:text-text-primary transition-colors text-left block py-0.5 w-full min-h-[28px]"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal("terms")}
                  className="hover:text-text-primary transition-colors text-left block py-0.5 w-full min-h-[28px]"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal("cookies")}
                  className="hover:text-text-primary transition-colors text-left block py-0.5 w-full min-h-[28px]"
                >
                  Cookie Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal("data-policy")}
                  className="hover:text-text-primary transition-colors text-left block py-0.5 w-full min-h-[28px]"
                >
                  Data Governance Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal("security")}
                  className="hover:text-text-primary transition-colors text-left block py-0.5 w-full min-h-[28px]"
                >
                  FERPA Compliance Overview
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Support */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-text-primary text-xs uppercase tracking-wider font-mono">
                Support
              </h4>
              <button
                type="button"
                onClick={() => toggleSection("support")}
                className="sm:hidden p-1 text-text-muted hover:text-text-primary min-h-[36px] min-w-[36px] flex items-center justify-center"
                aria-label="Toggle Support links"
              >
                <ChevronDown
                  className={cn("w-4 h-4 transition-transform", openSections.support && "rotate-180")}
                />
              </button>
            </div>

            <ul
              className={cn(
                "space-y-2 text-xs",
                !openSections.support && "hidden sm:block"
              )}
            >
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal("contact")}
                  className="hover:text-text-primary transition-colors text-left block py-0.5 w-full min-h-[28px]"
                >
                  Student Helpdesk
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal("contact")}
                  className="hover:text-text-primary transition-colors text-left block py-0.5 w-full min-h-[28px]"
                >
                  Report an Issue
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal("security")}
                  className="hover:text-text-primary transition-colors text-left block py-0.5 w-full min-h-[28px]"
                >
                  Security Vulnerability Disclosure
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal("about")}
                  className="hover:text-text-primary transition-colors text-left block py-0.5 w-full min-h-[28px]"
                >
                  Institutional SLA
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Bottom Bar: Theme Selector & Copyright */}
      <div className="border-t border-border-default bg-bg-primary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-text-muted flex-wrap justify-center sm:justify-start">
            <span>© 2026 College AI. All rights reserved.</span>
            <span>•</span>
            <span>Higher Education Intelligence Infrastructure</span>
          </div>

          {/* Theme switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-bg-secondary border border-border-default shrink-0">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors min-h-[30px]",
                theme === "light"
                  ? "bg-bg-elevated text-text-primary font-semibold shadow-xs"
                  : "text-text-muted hover:text-text-primary"
              )}
              aria-label="Set light theme"
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors min-h-[30px]",
                theme === "dark"
                  ? "bg-bg-elevated text-text-primary font-semibold shadow-xs"
                  : "text-text-muted hover:text-text-primary"
              )}
              aria-label="Set dark theme"
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme("system")}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors min-h-[30px]",
                theme === "system"
                  ? "bg-bg-elevated text-text-primary font-semibold shadow-xs"
                  : "text-text-muted hover:text-text-primary"
              )}
              aria-label="Set system theme"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>System</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
