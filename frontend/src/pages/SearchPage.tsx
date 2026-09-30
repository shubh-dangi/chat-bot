import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { Search, MessageSquare, GraduationCap, ArrowRight, X } from "lucide-react"
import { Header } from "@/shared/components/layout/Header"
import { PageContainer } from "@/shared/components/layout/PageContainer"
import { Badge } from "@/shared/components/ui/Badge"
import { useConversations } from "@/features/chat/hooks/useConversations"
import { MOCK_STUDENTS } from "@/features/student/services/studentService"
import { ROUTES } from "@/shared/config/routes"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<"all" | "chats" | "students">("all")

  const { allConversations } = useConversations()

  const matchingConversations = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return allConversations.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.lastMessagePreview && c.lastMessagePreview.toLowerCase().includes(q))
    )
  }, [allConversations, query])

  const matchingStudents = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return MOCK_STUDENTS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.rollNumber.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q)
    )
  }, [query])

  const hasResults =
    matchingConversations.length > 0 || matchingStudents.length > 0

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <Header title="Search" subtitle="Query conversations, students, and institutional files" />

      <PageContainer>
        <div className="space-y-6 max-w-3xl mx-auto">
          {/* Large Search Input */}
          <div className="relative w-full">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search across conversations, students, and policies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-10 text-sm sm:text-base rounded-xl bg-bg-elevated border border-border-default text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus shadow-xs transition-colors"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary rounded"
                aria-label="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1.5 rounded-full border transition-colors select-none ${
                activeFilter === "all"
                  ? "bg-text-primary text-bg-primary border-text-primary font-medium"
                  : "bg-bg-primary text-text-secondary border-border-default hover:bg-interactive-hover"
              }`}
            >
              All Categories
            </button>
            <button
              onClick={() => setActiveFilter("chats")}
              className={`px-3 py-1.5 rounded-full border transition-colors select-none ${
                activeFilter === "chats"
                  ? "bg-text-primary text-bg-primary border-text-primary font-medium"
                  : "bg-bg-primary text-text-secondary border-border-default hover:bg-interactive-hover"
              }`}
            >
              Chats ({matchingConversations.length})
            </button>
            <button
              onClick={() => setActiveFilter("students")}
              className={`px-3 py-1.5 rounded-full border transition-colors select-none ${
                activeFilter === "students"
                  ? "bg-text-primary text-bg-primary border-text-primary font-medium"
                  : "bg-bg-primary text-text-secondary border-border-default hover:bg-interactive-hover"
              }`}
            >
              Students ({matchingStudents.length})
            </button>
          </div>

          {/* Results Display */}
          {query.trim() === "" ? (
            <div className="text-center py-16 text-text-muted space-y-2 select-none">
              <Search className="w-8 h-8 mx-auto opacity-30 mb-2" />
              <p className="text-sm">Type keywords above to search across campus records and conversation logs.</p>
            </div>
          ) : !hasResults ? (
            <div className="text-center py-16 text-text-muted space-y-2 select-none">
              <p className="text-sm text-text-primary font-medium">No results found for &quot;{query}&quot;</p>
              <p className="text-xs text-text-secondary">Try searching by student name, roll number, course, or topic.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Matching Conversations */}
              {(activeFilter === "all" || activeFilter === "chats") &&
                matchingConversations.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider px-1">
                      Conversations ({matchingConversations.length})
                    </h3>
                    <div className="space-y-2">
                      {matchingConversations.map((c) => (
                        <Link
                          key={c.id}
                          to={ROUTES.CHAT_CONVERSATION(c.id)}
                          className="p-3.5 rounded-lg border border-border-default bg-bg-primary hover:bg-interactive-hover transition-colors flex items-center justify-between group shadow-xs"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 rounded bg-bg-secondary text-text-muted shrink-0">
                              <MessageSquare className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs sm:text-sm font-semibold text-text-primary truncate">
                                {c.title}
                              </div>
                              {c.lastMessagePreview && (
                                <div className="text-[11px] text-text-muted truncate mt-0.5">
                                  {c.lastMessagePreview}
                                </div>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-text-primary shrink-0 transition-transform" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

              {/* Matching Students */}
              {(activeFilter === "all" || activeFilter === "students") &&
                matchingStudents.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider px-1">
                      Students ({matchingStudents.length})
                    </h3>
                    <div className="space-y-2">
                      {matchingStudents.map((s) => (
                        <Link
                          key={s.id}
                          to={ROUTES.STUDENT_DETAIL(s.id)}
                          className="p-3.5 rounded-lg border border-border-default bg-bg-primary hover:bg-interactive-hover transition-colors flex items-center justify-between group shadow-xs"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 rounded bg-bg-secondary text-text-muted shrink-0">
                              <GraduationCap className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs sm:text-sm font-semibold text-text-primary truncate">
                                {s.name}{" "}
                                <span className="font-mono text-xs text-text-muted font-normal">
                                  ({s.rollNumber})
                                </span>
                              </div>
                              <div className="text-[11px] text-text-muted truncate mt-0.5">
                                {s.course} • {s.department} • {s.year}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge variant={s.enrollmentStatus === "Active" ? "success" : "secondary"} size="sm">
                              {s.enrollmentStatus}
                            </Badge>
                            <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-text-primary transition-transform" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  )
}
