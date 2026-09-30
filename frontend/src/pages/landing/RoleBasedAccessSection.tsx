import * as React from "react"
import { User, GraduationCap, ShieldAlert, Check, Minus } from "lucide-react"

const ROLES = [
  {
    name: "Student Tier",
    icon: User,
    badge: "Default Account",
    description: "Tailored for enrolled students seeking fast, verified answers to academic inquiries.",
    features: [
      { name: "Academic AI Chat & Streaming", allowed: true },
      { name: "Public Campus Document & Syllabus Search", allowed: true },
      { name: "Personal Profile & Roster Inspection", allowed: true },
      { name: "Confidential Student Record Redaction", allowed: true },
      { name: "Full Cohort Roster Inspection", allowed: false },
      { name: "Document Ingestion & System Governance", allowed: false },
    ],
  },
  {
    name: "Faculty & Advisor Tier",
    icon: GraduationCap,
    badge: "Authorized Staff",
    description: "Designed for department educators, course conveners, and designated academic mentors.",
    features: [
      { name: "Academic AI Chat & Streaming", allowed: true },
      { name: "Public Campus Document & Syllabus Search", allowed: true },
      { name: "Personal Profile & Roster Inspection", allowed: true },
      { name: "Confidential Student Record Redaction", allowed: true },
      { name: "Full Cohort Roster Inspection", allowed: true },
      { name: "Document Ingestion & System Governance", allowed: false },
    ],
  },
  {
    name: "Administrator Tier",
    icon: ShieldAlert,
    badge: "Institutional Oversight",
    description: "Full administrative controls for registrars, IT personnel, and campus department chairs.",
    features: [
      { name: "Academic AI Chat & Streaming", allowed: true },
      { name: "Public Campus Document & Syllabus Search", allowed: true },
      { name: "Personal Profile & Roster Inspection", allowed: true },
      { name: "Confidential Student Record Redaction", allowed: true },
      { name: "Full Cohort Roster Inspection", allowed: true },
      { name: "Document Ingestion & System Governance", allowed: true },
    ],
  },
]

export function RoleBasedAccessSection() {
  return (
    <section id="roles" className="py-14 sm:py-20 lg:py-24 bg-bg-secondary border-y border-border-default px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-bg-elevated border border-border-default text-xs font-mono font-medium text-text-primary">
            <span>Access Control Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-text-primary text-balance">
            Tiered permissions designed around campus responsibility.
          </h2>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            Every user interacts within a clearly demarcated security boundary enforced by server-side claims and database policies.
          </p>
        </div>

        {/* 3 Role Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {ROLES.map((role) => {
            const Icon = role.icon
            return (
              <div
                key={role.name}
                className="p-6 rounded-2xl border border-border-default bg-bg-elevated flex flex-col justify-between space-y-5 shadow-xs"
              >
                <div className="space-y-4">
                  {/* Role Header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl bg-bg-secondary border border-border-default flex items-center justify-center text-text-primary">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-bg-secondary border border-border-default text-text-muted font-medium">
                      {role.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-text-primary">
                      {role.name}
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed mt-1">
                      {role.description}
                    </p>
                  </div>

                  {/* Feature checklist */}
                  <div className="pt-3 border-t border-border-subtle space-y-2.5">
                    {role.features.map((f) => (
                      <div
                        key={f.name}
                        className="flex items-center gap-2.5 text-xs"
                      >
                        {f.allowed ? (
                          <div className="w-4 h-4 rounded-full bg-status-success-surface border border-status-success-border text-status-success-text flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-bg-secondary border border-border-default text-text-muted flex items-center justify-center shrink-0">
                            <Minus className="w-2.5 h-2.5 stroke-[2.5]" />
                          </div>
                        )}
                        <span
                          className={
                            f.allowed ? "text-text-primary font-medium" : "text-text-muted"
                          }
                        >
                          {f.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-border-subtle text-[11px] font-mono text-text-muted">
                  Enforced via PostgreSQL RLS
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
