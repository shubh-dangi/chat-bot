import * as React from "react"
import { GraduationCap, Briefcase, Building, Users } from "lucide-react"

const USE_CASES = [
  {
    role: "Enrolled Students",
    icon: GraduationCap,
    headline: "Fast answers without digging through scattered notices.",
    points: [
      "Verify course prerequisite requirements before enrolling in electives.",
      "Check mid-term exam schedules and hall ticket release windows.",
      "Query hostel curfew hours and submit digital warden gate pass requests.",
      "Share verified discussion snippets with study partners.",
    ],
  },
  {
    role: "Faculty & Professors",
    icon: Briefcase,
    headline: "Reduce repetitive office-hour inquiries by 70%.",
    points: [
      "Direct students to grounded syllabus prerequisites and lab guidelines.",
      "Verify official university examination and grade appeal dates.",
      "Access department-wide circulars and academic council policies instantly.",
      "Share standardized course requirements with incoming semester cohorts.",
    ],
  },
  {
    role: "Academic Advisors",
    icon: Users,
    headline: "Proactive guidance with verified student context.",
    points: [
      "Review student roster progression and verify course completion credits.",
      "Quickly look up institutional academic probation bylaws and cutoff marks.",
      "Maintain confidential student case notes protected by audit logging.",
      "Guide advisees through official prerequisite pathways.",
    ],
  },
  {
    role: "Campus Administrators",
    icon: Building,
    headline: "Centralized knowledge distribution & compliance.",
    points: [
      "Upload and index signed institutional circulars within minutes.",
      "Maintain unified student rosters with automated FERPA masking.",
      "Inspect audit logs for record access and security compliance.",
      "Eliminate front-desk congestion during peak examination windows.",
    ],
  },
]

export function UseCasesSection() {
  return (
    <section id="use-cases" className="py-14 sm:py-20 lg:py-24 bg-bg-secondary border-y border-border-default px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-bg-elevated border border-border-default text-xs font-mono font-medium text-text-primary">
            <span>Stakeholder Workflows</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-text-primary text-balance">
            Engineered for every campus stakeholder.
          </h2>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            From first-year students to the Office of the Registrar, College AI provides targeted workflows tailored to campus responsibilities.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {USE_CASES.map((uc) => {
            const Icon = uc.icon
            return (
              <div
                key={uc.role}
                className="p-6 rounded-2xl border border-border-default bg-bg-elevated space-y-4 shadow-xs hover:border-border-strong transition-all duration-fast"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-bg-secondary border border-border-default flex items-center justify-center text-text-primary">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-text-primary">
                      {uc.role}
                    </h3>
                    <p className="text-xs text-text-muted mt-0.5 font-medium">
                      {uc.headline}
                    </p>
                  </div>
                </div>

                <ul className="space-y-2 pt-2 border-t border-border-subtle text-xs text-text-secondary">
                  {uc.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-brand-text font-bold mt-0.5">•</span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
