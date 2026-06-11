import Link from "next/link"
import { TOOLS } from "@/lib/tools"
import { CountUp } from "@/components/count-up"

const SPEC_ROWS = [
  { k: "Sign-up", v: "None" },
  { k: "Execution", v: "In-browser" },
  { k: "Your files", v: "Stay on device", highlight: true },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/70">
      <div aria-hidden="true" className="blueprint-grid absolute inset-0" />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-14 md:grid-cols-[1.4fr_0.9fr] md:gap-16 md:px-8 md:py-20">
        {/* Left: headline */}
        <div>
          <p className="animate-fade-in-up flex items-center gap-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            <span aria-hidden="true" className="inline-block h-px w-8 bg-primary" />
            Field kit &middot; {TOOLS.length} instruments &middot; no account required
          </p>

          <h1 className="animate-fade-in-up stagger-1 mt-6 font-display font-extrabold uppercase leading-[0.92] tracking-[0.005em] text-[clamp(3.6rem,10.5vw,6.6rem)]">
            Check it.
            <br />
            Test it.
            <br />
            <span className="text-stroke-primary">Shield it.</span>
          </h1>

          <p className="animate-fade-in-up stagger-2 mt-7 max-w-md text-base leading-relaxed text-muted-foreground md:text-[17px]">
            {TOOLS.length} free security and privacy instruments that run{" "}
            <strong className="font-medium text-foreground">entirely in your browser</strong>.
            No sign-up, no uploads — open a tool and get an answer.
          </p>

          <div className="animate-fade-in-up stagger-3 mt-9 flex flex-wrap items-center gap-3.5">
            <a
              href="#tools"
              className="bg-foreground px-6 py-3.5 font-mono text-[13px] font-medium tracking-[0.06em] text-background transition-colors hover:bg-primary"
            >
              OPEN THE CONSOLE ↓
            </a>
            <Link
              href="/tools/browser-fingerprint"
              className="border border-border px-6 py-3.5 font-mono text-[13px] tracking-[0.06em] text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              WHAT&apos;S MY FINGERPRINT?
            </Link>
          </div>
        </div>

        {/* Right: spec plate */}
        <aside
          aria-label="Site facts"
          className="reg-ticks animate-fade-in-up stagger-2 relative h-fit self-start border border-border bg-card md:mt-3"
        >
          <div className="flex items-center justify-between border-b border-border/70 px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <span>Spec sheet</span>
            <span>Rev. {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-baseline justify-between border-b border-border/70 px-5 py-4">
            <span className="font-mono text-xs uppercase tracking-[0.05em] text-muted-foreground">
              Instruments
            </span>
            <span className="font-display text-4xl font-bold leading-none text-foreground">
              <CountUp value={TOOLS.length} />
            </span>
          </div>

          {SPEC_ROWS.map((row) => (
            <div
              key={row.k}
              className="flex items-baseline justify-between border-b border-border/70 px-5 py-4 font-mono text-xs"
            >
              <span className="uppercase tracking-[0.05em] text-muted-foreground">{row.k}</span>
              <span
                className={
                  row.highlight ? "uppercase text-primary" : "uppercase text-foreground"
                }
              >
                {row.v}
              </span>
            </div>
          ))}

          <a
            href="https://github.com/TheShield2594/theshieldit.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-baseline justify-between px-5 py-4 font-mono text-xs transition-colors hover:bg-secondary/60"
          >
            <span className="uppercase tracking-[0.05em] text-muted-foreground">Source</span>
            <span className="uppercase text-foreground">Open ↗</span>
          </a>
        </aside>
      </div>
    </section>
  )
}
