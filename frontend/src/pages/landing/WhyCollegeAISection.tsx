import * as React from "react"
import { Check, X } from "lucide-react"

const COMPARISONS = [
  {
    topic: "Grounding & Accuracy",
    generic: "Hallucinates dates, syllabus outlines, and dead links from outdated web scrapes.",
    collegeAI: "Directly cites official university circular numbers, signed notices, and active syllabi.",
  },
  {
    topic: "Student Data Privacy",
    generic: "Prompts and personal academic records are retained to train public commercial models.",
    collegeAI: "Zero public model training. Automated FERPA masking for student identifiers and grades.",
  },
  {
    topic: "Campus Access Controls",
    generic: "Single public tier with zero awareness of departmental authority or student rosters.",
    collegeAI: "Granular Role-Based Access Control (RBAC) across Students, Faculty Advisors, and Admins.",
  },
  {
    topic: "Institutional Context",
    generic: "No awareness of prerequisite course codes, gate curfew timings, or hall ticket rules.",
    collegeAI: "Pre-indexed against the institution's complete academic catalog, bylaws, and faculty directories.",
  },
]

export function WhyCollegeAISection() {
  return (
    <section className="py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10 sm:space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-bg-secondary border border-border-default text-xs font-mono font-medium text-text-primary">
          <span>Comparative Value</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-text-primary text-balance">
          Why campuses need specialized institutional intelligence.
        </h2>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          Generic public chatbots lack institutional memory, leak student data, and invent nonexistent regulations.
        </p>
      </div>

      {/* Comparison Table / Cards */}
      <div className="rounded-2xl border border-border-default bg-bg-elevated overflow-hidden shadow-xs">
        {/* Table Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-b border-border-default bg-bg-secondary text-xs font-semibold text-text-muted">
          <div className="p-4 md:col-span-3 font-mono uppercase tracking-wider">
            Evaluation Dimension
          </div>
          <div className="p-4 md:col-span-4 border-t md:border-t-0 md:border-l border-border-default flex items-center gap-2 text-status-error-text">
            <X className="w-4 h-4" />
            <span>Generic Public Chatbots</span>
          </div>
          <div className="p-4 md:col-span-5 border-t md:border-t-0 md:border-l border-border-default flex items-center gap-2 text-brand-text bg-brand-surface/40">
            <Check className="w-4 h-4 text-status-success-text" />
            <span className="font-bold text-text-primary">College AI Platform</span>
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-border-default text-xs sm:text-sm">
          {COMPARISONS.map((row) => (
            <div key={row.topic} className="grid grid-cols-1 md:grid-cols-12 items-stretch">
              {/* Topic */}
              <div className="p-4 md:col-span-3 font-medium text-text-primary bg-bg-secondary/30 flex items-center">
                {row.topic}
              </div>

              {/* Generic */}
              <div className="p-4 md:col-span-4 text-text-muted border-t md:border-t-0 md:border-l border-border-subtle flex items-start gap-2.5">
                <span className="text-status-error-text mt-0.5 shrink-0">✕</span>
                <span className="leading-relaxed">{row.generic}</span>
              </div>

              {/* College AI */}
              <div className="p-4 md:col-span-5 text-text-primary border-t md:border-t-0 md:border-l border-border-subtle flex items-start gap-2.5 bg-brand-surface/10 font-medium">
                <span className="text-status-success-text mt-0.5 shrink-0">✓</span>
                <span className="leading-relaxed">{row.collegeAI}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
