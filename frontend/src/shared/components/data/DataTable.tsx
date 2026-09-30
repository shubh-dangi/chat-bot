import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/shared/components/ui/Button"
import { cn } from "@/shared/utils/cn"

export interface Column<T> {
  header: string
  accessorKey?: keyof T
  cell?: (item: T) => React.ReactNode
  className?: string
  /** Hide this column below the given breakpoint to avoid horizontal scrolling */
  hideBelow?: "sm" | "md" | "lg" | "xl"
  headerClassName?: string
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string
  onRowClick?: (item: T) => void
  emptyState?: React.ReactNode
  isLoading?: boolean
  className?: string
  /** Mobile/tablet card renderer. When omitted, columns render as a label/value list. */
  renderCard?: (item: T, index: number) => React.ReactNode
  caption?: string
}

const HIDE_CLASS: Record<NonNullable<Column<unknown>["hideBelow"]>, string> = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
  xl: "hidden xl:table-cell",
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyState,
  isLoading,
  className,
  renderCard,
  caption,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full min-w-0 border border-border-default rounded-lg p-4 sm:p-6 space-y-3">
        <div className="h-8 bg-bg-tertiary rounded animate-pulse w-full" />
        <div className="h-10 bg-bg-tertiary rounded animate-pulse w-full" />
        <div className="h-10 bg-bg-tertiary rounded animate-pulse w-full" />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      emptyState || (
        <div className="text-center py-12 px-4 text-sm text-text-muted border border-border-default rounded-lg break-words">
          No records found
        </div>
      )
    )
  }

  // Label/value fallback for narrow viewports when no card renderer is supplied
  const defaultCard = (item: T) => (
    <div
      key={keyExtractor(item)}
      onClick={() => onRowClick?.(item)}
      role={onRowClick ? "button" : undefined}
      tabIndex={onRowClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onRowClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault()
          onRowClick(item)
        }
      }}
      className={cn(
        "w-full min-w-0 text-left p-3.5 rounded-lg border border-border-default bg-bg-primary shadow-xs",
        onRowClick && "cursor-pointer hover:bg-interactive-hover active:bg-interactive-active transition-colors"
      )}
    >
      <dl className="space-y-2 min-w-0">
        {columns.map((col, i) => {
          const value = col.cell
            ? col.cell(item)
            : col.accessorKey
            ? String(item[col.accessorKey] ?? "")
            : null
          if (value === null || value === undefined || value === "") return null

          const isPrimary = i === 0
          return (
            <div
              key={i}
              className={cn(
                "flex flex-wrap items-baseline gap-x-2 gap-y-0.5 min-w-0",
                !isPrimary && "pt-2 border-t border-border-subtle"
              )}
            >
              <dt
                className={cn(
                  "text-[10px] uppercase tracking-wider text-text-muted shrink-0",
                  isPrimary && "sr-only"
                )}
              >
                {col.header}
              </dt>
              <dd
                className={cn(
                  "min-w-0 text-text-primary break-words",
                  isPrimary ? "text-sm font-semibold flex-1" : "text-xs flex-1"
                )}
              >
                {value}
              </dd>
            </div>
          )
        })}
      </dl>
    </div>
  )

  return (
    <>
      {/* Table view — md and up. Scrolling is contained inside this element only. */}
      <div
        className={cn(
          "hidden md:block w-full min-w-0 max-w-full overflow-x-auto",
          "border border-border-default rounded-lg bg-bg-primary",
          "[scrollbar-width:thin]",
          className
        )}
      >
        <table className="w-full text-left border-collapse text-sm">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            <tr className="border-b border-border-default bg-bg-secondary text-text-secondary select-none">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={cn(
                    "px-4 py-3 font-semibold text-xs tracking-wider uppercase whitespace-nowrap",
                    col.hideBelow && HIDE_CLASS[col.hideBelow],
                    col.headerClassName,
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  "transition-colors",
                  onRowClick ? "cursor-pointer hover:bg-interactive-hover" : ""
                )}
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={cn(
                      "px-4 py-3.5 text-text-primary align-top",
                      col.hideBelow && HIDE_CLASS[col.hideBelow],
                      col.className
                    )}
                  >
                    {col.cell
                      ? col.cell(item)
                      : col.accessorKey
                      ? String(item[col.accessorKey] ?? "")
                      : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card view — below md. Prevents the whole page from scrolling sideways. */}
      <div className="md:hidden w-full min-w-0 space-y-2.5">
        {data.map((item, index) =>
          renderCard ? (
            <React.Fragment key={keyExtractor(item)}>
              {renderCard(item, index)}
            </React.Fragment>
          ) : (
            defaultCard(item)
          )
        )}
      </div>
    </>
  )
}

export function DataTablePagination({
  currentPage,
  totalPages,
  onPrev,
  onNext,
  totalItems,
}: {
  currentPage: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
  totalItems?: number
}) {
  return (
    <nav
      className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-2 xs:gap-4 py-3 text-xs text-text-secondary select-none"
      aria-label="Pagination"
    >
      <div className="text-center xs:text-left min-w-0 break-words">
        {totalItems !== undefined ? (
          <span>
            Page {currentPage} of {totalPages} · {totalItems} items
          </span>
        ) : (
          <span>
            Page {currentPage} of {totalPages}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="secondary"
          size="sm"
          onClick={onPrev}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          className="flex-1 xs:flex-none justify-center"
        >
          <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
          <span>Previous</span>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onNext}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          className="flex-1 xs:flex-none justify-center"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        </Button>
      </div>
    </nav>
  )
}
