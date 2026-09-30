import { Search, X } from "lucide-react"

export function StudentSearchBar({
  value,
  onChange,
}: {
  value: string
  onChange: (val: string) => void
}) {
  return (
    <div className="relative w-full max-w-md min-w-0">
      <Search
        className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="text"
        placeholder="Search by student name, roll number, email..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search students by name, roll number, or email"
        className="w-full min-w-0 h-11 xs:h-10 pl-10 pr-11 text-base xs:text-sm rounded-md bg-input-bg border border-input-border text-text-primary placeholder:text-input-placeholder focus:outline-none focus:border-input-border-focus focus:ring-1 focus:ring-input-border-focus transition-colors shadow-xs"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-1 top-1/2 -translate-y-1/2 p-2.5 text-text-muted hover:text-text-primary rounded-md hover:bg-interactive-hover transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Clear student search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
