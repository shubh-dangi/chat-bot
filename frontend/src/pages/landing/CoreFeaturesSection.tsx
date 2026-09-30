import * as React from "react"
import {
  MessageSquare,
  GraduationCap,
  BookOpen,
  FileSearch,
  History,
  Share2,
  Shield,
  Sliders,
} from "lucide-react"
import { cn } from "@/shared/utils/cn"

interface FeatureItem {
  icon: React.ComponentType<{ className?: string }>
  title: string
  status: "Available" | "In Preview" | "Coming Soon"
  description: string
  tags: string[]
}

const FEATURES: FeatureItem[] = [
  {
    icon: MessageSquare,
    title: "AI Academic Chat",
    status: "Available",
    description:
      "Conversational interface with progressive token streaming, code syntax formatting, and multi-turn context tailored to campus academic inquiries.",
    tags: ["Token Streaming", "Markdown Parsing", "Instant Regeneration"],
  },
  {
    icon: GraduationCap,
    title: "Student Intelligence",
    status: "Available",
    description:
      "Query authorized student rosters, academic standing, and assigned faculty mentors with automated FERPA-compliant privacy masking.",
    tags: ["Directory Lookup", "FERPA Redaction", "Advisor Mapping"],
  },
  {
    icon: BookOpen,
    title: "College Knowledge Base",
    status: "Available",
    description:
      "Centralized repository of official department syllabi, examination circulars, credit prerequisites, and campus residential bylaws.",
    tags: ["Verified Grounding", "Handbook Citations", "Bylaw Search"],
  },
  {
    icon: FileSearch,
    title: "Document Intelligence",
    status: "In Preview",
    description:
      "Automated extraction, vector embedding, and semantic chunking for institutional PDF circulars, academic notices, and curricula.",
    tags: ["Semantic Search", "PDF Chunking", "Citation Verification"],
  },
  {
    icon: History,
    title: "Chat History Management",
    status: "Available",
    description:
      "Full conversation management with search, inline renaming, chronological categorization, and permanent conversation deletion.",
    tags: ["Full-Text Search", "Thread Renaming", "Data Purge"],
  },
  {
    icon: Share2,
    title: "Controlled Read-Only Sharing",
    status: "Available",
    description:
      "Generate secure, immutable share tokens for specific discussion threads without exposing sensitive student attributes or personal tokens.",
    tags: ["Immutable URLs", "Token Isolation", "Public Snapshot"],
  },
  {
    icon: Shield,
    title: "Security & Role-Based Access",
    status: "Available",
    description:
      "Defensive architecture enforcing PostgreSQL Row-Level Security, rate-limited endpoints, and tiered access for Students, Advisors, and Admins.",
    tags: ["PostgreSQL RLS", "Tiered RBAC", "Audit Logging"],
  },
  {
    icon: Sliders,
    title: "Administrative Portal",
    status: "Available",
    description:
      "Dedicated management suite for university administrators to provision student directories, upload circulars, and monitor system health.",
    tags: ["Student Management", "Document Uploads", "Audit Trails"],
  },
]

export function CoreFeaturesSection() {
  return (
    <section id="features" className="py-14 sm:py-20 lg:py-24 bg-bg-secondary border-y border-border-default px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-bg-elevated border border-border-default text-xs font-mono font-medium text-text-primary">
            <span>Core Capabilities</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-text-primary text-balance">
            Everything your institution needs to accelerate campus intelligence.
          </h2>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            Engineered specifically for higher education institutions. Every capability is strictly grounded, role-governed, and privacy-first.
          </p>
        </div>

        {/* Features 8-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {FEATURES.map((feat) => {
            const Icon = feat.icon
            return (
              <div
                key={feat.title}
                className="p-5 rounded-xl border border-border-default bg-bg-elevated flex flex-col justify-between space-y-4 shadow-xs hover:border-border-strong transition-all duration-fast"
              >
                <div className="space-y-3">
                  {/* Icon & Status Pill */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-10 h-10 rounded-lg bg-bg-secondary border border-border-default flex items-center justify-center text-text-primary shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>

                    <span
                      className={cn(
                        "text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-semibold",
                        feat.status === "Available"
                          ? "bg-status-success-surface text-status-success-text border border-status-success-border"
                          : "bg-status-warning-surface text-status-warning-text border border-status-warning-border"
                      )}
                    >
                      {feat.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-text-primary tracking-tight">
                    {feat.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                {/* Sub-tags */}
                <div className="pt-3 border-t border-border-subtle flex flex-wrap gap-1.5">
                  {feat.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono text-text-muted bg-bg-secondary px-2 py-0.5 rounded border border-border-subtle"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
