import { AdminOverview } from "@/features/admin/components/AdminOverview"
import { PageTransition } from "@/shared/components/motion/PageTransition"

export default function AdminDashboardPage() {
  return (
    <PageTransition>
      <AdminOverview />
    </PageTransition>
  )
}
