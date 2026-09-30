import * as React from "react"
import {
  GraduationCap,
  Copy,
  Check,
  RefreshCw,
  Zap,
  Code2,
} from "lucide-react"

export function AIChatExperienceSection() {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard?.writeText(
      "Subjects for CS Semester 5:\n1. CS-501: Operating Systems & Kernel Architecture (4 credits)\n2. CS-502: Computer Networks & Distributed Systems (4 credits)\n3. CS-503: Database Management Systems (4 credits)\n4. CS-504: Theory of Computation (3 credits)\n5. CS-505P: Socket Programming & Networks Lab (2 credits)"
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="ai-chat" className="py-14 sm:py-20 lg:py-24 bg-bg-secondary border-y border-border-default px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-bg-elevated border border-border-default text-xs font-mono font-medium text-text-primary">
            <span>Conversational Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-text-primary text-balance">
            Fluid, grounded, and structured for complex campus inquiries.
          </h2>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            Streaming progressive responses with native markdown parsing, code blocks, and instant citation footers.
          </p>
        </div>

        {/* Two Columns: Chat Features on Left, Realistic Mock Chat on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Left Feature Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-xl border border-border-default bg-bg-elevated space-y-1.5 shadow-xs">
              <div className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <Zap className="w-4 h-4 text-brand-text" />
                <span>Progressive Token Streaming</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Watch verified answers stream naturally with low-latency chunk rendering instead of waiting for a complete payload.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border-default bg-bg-elevated space-y-1.5 shadow-xs">
              <div className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <Code2 className="w-4 h-4 text-brand-text" />
                <span>Markdown, Tables &amp; Code Syntax</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Syllabus lists, exam timetables, fee schedules, and programming lab assignments are parsed into clean structured typography.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border-default bg-bg-elevated space-y-1.5 shadow-xs">
              <div className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-brand-text" />
                <span>Micro-Actions: Copy &amp; Regenerate</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                One-click copying with clipboard confirmation, question editing to branch new inquiries, and immediate context clearing.
              </p>
            </div>
          </div>

          {/* Right Realistic Chat Frame Mockup (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-border-default bg-bg-elevated p-5 sm:p-6 space-y-4 shadow-sm">
            {/* Header bar */}
            <div className="flex items-center justify-between pb-3 border-b border-border-default text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-status-success-text" />
                <span className="font-semibold text-text-primary">Chat Session: Academic Advising</span>
              </div>
              <span className="font-mono text-[11px] text-text-muted">Latency: 42ms</span>
            </div>

            {/* Simulated Chat Dialogue */}
            <div className="space-y-4 pt-1">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="bg-brand text-brand-contrast p-3.5 rounded-2xl rounded-tr-xs text-xs sm:text-sm max-w-[90%] sm:max-w-md shadow-xs leading-relaxed">
                  What subjects and practical labs are scheduled for CS Semester 5?
                </div>
              </div>

              {/* Assistant Message */}
              <div className="flex justify-start items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-brand text-brand-contrast flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <GraduationCap className="w-4 h-4" />
                </div>

                <div className="space-y-2 max-w-[calc(100%-2.5rem)] min-w-0">
                  <div className="bg-bg-secondary text-text-primary border border-border-default p-4 rounded-2xl rounded-tl-xs text-xs sm:text-sm leading-relaxed space-y-2 shadow-xs">
                    <p className="font-medium text-text-primary">
                      Per the 2026 CS Curriculum Handbook, here are the mandatory courses for Semester 5:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-text-secondary text-xs">
                      <li><strong>CS-501:</strong> Operating Systems (4 Credits)</li>
                      <li><strong>CS-502:</strong> Computer Networks (4 Credits)</li>
                      <li><strong>CS-503:</strong> Database Management (4 Credits)</li>
                      <li><strong>CS-504:</strong> Theory of Computation (3 Credits)</li>
                      <li><strong>CS-505P:</strong> Socket Programming Lab (2 Credits)</li>
                    </ul>
                    <p className="text-[11px] text-text-muted pt-1">
                      Registration Deadline: Friday, Oct 16th with faculty mentor sign-off.
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between text-[11px] text-text-muted px-1">
                    <span className="font-mono text-text-secondary">
                      Grounding: Syllabus § CS-501-505
                    </span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-bg-secondary hover:bg-interactive-hover text-text-secondary hover:text-text-primary border border-border-default transition-colors"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-status-success-text" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copied ? "Copied" : "Copy Response"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
