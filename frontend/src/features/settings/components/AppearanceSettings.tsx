import { Sun, Moon, Laptop, Check } from "lucide-react"
import { useTheme } from "@/shared/hooks/useTheme"
import { cn } from "@/shared/utils/cn"
import type { ThemeMode } from "@/shared/types"

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme()

  const options: { id: ThemeMode; label: string; description: string; icon: React.ReactNode }[] = [
    {
      id: "light",
      label: "Light",
      description: "Clean, high-contrast light theme with neutral-0 surfaces.",
      icon: <Sun className="w-5 h-5 text-amber-500" />,
    },
    {
      id: "dark",
      label: "Dark",
      description: "Restrained, eye-friendly neutral-950 surfaces for long sessions.",
      icon: <Moon className="w-5 h-5 text-blue-400" />,
    },
    {
      id: "system",
      label: "System",
      description: "Automatically matches your operating system appearance preference.",
      icon: <Laptop className="w-5 h-5 text-text-secondary" />,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-text-primary">Theme Appearance</h3>
        <p className="text-xs text-text-secondary mt-1">
          Select your preferred interface color scheme. Changes apply instantly across all pages.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map((opt) => {
          const isSelected = theme === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTheme(opt.id)}
              className={cn(
                "p-4 rounded-xl border text-left flex flex-col justify-between transition-colors duration-150 relative select-none cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-ring",
                isSelected
                  ? "border-brand bg-brand-surface/40 shadow-sm ring-1 ring-brand"
                  : "border-border-default bg-bg-elevated hover:border-brand-border hover:bg-brand-surface/20"
              )}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-brand text-brand-contrast flex items-center justify-center shadow-xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
              <div className="mb-3">{opt.icon}</div>
              <div>
                <div className="text-sm font-semibold text-text-primary mb-1">{opt.label}</div>
                <div className="text-[11px] text-text-secondary leading-normal text-pretty break-words">{opt.description}</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
