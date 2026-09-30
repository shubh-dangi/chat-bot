import { useState, useEffect, useCallback } from "react"
import { Header } from "@/shared/components/layout/Header"
import { PageContainer } from "@/shared/components/layout/PageContainer"
import { StudentSearchBar } from "@/features/student/components/StudentSearchBar"
import { StudentFilters } from "@/features/student/components/StudentFilters"
import { StudentTable } from "@/features/student/components/StudentTable"
import { DataTablePagination } from "@/shared/components/data/DataTable"
import { usePagination } from "@/shared/hooks/usePagination"
import { studentService } from "@/features/student/services/studentService"
import type { Student } from "@/features/student/types/student.types"

export default function StudentSearchPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState("")
  const [department, setDepartment] = useState("all")
  const [year, setYear] = useState("all")
  const [status, setStatus] = useState("all")

  const fetchStudents = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await studentService.getStudents({
        searchQuery,
        department,
        year,
        status,
      })
      setStudents(data)
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, department, year, status])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents()
    }, 200)
    return () => clearTimeout(timer)
  }, [fetchStudents])

  const {
    paginatedItems,
    currentPage,
    totalPages,
    totalItems,
    prevPage,
    nextPage,
  } = usePagination(students, 6)

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <Header
        title="Student Directory"
        subtitle="Search and verify verified institutional student records"
      />

      <PageContainer>
        <div className="space-y-5">
          {/* Search Bar & Filter Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-2">
            <StudentSearchBar value={searchQuery} onChange={setSearchQuery} />
            <StudentFilters
              department={department}
              year={year}
              status={status}
              onDepartmentChange={setDepartment}
              onYearChange={setYear}
              onStatusChange={setStatus}
            />
          </div>

          {/* Student Table / Cards */}
          <StudentTable students={paginatedItems} isLoading={isLoading} />

          {/* Pagination Controls */}
          {!isLoading && students.length > 0 && (
            <DataTablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              onPrev={prevPage}
              onNext={nextPage}
            />
          )}
        </div>
      </PageContainer>
    </div>
  )
}
