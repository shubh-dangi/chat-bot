import * as React from "react"
import {
  Layers,
  FileText,
  Building2,
  BookMarked,
  BellRing,
  CheckCircle,
} from "lucide-react"
import { cn } from "@/shared/utils/cn"

const INTEL_CATEGORIES = [
  {
    id: "courses",
    title: "Courses & Curricula",
    icon: Layers,
    description: "Credit structures, prerequisites, theory-vs-practical splits, and core elective requirements.",
    example: "CS-501 Operating Systems (4.0 credits) requires CS-201 Data Structures.",
  },
  {
    id: "departments",
    title: "Academic Departments",
    icon: Building2,
    description: "Faculty directories, chair offices, advising hours, and laboratory locations.",
    example: "School of Engineering & Technology: 6 Departments, 48 Faculty Members.",
  },
  {
    id: "regulations",
    title: "Campus Bylaws & Hostel Rules",
    icon: FileText,
    description: "Gate pass protocols, curfew timings, library borrowing limits, and fee schedules.",
    example: "Hostel gate closes at 21:30 on weekdays. Digital passes required 24h prior.",
  },
  {
    id: "announcements",
    title: "Official Circulars & Notices",
    icon: BellRing,
    description: "Mid-term test schedules, hall ticket distribution dates, and university holiday calendars.",
    example: "Notice #EX-402: Mid-term examinations commence Monday, October 19th.",
  },
  {
    id: "resources",
    title: "Academic Resources",
    icon: BookMarked,
    description: "Reference textbooks, digital library portal access codes, and past examination papers.",
    example: "Recommended Reading: Kurose & Ross 8th Ed. for Computer Networks.",
  },
]

export function CollegeIntelligenceSection() {
  const [selectedCategory, setSelectedCategory] = React.useState(INTEL_CATEGORIES[0])

  return (
    <section id="intelligence" className="py-14 sm:py-20 lg:py-24 bg-bg-secondary border-y border-border-default px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-bg-elevated border border-border-default text-xs font-mono font-medium text-text-primary">
            <span>Unified Knowledge Structure</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-text-primary text-balance">
            Centralized college knowledge, organized for instant retrieval.
          </h2>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            Eliminate buried PDF handbooks and fragmented bulletin boards. College AI categorizes institutional knowledge into high-precision vector records.
          </p>
        </div>

        {/* Category Selector Grid & Live Detail Pane */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Category Selection List (5 cols) */}
          <div className="lg:col-span-5 space-y-2">
            {INTEL_CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const isSelected = selectedCategory.id === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all duration-fast flex items-start gap-3.5",
                    isSelected
                      ? "bg-bg-elevated border-brand-border-strong text-text-primary shadow-xs"
                      : "bg-bg-primary/50 border-border-default text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                  )}
                >
                  <div
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border",
                      isSelected
                        ? "bg-brand text-brand-contrast border-brand"
                        : "bg-bg-secondary text-text-secondary border-border-default"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-text-primary">
                      {cat.title}
                    </div>
                    <div className="text-xs text-text-muted mt-0.5 line-clamp-1">
                      {cat.description}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Right Detailed Structured Record Mockup (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-2xl border border-border-default bg-bg-elevated space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-border-default">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-surface border border-brand-border text-brand-text flex items-center justify-center">
                  <selectedCategory.icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-text-primary">
                    {selectedCategory.title} Record
                  </h3>
                  <div className="text-[11px] font-mono text-text-muted">
                    Database Schema: institutional_{selectedCategory.id}_catalog
                  </div>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-status-success-surface text-status-success-text border border-status-success-border">
                Indexed &amp; Grounded
              </span>
            </div>

            {/* Scope description */}
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              {selectedCategory.description}
            </p>

            {/* Sample Verified Query Box */}
            <div className="p-4 rounded-xl bg-bg-secondary border border-border-default space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-text-muted">
                Sample Grounded Output
              </div>
              <div className="text-xs sm:text-sm font-sans font-medium text-text-primary leading-relaxed">
                "{selectedCategory.example}"
              </div>
              <div className="pt-2 flex items-center gap-2 text-[11px] text-text-muted">
                <CheckCircle className="w-3.5 h-3.5 text-status-success-text shrink-0" />
                <span>Verified against official signed university circular</span>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="text-[11px] text-text-muted border-t border-border-subtle pt-3">
              Note: Connected to institutional knowledge base. Non-public departmental documents require verified staff or advisor authorization.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
