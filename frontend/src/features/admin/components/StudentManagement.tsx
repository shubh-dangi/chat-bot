import { useState } from "react"
import { MOCK_STUDENTS } from "@/features/student/services/studentService"
import { DataTable, type Column } from "@/shared/components/data/DataTable"
import { Badge } from "@/shared/components/ui/Badge"
import { Button } from "@/shared/components/ui/Button"
import { useToast } from "@/shared/components/feedback/ToastContainer"
import type { Student } from "@/features/student/types/student.types"

export function StudentManagement() {
  const { success } = useToast()
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS)

  const toggleStudentStatus = (id: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const next = s.enrollmentStatus === "Active" ? "On Leave" : "Active"
          success(`Status updated to ${next}`)
          return { ...s, enrollmentStatus: next }
        }
        return s
      })
    )
  }

  const columns: Column<Student>[] = [
    {
      header: "Roll No",
      accessorKey: "rollNumber",
      className: "font-mono text-xs text-text-primary",
    },
    {
      header: "Name",
      accessorKey: "name",
      className: "text-xs font-semibold text-text-primary",
    },
    {
      header: "Program",
      cell: (s) => (
        <span className="text-xs text-text-secondary">
          {s.course} • {s.department}
        </span>
      ),
    },
    {
      header: "Semester",
      cell: (s) => <span className="text-xs text-text-muted">Sem {s.semester}</span>,
    },
    {
      header: "Status",
      cell: (s) => (
        <Badge variant={s.enrollmentStatus === "Active" ? "success" : "warning"} size="sm">
          {s.enrollmentStatus}
        </Badge>
      ),
    },
    {
      header: "Actions",
      cell: (s) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleStudentStatus(s.id)}
          className="text-xs h-7"
        >
          {s.enrollmentStatus === "Active" ? "Place on Leave" : "Reinstate"}
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-4 max-w-5xl">
      <div>
        <h2 className="text-xl font-semibold text-text-primary">Student Enrollment Management</h2>
        <p className="text-xs text-text-secondary mt-1">
          Review academic standings, enrollment certifications, and active roster states.
        </p>
      </div>

      <DataTable columns={columns} data={students} keyExtractor={(s) => s.id} />
    </div>
  )
}
