import { Select } from "@/shared/components/ui/Select"

export interface StudentFiltersProps {
  department: string
  year: string
  status: string
  onDepartmentChange: (dept: string) => void
  onYearChange: (yr: string) => void
  onStatusChange: (st: string) => void
}

export function StudentFilters({
  department,
  year,
  status,
  onDepartmentChange,
  onYearChange,
  onStatusChange,
}: StudentFiltersProps) {
  const departments = [
    { value: "all", label: "All Departments" },
    { value: "Computer Science", label: "Computer Science" },
    { value: "Mathematics", label: "Mathematics" },
    { value: "Physics", label: "Physics" },
    { value: "Life Sciences", label: "Life Sciences" },
  ]

  const years = [
    { value: "all", label: "All Years" },
    { value: "Freshman", label: "Freshman" },
    { value: "Sophomore", label: "Sophomore" },
    { value: "Junior", label: "Junior" },
    { value: "Senior", label: "Senior" },
  ]

  const statuses = [
    { value: "all", label: "All Statuses" },
    { value: "Active", label: "Active" },
    { value: "Graduated", label: "Graduated" },
    { value: "On Leave", label: "On Leave" },
  ]

  return (
    // Full-width stacked selects on narrow screens, then equal columns from xs up.
    // Fixed widths are avoided so 320px never overflows or squeezes the labels.
    <div className="grid grid-cols-1 xs:grid-cols-3 gap-2.5 w-full lg:w-auto lg:grid-cols-3 min-w-0">
      <div className="min-w-0">
        <Select
          options={departments}
          value={department}
          onChange={(e) => onDepartmentChange(e.target.value)}
          aria-label="Filter by department"
        />
      </div>
      <div className="min-w-0">
        <Select
          options={years}
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
          aria-label="Filter by academic year"
        />
      </div>
      <div className="min-w-0">
        <Select
          options={statuses}
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Filter by status"
        />
      </div>
    </div>
  )
}
