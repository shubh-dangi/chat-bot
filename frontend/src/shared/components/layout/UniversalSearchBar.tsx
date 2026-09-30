import * as React from "react"
import { useNavigate, useLocation, useSearchParams } from "react-router-dom"
import { Search, X } from "lucide-react"
import { useUiStore } from "@/stores/uiStore"
import { ROUTES } from "@/shared/config/routes"
import { cn } from "@/shared/utils/cn"

export interface UniversalSearchBarProps {
  className?: string
  placeholder?: string
}

export function UniversalSearchBar({
  className,
  placeholder = "Search your chats...",
}: UniversalSearchBarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const { searchQuery, setSearchQuery } = useUiStore()

  // Synchronize if URL search param changes on load
  React.useEffect(() => {
    const qParam = searchParams.get("q")
    if (qParam !== null && qParam !== searchQuery) {
      setSearchQuery(qParam)
    }
  }, [searchParams])

  // Global Ctrl+K / Cmd+K shortcut to focus universal search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = searchQuery.trim()
    if (trimmed && !location.pathname.startsWith("/chat")) {
      navigate(`${ROUTES.CHAT}?q=${encodeURIComponent(trimmed)}`)
    }
  }

  const handleClear = () => {
    setSearchQuery("")
    inputRef.current?.focus()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "relative flex items-center w-full max-w-xs sm:max-w-sm md:max-w-md",
        className
      )}
      role="search"
    >
      <Search
        className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="search"
        value={searchQuery}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Search your chats"
        className={cn(
          "w-full h-9 pl-9 pr-14 text-xs sm:text-sm rounded-lg",
          "bg-bg-secondary/80 hover:bg-bg-secondary focus:bg-bg-elevated",
          "border border-border-default focus:border-brand focus:ring-1 focus:ring-interactive-ring",
          "text-text-primary placeholder:text-text-muted",
          "transition-colors shadow-2xs outline-none"
        )}
      />

      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {searchQuery ? (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded text-text-muted hover:text-text-primary transition-colors"
            aria-label="Clear search input"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-text-muted bg-bg-tertiary border border-border-default rounded">
            <span>⌘</span>K
          </kbd>
        )}
      </div>
    </form>
  )
}
