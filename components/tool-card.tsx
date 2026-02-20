"use client"

import Link from "next/link"
import {
  Mail, Lock, KeyRound, Hash, QrCode, CircleHelp, ShieldCheck, Activity,
  Shield, LockKeyhole, ArrowRight,
  Fingerprint, FileKey, PenLine, ShieldAlert,
  Image as ImageIcon, MapPin, Link as LinkIcon, Key,
  FileSearch, KeySquare, ShieldOff, Wifi, Radar, Wrench,
  ScanSearch, Network, Clock, Star, History,
  LayoutGrid, BookOpen, BookMarked, Book, Newspaper,
  ClipboardList, Trophy, Drama,
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

export function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  const Icon = ICON_MAP[tool.icon] || Shield

  return (
    <Link
      href={tool.href}
      className={cn(
        "group relative flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-all duration-300",
        "hover:border-primary/40 hover:bg-card/80 hover:shadow-[0_0_30px_-6px_hsl(var(--primary)/0.15)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "animate-fade-in-up"
      )}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Icon + tag row */}
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105",
            tool.iconColor
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <span className="rounded-md bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
          {tool.tagLabel}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-[15px] font-semibold text-foreground leading-snug group-hover:text-primary transition-colors duration-200">
        {tool.title}
      </h3>

      {/* Description */}
      <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
        {tool.description}
      </p>

      {/* CTA row */}
      <div className="mt-auto flex items-center gap-1.5 text-xs font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
        <span>Open tool</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </div>
    </Link>
  )
}
