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
  FileText, Files, RotateCw, Scissors,
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
  "file-text": FileText,
  files: Files,
  "rotate-cw": RotateCw,
  scissors: Scissors,
}

export function ToolCard({
  tool,
  index,
  selected,
  onHover,
  isFavorited,
  onFavorite,
  variant = "carousel",
}: {
  tool: Tool
  index: number
  selected: boolean
  onHover: () => void
  isFavorited?: boolean
  onFavorite?: () => void
  variant?: "carousel" | "grid"
}) {
  const Icon = ICON_MAP[tool.icon] || Shield
  const indexLabel = String(index + 1).padStart(2, "0")

  return (
    <Link
      href={tool.href}
      data-tool-href={tool.href}
      onMouseEnter={onHover}
      onFocus={onHover}
      className={cn(
        "group relative block aspect-square p-4 transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
        variant === "carousel"
          ? "min-w-36 animate-fade-in-up sm:min-w-44 md:min-w-48"
          : "animate-fade-in border-b border-r border-border/70 bg-background",
        selected
          ? "bg-card shadow-[inset_0_0_0_1px_hsl(var(--primary))]"
          : "hover:bg-card"
      )}
      style={{ animationDelay: `${Math.min(index, 10) * 45}ms` }}
    >
      {/* Index number — yields to the favorite star on hover */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute right-3.5 top-3 font-mono text-[11px] tracking-[0.08em] transition-opacity duration-150",
          selected ? "text-primary" : "text-muted-foreground/70",
          (isFavorited || onFavorite) && "group-hover:opacity-0",
          isFavorited && "opacity-0"
        )}
      >
        {indexLabel}
      </span>

      {/* Favorites button */}
      {onFavorite && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onFavorite()
          }}
          aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
          className={cn(
            "absolute right-2 top-2 z-20 flex h-6 w-6 items-center justify-center transition-all duration-150",
            isFavorited
              ? "text-primary"
              : "text-transparent group-hover:text-muted-foreground hover:!text-primary"
          )}
        >
          <Star className="h-3.5 w-3.5" fill={isFavorited ? "currentColor" : "none"} />
        </button>
      )}

      <div className="relative flex h-full flex-col justify-between">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center border border-border/70 transition-colors duration-200",
            tool.iconColor,
            selected && "border-primary/60"
          )}
        >
          <Icon className="h-[18px] w-[18px]" />
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {tool.tagLabel}
            {tool.new && <span className="text-primary"> &middot; New</span>}
          </p>
          <h3 className="mt-1.5 text-sm font-semibold leading-tight text-foreground line-clamp-2">
            {tool.title}
          </h3>
        </div>
      </div>
    </Link>
  )
}
