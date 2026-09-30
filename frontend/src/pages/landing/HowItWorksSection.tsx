import * as React from "react"
import { LogIn, MessageSquare, Compass, CheckCircle2 } from "lucide-react"

const STEPS = [
  {
    step: "01",
    title: "Sign in with Campus ID",
    subtitle: "Authenticated Institutional Context",
    icon: LogIn,
    description:
      "Log in securely using your university credentials. The platform identifies your enrolled department, degree cohort, and role-based permissions.",
  },
  {
    step: "02",
    title: "Ask Natural Inquiries",
    subtitle: "Conversational & Semantic Queries",
    icon: MessageSquare,
    description:
      "Type any academic question about syllabi, lab deadlines, hostel curfew rules, or exam guidelines just like speaking to an academic advisor.",
  },
  {
    step: "03",
    title: "Explore Grounded Citations",
    subtitle: "Document-Backed Verification",
    icon: Compass,
    description:
      "The intelligence engine scans official circulars and handbooks, cross-verifying each response with exact page and section citations.",
  },
  {
    step: "04",
    title: "Take Immediate Action",
    subtitle: "Actionable Academic Velocity",
    icon: CheckCircle2,
    description:
      "Copy code blocks, download referenced notices, share read-only study transcripts, or navigate to administrative student records seamlessly.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10 sm:space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-bg-secondary border border-border-default text-xs font-mono font-medium text-text-primary">
          <span>Operational Workflow</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-text-primary">
          How College AI powers campus intelligence.
        </h2>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          From question to verified institutional ground truth in milliseconds.
        </p>
      </div>

      {/* 4 Steps Visual Flow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
        {STEPS.map((item, index) => {
          const Icon = item.icon
          return (
            <div
              key={item.step}
              className="p-5 sm:p-6 rounded-xl border border-border-default bg-bg-elevated flex flex-col justify-between space-y-4 shadow-xs relative"
            >
              <div className="space-y-3">
                {/* Step Number & Icon */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-brand-text bg-brand-surface border border-brand-border px-2 py-0.5 rounded">
                    {item.step}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-bg-secondary border border-border-default flex items-center justify-center text-text-secondary">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                {/* Step Title */}
                <div>
                  <h3 className="text-base font-semibold text-text-primary">
                    {item.title}
                  </h3>
                  <div className="text-[11px] font-mono text-text-muted mt-0.5">
                    {item.subtitle}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Step indicator footer */}
              <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-[11px] text-text-muted">
                <span>Phase {index + 1} of 4</span>
                <span className="text-status-success-text font-medium">Verified</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
