import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/shared/utils/cn"

interface FAQItem {
  id: string
  question: string
  answer: string
}

const FAQS: FAQItem[] = [
  {
    id: "what-is-college-ai",
    question: "What is College AI?",
    answer:
      "College AI is a specialized institutional intelligence and retrieval platform for higher education institutions. It connects students, faculty, and administrative staff to verified campus documents, academic syllabi, exam schedules, and student directories through a natural-language conversational interface.",
  },
  {
    id: "who-can-use-it",
    question: "Who can use it?",
    answer:
      "College AI supports three role tiers: Enrolled Students, Faculty / Academic Advisors, and Campus Administrators. Students have access to public campus documents, their personal academic standing, and conversational guidance. Faculty and administrators have expanded permissions for cohort advising and document ingestion.",
  },
  {
    id: "what-information-can-it-provide",
    question: "What information can it provide?",
    answer:
      "College AI provides grounded answers regarding course prerequisites, syllabus outlines, lab credit requirements, examination circulars, hall ticket release schedules, hostel curfew rules, library hours, and departmental faculty contacts—all citing official signed university circulars.",
  },
  {
    id: "how-is-student-information-protected",
    question: "How is student information protected?",
    answer:
      "All student data is safeguarded in accordance with FERPA principles. Sensitive personal identifiers, personal telephone numbers, and cumulative grade point averages are automatically masked before rendering on client interfaces. Multi-tenant database isolation is enforced via PostgreSQL Row-Level Security.",
  },
  {
    id: "can-chats-be-shared",
    question: "Can chats be shared?",
    answer:
      "Yes. Users can generate secure, immutable read-only URLs for specific discussion threads. When shared, only the dialogue content is exported into a public snapshot; author session tokens and confidential student attributes remain strictly excluded.",
  },
  {
    id: "is-ai-currently-enabled",
    question: "Is AI currently enabled?",
    answer:
      "Yes. The platform provides streaming conversational intelligence with real-time markdown parsing, code fence formatting, and institutional handbook grounding. In addition, an interactive simulator is available on the landing page so you can experience the workspace prior to logging in.",
  },
  {
    id: "what-happens-to-my-chats",
    question: "What happens to my chats?",
    answer:
      "Your personal chat history is stored securely in your private account workspace. You can search, rename, or permanently delete conversations at any time. When a conversation is deleted, it is completely purged from active indexes.",
  },
  {
    id: "does-it-work-on-mobile",
    question: "Does it work on mobile?",
    answer:
      "Yes. College AI is built mobile-first. The interface adapts responsively across mobile smartphones (320px+), tablets, laptops, desktops, and ultrawide displays with accessible touch targets, a dedicated slide-in navigation drawer, and zero horizontal scrolling.",
  },
  {
    id: "can-administrators-manage-data",
    question: "Can administrators manage data?",
    answer:
      "Yes. Authorized campus administrators have access to an Administrative Portal where they can provision student directories, upload and index institutional PDF circulars, manage user roles, and inspect security audit logs.",
  },
]

export function FAQSection() {
  const [openIds, setOpenIds] = React.useState<Record<string, boolean>>({
    "what-is-college-ai": true, // First one open by default
  })

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <section id="faq" className="py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10 sm:space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-bg-secondary border border-border-default text-xs font-mono font-medium text-text-primary">
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-text-primary text-balance">
          Frequently asked questions.
        </h2>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          Everything you need to know about the College AI platform, security architecture, and campus deployment.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {FAQS.map((faq) => {
          const isOpen = Boolean(openIds[faq.id])
          const headerId = `faq-header-${faq.id}`
          const panelId = `faq-panel-${faq.id}`

          return (
            <div
              key={faq.id}
              className={cn(
                "rounded-xl border transition-colors",
                isOpen
                  ? "bg-bg-elevated border-brand-border shadow-xs"
                  : "bg-bg-elevated/60 border-border-default hover:border-border-strong"
              )}
            >
              <h3>
                <button
                  id={headerId}
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 text-sm sm:text-base font-semibold text-text-primary min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-ring rounded-xl"
                >
                  <span className="leading-snug">{faq.question}</span>
                  <div
                    className={cn(
                      "w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-text-muted transition-transform duration-fast",
                      isOpen ? "rotate-180 text-brand-text bg-brand-surface" : "bg-bg-secondary"
                    )}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
              </h3>

              {isOpen && (
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  className="px-5 pb-5 pt-1 text-xs sm:text-sm text-text-secondary leading-relaxed border-t border-border-subtle"
                >
                  {faq.answer}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
