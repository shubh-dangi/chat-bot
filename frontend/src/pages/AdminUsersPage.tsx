import { UserTable } from "@/features/admin/components/UserTable"
import { PageTransition } from "@/shared/components/motion/PageTransition"

export default function AdminUsersPage() {
  return (
    <PageTransition>
      <UserTable />
    </PageTransition>
  )
}
