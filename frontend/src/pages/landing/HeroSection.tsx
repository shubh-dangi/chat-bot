import * as React from "react"
import { Link } from "react-router-dom"
import { ArrowRight, ShieldCheck, Database, Lock, Zap } from "lucide-react"
import { Button } from "@/shared/components/ui/Button"
import { ROUTES } from "@/shared/config/routes"

export function HeroSection() {
  const scrollToPreview = (e: React.MouseEvent) => {
    e.preventDefault()
    const element = document.getElementById("product-preview")
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
      history.pushState(null, "", "#product-preview")
    }
  }

  return (
    <section id="hero" className="relative pt-12 sm:pt-16 lg:pt-24 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto space-y-6">
      {/* 1. Eyebrow Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-border bg-brand-surface text-xs font-medium text-brand-text shadow-xs max-w-full flex-wrap justify-center animate-page-enter">
        <span className="w-2 h-2 rounded-full bg-brand shrink-0" aria-hidden="true" />
        <span className="font-semibold">Institutional Intelligence Platform</span>
        <span className="text-brand-border hidden xs:inline" aria-hidden="true">•</span>
        <span className="font-mono text-[11px] text-brand-text font-normal">v2.4 Grounded Release</span>
      </div>

      {/* 2. Main Headline (Single H1) */}
      <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-[1.12] text-balance max-w-4xl mx-auto">
        College intelligence,{" "}
        <span className="text-brand inline-block">
          reimagined for modern campuses.
        </span>
      </h1>

      {/* 3. Supporting Description */}
      <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto text-pretty">
        One unified, privacy-governed platform for institutional regulations, academic syllabi, verified student records, and conversational guidance.
      </p>

      {/* 4. Action CTAs */}
      <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-center gap-3 pt-3 max-w-md mx-auto xs:max-w-none">
        <Link to={ROUTES.REGISTER} className="w-full xs:w-auto">
          <Button
            variant="primary"
            size="lg"
            className="w-full xs:w-auto gap-2 text-sm sm:text-base font-semibold shadow-sm min-h-[50px] px-6"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Button>
        </Link>
        <a href="#product-preview" onClick={scrollToPreview} className="w-full xs:w-auto">
          <Button
            variant="secondary"
            size="lg"
            className="w-full xs:w-auto text-sm sm:text-base font-medium min-h-[50px] px-6"
          >
            Explore Live Preview
          </Button>
        </a>
      </div>

      {/* 5. Trust / Capability Indicators */}
      <div className="pt-6 sm:pt-8 border-t border-border-subtle max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-left">
        <div className="p-3 rounded-lg bg-bg-secondary/60 border border-border-default flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-brand-text shrink-0 mt-0.5" />
          <div className="min-w-0">
            <div className="text-xs font-semibold text-text-primary">Role-Based Access</div>
            <div className="text-[11px] text-text-muted leading-tight">Student, Advisor &amp; Admin tiers</div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-bg-secondary/60 border border-border-default flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-brand-text shrink-0 mt-0.5" />
          <div className="min-w-0">
            <div className="text-xs font-semibold text-text-primary">FERPA Privacy Masking</div>
            <div className="text-[11px] text-text-muted leading-tight">Automated PII redaction</div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-bg-secondary/60 border border-border-default flex items-start gap-2.5">
          <Database className="w-4 h-4 text-brand-text shrink-0 mt-0.5" />
          <div className="min-w-0">
            <div className="text-xs font-semibold text-text-primary">Verified Grounding</div>
            <div className="text-[11px] text-text-muted leading-tight">Official handbook citations</div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-bg-secondary/60 border border-border-default flex items-start gap-2.5">
          <Zap className="w-4 h-4 text-brand-text shrink-0 mt-0.5" />
          <div className="min-w-0">
            <div className="text-xs font-semibold text-text-primary">Streaming Token Engine</div>
            <div className="text-[11px] text-text-muted leading-tight">Sub-100ms first token latency</div>
          </div>
        </div>
      </div>
    </section>
  )
}
