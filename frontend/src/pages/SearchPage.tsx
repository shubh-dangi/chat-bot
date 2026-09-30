import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, MessageSquare, GraduationCap, FileText, ArrowRight, X, Loader2 } from "lucide-react"
import { Header } from "@/shared/components/layout/Header"
import { PageContainer } from "@/shared/components/layout/PageContainer"
import { PageTransition } from "@/shared/components/motion/PageTransition"
import { FadeIn } from "@/shared/components/motion/FadeIn"
import { Badge } from "@/shared/components/ui/Badge"
import { apiClient } from "@/shared/services/apiClient"
import { useConversations } from "@/features/chat/hooks/useConversations"
import { MOCK_STUDENTS } from "@/features/student/services/studentService"
import { ROUTES } from "@/shared/config/routes"

interface SearchResults {
  conversations: Array<{ id: string; title: string; lastMessagePreview?: string }>
  students: Array<{ id: string; name: string; rollNumber: string; department?: string }>
  documents: Array<{ id: string; filename: string; type: string; status?: string }>
}

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<"all" | "chats" | "students" | "documents">("all")
  const [results, setResults] = useState<SearchResults>({ conversations: [], students: [], documents: [] })
  const [loading, setLoading] = useState(false)

  const { allConversations } = useConversations()

  useEffect(() => {
    if (!query.trim()) {
      setResults({ conversations: [], students: [], documents: [] })
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      const q = query.trim().toLowerCase()

      try {
        const res = await apiClient.get<{ query: string; results: SearchResults }>("/api/search", {
          params: { q: query.trim() },
        })
        if (res && res.results) {
          setResults({
            conversations: res.results.conversations || [],
            students: res.results.students || [],
            documents: res.results.documents || [],
          })
          setLoading(false)
          return
        }
      } catch (err) {
        console.warn("Backend unified search error, using local index fallback:", err)
      }

      // Local fallback search across conversations and students
      const localConvs = allConversations
        .filter(
          (c) =>
            c.title.toLowerCase().includes(q) ||
            (c.lastMessagePreview && c.lastMessagePreview.toLowerCase().includes(q))
        )
        .map((c) => ({ id: c.id, title: c.title, lastMessagePreview: c.lastMessagePreview }))

      const localStudents = MOCK_STUDENTS.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.rollNumber.toLowerCase().includes(q) ||
          s.department.toLowerCase().includes(q)
      ).map((s) => ({ id: s.id, name: s.name, rollNumber: s.rollNumber, department: s.department }))

      const localDocs = [
        { id: "doc-1", filename: "University_Academic_Curriculum_2026.pdf", type: "Syllabus", status: "Processed" },
        { id: "doc-2", filename: "Hostel_Rules_and_Disciplinary_Code.pdf", type: "Student Handbook", status: "Processed" },
        { id: "doc-3", filename: "Campus_Placement_Eligibilities_2026_27.pdf", type: "Placement", status: "Processed" },
      ].filter((d) => d.filename.toLowerCase().includes(q) || d.type.toLowerCase().includes(q))

      setResults({
        conversations: localConvs,
        students: localStudents,
        documents: localDocs,
      })
      setLoading(false)
    }, 250)

    return () => clearTimeout(timer)
  }, [query, allConversations])

  const totalResultsCount =
    results.conversations.length + results.students.length + results.documents.length

  const showConversations =
    (activeFilter === "all" || activeFilter === "chats") && results.conversations.length > 0
  const showStudents =
    (activeFilter === "all" || activeFilter === "students") && results.students.length > 0
  const showDocuments =
    (activeFilter === "all" || activeFilter === "documents") && results.documents.length > 0

  const hasAnyResults = showConversations || showStudents || showDocuments

  return (
    <PageTransition>
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <Header title="Search" subtitle="Query across conversations, student records, and campus documents" />

        <PageContainer>
          <div className="space-y-6 max-w-3xl mx-auto">
            {/* Search Input Bar */}
            <div className="relative w-full">
              {loading ? (
                <Loader2 className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-brand animate-spin" />
              ) : (
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              )}
              <input
                type="text"
                placeholder="Search conversations, students, syllabi, handbooks..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-10 text-sm sm:text-base rounded-xl bg-bg-elevated border border-border-default text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-interactive-ring shadow-xs transition-colors"
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary rounded hover:bg-interactive-hover transition-colors"
                  aria-label="Clear search query"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                className={`px-3.5 py-1.5 rounded-full border transition-all duration-fast select-none cursor-pointer ${
                  activeFilter === "all"
                    ? "bg-brand text-brand-contrast border-brand font-medium shadow-xs"
                    : "bg-bg-elevated text-text-secondary border-border-default hover:bg-brand-surface hover:text-brand-text hover:border-brand-border"
                }`}
              >
                All Topics ({totalResultsCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("chats")}
                className={`px-3.5 py-1.5 rounded-full border transition-all duration-fast select-none cursor-pointer ${
                  activeFilter === "chats"
                    ? "bg-brand text-brand-contrast border-brand font-medium shadow-xs"
                    : "bg-bg-elevated text-text-secondary border-border-default hover:bg-brand-surface hover:text-brand-text hover:border-brand-border"
                }`}
              >
                Conversations ({results.conversations.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("students")}
                className={`px-3.5 py-1.5 rounded-full border transition-all duration-fast select-none cursor-pointer ${
                  activeFilter === "students"
                    ? "bg-brand text-brand-contrast border-brand font-medium shadow-xs"
                    : "bg-bg-elevated text-text-secondary border-border-default hover:bg-brand-surface hover:text-brand-text hover:border-brand-border"
                }`}
              >
                Students ({results.students.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("documents")}
                className={`px-3.5 py-1.5 rounded-full border transition-all duration-fast select-none cursor-pointer ${
                  activeFilter === "documents"
                    ? "bg-brand text-brand-contrast border-brand font-medium shadow-xs"
                    : "bg-bg-elevated text-text-secondary border-border-default hover:bg-brand-surface hover:text-brand-text hover:border-brand-border"
                }`}
              >
                Documents ({results.documents.length})
              </button>
            </div>

            {/* Results Display */}
            {query.trim() === "" ? (
              <div className="text-center py-20 text-text-muted space-y-3 select-none">
                <div className="w-12 h-12 rounded-2xl bg-brand-surface border border-brand-border flex items-center justify-center mx-auto text-brand-text">
                  <Search className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-text-primary">Instant Unified Institutional Search</p>
                <p className="text-xs text-text-secondary max-w-sm mx-auto">
                  Type keywords above to search across active conversations, course handbooks, and verified student directory records.
                </p>
              </div>
            ) : !hasAnyResults && !loading ? (
              <div className="text-center py-16 text-text-muted space-y-2 select-none">
                <p className="text-sm text-text-primary font-medium">No results found for &quot;{query}&quot;</p>
                <p className="text-xs text-text-secondary">Try searching by student name, roll number, course, or topic.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Matching Conversations */}
                {showConversations && (
                  <div className="space-y-2.5">
                    <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider px-1">
                      Conversations ({results.conversations.length})
                    </h3>
                    <div className="space-y-2">
                      {results.conversations.map((c, i) => (
                        <FadeIn key={c.id} delay={i * 30}>
                          <Link
                            to={ROUTES.CHAT_CONVERSATION(c.id)}
                            className="p-3.5 rounded-xl border border-border-default bg-bg-elevated hover:border-brand-border hover:bg-brand-surface/30 hover:-translate-y-[1px] active:translate-y-0 transition-all duration-fast flex items-center justify-between group shadow-xs cursor-pointer"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="p-2.5 rounded-lg bg-brand-surface text-brand-text border border-brand-border shrink-0">
                                <MessageSquare className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs sm:text-sm font-semibold text-text-primary group-hover:text-brand-text truncate transition-colors">
                                  {c.title}
                                </div>
                                {c.lastMessagePreview && (
                                  <div className="text-[11px] text-text-muted truncate mt-0.5">
                                    {c.lastMessagePreview}
                                  </div>
                                )}
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-brand-text group-hover:translate-x-0.5 shrink-0 transition-all" />
                          </Link>
                        </FadeIn>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matching Students */}
                {showStudents && (
                  <div className="space-y-2.5">
                    <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider px-1">
                      Students ({results.students.length})
                    </h3>
                    <div className="space-y-2">
                      {results.students.map((s, i) => (
                        <FadeIn key={s.id} delay={i * 30}>
                          <Link
                            to={ROUTES.STUDENT_DETAIL(s.id)}
                            className="p-3.5 rounded-xl border border-border-default bg-bg-elevated hover:border-brand-border hover:bg-brand-surface/30 hover:-translate-y-[1px] active:translate-y-0 transition-all duration-fast flex items-center justify-between group shadow-xs cursor-pointer"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">
                                <GraduationCap className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs sm:text-sm font-semibold text-text-primary group-hover:text-brand-text truncate transition-colors">
                                  {s.name}
                                </div>
                                <div className="text-[11px] text-text-muted truncate mt-0.5 font-mono">
                                  {s.rollNumber} {s.department ? `• ${s.department}` : ""}
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline" size="sm" className="shrink-0">
                              View Profile
                            </Badge>
                          </Link>
                        </FadeIn>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matching Documents */}
                {showDocuments && (
                  <div className="space-y-2.5">
                    <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider px-1">
                      Institutional Documents ({results.documents.length})
                    </h3>
                    <div className="space-y-2">
                      {results.documents.map((d, i) => (
                        <FadeIn key={d.id} delay={i * 30}>
                          <div className="p-3.5 rounded-xl border border-border-default bg-bg-elevated flex items-center justify-between shadow-xs">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600 border border-blue-500/20 shrink-0">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs sm:text-sm font-semibold text-text-primary truncate">
                                  {d.filename}
                                </div>
                                <div className="text-[11px] text-text-muted truncate mt-0.5">
                                  {d.type} {d.status ? `• ${d.status}` : ""}
                                </div>
                              </div>
                            </div>
                            <Badge variant="success" size="sm" className="shrink-0">
                              Indexed
                            </Badge>
                          </div>
                        </FadeIn>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </PageContainer>
      </div>
    </PageTransition>
  )
}
