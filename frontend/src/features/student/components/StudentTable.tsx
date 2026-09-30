import { useNavigate } from "react-router-dom"
import { Avatar } from "@/shared/components/ui/Avatar"
import { Badge } from "@/shared/components/ui/Badge"
import { DataTable, type Column } from "@/shared/components/data/DataTable"
import { ROUTES } from "@/shared/config/routes"
import type { Student } from "../types/student.types"

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
        <div className="flex items-center gap-3">
          <Avatar src={s.avatarUrl} fallback={s.name} size="sm" />
          <div className="min-w-0">
            <div className="font-semibold text-text-primary text-xs sm:text-sm">{s.name}</div>
            <div className="text-[11px] text-text-muted truncate">{s.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Roll Number",
      accessorKey: "rollNumber",
      className: "font-mono text-xs text-text-secondary",
    },
    {
      header: "Department / Course",
      cell: (s) => (
        <div className="text-xs">
          <div className="font-medium text-text-primary">{s.department}</div>
          <div className="text-[11px] text-text-muted">{s.course}</div>
        </div>
      ),
    },
    {
      header: "Year",
      accessorKey: "year",
      className: "text-xs text-text-secondary",
    },
    {
      header: "Status",
      cell: (s) => {
        const variant =
          s.enrollmentStatus === "Active"
            ? "success"
            : s.enrollmentStatus === "Graduated"
            ? "info"
            : "warning"
        return (
          <Badge variant={variant} size="sm">
            {s.enrollmentStatus}
          </Badge>
        )
      },
    },
  ]

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden sm:block">
        <DataTable
          columns={columns}
          data={students}
          keyExtractor={(s) => s.id}
          isLoading={isLoading}
          onRowClick={(s) => navigate(ROUTES.STUDENT_DETAIL(s.id))}
          emptyState={
            <div className="text-center py-12 text-xs text-text-muted border border-border-default rounded-lg">
              No students found matching your filters.
            </div>
          }
        />
      </div>

      {/* Mobile Card List View */}
      <div className="sm:hidden space-y-3">
        {students.map((s) => (
          <div
            key={s.id}
            onClick={() => navigate(ROUTES.STUDENT_DETAIL(s.id))}
            className="p-4 rounded-lg border border-border-default bg-bg-primary hover:bg-interactive-hover transition-colors cursor-pointer space-y-2.5 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Avatar src={s.avatarUrl} fallback={s.name} size="sm" />
                <div>
                  <div className="text-xs font-semibold text-text-primary">{s.name}</div>
                  <div className="text-[11px] font-mono text-text-muted">{s.rollNumber}</div>
                </div>
              </div>
              <Badge
                variant={
                  s.enrollmentStatus === "Active"
                    ? "success"
                    : s.enrollmentStatus === "Graduated"
                    ? "info"
                    : "warning"
                }
                size="sm"
              >
                {s.enrollmentStatus}
              </Badge>
            </div>
            <div className="text-xs text-text-secondary flex justify-between pt-1 border-t border-border-subtle">
              <span>{s.department}</span>
              <span>{s.year} • Sem {s.semester}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
