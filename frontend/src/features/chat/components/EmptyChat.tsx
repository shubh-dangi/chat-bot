import { GraduationCap, Calendar, HelpCircle, UserSearch } from "lucide-react"

export interface EmptyChatProps {
  onSelectPrompt: (promptText: string) => void
}

export function EmptyChat({ onSelectPrompt }: EmptyChatProps) {
  const suggestions = [
    {
      title: "Course Deadlines",
      prompt: "What are the registration deadlines and exam schedules for this semester?",
      icon: <Calendar className="w-4 h-4 text-text-muted" />,
    },
    {
      title: "Campus Regulations",
      prompt: "What are the rules regarding campus attendance, hostel timings, and leave approval?",
      icon: <HelpCircle className="w-4 h-4 text-text-muted" />,
    },
    {
      title: "Student Records",
      prompt: "How can I search for student course enrollment details and departmental contacts?",
      icon: <UserSearch className="w-4 h-4 text-text-muted" />,
    },
  ]

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-xl mx-auto select-none animate-in fade-in duration-200">
      <div className="w-12 h-12 rounded-xl bg-bg-secondary border border-border-default flex items-center justify-center text-text-primary mb-4 shadow-xs">
        <GraduationCap className="w-6 h-6" />
      </div>

      <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-text-primary mb-2">
        College AI
      </h2>

      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-md mb-8">
        Ask me anything about your college. I can assist with academic policies, course outlines, exam schedules, and student inquiries.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
        {suggestions.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(item.prompt)}
            className="p-3.5 text-left rounded-lg bg-bg-secondary border border-border-default hover:border-border-strong hover:bg-interactive-hover transition-all duration-100 flex flex-col justify-between group shadow-xs cursor-pointer"
          >
            <div className="mb-2">{item.icon}</div>
            <div className="text-xs font-semibold text-text-primary mb-1 group-hover:text-text-primary">
              {item.title}
            </div>
            <div className="text-[11px] text-text-muted line-clamp-2 leading-relaxed">
              &quot;{item.prompt}&quot;
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
