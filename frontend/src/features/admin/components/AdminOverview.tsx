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
    <div className="space-y-8 max-w-5xl animate-page-enter">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-default">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tight">
            System Health & Analytics
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Real-time status of student records, conversational traffic, and campus vector indexing.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to={ROUTES.ADMIN_DOCUMENTS}>
            <Button variant="secondary" size="sm" className="gap-1.5 shadow-xs">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Doc</span>
            </Button>
          </Link>
          <Link to={ROUTES.ADMIN_USERS}>
            <Button variant="primary" size="sm" className="gap-1.5 shadow-xs">
              <UserPlus className="w-3.5 h-3.5" />
              <span>Invite User</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <FadeIn key={idx} delay={idx * 50}>
            <Link to={s.to}>
              <Card elevated interactive className="h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-semibold text-text-muted uppercase tracking-wider">
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
          </FadeIn>
        ))}
      </div>

      {/* Activity Information & Institutional Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity List */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-border-default bg-bg-elevated space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-text-primary" />
              <h3 className="text-sm font-semibold text-text-primary">Recent Institutional Activity</h3>
            </div>
            <Badge variant="outline" size="sm">Real-time Stream</Badge>
          </div>

          <div className="space-y-3">
            {recentActivity.map((act, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg border border-border-subtle bg-bg-primary text-xs"
              >
                <div className="min-w-0 pr-2">
                  <div className="font-semibold text-text-primary">{act.action}</div>
                  <div className="text-text-muted font-mono text-[11px] truncate mt-0.5">{act.target}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
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
        <div className="p-5 rounded-xl border border-border-default bg-bg-elevated space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-status-success-text" />
            <h3 className="text-sm font-semibold text-text-primary">Security Posture</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-border-subtle">
              <span className="text-text-secondary">FERPA Redaction</span>
              <span className="font-semibold text-status-success-text">Active</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border-subtle">
              <span className="text-text-secondary">Audit Logging</span>
              <span className="font-semibold text-text-primary">Enabled (Level 3)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border-subtle">
              <span className="text-text-secondary">Vector Store</span>
              <span className="font-semibold text-text-primary">Indexed (99.8%)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-text-secondary">RBAC Policy</span>
              <span className="font-semibold text-text-primary">Strict</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
