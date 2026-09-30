import React from "react"
import { Button } from "@/components/ui/button"
import { BackendStatusBadge } from "@/components/BackendStatusBadge"
import {
  GraduationCap,
  Plus,
  MessageSquare,
  BookOpen,
  Calendar,
  Layers,
  Database,
} from "lucide-react"

interface SidebarProps {
  onNewChat: () => void
  currentSessionId: string
}

export const Sidebar: React.FC<SidebarProps> = ({ onNewChat }) => {
  const sampleHistory = [
    { id: "1", title: "BCA Semester 5 Syllabus & Exam Dates" },
    { id: "2", title: "Campus Hostel Application Process" },
    { id: "3", title: "Library Membership & Book Renewal" },
  ]

  return (
    <aside className="w-64 h-full flex flex-col bg-zinc-950 text-zinc-100 border-r border-zinc-800">
      {/* Brand Header */}
      <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-semibold text-sm leading-tight text-white">College AI</h1>
            <p className="text-[11px] text-zinc-400">Campus Chatbot</p>
          </div>
        </div>
      </div>

      {/* New Chat Action */}
      <div className="p-3">
        <Button
          onClick={onNewChat}
          className="w-full justify-start gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-100 font-medium text-xs h-9 shadow-sm"
        >
          <Plus className="w-4 h-4 text-blue-400" />
          <span>New Chat</span>
        </Button>
      </div>

      {/* Chat History List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        <div className="px-2 pb-1 text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
          Recent Chats
        </div>
        {sampleHistory.map((item) => (
          <button
            key={item.id}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs rounded-md text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors text-left truncate group"
          >
            <MessageSquare className="w-3.5 h-3.5 text-zinc-500 group-hover:text-blue-400 shrink-0" />
            <span className="truncate">{item.title}</span>
          </button>
        ))}

        <div className="pt-4 px-2 pb-1 text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
          Quick Portals
        </div>
        <a
          href="#academics"
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-md text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
          <span>Academics & Courses</span>
        </a>
        <a
          href="#schedule"
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-md text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors"
        >
          <Calendar className="w-3.5 h-3.5 text-zinc-500" />
          <span>Academic Calendar</span>
        </a>
        <a
          href="#database"
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-md text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors"
        >
          <Database className="w-3.5 h-3.5 text-zinc-500" />
          <span>PostgreSQL Config</span>
        </a>
      </div>

      {/* Footer Backend Status & Environment */}
      <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/80 space-y-2">
        <BackendStatusBadge />
        <div className="flex items-center justify-between text-[10px] text-zinc-500 px-1">
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3" />
            React + Vite + FastAPI
          </span>
          <span className="font-mono text-zinc-400">v0.1.0</span>
        </div>
      </div>
    </aside>
  )
}
