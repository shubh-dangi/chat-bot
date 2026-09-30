import { Search, X } from "lucide-react"

export function StudentSearchBar({
  value,
  onChange,
}: {
  value: string
  onChange: (val: string) => void
}) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
      <input
        type="text"
        placeholder="Search by student name, roll number, email..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 pl-10 pr-8 text-sm rounded-md bg-input-bg border border-input-border text-text-primary placeholder:text-input-placeholder focus:outline-none focus:border-input-border-focus focus:ring-1 focus:ring-input-border-focus transition-colors shadow-xs"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary rounded"
          aria-label="Clear student search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
