import {
  Mail,
  Search,
  Lock,
  Globe,
  KeyRound,
  FileDiff,
  Hash,
  Code,
  Braces,
  Regex,
  QrCode,
  CircleHelp,
  ShieldCheck,
  Activity,
  Shield,
  LockKeyhole,
  ArrowUpRight,
} from "lucide-react"
import type { Tool } from "@/lib/tools"
import { cn } from "@/lib/utils"

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  mail: Mail,
  search: Search,
  lock: Lock,
  globe: Globe,
  "key-round": KeyRound,
  "file-diff": FileDiff,
  hash: Hash,
  code: Code,
  braces: Braces,
  regex: Regex,
  "qr-code": QrCode,
  "circle-help": CircleHelp,
  "shield-check": ShieldCheck,
  activity: Activity,
  shield: Shield,
  "lock-keyhole": LockKeyhole,
}

export function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  const Icon = ICON_MAP[tool.icon] || Shield

  return (
    <a
      href={tool.href}
      className={cn(
        "group relative flex flex-col gap-3 rounded-xl border border-border bg-card/50 p-5 backdrop-blur-sm transition-all duration-300",
        "hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100 rounded-t-xl" />
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            tool.iconColor
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
      <h3 className="text-[15px] font-semibold text-foreground leading-snug">
        {tool.title}
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {tool.description}
      </p>
      <span className="mt-auto inline-block self-start rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
        {tool.tagLabel}
      </span>
    </a>
  )
}
