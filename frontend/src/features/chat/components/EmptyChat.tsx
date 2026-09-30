import {
  GraduationCap,
  Calendar,
  BookOpen,
  FileText,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
} from "lucide-react"
import { Badge } from "@/shared/components/ui/Badge"
import { FadeIn } from "@/shared/components/motion/FadeIn"

export interface EmptyChatProps {
  onSelectPrompt: (promptText: string) => void
}

export function EmptyChat({ onSelectPrompt }: EmptyChatProps) {
  const categories = [
    {
      badge: "Academics",
      title: "Syllabus & Course Structure",
      prompt: "What is the detailed syllabus and credit distribution for Computer Science Semester 5?",
      icon: <BookOpen className="w-4 h-4 text-brand-text" />,
      subtext: "Covers prerequisites, elective courses, and practical lab hours",
    },
    {
      badge: "Examinations",
      title: "Exam Schedules & Deadlines",
      prompt: "When do the mid-semester examinations begin and what is the last date to submit admit card applications?",
      icon: <Calendar className="w-4 h-4 text-brand-text" />,
      subtext: "Includes internal assessment schedules and hall permit guidelines",
    },
    {
      badge: "Campus Policies",
      title: "Attendance & Grading System",
      prompt: "What are the minimum attendance thresholds and grade point average criteria for semester honors?",
      icon: <FileText className="w-4 h-4 text-brand-text" />,
      subtext: "Official institutional rules on attendance grace and academic standing",
    },
    {
      badge: "Regulations",
      title: "Campus Facilities & Lab Access",
      prompt: "What are the campus library timings and access procedures for high-performance computing labs?",
      icon: <ShieldCheck className="w-4 h-4 text-brand-text" />,
      subtext: "Operating hours, access clearances, and departmental equipment rules",
    },
  ]

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-3xl mx-auto select-none">
      {/* Brand Icon & Welcome */}
      <FadeIn delay={50} className="flex flex-col items-center text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-brand-surface border border-brand-border flex items-center justify-center text-brand-text mb-4 shadow-xs">
          <GraduationCap className="w-6 h-6" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-border bg-brand-surface text-[11px] font-medium text-brand-text mb-3">
          <Sparkles className="w-3 h-3 text-brand" />
          <span>Campus Conversational Assistant</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary mb-2.5">
          What can I help you with today?
        </h2>

        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-lg">
          Ask questions about courses, schedules, regulations, or campus facilities. Grounded directly in official institutional documents.
        </p>
      </FadeIn>

      {/* Suggestion Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
        {categories.map((item, idx) => (
          <FadeIn
            key={idx}
            delay={100 + idx * 60}
          >
            <button
              type="button"
              onClick={() => onSelectPrompt(item.prompt)}
              className="w-full text-left p-4 rounded-xl bg-bg-elevated border border-border-default hover:border-brand-border hover:bg-brand-surface/30 hover:shadow-sm hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.99] transition-all duration-fast flex flex-col justify-between group cursor-pointer h-full"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-brand-surface border border-brand-border flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <Badge variant="default" size="sm" className="text-[10px] uppercase font-semibold">
                      {item.badge}
                    </Badge>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-brand-text group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-fast shrink-0" />
                </div>

                <div className="text-xs sm:text-sm font-semibold text-text-primary mb-1 group-hover:text-brand-text transition-colors">
                  {item.title}
                </div>
                <div className="text-xs text-text-muted leading-relaxed line-clamp-2">
                  {item.subtext}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-border-subtle flex items-center gap-1.5 text-[11px] text-text-secondary group-hover:text-brand-text font-mono truncate transition-colors">
                <FileText className="w-3 h-3 text-text-muted shrink-0" />
                <span className="truncate">&quot;{item.prompt}&quot;</span>
              </div>
            </button>
          </FadeIn>
        ))}
      </div>
    </div>
  )
}
