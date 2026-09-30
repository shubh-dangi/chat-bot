import { Link } from "react-router-dom"
import {
  MessageSquare,
  GraduationCap,
  Share2,
  ArrowRight,
  Sun,
  Moon,
  Laptop,
} from "lucide-react"
import { Button } from "@/shared/components/ui/Button"
import { useTheme } from "@/shared/hooks/useTheme"
import { ROUTES } from "@/shared/config/routes"

export default function LandingPage() {
  const { theme, setTheme } = useTheme()

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col justify-between select-none">
      {/* 1. Navbar */}
      <header className="h-16 border-b border-border-default px-4 sm:px-8 flex items-center justify-between sticky top-0 bg-bg-primary/95 backdrop-blur z-sticky">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="College AI" className="w-7 h-7 rounded" />
          <span className="font-semibold text-base sm:text-lg tracking-tight text-text-primary">
            College AI
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm text-text-secondary">
          <a href="#features" className="hover:text-text-primary transition-colors">
            Capabilities
          </a>
          <a href="#preview" className="hover:text-text-primary transition-colors">
            Product Preview
          </a>
          <a href="#workflow" className="hover:text-text-primary transition-colors">
            How It Works
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={cycleTheme}
            className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-interactive-hover transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Moon className="w-4 h-4" /> : theme === "light" ? <Sun className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
          </button>
          <Link to={ROUTES.LOGIN}>
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
              Sign In
            </Button>
          </Link>
          <Link to={ROUTES.CHAT}>
            <Button variant="primary" size="sm" className="text-xs sm:text-sm gap-1.5 shadow-xs">
              <span>Open App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="py-16 sm:py-24 px-4 text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-default bg-bg-secondary text-xs font-medium text-text-secondary">
          <span className="w-2 h-2 rounded-full bg-status-success-text" />
          <span>Production-Grade Campus Intelligence</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-text-primary leading-tight">
          Your College. <br />
          One Intelligent Assistant.
        </h1>

        <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-xl mx-auto">
          Instant, verified answers for university syllabi, campus regulations, examination schedules, and student records — designed with privacy, clarity, and speed.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to={ROUTES.CHAT} className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2">
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to={ROUTES.STUDENTS} className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Explore Student Directory
            </Button>
          </Link>
        </div>
      </section>

      {/* 3. Product Preview Box */}
      <section id="preview" className="px-4 sm:px-8 max-w-5xl mx-auto w-full pb-16">
        <div className="rounded-xl border border-border-default bg-bg-secondary p-2 sm:p-3 shadow-md">
          {/* Simulated App Frame */}
          <div className="rounded-lg border border-border-default bg-bg-primary overflow-hidden flex flex-col h-[420px]">
            {/* Window bar */}
            <div className="h-9 px-4 bg-bg-secondary border-b border-border-default flex items-center justify-between text-xs text-text-muted">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                <span className="ml-2 font-mono text-[11px] text-text-secondary">college-ai.internal/chat</span>
              </div>
              <span>Live Workspace</span>
            </div>

            {/* Split layout inside preview */}
            <div className="flex flex-1 overflow-hidden">
              {/* Fake mini sidebar */}
              <div className="w-48 bg-bg-secondary border-r border-border-default p-3 hidden sm:flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="h-7 rounded bg-neutral-800 text-neutral-0 dark:bg-neutral-50 dark:text-neutral-900 flex items-center justify-center text-xs font-medium">
                    + New Chat
                  </div>
                  <div className="text-[10px] uppercase font-semibold text-text-muted pt-2">Today</div>
                  <div className="text-xs p-1.5 rounded bg-interactive-selected text-text-primary truncate font-medium">
                    BCA Semester 5 Syllabus
                  </div>
                  <div className="text-xs p-1.5 rounded text-text-secondary truncate">
                    Hostel Gate Timings
                  </div>
                </div>
                <div className="text-[11px] text-text-muted border-t border-border-default pt-2">
                  Jane Smith • Student
                </div>
              </div>

              {/* Chat thread */}
              <div className="flex-1 p-4 flex flex-col justify-between bg-bg-primary">
                <div className="space-y-3">
                  <div className="flex justify-end">
                    <div className="bg-neutral-800 text-neutral-50 p-2.5 rounded-xl rounded-br-none text-xs max-w-sm">
                      What are the internal exam dates for BCA Semester 5?
                    </div>
                  </div>
                  <div className="flex justify-start gap-2">
                    <div className="w-6 h-6 rounded bg-bg-secondary border border-border-default flex items-center justify-center shrink-0">
                      <GraduationCap className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-bg-secondary text-text-primary border border-border-default p-3 rounded-xl rounded-bl-none text-xs max-w-md leading-relaxed">
                      Internal test series 1 commences on <strong>October 18th</strong>. Admit cards can be downloaded from the university portal starting Monday.
                    </div>
                  </div>
                </div>

                {/* Fake composer */}
                <div className="pt-2">
                  <div className="h-9 px-3 rounded-lg border border-border-default bg-bg-elevated flex items-center justify-between text-xs text-text-muted">
                    <span>Ask anything about courses, exams, or regulations...</span>
                    <div className="w-6 h-6 rounded bg-neutral-800 text-neutral-0 dark:bg-neutral-50 dark:text-neutral-900 flex items-center justify-center text-[10px]">
                      ↗
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Features */}
      <section id="features" className="py-16 bg-bg-secondary border-y border-border-default px-4 sm:px-8">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl font-semibold text-text-primary tracking-tight">
              Built Specifically for Academic Institutions
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Eliminate administrative back-and-forth with a unified conversational intelligence interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-lg border border-border-default bg-bg-primary space-y-3">
              <div className="w-10 h-10 rounded-lg bg-bg-secondary border border-border-default flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-text-primary" />
              </div>
              <h3 className="text-base font-semibold text-text-primary">Instant AI Conversations</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Natural-language Q&A for syllabus guidelines, grading policies, attendance requirements, and university notices.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border-default bg-bg-primary space-y-3">
              <div className="w-10 h-10 rounded-lg bg-bg-secondary border border-border-default flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-text-primary" />
              </div>
              <h3 className="text-base font-semibold text-text-primary">Student Directory</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Searchable student records with privacy masking for sensitive identifiers and instant academic standing verification.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border-default bg-bg-primary space-y-3">
              <div className="w-10 h-10 rounded-lg bg-bg-secondary border border-border-default flex items-center justify-center">
                <Share2 className="w-5 h-5 text-text-primary" />
              </div>
              <h3 className="text-base font-semibold text-text-primary">Shareable Snapshots</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Generate secure, read-only links for specific discussions with peer study groups or faculty advisors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works */}
      <section id="workflow" className="py-16 px-4 sm:px-8 max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-text-primary">How College AI Works</h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Structured query processing with grounded campus knowledge.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-lg border border-border-default bg-bg-secondary space-y-2">
            <div className="text-sm font-semibold font-mono text-text-primary">01. Inquire</div>
            <p className="text-xs text-text-secondary">Ask any question in natural language</p>
          </div>
          <div className="p-4 rounded-lg border border-border-default bg-bg-secondary space-y-2">
            <div className="text-sm font-semibold font-mono text-text-primary">02. Retrieve</div>
            <p className="text-xs text-text-secondary">Queries syllabus, handbooks & records</p>
          </div>
          <div className="p-4 rounded-lg border border-border-default bg-bg-secondary space-y-2">
            <div className="text-sm font-semibold font-mono text-text-primary">03. Verify</div>
            <p className="text-xs text-text-secondary">Strict privacy & role access verification</p>
          </div>
          <div className="p-4 rounded-lg border border-border-default bg-bg-secondary space-y-2">
            <div className="text-sm font-semibold font-mono text-text-primary">04. Deliver</div>
            <p className="text-xs text-text-secondary">Instant structured answer & citations</p>
          </div>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="py-16 px-4 text-center bg-bg-secondary border-t border-border-default space-y-4">
        <h2 className="text-2xl font-semibold text-text-primary">Ready to get started?</h2>
        <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto">
          Log in with your college credentials or explore the live chat experience immediately.
        </p>
        <div className="pt-2">
          <Link to={ROUTES.CHAT}>
            <Button variant="primary" size="lg" className="shadow-xs">
              Launch College AI
            </Button>
          </Link>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="py-8 px-4 sm:px-8 border-t border-border-default bg-bg-primary text-xs text-text-muted">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="College AI" className="w-5 h-5 rounded" />
            <span className="font-semibold text-text-primary">College AI</span>
            <span>• © 2026</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to={ROUTES.CHAT} className="hover:text-text-primary transition-colors">
              Chat
            </Link>
            <Link to={ROUTES.STUDENTS} className="hover:text-text-primary transition-colors">
              Students
            </Link>
            <Link to={ROUTES.LOGIN} className="hover:text-text-primary transition-colors">
              Sign In
            </Link>
            <Link to={ROUTES.SETTINGS} className="hover:text-text-primary transition-colors">
              Settings
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
