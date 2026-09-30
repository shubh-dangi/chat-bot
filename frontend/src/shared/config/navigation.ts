import { ROUTES } from "./routes"

export interface NavItem {
  label: string
  href: string
  icon: string
  badge?: string
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: "Chat Assistant", href: ROUTES.CHAT, icon: "MessageSquare" },
  { label: "Search Knowledge", href: ROUTES.SEARCH, icon: "Search" },
]

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: ROUTES.ADMIN, icon: "LayoutDashboard" },
  { label: "Users", href: ROUTES.ADMIN_USERS, icon: "Users" },
  { label: "Students", href: ROUTES.ADMIN_STUDENTS, icon: "UserCheck" },
  { label: "Documents", href: ROUTES.ADMIN_DOCUMENTS, icon: "FileText" },
]
