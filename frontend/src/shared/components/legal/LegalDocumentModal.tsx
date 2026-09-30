import * as React from "react"
import { X, Shield, FileText, Cookie, Lock, Eye, Building, Mail, Database, CheckCircle2 } from "lucide-react"
import { LEGAL_DOCUMENTS, LegalDoc } from "./legalContent"
import { cn } from "@/shared/utils/cn"

export interface LegalDocumentModalProps {
  docId: string | null
  onClose: () => void
  onSelectDoc?: (docId: string) => void
}

const DOC_TABS: { id: LegalDoc["id"]; label: string; icon: React.ReactNode }[] = [
  { id: "privacy", label: "Privacy Policy", icon: <Lock className="w-3.5 h-3.5" /> },
  { id: "terms", label: "Terms of Service", icon: <FileText className="w-3.5 h-3.5" /> },
  { id: "security", label: "Security & Governance", icon: <Shield className="w-3.5 h-3.5" /> },
  { id: "cookies", label: "Cookie Policy", icon: <Cookie className="w-3.5 h-3.5" /> },
  { id: "data-policy", label: "Data Policy", icon: <Database className="w-3.5 h-3.5" /> },
  { id: "accessibility", label: "Accessibility", icon: <Eye className="w-3.5 h-3.5" /> },
  { id: "about", label: "About Platform", icon: <Building className="w-3.5 h-3.5" /> },
  { id: "contact", label: "Contact & Support", icon: <Mail className="w-3.5 h-3.5" /> },
]

export function LegalDocumentModal({
  docId,
  onClose,
  onSelectDoc,
}: LegalDocumentModalProps) {
  const surfaceRef = React.useRef<HTMLDivElement>(null)
  const previousActiveElement = React.useRef<HTMLElement | null>(null)

  const activeDoc: LegalDoc | undefined = docId ? LEGAL_DOCUMENTS[docId] || LEGAL_DOCUMENTS.privacy : undefined

  React.useEffect(() => {
    if (!docId) return

    previousActiveElement.current = document.activeElement as HTMLElement

    // Auto focus the modal surface or first focusable button
    requestAnimationFrame(() => {
      const closeBtn = surfaceRef.current?.querySelector<HTMLElement>('button[aria-label="Close modal"]')
      closeBtn?.focus()
    })

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation()
        onClose()
        return
      }

      // Tab trap
      if (e.key === "Tab" && surfaceRef.current) {
        const focusables = surfaceRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusables.length === 0) return

        const firstElement = focusables[0]
        const lastElement = focusables[focusables.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown, true)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true)
      document.body.style.overflow = prevOverflow
      previousActiveElement.current?.focus?.()
    }
  }, [docId, onClose])

  if (!docId || !activeDoc) return null

  return (
    <div
      className="fixed inset-0 z-modal flex items-end sm:items-center justify-center overflow-y-auto overscroll-contain"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-bg-overlay/80 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog Surface */}
      <div
        ref={surfaceRef}
        tabIndex={-1}
        className={cn(
          "relative w-full z-10 bg-bg-elevated border border-border-default shadow-xl",
          "flex flex-col h-[90dvh] max-h-[90dvh] sm:max-w-3xl",
          "rounded-t-2xl sm:rounded-2xl",
          "pb-[env(safe-area-inset-bottom)] sm:pb-0 outline-none animate-dialog-enter overflow-hidden"
        )}
      >
        {/* Mobile Drag Indicator */}
        <div
          className="mx-auto mt-2 h-1 w-10 rounded-full bg-border-strong shrink-0 sm:hidden"
          aria-hidden="true"
        />

        {/* Header */}
        <div className="px-5 py-4 border-b border-border-default flex items-center justify-between gap-3 shrink-0 bg-bg-secondary/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-brand-surface text-brand-text border border-brand-border">
                <CheckCircle2 className="w-3 h-3 text-status-success-text" />
                Institutional Compliance
              </span>
              <span className="text-[11px] text-text-muted">Updated {activeDoc.lastUpdated}</span>
            </div>
            <h2
              id="legal-modal-title"
              className="text-lg sm:text-xl font-bold text-text-primary tracking-tight mt-1"
            >
              {activeDoc.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 -mr-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-interactive-hover transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-border-default bg-bg-secondary/20 overflow-x-auto no-scrollbar shrink-0">
          {DOC_TABS.map((tab) => {
            const isActive = tab.id === activeDoc.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectDoc?.(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors min-h-[36px]",
                  isActive
                    ? "bg-bg-primary text-text-primary border border-border-default shadow-xs"
                    : "text-text-secondary hover:text-text-primary hover:bg-interactive-hover"
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-xs sm:text-sm text-text-secondary leading-relaxed">
          <p className="p-3.5 rounded-xl bg-bg-secondary border border-border-default text-text-primary text-xs sm:text-sm font-medium">
            {activeDoc.subtitle}
          </p>

          <div className="space-y-6">
            {activeDoc.sections.map((section, idx) => (
              <section key={idx} className="space-y-2">
                <h3 className="text-sm sm:text-base font-semibold text-text-primary">
                  {section.heading}
                </h3>
                {Array.isArray(section.content) ? (
                  <div className="space-y-2 text-text-secondary">
                    {section.content.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}
                  </div>
                ) : (
                  <p>{section.content}</p>
                )}
              </section>
            ))}
          </div>

          <div className="pt-6 border-t border-border-default text-xs text-text-muted flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span>Official College AI Institutional Governance Standard</span>
            <button
              onClick={onClose}
              className="text-brand-text hover:underline font-medium min-h-[36px] flex items-center"
            >
              Close Document
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
