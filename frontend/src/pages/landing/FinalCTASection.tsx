import * as React from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react"
import { Button } from "@/shared/components/ui/Button"
import { ROUTES } from "@/shared/config/routes"

export function FinalCTASection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="rounded-2xl border border-brand-border bg-bg-elevated p-8 sm:p-12 lg:p-16 text-center space-y-6 shadow-sm relative overflow-hidden">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-border bg-brand-surface text-xs font-semibold text-brand-text">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Instant Institutional Onboarding</span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary text-balance max-w-2xl mx-auto">
          Your college information, one intelligent workspace.
        </h2>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-xl mx-auto text-pretty">
          Start exploring verified campus regulations, syllabus prerequisites, and student records with zero hallucinations.
        </p>

        {/* Buttons */}
        <div className="pt-2 flex flex-col xs:flex-row items-stretch xs:items-center justify-center gap-3 max-w-md mx-auto xs:max-w-none">
          <Link to={ROUTES.REGISTER} className="w-full xs:w-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full xs:w-auto gap-2 text-sm sm:text-base font-semibold shadow-xs min-h-[50px] px-7"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Button>
          </Link>

          <Link to={ROUTES.CHAT} className="w-full xs:w-auto">
            <Button
              variant="secondary"
              size="lg"
              className="w-full xs:w-auto text-sm sm:text-base font-medium min-h-[50px] px-7"
            >
              Launch Assistant
            </Button>
          </Link>
        </div>

        {/* Trust micro-text */}
        <div className="pt-4 flex items-center justify-center gap-4 text-xs text-text-muted flex-wrap">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-status-success-text" />
            <span>FERPA Privacy Masking</span>
          </div>
          <span>•</span>
          <span>No Credit Card Required</span>
          <span>•</span>
          <span>Institutional SSO Ready</span>
        </div>
      </div>
    </section>
  )
}
