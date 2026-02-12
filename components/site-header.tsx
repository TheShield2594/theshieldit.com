"use client"

import { useState } from "react"
import Link from "next/link"
import { Shield, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/theshieldit",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:brandon@theshieldit.com",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/theshieldit",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
]

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg outline-none"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-[18px] w-[18px] text-primary-foreground" />
            <div className="absolute inset-0 rounded-lg animate-pulse-ring" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            The Shield IT
          </span>
        </Link>

        {/* Desktop social links */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Social links">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              target={link.href.startsWith("mailto") ? undefined : "_blank"}
              rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
              aria-label={link.label}
            >
              {link.icon}
            </a>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-xl transition-all duration-300 md:hidden",
          mobileOpen ? "max-h-48 py-4" : "max-h-0 py-0"
        )}
        aria-hidden={!mobileOpen}
      >
        <nav className="flex items-center justify-center gap-3 px-4" aria-label="Social links">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              target={link.href.startsWith("mailto") ? undefined : "_blank"}
              rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
              aria-label={link.label}
              tabIndex={mobileOpen ? 0 : -1}
            >
              {link.icon}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
