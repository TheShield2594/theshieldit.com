import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground md:flex-row md:justify-between md:px-8">
        <Link href="/" className="outline-none transition-colors hover:text-foreground">
          The Shield IT &mdash; est. 2024
        </Link>

        <p className="text-center">
          No accounts &middot; no uploads &middot;{" "}
          <a
            href="https://umami.is"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
          >
            cookieless analytics
          </a>{" "}
          only
        </p>

        <p>
          Built by one person{" "}
          <a
            href="https://linkedin.com/in/theshieldit"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            ↗
          </a>
        </p>
      </div>
    </footer>
  )
}
