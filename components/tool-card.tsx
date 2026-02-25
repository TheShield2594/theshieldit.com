"use client"

import Link from "next/link"
import {
  Mail, Lock, KeyRound, Hash, QrCode, CircleHelp, ShieldCheck, Activity,
  Shield, LockKeyhole,
  Fingerprint, FileKey, PenLine, ShieldAlert,
  Image as ImageIcon, MapPin, Link as LinkIcon, Key,
  FileSearch, KeySquare, ShieldOff, Wifi, Radar, Wrench,
  ScanSearch, Network, Clock, Star, History,
  LayoutGrid, BookOpen, BookMarked, Book, Newspaper,
  ClipboardList, Trophy, Drama, Minimize2,
} from "lucide-react"
import type { Tool, ToolIcon } from "@/lib/tools"
import { cn } from "@/lib/utils"

const ICON_MAP: Record<ToolIcon, React.ComponentType<{ className?: string }>> = {
  mail: Mail,
  lock: Lock,
  "key-round": KeyRound,
  hash: Hash,
  "qr-code": QrCode,
  "circle-help": CircleHelp,
  "shield-check": ShieldCheck,
  activity: Activity,
  shield: Shield,
  "lock-keyhole": LockKeyhole,
  fingerprint: Fingerprint,
  "file-certificate": FileKey,
  "pen-line": PenLine,
  "shield-alert": ShieldAlert,
  image: ImageIcon,
  "map-pin": MapPin,
  link: LinkIcon,
  key: Key,
  "file-search": FileSearch,
  "key-square": KeySquare,
  "shield-off": ShieldOff,
  wifi: Wifi,
  radar: Radar,
  wrench: Wrench,
  "scan-search": ScanSearch,
  "minimize-2": Minimize2,
  network: Network,
  clock: Clock,
  star: Star,
  history: History,
  "layout-grid": LayoutGrid,
  "book-open": BookOpen,
  "book-marked": BookMarked,
  book: Book,
  newspaper: Newspaper,
  "clipboard-list": ClipboardList,
  trophy: Trophy,
  drama: Drama,
}

export function ToolCard({
  tool,
  index,
  selected,
  onHover,
}: {
  tool: Tool
  index: number
  selected: boolean
  onHover: () => void
}) {
  const Icon = ICON_MAP[tool.icon] || Shield

  return (
    <Link
      href={tool.href}
      onMouseEnter={onHover}
      onFocus={onHover}
      className={cn(
        "group relative block aspect-square min-w-36 rounded-2xl border p-4 transition-all duration-300 sm:min-w-44 md:min-w-48",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "animate-fade-in-up",
        selected
          ? "border-primary/70 bg-card shadow-[0_25px_45px_-25px_hsl(var(--primary)/0.8)]"
          : "border-border/70 bg-card/70 hover:-translate-y-1 hover:border-primary/40 hover:bg-card"
      )}
      style={{ animationDelay: `${index * 45}ms` }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />

      <div className="relative flex h-full flex-col justify-between">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105",
            tool.iconColor
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {tool.tagLabel}
          </p>
          <h3 className="mt-1 text-sm font-semibold leading-tight text-foreground line-clamp-2">
            {tool.title}
          </h3>
        </div>
      </div>
    </Link>
  )
}
