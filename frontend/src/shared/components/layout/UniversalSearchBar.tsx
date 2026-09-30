import * as React from "react"
import { useNavigate, useLocation, useSearchParams } from "react-router-dom"
import { Search, X } from "lucide-react"
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

  // The only search surface left is the conversation list, so the query lives in
  // /chat?q= and the sidebar's list filter reads it from there.
  const initialQ = location.pathname === ROUTES.CHAT ? searchParams.get("q") || "" : ""
  const [query, setQuery] = React.useState(initialQ)

  // Synchronize if URL search param changes
  React.useEffect(() => {
    if (location.pathname === ROUTES.CHAT) {
      setQuery(searchParams.get("q") || "")
    }
  }, [location.pathname, searchParams])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      navigate(`${ROUTES.CHAT}?q=${encodeURIComponent(trimmed)}`)
    } else {
      navigate(ROUTES.CHAT)
    }
  }

  const handleClear = () => {
    setQuery("")
    if (location.pathname === ROUTES.CHAT) {
      navigate(ROUTES.CHAT)
    }
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
        value={query}
        onChange={(e) => setQuery(e.target.value)}
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
        {query ? (
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
