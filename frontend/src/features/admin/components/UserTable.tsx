import { useState } from "react"
import { DataTable, type Column } from "@/shared/components/data/DataTable"
import { Badge } from "@/shared/components/ui/Badge"
import { Avatar } from "@/shared/components/ui/Avatar"
import { Button } from "@/shared/components/ui/Button"
import { useToast } from "@/shared/components/feedback/ToastContainer"
import type { User } from "@/shared/types"

interface ManagedUser extends User {
  status: "Active" | "Inactive"
  lastActive: string
}

const INITIAL_USERS: ManagedUser[] = [
  {
    id: "usr-1",
    name: "Dr. Marcus Chen",
    email: "m.chen@college.edu",
    role: "faculty",
    department: "Physics",
    status: "Active",
    lastActive: "10 mins ago",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&q=80",
  },
  {
    id: "usr-2",
    name: "Prof. Elena Rostova",
    email: "e.rostova@college.edu",
    role: "faculty",
    department: "Mathematics",
    status: "Active",
    lastActive: "2 hours ago",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&q=80",
  },
  {
    id: "usr-3",
    name: "Administrator SDX",
    email: "admin@college.edu",
    role: "admin",
    department: "IT Infrastructure",
    status: "Active",
    lastActive: "Just now",
  },
  {
    id: "usr-4",
    name: "Jane Smith",
    email: "jane.smith@college.edu",
    role: "student",
    department: "Computer Science",
    status: "Active",
    lastActive: "Yesterday",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&q=80",
  },
]

export function UserTable() {
  const { success } = useToast()
  const [users, setUsers] = useState<ManagedUser[]>(INITIAL_USERS)

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const next = u.status === "Active" ? "Inactive" : "Active"
          success(`User status updated to ${next}`)
          return { ...u, status: next }
        }
        return u
      })
    )
  }

  const columns: Column<ManagedUser>[] = [
    {
      header: "User",
      cell: (u) => (
        <div className="flex items-center gap-3">
          <Avatar src={u.avatarUrl} fallback={u.name} size="sm" />
          <div>
            <div className="font-semibold text-xs text-text-primary">{u.name}</div>
            <div className="text-[11px] text-text-muted">{u.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      cell: (u) => (
        <Badge variant={u.role === "admin" ? "default" : u.role === "faculty" ? "info" : "secondary"} size="sm">
          {u.role.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: "Department",
      accessorKey: "department",
      className: "text-xs text-text-secondary",
    },
    {
      header: "Last Active",
      accessorKey: "lastActive",
      className: "text-xs text-text-muted",
    },
    {
      header: "Status",
      cell: (u) => (
        <Badge variant={u.status === "Active" ? "success" : "warning"} size="sm">
          {u.status}
        </Badge>
      ),
    },
    {
      header: "Actions",
      cell: (u) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleStatus(u.id)}
          className="text-xs h-7"
        >
          {u.status === "Active" ? "Deactivate" : "Activate"}
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-4 max-w-5xl">
      <div>
        <h2 className="text-xl font-semibold text-text-primary">Institutional Users</h2>
        <p className="text-xs text-text-secondary mt-1">
          Manage roles, departmental credentials, and active permissions.
        </p>
      </div>

      <DataTable columns={columns} data={users} keyExtractor={(u) => u.id} />
    </div>
  )
}
