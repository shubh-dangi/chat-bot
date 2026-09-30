import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/shared/components/ui/Button"
import { cn } from "@/shared/utils/cn"

export interface Column<T> {
  header: string
  accessorKey?: keyof T
  cell?: (item: T) => React.ReactNode
  className?: string
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string
  onRowClick?: (item: T) => void
  emptyState?: React.ReactNode
  isLoading?: boolean
  className?: string
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyState,
  isLoading,
  className,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full border border-border-default rounded-lg p-6 space-y-3">
        <div className="h-8 bg-bg-tertiary rounded animate-pulse w-full" />
        <div className="h-10 bg-bg-tertiary rounded animate-pulse w-full" />
        <div className="h-10 bg-bg-tertiary rounded animate-pulse w-full" />
      </div>
    )
  }

  if (data.length === 0) {
    return emptyState || (
      <div className="text-center py-12 text-sm text-text-muted border border-border-default rounded-lg">
        No records found
      </div>
    )
  }

  return (
    <div className={cn("w-full overflow-x-auto border border-border-default rounded-lg bg-bg-primary", className)}>
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-border-default bg-bg-secondary text-text-secondary select-none">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={cn("px-4 py-3 font-semibold text-xs tracking-wider uppercase", col.className)}
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
                <td key={colIdx} className={cn("px-4 py-3.5 text-text-primary", col.className)}>
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
    <div className="flex items-center justify-between gap-4 py-3 text-xs text-text-secondary select-none">
      <div>
        {totalItems !== undefined ? (
          <span>Showing page {currentPage} of {totalPages} ({totalItems} items)</span>
        ) : (
          <span>Page {currentPage} of {totalPages}</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={onPrev}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-3.5 h-3.5 mr-1" />
          Previous
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onNext}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          Next
          <ChevronRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </div>
  )
}
