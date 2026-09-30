import * as React from "react"
import {
  ShieldCheck,
  KeyRound,
  Server,
  Share2,
  EyeOff,
} from "lucide-react"

export function SecurityPrivacySection() {
  return (
    <section id="security" className="py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12 sm:space-y-16">
      {/* 1. Security Architecture Principles */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-bg-secondary border border-border-default text-xs font-mono font-medium text-text-primary">
            <span>Security Engineering</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-text-primary text-balance">
            Architecture-level defensive engineering.
          </h2>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            Security built into every layer—from database Row-Level Security to input sanitization and token-verified sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="p-5 rounded-xl border border-border-default bg-bg-elevated space-y-2.5 shadow-xs">
            <KeyRound className="w-5 h-5 text-brand-text mb-1" />
            <h3 className="text-sm font-semibold text-text-primary">Session Authentication</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Cryptographically signed JWT bearer tokens validated server-side on every API request.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border-default bg-bg-elevated space-y-2.5 shadow-xs">
            <Server className="w-5 h-5 text-brand-text mb-1" />
            <h3 className="text-sm font-semibold text-text-primary">Database Row-Level Security</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              PostgreSQL RLS isolates tenant data so users can only access rows matching their verified identity.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border-default bg-bg-elevated space-y-2.5 shadow-xs">
            <EyeOff className="w-5 h-5 text-brand-text mb-1" />
            <h3 className="text-sm font-semibold text-text-primary">Automated Data Masking</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Personal contact details and restricted GPAs are redacted prior to client rendering.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border-default bg-bg-elevated space-y-2.5 shadow-xs">
            <Share2 className="w-5 h-5 text-brand-text mb-1" />
            <h3 className="text-sm font-semibold text-text-primary">Controlled Snapshot Sharing</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Read-only immutable tokens strip author tokens, ensuring discussions can be shared safely.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Privacy Policy & Data Governance Principles */}
      <div className="p-6 sm:p-8 rounded-2xl border border-border-default bg-bg-secondary space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-default">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-brand-text font-semibold uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>Transparent Campus Privacy</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight mt-1">
              How institutional data is processed and protected
            </h3>
          </div>
          <span className="text-xs font-mono text-text-muted">
            FERPA Aligned Governance
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-text-secondary">
          <div className="space-y-2">
            <h4 className="font-semibold text-text-primary text-sm">What We Collect &amp; Why</h4>
            <p className="leading-relaxed text-xs">
              We process institutional directory identifiers (name, student roll number, enrolled cohort) exclusively to provide authenticated campus answers and student lookups.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-text-primary text-sm">Zero Public Model Training</h4>
            <p className="leading-relaxed text-xs">
              User conversations and uploaded university circulars are never sold, rented, or used to train public commercial AI models. Your campus data remains isolated.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-text-primary text-sm">Data Retention &amp; User Control</h4>
            <p className="leading-relaxed text-xs">
              Students and staff can delete individual chat conversations or purge their complete history at any time. Audit trails are retained for institutional compliance.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-text-muted">
          <span>Responsible Disclosure: security@collegeai.internal</span>
          <span>Official Institutional Compliance Standard</span>
        </div>
      </div>
    </section>
  )
}
