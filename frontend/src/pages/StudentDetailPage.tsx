import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Header } from "@/shared/components/layout/Header"
import { PageContainer } from "@/shared/components/layout/PageContainer"
import { PageTransition } from "@/shared/components/motion/PageTransition"
import { StudentDetailPanel } from "@/features/student/components/StudentDetailPanel"
import { LoadingState } from "@/shared/components/feedback/LoadingState"
import { ErrorState } from "@/shared/components/feedback/ErrorState"
import { studentService } from "@/features/student/services/studentService"
import { ROUTES } from "@/shared/config/routes"
import type { Student } from "@/features/student/types/student.types"

export default function StudentDetailPage() {
  const { studentId } = useParams<{ studentId: string }>()
  const navigate = useNavigate()
  const [student, setStudent] = useState<Student | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!studentId) return
    setIsLoading(true)
    studentService
      .getStudentById(studentId)
      .then((res) => {
        setStudent(res)
        setIsLoading(false)
      })
      .catch(() => {
        setStudent(null)
        setIsLoading(false)
      })
  }, [studentId])

  return (
    <PageTransition>
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <Header
          title="Student Profile"
          subtitle={student ? `${student.name} (${student.rollNumber})` : "Student Details"}
        />

        <PageContainer>
          {isLoading ? (
            <LoadingState type="page" />
          ) : !student ? (
            <ErrorState
              title="Student Not Found"
              message="No student record matches this identifier. Please verify the roll number."
              onGoHome={() => (window.location.href = ROUTES.STUDENTS)}
            />
          ) : (
            <StudentDetailPanel student={student} />
          )}
        </PageContainer>
      </div>
    </PageTransition>
  )
}
