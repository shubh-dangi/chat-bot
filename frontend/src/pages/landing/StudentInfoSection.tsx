import * as React from "react"
import { Search, ShieldAlert, Lock, UserCheck, Eye, EyeOff, CheckCircle2 } from "lucide-react"
import { cn } from "@/shared/utils/cn"

export function StudentInfoSection() {
  const [showMasked, setShowMasked] = React.useState(true)

  return (
    <section id="student-info" className="py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10 sm:space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-bg-secondary border border-border-default text-xs font-mono font-medium text-text-primary">
          <span>Student Directory &amp; Records</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-text-primary text-balance">
          Authorized student information, protected by default.
        </h2>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          Search student directories and view academic standing while strictly enforcing FERPA compliance and privacy masking.
        </p>
      </div>

      {/* Prominent Privacy Callout Banner */}
      <div className="p-4 sm:p-5 rounded-xl border border-border-strong bg-bg-secondary flex flex-col sm:flex-row items-start sm:items-center gap-3.5 max-w-4xl mx-auto shadow-xs">
        <div className="w-9 h-9 rounded-lg bg-bg-elevated border border-border-default flex items-center justify-center text-brand shrink-0">
          <ShieldAlert className="w-5 h-5 text-brand-text" />
        </div>
        <div className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          <span className="font-semibold text-text-primary">Privacy Rule: </span>
          Student information is shown only according to applicable permissions and access rules. Confidential personal identifiers, contact details, and cumulative grade point averages remain strictly masked.
        </div>
      </div>

      {/* Main Grid: Capabilities on Left, Live Record Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center max-w-5xl mx-auto">
        {/* Left: 4 Pillars of Student Intelligence (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl border border-border-default bg-bg-elevated space-y-1 shadow-xs">
            <div className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <Search className="w-4 h-4 text-brand-text" />
              <span>Student Directory Search</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Find peers and cohort members by name, roll number, or enrolled department for academic study groups.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border-default bg-bg-elevated space-y-1 shadow-xs">
            <div className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-brand-text" />
              <span>Student Profile &amp; Cohort</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Verify degree tracks, active enrollment status, academic year, and semester progression.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border-default bg-bg-elevated space-y-1 shadow-xs">
            <div className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <Lock className="w-4 h-4 text-brand-text" />
              <span>Academic Advisor Alignment</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Easily discover your designated faculty mentor and departmental advisor office hours.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border-default bg-bg-elevated space-y-1 shadow-xs">
            <div className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-text" />
              <span>Role-Authorized Details</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Faculty and advisors can access verified attendance percentages and internal performance notes with full audit logging.
            </p>
          </div>
        </div>

        {/* Right: Live Interactive Card with Masking Toggle (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl border border-border-default bg-bg-elevated space-y-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-border-default">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand text-brand-contrast flex items-center justify-center font-bold text-sm">
                AS
              </div>
              <div>
                <div className="text-sm font-bold text-text-primary">Aarav Sharma</div>
                <div className="text-xs text-text-muted font-mono">BCA2022-041</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowMasked(!showMasked)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border border-border-default bg-bg-secondary hover:bg-interactive-hover text-text-secondary transition-colors"
              title="Toggle role permission simulation"
            >
              {showMasked ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{showMasked ? "Simulate Advisor View" : "Public Student View"}</span>
            </button>
          </div>

          {/* Student details grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-bg-secondary border border-border-subtle">
              <span className="text-[11px] text-text-muted block">Program</span>
              <span className="font-semibold text-text-primary">BCA Computer Applications</span>
            </div>

            <div className="p-3 rounded-lg bg-bg-secondary border border-border-subtle">
              <span className="text-[11px] text-text-muted block">Cohort</span>
              <span className="font-semibold text-text-primary">Semester 5 (2022-2025)</span>
            </div>

            <div className="p-3 rounded-lg bg-bg-secondary border border-border-subtle">
              <span className="text-[11px] text-text-muted block">Faculty Advisor</span>
              <span className="font-semibold text-text-primary">Dr. Ramesh V. (Room 304)</span>
            </div>

            <div className="p-3 rounded-lg bg-bg-secondary border border-border-subtle">
              <span className="text-[11px] text-text-muted block">Cumulative GPA</span>
              {showMasked ? (
                <span className="font-mono text-status-warning-text font-medium flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>••• (Protected)</span>
                </span>
              ) : (
                <span className="font-mono text-text-primary font-bold">
                  8.84 / 10.0 (Advisor Authorized)
                </span>
              )}
            </div>
          </div>

          {/* Masking Status Notice */}
          <div className="p-3 rounded-xl bg-bg-secondary/70 border border-border-default flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-text-secondary">
              <Lock className="w-3.5 h-3.5 text-text-muted" />
              <span>FERPA Masking State:</span>
            </div>
            <span
              className={cn(
                "px-2 py-0.5 rounded text-[11px] font-mono font-medium",
                showMasked
                  ? "bg-status-success-surface text-status-success-text border border-status-success-border"
                  : "bg-status-warning-surface text-status-warning-text border border-status-warning-border"
              )}
            >
              {showMasked ? "Masking Active (Student Tier)" : "Audit Logged (Advisor Tier)"}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
