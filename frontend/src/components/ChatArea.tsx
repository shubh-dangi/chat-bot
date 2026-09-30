import React, { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Sparkles, BookOpen, Clock, Building, ShieldCheck } from "lucide-react"
import type { Message } from "@/types"

interface ChatAreaProps {
  messages: Message[]
  onSendMessage: (content: string) => void
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages, onSendMessage }) => {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    onSendMessage(input.trim())
    setInput("")
  }

  const promptSuggestions = [
    {
      icon: BookOpen,
      title: "Course Curriculum & Syllabus",
      desc: "Get information about BCA/B.Tech syllabus and subjects",
      prompt: "What is the syllabus structure for BCA Semester 5?",
    },
    {
      icon: Clock,
      title: "Exam Timetable & Schedule",
      desc: "Check upcoming semester examination dates",
      prompt: "When do the end-semester examinations begin?",
    },
    {
      icon: Building,
      title: "Hostel & Campus Facilities",
      desc: "Hostel allotment rules, fees, and mess timings",
      prompt: "What is the procedure for campus hostel accommodation?",
    },
    {
      icon: ShieldCheck,
      title: "Attendance & Clearance Policy",
      desc: "Minimum attendance criteria for hall ticket issuance",
      prompt: "What is the minimum attendance requirement for semester exams?",
    },
  ]

  return (
    <div className="flex-1 h-full flex flex-col bg-zinc-900 text-zinc-100">
      {/* Top Navigation Bar */}
      <header className="h-14 px-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-200">College AI Chatbot</h2>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Environment Ready (AI Model slot reserved)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-zinc-800 border border-zinc-700 text-zinc-300">
            <Sparkles className="w-3 h-3 text-amber-400" />
            FastAPI + PostgreSQL
          </span>
        </div>
      </header>

      {/* Message Feed Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6">
        {messages.length === 0 ? (
          <div className="max-w-2xl mx-auto h-full flex flex-col justify-center items-center text-center space-y-8 py-10">
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto shadow-inner">
                <Bot className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100">
                Welcome to College AI Chatbot
              </h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                Your campus companion for academic queries, admissions, exam notices, and student services.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
              {promptSuggestions.map((item, idx) => {
                const Icon = item.icon
                return (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(item.prompt)}
                    className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-800/80 hover:border-zinc-700 transition-all group flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                      <span className="text-xs font-semibold text-zinc-200">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 group-hover:text-zinc-300">
                      {item.desc}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white shadow-md rounded-br-none"
                      : "bg-zinc-800/90 text-zinc-100 border border-zinc-700/60 rounded-bl-none shadow-sm"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  <div
                    className={`mt-1.5 text-[10px] ${
                      msg.sender === "user" ? "text-blue-200" : "text-zinc-400"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Box Area */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-950/60">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about college courses, timetable, exams, fees..."
            className="w-full h-12 pl-4 pr-12 rounded-xl bg-zinc-900 border border-zinc-700/80 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white flex items-center justify-center transition-all shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[11px] text-center text-zinc-500 mt-2">
          College AI Chatbot Environment &bull; React + FastAPI + PostgreSQL &bull; AI Model will be added in next step.
        </p>
      </div>
    </div>
  )
}
