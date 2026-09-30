import {
  Users,
  MessageSquare,
  GraduationCap,
  FileText,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  Upload,
  UserPlus,
} from "lucide-react"
import { Link } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/Card"
import { Badge } from "@/shared/components/ui/Badge"
import { Button } from "@/shared/components/ui/Button"
import { FadeIn } from "@/shared/components/motion/FadeIn"
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
      title: "Campus AI Queries",
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

  const recentActivity = [
    {
      action: "Syllabus Indexing Completed",
      target: "CS501_Computer_Networks_2026.pdf",
      time: "12 mins ago",
      type: "doc",
      status: "success",
    },
    {
      action: "FERPA Access Requested",
      target: "Faculty Advisor Dr. M. Iyer (CS Dept)",
      time: "48 mins ago",
      type: "auth",
      status: "info",
    },
    {
      action: "New Student Record Verified",
      target: "Aarav Sharma (BCA2022-041)",
      time: "2 hours ago",
      type: "student",
      status: "success",
    },
    {
      action: "Campus Circular Updated",
      target: "Notice #EX-402 Exam Deadlines",
      time: "5 hours ago",
      type: "doc",
      status: "warning",
    },
  ]

  return (
    <div className="space-y-fluid-6 max-w-5xl animate-page-enter min-w-0">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-default">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tight text-balance">
            System Health & Analytics
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 text-pretty break-words">
            Real-time status of student records, conversational traffic, and campus vector indexing.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
          <Link to={ROUTES.ADMIN_DOCUMENTS} className="flex-1 sm:flex-none">
            <Button variant="secondary" size="sm" className="gap-1.5 shadow-xs w-full justify-center">
              <Upload className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Upload Doc</span>
            </Button>
          </Link>
          <Link to={ROUTES.ADMIN_USERS} className="flex-1 sm:flex-none">
            <Button variant="primary" size="sm" className="gap-1.5 shadow-xs w-full justify-center">
              <UserPlus className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Invite User</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s, idx) => (
          <FadeIn key={idx} delay={idx * 50}>
            <Link to={s.to} className="block h-full rounded-xl focus-visible:ring-2 focus-visible:ring-interactive-ring">
              <Card elevated interactive className="h-full">
                <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
                  <CardTitle className="text-[11px] font-semibold text-text-muted uppercase tracking-wider text-pretty min-w-0">
                    {s.title}
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-bg-secondary border border-border-subtle shrink-0">
                    {s.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-text-primary tracking-tight">{s.value}</div>
                  <div className="flex items-center gap-1 text-[11px] text-text-muted mt-1.5 min-w-0">
                    <ArrowUpRight className="w-3.5 h-3.5 text-status-success-text shrink-0" />
                    <span className="truncate">{s.change}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </FadeIn>
        ))}
      </div>

      {/* Activity Information & Institutional Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Activity List */}
        <div className="lg:col-span-2 p-4 sm:p-5 rounded-xl border border-border-default bg-bg-elevated space-y-4 shadow-xs min-w-0">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <Activity className="w-4 h-4 text-text-primary shrink-0" />
              <h3 className="text-sm font-semibold text-text-primary truncate">
                Recent Institutional Activity
              </h3>
            </div>
            <Badge variant="outline" size="sm" className="shrink-0">Real-time Stream</Badge>
          </div>

          <div className="space-y-3">
            {recentActivity.map((act, i) => (
              <div
                key={i}
                className="flex flex-wrap xs:flex-nowrap items-center justify-between gap-2 p-3 rounded-lg border border-border-subtle bg-bg-primary text-xs min-w-0"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-text-primary break-words">{act.action}</div>
                  <div className="text-text-muted font-mono text-[11px] truncate mt-0.5">{act.target}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0 w-full xs:w-auto justify-between xs:justify-end">
                  <span className="text-[11px] text-text-muted">{act.time}</span>
                  <Badge
                    variant={act.status === "success" ? "success" : act.status === "warning" ? "warning" : "info"}
                    size="sm"
                  >
                    {act.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Access Posture */}
        <div className="p-4 sm:p-5 rounded-xl border border-border-default bg-bg-elevated space-y-4 shadow-xs min-w-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-status-success-text shrink-0" />
            <h3 className="text-sm font-semibold text-text-primary truncate">Security Posture</h3>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { label: "FERPA Redaction", value: "Active", tone: "text-status-success-text" },
              { label: "Audit Logging", value: "Enabled (Level 3)", tone: "text-text-primary" },
              { label: "Vector Store", value: "Indexed (99.8%)", tone: "text-text-primary" },
              { label: "RBAC Policy", value: "Strict", tone: "text-text-primary" },
            ].map((row, i) => (
              <div
                key={i}
                className={`flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 py-1.5 ${i < 3 ? "border-b border-border-subtle" : ""}`}
              >
                <span className="text-text-secondary">{row.label}</span>
                <span className={`font-semibold ${row.tone} min-w-0 break-words`}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
