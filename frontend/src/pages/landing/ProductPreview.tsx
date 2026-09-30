import * as React from "react"
import {
  MessageSquare,
  GraduationCap,
  Copy,
  Check,
  Send,
  Lock,
  BookOpen,
} from "lucide-react"
import { cn } from "@/shared/utils/cn"

interface DemoScenario {
  id: string
  title: string
  category: string
  userQuery: string
  assistantReply: string
  groundingCitation: string
  studentContext: {
    name: string
    rollNo: string
    program: string
    semester: string
    status: string
  }
}

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "syllabus",
    title: "CS Sem 5 Lab Credits",
    category: "Academic Syllabus",
    userQuery: "What are the core prerequisites and lab credits for Computer Networks in CS Sem 5?",
    assistantReply:
      "Per the 2026 Academic Catalog:\n• Course Code: CS-502 Computer Networks\n• Prerequisites: CS-301 Data Structures & Algorithms (Grade C or above)\n• Total Credits: 4.0 (3 Lecture Hours + 2 Practical Lab Hours weekly)\n• Practical Assessment: Minimum 8 verified socket programming experiments required prior to mid-term sign-off.",
    groundingCitation: "2026 Faculty Syllabus § CS-502.B",
    studentContext: {
      name: "Jane Student",
      rollNo: "CS2023-089",
      program: "B.Tech Computer Science",
      semester: "Semester 5",
      status: "Enrolled",
    },
  },
  {
    id: "exams",
    title: "Mid-Term Circular 2026",
    category: "Examination Notice",
    userQuery: "What is the schedule for mid-term exams and when are hall tickets available?",
    assistantReply:
      "Per University Examination Notice #EX-402:\n• Exam Window: October 19 – October 28, 2026\n• Hall Ticket Downloads: Available on the Student Portal starting Friday 10:00 AM\n• Mandatory Requirement: Minimum 75% attendance threshold verified by departmental mentors to sit for written papers.",
    groundingCitation: "University Circular #EX-402",
    studentContext: {
      name: "Aarav Sharma",
      rollNo: "BCA2022-041",
      program: "BCA Computer Applications",
      semester: "Semester 5",
      status: "Eligible (82% Attendance)",
    },
  },
  {
    id: "regulations",
    title: "Hostel Entry Regulations",
    category: "Campus Regulations",
    userQuery: "What are the gate curfew hours and overnight travel pass procedures for hostel residents?",
    assistantReply:
      "Campus Resident Rulebook § 4.2:\n• Main Gate Curfew: 21:30 (9:30 PM) on instructional weekdays\n• Weekend Gate Extension: Permitted until 22:30 (10:30 PM)\n• Overnight Leave: Digital leave pass must be requested via portal at least 24 hours in advance and verified by resident warden approval.",
    groundingCitation: "Residential Handbook § 4.2.1",
    studentContext: {
      name: "Priya Nair",
      rollNo: "EE2023-112",
      program: "B.Tech Electrical",
      semester: "Semester 3",
      status: "Block B Resident",
    },
  },
  {
    id: "grading",
    title: "Grade Appeal & Re-evaluation",
    category: "Academic Bylaws",
    userQuery: "How do I request re-evaluation for end-semester papers and what is the fee deadline?",
    assistantReply:
      "Institutional Academic Code § 8.1:\n• Application Window: Open for 14 calendar days following provisional results declaration\n• Fee Schedule: $25 (or ₹500 institutional equivalent) per theory course paper\n• Outcome Processing: Re-evaluated scores finalized within 21 business days by an external board examiner.",
    groundingCitation: "Academic Code Handbook § 8.1",
    studentContext: {
      name: "Marcus Vance",
      rollNo: "ME2022-019",
      program: "B.Tech Mechanical",
      semester: "Semester 6",
      status: "Standing: Good",
    },
  },
]

export function ProductPreview() {
  const [activeScenario, setActiveScenario] = React.useState<DemoScenario>(DEMO_SCENARIOS[0])
  const [displayedText, setDisplayedText] = React.useState("")
  const [isTyping, setIsTyping] = React.useState(false)
  const [hasCopied, setHasCopied] = React.useState(false)
  const [selectedTab, setSelectedTab] = React.useState<"chat" | "student">("chat")

  // Simulate typewriter response streaming on scenario switch
  React.useEffect(() => {
    setIsTyping(true)
    setDisplayedText("")
    const fullText = activeScenario.assistantReply
    let idx = 0

    const interval = setInterval(() => {
      if (idx < fullText.length) {
        idx += 4
        setDisplayedText(fullText.slice(0, idx))
      } else {
        setDisplayedText(fullText)
        setIsTyping(false)
        clearInterval(interval)
      }
    }, 18)

    return () => clearInterval(interval)
  }, [activeScenario])

  const handleCopy = () => {
    navigator.clipboard?.writeText(displayedText)
    setHasCopied(true)
    setTimeout(() => setHasCopied(false), 2000)
  }

  return (
    <section id="product-preview" className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full pb-14 sm:pb-20">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-bg-secondary border border-border-default text-xs font-mono text-text-muted">
          <span>Interactive Product Simulator</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
          Experience the workspace before signing in.
        </h2>
        <p className="text-sm text-text-secondary">
          Click any institutional query scenario below to see how College AI retrieves, verifies, and formats campus intelligence.
        </p>
      </div>

      {/* Main Preview Container Frame */}
      <div className="rounded-2xl border border-border-default bg-bg-secondary p-1.5 sm:p-3 shadow-md">
        <div className="rounded-xl border border-border-default bg-bg-elevated overflow-hidden flex flex-col min-h-[520px] sm:h-[580px] shadow-xs">
          {/* Top Browser / Window Frame Bar */}
          <div className="h-11 px-3 sm:px-4 bg-bg-secondary border-b border-border-default flex items-center justify-between gap-3 text-xs shrink-0 select-none">
            {/* Window Controls */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-status-error-text/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-status-warning-text/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-status-success-text/80" />
              </div>
              <div className="ml-2 px-2.5 py-0.5 rounded bg-bg-primary border border-border-subtle font-mono text-[11px] text-text-muted truncate max-w-[220px] sm:max-w-xs">
                college-ai.internal/workspace
              </div>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-status-success-surface border border-status-success-border text-status-success-text text-[11px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-status-success-text animate-pulse" />
                <span>Simulated Sandbox</span>
              </div>
            </div>
          </div>

          {/* Interactive Workspace Body */}
          <div className="flex flex-1 overflow-hidden min-h-0">
            {/* Left Simulated Sidebar (Visible on md+) */}
            <aside className="w-64 bg-bg-secondary border-r border-border-default p-3 hidden md:flex flex-col justify-between shrink-0 select-none">
              <div className="space-y-3">
                {/* New Chat Button */}
                <div className="h-9 rounded-lg bg-brand text-brand-contrast flex items-center justify-center text-xs font-semibold shadow-xs gap-1.5 cursor-default">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>+ New Academic Chat</span>
                </div>

                {/* Scenario Navigation */}
                <div className="space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-text-muted px-2 py-1 font-semibold">
                    Campus Scenarios
                  </div>

                  {DEMO_SCENARIOS.map((scenario) => {
                    const isSelected = activeScenario.id === scenario.id
                    return (
                      <button
                        key={scenario.id}
                        type="button"
                        onClick={() => setActiveScenario(scenario)}
                        className={cn(
                          "w-full text-left p-2.5 rounded-lg text-xs transition-colors flex flex-col gap-0.5",
                          isSelected
                            ? "bg-bg-primary border border-border-default text-text-primary shadow-xs font-semibold"
                            : "text-text-secondary hover:text-text-primary hover:bg-interactive-hover"
                        )}
                      >
                        <span className="truncate">{scenario.title}</span>
                        <span className="text-[10px] text-text-muted font-normal truncate">
                          {scenario.category}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Sidebar Active User Indicator */}
              <div className="p-2.5 rounded-lg bg-bg-primary border border-border-default flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-brand-surface border border-brand-border text-brand-text flex items-center justify-center font-bold text-xs shrink-0">
                  {activeScenario.studentContext.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-text-primary truncate">
                    {activeScenario.studentContext.name}
                  </div>
                  <div className="text-[10px] font-mono text-text-muted truncate">
                    {activeScenario.studentContext.rollNo}
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Main Content Pane */}
            <div className="flex-1 flex flex-col justify-between bg-bg-primary overflow-hidden min-w-0">
              {/* Mobile/Tablet Scenario Switcher Chips */}
              <div className="md:hidden px-3 py-2 bg-bg-secondary border-b border-border-default flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                {DEMO_SCENARIOS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveScenario(s)}
                    className={cn(
                      "px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap min-h-[36px] shrink-0 border transition-colors",
                      activeScenario.id === s.id
                        ? "bg-brand text-brand-contrast border-brand shadow-xs"
                        : "bg-bg-primary text-text-secondary border-border-default hover:text-text-primary"
                    )}
                  >
                    {s.title}
                  </button>
                ))}
              </div>

              {/* View Toggle Tabs (Chat vs Student Record preview) */}
              <div className="px-4 py-2 border-b border-border-subtle bg-bg-primary flex items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-1 bg-bg-secondary p-0.5 rounded-lg border border-border-default">
                  <button
                    type="button"
                    onClick={() => setSelectedTab("chat")}
                    className={cn(
                      "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                      selectedTab === "chat"
                        ? "bg-bg-elevated text-text-primary shadow-xs font-semibold"
                        : "text-text-muted hover:text-text-primary"
                    )}
                  >
                    Chat Interaction
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTab("student")}
                    className={cn(
                      "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                      selectedTab === "student"
                        ? "bg-bg-elevated text-text-primary shadow-xs font-semibold"
                        : "text-text-muted hover:text-text-primary"
                    )}
                  >
                    Student Record Card
                  </button>
                </div>

                <div className="text-[11px] font-mono text-text-muted hidden sm:flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-brand-text" />
                  <span>Grounding: {activeScenario.groundingCitation}</span>
                </div>
              </div>

              {/* Chat View Tab */}
              {selectedTab === "chat" && (
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 max-w-3xl mx-auto w-full">
                  {/* User Message */}
                  <div className="flex justify-end animate-message-enter">
                    <div className="bg-bg-tertiary text-text-primary p-3.5 rounded-2xl rounded-tr-xs text-xs sm:text-sm max-w-[85%] sm:max-w-lg border border-border-subtle shadow-xs leading-relaxed font-normal">
                      {activeScenario.userQuery}
                    </div>
                  </div>

                  {/* Assistant Message */}
                  <div className="flex justify-start items-start gap-2.5 animate-message-enter">
                    <div className="w-7 h-7 rounded-lg bg-brand text-brand-contrast flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <GraduationCap className="w-4 h-4" />
                    </div>

                    <div className="space-y-2 max-w-[calc(100%-2.5rem)] sm:max-w-xl min-w-0">
                      <div className="bg-bg-elevated text-text-primary border border-border-default p-4 rounded-2xl rounded-tl-xs text-xs sm:text-sm leading-relaxed shadow-xs">
                        {isTyping && displayedText.length < 5 ? (
                          <div className="flex items-center gap-2 text-text-muted text-xs">
                            <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                            <span>Retrieving verified campus handbook...</span>
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap font-sans text-text-primary break-words">
                            {displayedText}
                          </div>
                        )}
                      </div>

                      {/* Grounding Source & Micro-actions */}
                      <div className="flex items-center justify-between text-[11px] text-text-muted px-1">
                        <span className="font-mono text-text-secondary truncate">
                          Source: {activeScenario.groundingCitation}
                        </span>

                        <button
                          type="button"
                          onClick={handleCopy}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-interactive-hover text-text-secondary hover:text-text-primary transition-colors min-h-[32px]"
                          aria-label="Copy assistant answer"
                        >
                          {hasCopied ? (
                            <Check className="w-3.5 h-3.5 text-status-success-text" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>{hasCopied ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Student Record Card Tab */}
              {selectedTab === "student" && (
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-2xl mx-auto w-full space-y-4">
                  <div className="p-4 sm:p-5 rounded-xl border border-border-default bg-bg-elevated space-y-4 shadow-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-border-default">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-surface border border-brand-border text-brand-text flex items-center justify-center font-bold text-sm">
                          {activeScenario.studentContext.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-text-primary">
                            {activeScenario.studentContext.name}
                          </div>
                          <div className="text-xs text-text-muted font-mono">
                            {activeScenario.studentContext.rollNo}
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-status-success-surface text-status-success-text border border-status-success-border">
                        {activeScenario.studentContext.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-lg bg-bg-secondary border border-border-subtle">
                        <span className="text-text-muted block text-[11px]">Academic Program</span>
                        <span className="font-medium text-text-primary">
                          {activeScenario.studentContext.program}
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-bg-secondary border border-border-subtle">
                        <span className="text-text-muted block text-[11px]">Cohort Level</span>
                        <span className="font-medium text-text-primary">
                          {activeScenario.studentContext.semester}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-bg-secondary/70 border border-border-default flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-text-secondary">
                        <Lock className="w-3.5 h-3.5 text-text-muted" />
                        <span>FERPA Redaction Enabled</span>
                      </div>
                      <span className="text-[11px] font-mono text-text-muted">
                        Grades &amp; Contact: Masked
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Simulated Composer at Bottom */}
              <div className="p-3 sm:p-4 border-t border-border-default bg-bg-elevated shrink-0">
                <div className="max-w-3xl mx-auto flex items-center gap-2">
                  <div className="flex-1 h-11 px-3.5 rounded-xl border border-border-default bg-bg-primary flex items-center justify-between text-xs text-text-muted shadow-xs">
                    <span className="truncate">Ask about attendance, courses, or college bylaws...</span>
                    <span className="font-mono text-[10px] text-text-disabled hidden sm:inline">↵ to send</span>
                  </div>
                  <button
                    type="button"
                    className="w-11 h-11 rounded-xl bg-brand text-brand-contrast flex items-center justify-center shadow-xs shrink-0 cursor-default"
                    aria-label="Send simulated message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
