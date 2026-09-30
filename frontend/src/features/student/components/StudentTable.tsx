import { useNavigate } from "react-router-dom"
import { Avatar } from "@/shared/components/ui/Avatar"
import { Badge } from "@/shared/components/ui/Badge"
import { DataTable, type Column } from "@/shared/components/data/DataTable"
import { ROUTES } from "@/shared/config/routes"
import type { Student } from "../types/student.types"

function statusVariant(s: Student) {
  return s.enrollmentStatus === "Active"
    ? "success"
    : s.enrollmentStatus === "Graduated"
    ? "info"
    : "warning"
}

export function StudentTable({
  students,
  isLoading,
}: {
  students: Student[]
  isLoading?: boolean
}) {
  const navigate = useNavigate()

  const columns: Column<Student>[] = [
    {
      header: "Student",
      cell: (s) => (
        <div className="flex items-center gap-3 min-w-0">
          <Avatar src={s.avatarUrl} fallback={s.name} size="sm" />
          <div className="min-w-0">
            <div className="font-semibold text-text-primary text-xs sm:text-sm truncate">{s.name}</div>
            <div className="text-[11px] text-text-muted truncate break-all">{s.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Roll Number",
      accessorKey: "rollNumber",
      className: "font-mono text-xs text-text-secondary whitespace-nowrap",
    },
    {
      header: "Department / Course",
      cell: (s) => (
        <div className="text-xs min-w-0">
          <div className="font-medium text-text-primary truncate">{s.department}</div>
          <div className="text-[11px] text-text-muted truncate">{s.course}</div>
        </div>
      ),
      hideBelow: "lg",
    },
    {
      header: "Year",
      accessorKey: "year",
      className: "text-xs text-text-secondary whitespace-nowrap",
      hideBelow: "xl",
    },
    {
      header: "Status",
      cell: (s) => (
        <Badge variant={statusVariant(s)} size="sm">
          {s.enrollmentStatus}
        </Badge>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={students}
      keyExtractor={(s) => s.id}
      isLoading={isLoading}
      onRowClick={(s) => navigate(ROUTES.STUDENT_DETAIL(s.id))}
      caption="Student directory records"
      emptyState={
        <div className="text-center py-12 px-4 text-xs text-text-muted border border-border-default rounded-lg">
          No students found matching your filters.
        </div>
      }
      renderCard={(s) => (
        <button
          type="button"
          onClick={() => navigate(ROUTES.STUDENT_DETAIL(s.id))}
          className="w-full min-w-0 text-left p-4 rounded-lg border border-border-default bg-bg-primary hover:bg-interactive-hover active:bg-interactive-active transition-colors space-y-2.5 shadow-xs"
        >
          <div className="flex items-start justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar src={s.avatarUrl} fallback={s.name} size="sm" />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-text-primary truncate">{s.name}</div>
                <div className="text-[11px] font-mono text-text-muted truncate break-all">
                  {s.rollNumber}
                </div>
              </div>
            </div>
            <Badge variant={statusVariant(s)} size="sm" className="shrink-0">
              {s.enrollmentStatus}
            </Badge>
          </div>
          <div className="text-xs text-text-secondary flex flex-wrap justify-between gap-x-2 gap-y-1 pt-2 border-t border-border-subtle">
            <span className="truncate min-w-0">{s.department}</span>
            <span className="shrink-0">
              {s.year} • Sem {s.semester}
            </span>
          </div>
        </button>
      )}
    />
  )
}
