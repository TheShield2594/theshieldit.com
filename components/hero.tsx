import { ArrowRight } from "lucide-react"
import { TOOLS } from "@/lib/tools"

export function Hero() {
  return (
    <section className="relative py-20 text-center md:py-28">
      <div className="animate-fade-in-up mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 font-mono text-[11px] text-muted-foreground">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
        Open source · Privacy first · All in-browser
      </div>

      <h1
        className="animate-fade-in-up stagger-1 mx-auto max-w-4xl text-balance text-5xl font-extrabold tracking-tight md:text-7xl lg:text-8xl"
        style={{ letterSpacing: "-0.035em", lineHeight: 1.02 }}
      >
        Security tools
        <span
          className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text font-medium italic text-transparent"
        >
          without the surveillance.
        </span>
      </h1>

      <p className="animate-fade-in-up stagger-2 mx-auto mt-7 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
        {TOOLS.length} tools. Zero accounts. Everything in your browser.
      </p>

      <div className="animate-fade-in-up stagger-3 mt-9 flex flex-wrap items-center justify-center gap-3">
        <a
          href="/#tools"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_6px_20px_-8px_hsl(var(--primary))] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-10px_hsl(var(--primary))]"
        >
          Browse the library
          <ArrowRight className="h-4 w-4" />
        </a>
        <a
          href="https://github.com/TheShield2594/theshieldit.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-border/80 hover:text-foreground"
        >
          View on GitHub
        </a>
      </div>
    </section>
  )
}
