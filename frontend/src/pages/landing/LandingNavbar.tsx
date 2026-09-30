import * as React from "react"
import { Link } from "react-router-dom"
import {
  Menu,
  X,
  Sun,
  Moon,
  Laptop,
  ArrowRight,
  Shield,
  HelpCircle,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react"
import { BrandLogo } from "@/shared/components/ui/Logo"
import { Button } from "@/shared/components/ui/Button"
import { useTheme } from "@/shared/hooks/useTheme"
import { ROUTES } from "@/shared/config/routes"
import { cn } from "@/shared/utils/cn"

interface LandingNavbarProps {
  onOpenLegal?: (docId: string) => void
}

export function LandingNavbar({ onOpenLegal }: LandingNavbarProps) {
  const { theme, setTheme } = useTheme()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const menuButtonRef = React.useRef<HTMLButtonElement>(null)
  const drawerRef = React.useRef<HTMLDivElement>(null)

  // Track scroll position to transition navbar surface
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Lock background scroll when mobile drawer is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"

      // Focus first focusable item in drawer
      requestAnimationFrame(() => {
        const closeBtn = drawerRef.current?.querySelector<HTMLElement>('button[aria-label="Close menu"]')
        closeBtn?.focus()
      })

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsMobileMenuOpen(false)
          menuButtonRef.current?.focus()
        }

        // Focus trap
        if (e.key === "Tab" && drawerRef.current) {
          const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
          if (focusables.length === 0) return

          const first = focusables[0]
          const last = focusables[focusables.length - 1]

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault()
            last.focus()
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => {
        document.body.style.overflow = prevOverflow
        window.removeEventListener("keydown", handleKeyDown)
      }
    }
  }, [isMobileMenuOpen])

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    setIsMobileMenuOpen(false)
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
      // Update hash without jumping
      history.pushState(null, "", `#${targetId}`)
    }
  }

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-sticky w-full transition-all duration-normal",
          isScrolled
            ? "bg-bg-elevated/95 backdrop-blur border-b border-border-default shadow-xs"
            : "bg-bg-primary/80 backdrop-blur border-b border-border-subtle"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link
            to={ROUTES.HOME}
            className="flex items-center min-w-0 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-ring rounded-lg p-1 -ml-1"
            aria-label="College AI Home"
          >
            <BrandLogo size="md" subtitle="Institutional Intelligence" />
          </Link>

          {/* Desktop Navigation Links (>= 1024px) */}
          <nav
            className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-text-secondary"
            aria-label="Main Navigation"
          >
            <a
              href="#product-preview"
              onClick={(e) => handleNavClick(e, "product-preview")}
              className="hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-ring rounded px-1.5 py-0.5"
            >
              Product
            </a>
            <a
              href="#features"
              onClick={(e) => handleNavClick(e, "features")}
              className="hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-ring rounded px-1.5 py-0.5"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => handleNavClick(e, "how-it-works")}
              className="hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-ring rounded px-1.5 py-0.5"
            >
              How It Works
            </a>
            <a
              href="#security"
              onClick={(e) => handleNavClick(e, "security")}
              className="hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-ring rounded px-1.5 py-0.5"
            >
              Security
            </a>
            <a
              href="#faq"
              onClick={(e) => handleNavClick(e, "faq")}
              className="hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-ring rounded px-1.5 py-0.5"
            >
              FAQ
            </a>
          </nav>

          {/* Tablet Quick Nav (768px - 1023px) */}
          <nav
            className="hidden sm:flex lg:hidden items-center gap-4 text-xs font-medium text-text-secondary"
            aria-label="Tablet Navigation"
          >
            <a
              href="#product-preview"
              onClick={(e) => handleNavClick(e, "product-preview")}
              className="hover:text-text-primary transition-colors"
            >
              Product
            </a>
            <a
              href="#features"
              onClick={(e) => handleNavClick(e, "features")}
              className="hover:text-text-primary transition-colors"
            >
              Features
            </a>
            <a
              href="#security"
              onClick={(e) => handleNavClick(e, "security")}
              className="hover:text-text-primary transition-colors"
            >
              Security
            </a>
          </nav>

          {/* Desktop & Tablet Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={cycleTheme}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-interactive-hover transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center border border-border-subtle"
              aria-label={`Toggle visual theme. Current: ${theme}`}
              title={`Switch theme (currently ${theme})`}
            >
              {theme === "dark" ? (
                <Moon className="w-4 h-4" />
              ) : theme === "light" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Laptop className="w-4 h-4" />
              )}
            </button>

            {/* Sign In Link */}
            <Link to={ROUTES.LOGIN} className="hidden sm:inline-flex">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm font-medium">
                Sign In
              </Button>
            </Link>

            {/* Get Started CTA */}
            <Link to={ROUTES.REGISTER} className="hidden xs:inline-flex">
              <Button variant="primary" size="sm" className="gap-1.5 text-xs sm:text-sm font-medium shadow-xs">
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </Button>
            </Link>

            {/* Mobile / Tablet Menu Toggle Button */}
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-interactive-hover border border-border-default min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer & Backdrop */}
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="fixed inset-0 z-drawer lg:hidden flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-bg-overlay/70 backdrop-blur-xs transition-opacity duration-fast"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Surface */}
          <div
            ref={drawerRef}
            className="relative w-full max-w-sm h-full bg-bg-elevated border-l border-border-default shadow-xl flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-right"
          >
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-border-default flex items-center justify-between gap-3 shrink-0">
              <BrandLogo size="sm" subtitle="Campus Assistant" />
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-interactive-hover transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Navigation Links */}
            <div className="flex-1 py-4 px-4 space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-text-muted px-3 py-1 font-semibold">
                Navigation
              </div>

              <a
                href="#hero"
                onClick={(e) => handleNavClick(e, "hero")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-primary hover:bg-interactive-hover hover:text-brand-text transition-colors"
              >
                <Sparkles className="w-4 h-4 text-brand-text" />
                <span>Home</span>
              </a>

              <a
                href="#product-preview"
                onClick={(e) => handleNavClick(e, "product-preview")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-primary hover:bg-interactive-hover hover:text-brand-text transition-colors"
              >
                <Cpu className="w-4 h-4 text-brand-text" />
                <span>Product Preview</span>
              </a>

              <a
                href="#features"
                onClick={(e) => handleNavClick(e, "features")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-primary hover:bg-interactive-hover hover:text-brand-text transition-colors"
              >
                <Layers className="w-4 h-4 text-brand-text" />
                <span>Features</span>
              </a>

              <a
                href="#how-it-works"
                onClick={(e) => handleNavClick(e, "how-it-works")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-primary hover:bg-interactive-hover hover:text-brand-text transition-colors"
              >
                <span className="w-4 h-4 rounded-full border border-brand-border text-brand-text text-[10px] flex items-center justify-center font-bold">
                  01
                </span>
                <span>How It Works</span>
              </a>

              <a
                href="#intelligence"
                onClick={(e) => handleNavClick(e, "intelligence")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-primary hover:bg-interactive-hover hover:text-brand-text transition-colors"
              >
                <span className="w-4 h-4 text-brand-text text-xs flex items-center justify-center">🏛️</span>
                <span>College Intelligence</span>
              </a>

              <a
                href="#student-info"
                onClick={(e) => handleNavClick(e, "student-info")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-primary hover:bg-interactive-hover hover:text-brand-text transition-colors"
              >
                <span className="w-4 h-4 text-brand-text text-xs flex items-center justify-center">🎓</span>
                <span>Student Information</span>
              </a>

              <a
                href="#security"
                onClick={(e) => handleNavClick(e, "security")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-primary hover:bg-interactive-hover hover:text-brand-text transition-colors"
              >
                <Shield className="w-4 h-4 text-brand-text" />
                <span>Security &amp; Privacy</span>
              </a>

              <a
                href="#faq"
                onClick={(e) => handleNavClick(e, "faq")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-primary hover:bg-interactive-hover hover:text-brand-text transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-brand-text" />
                <span>FAQ</span>
              </a>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-border-default bg-bg-secondary/40 space-y-4 shrink-0">
              {/* Auth Buttons */}
              <div className="flex flex-col gap-2">
                <Link to={ROUTES.LOGIN} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="secondary" size="md" fullWidth className="text-sm">
                    Sign In
                  </Button>
                </Link>
                <Link to={ROUTES.REGISTER} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" fullWidth className="gap-2 text-sm shadow-xs">
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {/* Theme Selector Strip */}
              <div className="pt-2 border-t border-border-subtle">
                <div className="text-[11px] font-medium text-text-muted mb-2">Theme Preference</div>
                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-bg-primary border border-border-default">
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={cn(
                      "flex items-center justify-center gap-1.5 py-1.5 px-2 rounded text-xs font-medium transition-colors min-h-[36px]",
                      theme === "light"
                        ? "bg-bg-elevated text-text-primary shadow-xs font-semibold"
                        : "text-text-muted hover:text-text-primary"
                    )}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={cn(
                      "flex items-center justify-center gap-1.5 py-1.5 px-2 rounded text-xs font-medium transition-colors min-h-[36px]",
                      theme === "dark"
                        ? "bg-bg-elevated text-text-primary shadow-xs font-semibold"
                        : "text-text-muted hover:text-text-primary"
                    )}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Dark</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme("system")}
                    className={cn(
                      "flex items-center justify-center gap-1.5 py-1.5 px-2 rounded text-xs font-medium transition-colors min-h-[36px]",
                      theme === "system"
                        ? "bg-bg-elevated text-text-primary shadow-xs font-semibold"
                        : "text-text-muted hover:text-text-primary"
                    )}
                  >
                    <Laptop className="w-3.5 h-3.5" />
                    <span>System</span>
                  </button>
                </div>
              </div>

              {/* Legal Quick Links in Drawer */}
              {onOpenLegal && (
                <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] text-text-muted">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      onOpenLegal("privacy")
                    }}
                    className="hover:text-text-primary transition-colors py-1"
                  >
                    Privacy
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      onOpenLegal("terms")
                    }}
                    className="hover:text-text-primary transition-colors py-1"
                  >
                    Terms
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      onOpenLegal("contact")
                    }}
                    className="hover:text-text-primary transition-colors py-1"
                  >
                    Support
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

