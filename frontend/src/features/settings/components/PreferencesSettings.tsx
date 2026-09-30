import { useState } from "react"
import { Switch } from "@/shared/components/ui/Switch"
import { useToast } from "@/shared/components/feedback/ToastContainer"

export function PreferencesSettings() {
  const { success } = useToast()
  const [autoScroll, setAutoScroll] = useState(true)
  const [soundEffects, setSoundEffects] = useState(false)
  const [streamTyping, setStreamTyping] = useState(true)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-text-primary">Chat & Application Preferences</h3>
        <p className="text-xs text-text-secondary mt-1">
          Customize your chat experience, interaction feedbacks, and message scrolling.
        </p>
      </div>

      <div className="p-5 rounded-xl border border-border-default bg-bg-primary space-y-5">
        <Switch
          checked={autoScroll}
          onChange={(val) => {
            setAutoScroll(val)
            success(val ? "Auto-scroll enabled" : "Auto-scroll disabled")
          }}
          label="Auto-scroll to latest message"
          description="Automatically scroll to the bottom when new responses arrive."
        />

        <div className="border-t border-border-subtle" />

        <Switch
          checked={streamTyping}
          onChange={(val) => {
            setStreamTyping(val)
            success(val ? "Streaming animation active" : "Instant replies active")
          }}
          label="Simulate stream typing indicator"
          description="Render token streaming cursor when assistant responses are being formulated."
        />

        <div className="border-t border-border-subtle" />

        <Switch
          checked={soundEffects}
          onChange={(val) => {
            setSoundEffects(val)
            success(val ? "Notification sound enabled" : "Notification sound muted")
          }}
          label="Chime on message completion"
          description="Play a subtle audio tone when the assistant finishes generating an answer."
        />
      </div>
    </div>
  )
}
