import { StudentManagement } from "@/features/admin/components/StudentManagement"
import { PageTransition } from "@/shared/components/motion/PageTransition"

export default function AdminStudentsPage() {
  return (
    <PageTransition>
      <StudentManagement />
    </PageTransition>
  )
}
