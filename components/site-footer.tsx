import { Shield, Heart } from "lucide-react"
import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-card/30">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 md:flex-row md:justify-between md:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 rounded-md outline-none">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">The Shield IT</span>
        </Link>

        {/* Center */}
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          Built with <Heart className="h-3 w-3 text-chart-5" aria-hidden="true" /> for the privacy-conscious
        </p>

        {/* Right */}
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} &middot; No tracking except{" "}
          <a
            href="https://umami.is"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary transition-colors hover:text-accent"
          >
            privacy-friendly analytics
          </a>
        </p>
      </div>
    </footer>
  )
}
