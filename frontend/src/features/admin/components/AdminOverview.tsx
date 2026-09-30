import { Users, MessageSquare, GraduationCap, FileText, ArrowUpRight } from "lucide-react"
import { Link } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/Card"
import { ROUTES } from "@/shared/config/routes"

export function AdminOverview() {
  const stats = [
    {
      title: "Active Students",
      value: "1,248",
      change: "+12% this semester",
      icon: <GraduationCap className="w-5 h-5 text-text-primary" />,
      to: ROUTES.ADMIN_STUDENTS,
    },
    {
      title: "Campus AI Conversations",
      value: "18,420",
      change: "4,200 queries resolved",
      icon: <MessageSquare className="w-5 h-5 text-text-primary" />,
      to: ROUTES.CHAT,
    },
    {
      title: "Faculty & Staff Accounts",
      value: "86",
      change: "All departments verified",
      icon: <Users className="w-5 h-5 text-text-primary" />,
      to: ROUTES.ADMIN_USERS,
    },
    {
      title: "Ingested Knowledge Docs",
      value: "34",
      change: "Syllabi, Handbooks, Circulars",
      icon: <FileText className="w-5 h-5 text-text-primary" />,
      to: ROUTES.ADMIN_DOCUMENTS,
    },
  ]

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-semibold text-text-primary">System Health & Analytics</h2>
        <p className="text-xs text-text-secondary mt-1">
          Real-time summary of registered student accounts, active conversations, and campus knowledge documents.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <Link key={idx} to={s.to}>
            <Card elevated className="hover:border-border-strong transition-all duration-150 h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                  {s.title}
                </CardTitle>
                <div className="p-2 rounded-lg bg-bg-secondary border border-border-subtle">
                  {s.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-text-primary tracking-tight">{s.value}</div>
                <div className="flex items-center gap-1 text-[11px] text-text-muted mt-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-status-success-text" />
                  <span>{s.change}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
