import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  MessageSquare,
  GraduationCap,
  Share2,
  ArrowRight,
  Sun,
  Moon,
  Laptop,
  CheckCircle2,
  ShieldCheck,
  BookOpen,
  Search,
  FileText,
  Lock,
  Sparkles,
  Copy,
  Check,
  Send,
} from "lucide-react"
import { Button } from "@/shared/components/ui/Button"
import { Badge } from "@/shared/components/ui/Badge"
import { FadeIn } from "@/shared/components/motion/FadeIn"
import { TypingIndicator } from "@/shared/components/motion/TypingIndicator"
import { useTheme } from "@/shared/hooks/useTheme"
import { ROUTES } from "@/shared/config/routes"

interface DemoChatScenario {
  id: string
  title: string
  userQuery: string
  assistantReply: string
  category: string
}

const DEMO_SCENARIOS: DemoChatScenario[] = [
  {
    id: "syllabus",
    title: "CS Sem 5 Syllabus",
    userQuery: "What are the core prerequisites and lab credits for Computer Networks in CS Sem 5?",
    assistantReply: "According to the 2026 Academic Syllabus:\n• Prerequisites: CS301 Data Structures & Algorithms\n• Credits: 4 Total (3 Lecture + 1 Practical Lab)\n• Required Lab Submissions: Minimum 8 verified socket programming experiments before the Nov 14th cutoff.",
    category: "Academic Syllabus",
  },
  {
    id: "exams",
    title: "Exam Circular 2026",
    userQuery: "What is the schedule for mid-term exams and when are admit cards available?",
    assistantReply: "Per University Examination Notice #EX-402:\n• Series 1 Tests commence Monday, October 19th\n• Admit Cards available for digital download from the Student Portal starting Friday 10:00 AM\n• Attendance requirement: 75% mandatory threshold to sit for exams.",
    category: "Examination Circular",
  },
  {
    id: "hostel",
    title: "Hostel Entry Regulations",
    userQuery: "What are the campus curfew and hostel gate entry timings for residential students?",
    assistantReply: "Campus Resident Rulebook § 4.2:\n• Main Gate closes at 21:30 (9:30 PM) on weekdays\n• Weekend late-entry passes require warden digital approval 24 hours in advance via the campus portal.",
    category: "Campus Regulations",
  },
]

export default function LandingPage() {
  const { theme, setTheme } = useTheme()

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  // Interactive Live Product Preview State
  const [activeScenario, setActiveScenario] = useState<DemoChatScenario>(DEMO_SCENARIOS[0])
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [demoCopied, setDemoCopied] = useState(false)

  // Simulation of typewriter streaming when selecting a scenario
  useEffect(() => {
    setIsTyping(true)
    setDisplayedText("")
    const fullText = activeScenario.assistantReply
    let currentIdx = 0

    const interval = setInterval(() => {
      if (currentIdx < fullText.length) {
        currentIdx += 3
        setDisplayedText(fullText.slice(0, currentIdx))
      } else {
        setDisplayedText(fullText)
        setIsTyping(false)
        clearInterval(interval)
      }
    }, 15)

    return () => clearInterval(interval)
  }, [activeScenario])

  const handleCopyDemo = () => {
    navigator.clipboard?.writeText(displayedText)
    setDemoCopied(true)
    setTimeout(() => setDemoCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col justify-between select-none">
      {/* 1. Navbar */}
      <header className="h-16 border-b border-border-default px-4 sm:px-8 flex items-center justify-between sticky top-0 bg-bg-primary/95 backdrop-blur z-sticky transition-colors duration-fast">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand text-brand-contrast flex items-center justify-center font-bold text-sm shadow-sm">
            CA
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-base sm:text-lg tracking-tight text-text-primary leading-tight">
              College AI
            </span>
            <span className="text-[10px] text-text-muted hidden sm:inline">Institutional Intelligence</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm text-text-secondary">
          <a href="#preview" className="hover:text-text-primary transition-colors">
            Live Preview
          </a>
          <a href="#capabilities" className="hover:text-text-primary transition-colors">
            Capabilities
          </a>
          <a href="#spotlight-chat" className="hover:text-text-primary transition-colors">
            Chat Assistant
          </a>
          <a href="#security" className="hover:text-text-primary transition-colors">
            Security & FERPA
          </a>
          <a href="#workflow" className="hover:text-text-primary transition-colors">
            How It Works
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={cycleTheme}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-interactive-hover transition-colors"
            aria-label="Toggle visual theme"
          >
            {theme === "dark" ? (
              <Moon className="w-4 h-4" />
            ) : theme === "light" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Laptop className="w-4 h-4" />
            )}
          </button>
          <Link to={ROUTES.LOGIN}>
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
              Sign In
            </Button>
          </Link>
          <Link to={ROUTES.CHAT}>
            <Button variant="primary" size="sm" className="text-xs sm:text-sm gap-1.5 shadow-sm">
              <span>Launch App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="py-16 sm:py-24 px-4 text-center max-w-4xl mx-auto space-y-6">
        <FadeIn delay={0}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-border bg-brand-surface text-xs font-medium text-brand-text shadow-xs">
            <span className="w-2 h-2 rounded-full bg-brand shrink-0" />
            <span className="font-medium text-brand-text">Production-Grade Campus Knowledge System</span>
            <span className="text-brand-border">•</span>
            <span className="text-brand-text font-mono text-[11px]">v2.4 Grounded</span>
          </div>
        </FadeIn>

        <FadeIn delay={80}>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-text-primary leading-[1.15]">
            Instant academic answers. <br />
            <span className="text-brand">Verified by your institution.</span>
          </h1>
        </FadeIn>

        <FadeIn delay={140}>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-2xl mx-auto">
            Natural-language search and AI assistant for university syllabi, campus regulations, exam dates, and course guides. Built with strict privacy controls, responsive streaming, and zero clutter.
          </p>
        </FadeIn>

        <FadeIn delay={200} className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to={ROUTES.CHAT} className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2 text-sm shadow-sm">
              <span>Start Free Conversation</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to={ROUTES.SEARCH} className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto text-sm">
              Search Knowledge Base
            </Button>
          </Link>
        </FadeIn>
      </section>

      {/* 3. Interactive Product Preview Box */}
      <section id="preview" className="px-4 sm:px-8 max-w-5xl mx-auto w-full pb-20">
        <FadeIn delay={260}>
          <div className="rounded-2xl border border-border-default bg-bg-secondary p-2 sm:p-3 shadow-md">
            {/* Window bar */}
            <div className="rounded-xl border border-border-default bg-bg-elevated overflow-hidden flex flex-col h-[520px] shadow-xs">
              <div className="h-10 px-4 bg-bg-secondary border-b border-border-default flex items-center justify-between text-xs text-text-muted">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-status-error-text/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-status-warning-text/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-status-success-text/80" />
                  </div>
                  <span className="ml-2 font-mono text-[11px] text-text-secondary">
                    college-ai.internal/workspace
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-text-secondary font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-success-text" />
                  <span>Interactive Simulated Session</span>
                </div>
              </div>

              {/* Inside App Frame */}
              <div className="flex flex-1 overflow-hidden">
                {/* Mini Sidebar */}
                <div className="w-56 bg-bg-secondary border-r border-border-default p-3 hidden sm:flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="h-8 rounded-lg bg-brand text-brand-contrast flex items-center justify-center text-xs font-semibold shadow-sm">
                      + New Chat
                    </div>

                    <div className="text-[10px] uppercase font-bold tracking-wider text-text-muted px-1">
                      Interactive Topics
                    </div>

                    <div className="space-y-1">
                      {DEMO_SCENARIOS.map((scenario) => {
                        const isSelected = activeScenario.id === scenario.id
                        return (
                          <button
                            key={scenario.id}
                            type="button"
                            onClick={() => setActiveScenario(scenario)}
                            className={`w-full text-left p-2 rounded-lg text-xs transition-all duration-fast flex flex-col ${
                              isSelected
                                ? "bg-brand-surface border border-brand-border text-brand-text font-semibold shadow-xs"
                                : "text-text-secondary hover:text-brand-text hover:bg-brand-surface"
                            }`}
                          >
                            <span className="truncate">{scenario.title}</span>
                            <span className="text-[10px] text-text-muted font-normal">{scenario.category}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="text-[11px] text-text-muted border-t border-border-default pt-2.5 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center text-[10px] font-bold text-brand-text">
                      JS
                    </div>
                    <span className="truncate font-medium text-text-secondary">Jane Student • CS Sem 5</span>
                  </div>
                </div>

                {/* Chat conversation preview pane */}
                <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between bg-bg-primary overflow-y-auto">
                  <div className="space-y-4 max-w-2xl mx-auto w-full">
                    {/* Prompt Pill Switchers for Mobile */}
                    <div className="sm:hidden flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                      {DEMO_SCENARIOS.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setActiveScenario(s)}
                          className={`px-2.5 py-1 rounded-full text-[11px] border whitespace-nowrap ${
                            activeScenario.id === s.id
                              ? "bg-brand text-brand-contrast border-brand font-medium shadow-xs"
                              : "bg-bg-secondary text-text-secondary border-border-default"
                          }`}
                        >
                          {s.title}
                        </button>
                      ))}
                    </div>

                    {/* User message */}
                    <div className="flex justify-end animate-message-enter">
                      <div className="bg-brand text-brand-contrast p-3 rounded-2xl rounded-br-none text-xs sm:text-sm max-w-md shadow-sm leading-relaxed">
                        {activeScenario.userQuery}
                      </div>
                    </div>

                    {/* Assistant response */}
                    <div className="flex justify-start gap-2.5 animate-message-enter">
                      <div className="w-7 h-7 rounded-lg bg-brand-surface border border-brand-border flex items-center justify-center text-brand-text shrink-0 mt-0.5 shadow-xs">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div className="space-y-1.5 max-w-lg">
                        <div className="bg-bg-elevated text-text-primary border border-border-default p-3.5 rounded-2xl rounded-bl-none text-xs sm:text-sm leading-relaxed shadow-xs">
                          {isTyping && displayedText.length < 5 ? (
                            <TypingIndicator label="Referencing campus handbook" />
                          ) : (
                            <div className="whitespace-pre-wrap">{displayedText}</div>
                          )}
                        </div>

                        {/* Actions in preview */}
                        <div className="flex items-center gap-2 px-1 text-[11px] text-text-muted">
                          <span>Grounding: 2026 Handbook § 14</span>
                          <button
                            type="button"
                            onClick={handleCopyDemo}
                            className="inline-flex items-center gap-1 hover:text-text-primary transition-colors ml-auto"
                          >
                            {demoCopied ? (
                              <Check className="w-3 h-3 text-status-success-text" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{demoCopied ? "Copied" : "Copy"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Simulated Composer in Preview */}
                  <div className="pt-4 max-w-2xl mx-auto w-full">
                    <div className="h-11 px-3.5 rounded-xl border border-border-default bg-bg-elevated flex items-center justify-between text-xs text-text-muted shadow-xs">
                      <span className="truncate">Ask about attendance, courses, or college bylaws...</span>
                      <div className="w-7 h-7 rounded-lg bg-brand text-brand-contrast flex items-center justify-center shadow-xs">
                        <Send className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 4. Core Capabilities */}
      <section id="capabilities" className="py-20 bg-bg-secondary border-y border-border-default px-4 sm:px-8">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <Badge variant="secondary" size="md" className="font-semibold uppercase tracking-wider text-[10px]">
              Institutional Suite
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary tracking-tight">
              Designed For High Academic Velocity
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Standardize campus inquiries, records verification, and regulatory compliance into a unified interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-xl border border-border-default bg-bg-elevated space-y-3 shadow-xs hover:border-border-strong hover:shadow-sm transition-all duration-normal">
              <div className="w-10 h-10 rounded-lg bg-bg-secondary border border-border-default flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-text-primary" />
              </div>
              <h3 className="text-base font-semibold text-text-primary">Instant AI Conversations</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Direct conversational interface with streaming responses, code formatting, and multi-turn academic memory.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border-default bg-bg-elevated space-y-3 shadow-xs hover:border-border-strong hover:shadow-sm transition-all duration-normal">
              <div className="w-10 h-10 rounded-lg bg-bg-secondary border border-border-default flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-text-primary" />
              </div>
              <h3 className="text-base font-semibold text-text-primary">Student Record Verification</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Query student directory status, assigned faculty mentors, and academic standing with strict FERPA-compliant privacy masking.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border-default bg-bg-elevated space-y-3 shadow-xs hover:border-border-strong hover:shadow-sm transition-all duration-normal">
              <div className="w-10 h-10 rounded-lg bg-bg-secondary border border-border-default flex items-center justify-center">
                <Share2 className="w-5 h-5 text-text-primary" />
              </div>
              <h3 className="text-base font-semibold text-text-primary">Shareable Knowledge Links</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Generate secure, immutable read-only URLs for specific academic discussions with study partners or student advisors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Chat Experience Spotlight */}
      <section id="spotlight-chat" className="py-20 px-4 sm:px-8 max-w-5xl mx-auto space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <Badge variant="secondary" size="md" className="font-semibold uppercase tracking-wider text-[10px]">
              Chat Experience
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary tracking-tight">
              Fluid, fast, and structured for complex campus inquiries.
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Every message streams naturally with instant token rendering. Quickly copy answers, edit previous questions to branch new inquiries, or regenerate responses without page reloads.
            </p>
            <div className="space-y-2.5 pt-2 text-xs">
              <div className="flex items-center gap-2 text-text-primary font-medium">
                <CheckCircle2 className="w-4 h-4 text-status-success-text" />
                <span>Real-time progressive token streaming</span>
              </div>
              <div className="flex items-center gap-2 text-text-primary font-medium">
                <CheckCircle2 className="w-4 h-4 text-status-success-text" />
                <span>Markdown table, code fence, and list parsing</span>
              </div>
              <div className="flex items-center gap-2 text-text-primary font-medium">
                <CheckCircle2 className="w-4 h-4 text-status-success-text" />
                <span>One-click message copying with visual feedback</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-border-default bg-bg-secondary space-y-3 shadow-xs">
            <div className="p-4 rounded-xl border border-border-default bg-bg-elevated space-y-2">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span className="font-semibold text-text-primary">Assistant Response</span>
                <span className="font-mono text-[11px]">34ms latency</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                The Computer Science department requires all final-year project abstracts to be signed by your faculty advisor prior to November 10th.
              </p>
            </div>
            <div className="p-3 rounded-lg border border-border-default bg-bg-primary text-[11px] text-text-muted flex items-center justify-between">
              <span>Includes instant Copy, Edit, and Regenerate micro-interactions</span>
              <Badge variant="success" size="sm">Active</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Student Information Capability */}
      <section className="py-20 bg-bg-secondary border-y border-border-default px-4 sm:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1 p-6 rounded-2xl border border-border-default bg-bg-elevated space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-border-default">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-text-primary text-bg-primary flex items-center justify-center font-bold text-xs">
                  AR
                </div>
                <div>
                  <div className="text-xs font-semibold text-text-primary">Aarav Sharma</div>
                  <div className="text-[11px] text-text-muted font-mono">BCA2022-041</div>
                </div>
              </div>
              <Badge variant="success" size="sm">Active</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-bg-secondary border border-border-subtle">
                <span className="text-[11px] text-text-muted block">Program</span>
                <span className="font-medium text-text-primary">BCA Semester 5</span>
              </div>
              <div className="p-2.5 rounded-lg bg-bg-secondary border border-border-subtle">
                <span className="text-[11px] text-text-muted block">Cumulative GPA</span>
                <span className="font-mono font-medium text-text-primary">8.84 (Protected)</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-bg-tertiary text-xs">
              <div className="flex items-center gap-2 text-text-secondary text-[11px]">
                <Lock className="w-3.5 h-3.5 text-text-muted" />
                <span>FERPA Masking Enabled</span>
              </div>
              <span className="text-[11px] font-semibold text-text-primary">Confidential Record</span>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-4">
            <Badge variant="default" size="md" className="font-semibold uppercase tracking-wider text-[10px]">
              Campus Intelligence
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary tracking-tight">
              Privacy-first academic records & credential lookup.
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Access syllabus outlines, exam notices, and departmental guidelines. Sensitive personal identifiers remain strictly protected behind FERPA confidentiality controls.
            </p>
            <div className="pt-2">
              <Link to={ROUTES.CHAT}>
                <Button variant="secondary" size="md" className="gap-2">
                  <MessageSquare className="w-4 h-4 text-brand" />
                  <span>Ask Knowledge Assistant</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. College Knowledge / Documents */}
      <section className="py-20 px-4 sm:px-8 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <Badge variant="secondary" size="md" className="font-semibold uppercase tracking-wider text-[10px]">
            Knowledge Grounding
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary tracking-tight">
            Trained on Official College Documentation
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Eliminate rumors and hall confusion with directly cited answers from institutional manuals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-border-default bg-bg-elevated space-y-2 shadow-xs">
            <BookOpen className="w-5 h-5 text-text-primary mb-1" />
            <h4 className="text-sm font-semibold text-text-primary">Department Syllabi</h4>
            <p className="text-xs text-text-secondary">Official course requirements, prerequisites, and laboratory syllabi.</p>
          </div>
          <div className="p-4 rounded-xl border border-border-default bg-bg-elevated space-y-2 shadow-xs">
            <FileText className="w-5 h-5 text-text-primary mb-1" />
            <h4 className="text-sm font-semibold text-text-primary">Exam Circulars</h4>
            <p className="text-xs text-text-secondary">Mid-semester schedules, hall ticket rules, and re-evaluation policies.</p>
          </div>
          <div className="p-4 rounded-xl border border-border-default bg-bg-elevated space-y-2 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-text-primary mb-1" />
            <h4 className="text-sm font-semibold text-text-primary">Campus Bylaws</h4>
            <p className="text-xs text-text-secondary">Hostel rules, library timings, disciplinary codes, and fee structures.</p>
          </div>
          <div className="p-4 rounded-xl border border-border-default bg-bg-elevated space-y-2 shadow-xs">
            <Sparkles className="w-5 h-5 text-text-primary mb-1" />
            <h4 className="text-sm font-semibold text-text-primary">Faculty Contacts</h4>
            <p className="text-xs text-text-secondary">Departmental head contacts, office hours, and counseling schedules.</p>
          </div>
        </div>
      </section>

      {/* 8. Security & Access Control */}
      <section id="security" className="py-20 bg-bg-secondary border-y border-border-default px-4 sm:px-8">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          <Badge variant="secondary" size="md" className="font-semibold uppercase tracking-wider text-[10px]">
            Governance & Compliance
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary tracking-tight">
            Institutional Privacy By Architecture
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary max-w-xl mx-auto leading-relaxed">
            Data privacy is paramount. Role-based access ensures students, faculty members, and administrative staff only access authorized records.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-4">
            <div className="p-5 rounded-xl border border-border-default bg-bg-primary space-y-2">
              <div className="text-xs font-semibold text-text-primary">Role-Based Auth</div>
              <p className="text-xs text-text-secondary leading-relaxed">Separate permission tiers for Students, Faculty Advisors, and Campus Administrators.</p>
            </div>
            <div className="p-5 rounded-xl border border-border-default bg-bg-primary space-y-2">
              <div className="text-xs font-semibold text-text-primary">FERPA Redaction</div>
              <p className="text-xs text-text-secondary leading-relaxed">Confidential phone numbers and grades are automatically masked by default.</p>
            </div>
            <div className="p-5 rounded-xl border border-border-default bg-bg-primary space-y-2">
              <div className="text-xs font-semibold text-text-primary">Audit Trail</div>
              <p className="text-xs text-text-secondary leading-relaxed">Every document search and administrative record modification is recorded.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. How It Works */}
      <section id="workflow" className="py-20 px-4 sm:px-8 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="secondary" size="md" className="font-semibold uppercase tracking-wider text-[10px]">
            Workflow
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary">How College AI Works</h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Structured query processing grounded in verified institutional documents.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border border-border-default bg-bg-elevated space-y-2 shadow-xs hover:border-border-strong transition-colors">
            <div className="text-sm font-semibold font-mono text-text-primary">01. Query</div>
            <p className="text-xs text-text-secondary leading-relaxed">Ask any question about courses, deadlines, or campus regulations in natural language.</p>
          </div>
          <div className="p-5 rounded-xl border border-border-default bg-bg-elevated space-y-2 shadow-xs hover:border-border-strong transition-colors">
            <div className="text-sm font-semibold font-mono text-text-primary">02. Retrieve</div>
            <p className="text-xs text-text-secondary leading-relaxed">Semantically queries syllabus files, official circulars, and departmental databases.</p>
          </div>
          <div className="p-5 rounded-xl border border-border-default bg-bg-elevated space-y-2 shadow-xs hover:border-border-strong transition-colors">
            <div className="text-sm font-semibold font-mono text-text-primary">03. Verify</div>
            <p className="text-xs text-text-secondary leading-relaxed">Enforces role-based permissions and verifies citations against official handbooks.</p>
          </div>
          <div className="p-5 rounded-xl border border-border-default bg-bg-elevated space-y-2 shadow-xs hover:border-border-strong transition-colors">
            <div className="text-sm font-semibold font-mono text-text-primary">04. Deliver</div>
            <p className="text-xs text-text-secondary leading-relaxed">Streams verified answers with actionable steps, code blocks, and policy citations.</p>
          </div>
        </div>
      </section>

      {/* 10. CTA */}
      <section className="py-20 px-4 text-center bg-bg-secondary border-t border-border-default space-y-5">
        <div className="max-w-xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary tracking-tight">
            Ready to experience College AI?
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Access the institutional assistant immediately or sign in to save your personal discussion history.
          </p>
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to={ROUTES.CHAT}>
              <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-xs gap-2">
                <span>Launch Assistant Now</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to={ROUTES.LOGIN}>
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Sign In With College ID
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 11. Footer */}
      <footer className="py-10 px-4 sm:px-8 border-t border-border-default bg-bg-primary text-xs text-text-muted select-none">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-brand text-brand-contrast flex items-center justify-center text-[10px] font-bold shadow-xs">
              CA
            </div>
            <span className="font-semibold text-text-primary">College AI</span>
            <span>• © 2026 Academic Intelligence System</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to={ROUTES.CHAT} className="hover:text-brand-text transition-colors">
              Chat Assistant
            </Link>
            <Link to={ROUTES.SEARCH} className="hover:text-brand-text transition-colors">
              Knowledge Search
            </Link>
            <Link to={ROUTES.SETTINGS} className="hover:text-brand-text transition-colors">
              Settings
            </Link>
            <Link to={ROUTES.LOGIN} className="hover:text-brand-text transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
