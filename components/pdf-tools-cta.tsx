import { FileText, ArrowRight, Shield, Lock } from "lucide-react"

const HIGHLIGHTS = [
  "Merge & Split",
  "Encrypt & Sign",
  "Convert & Compress",
  "OCR & Redact",
]

export function PdfToolsCta() {
  return (
    <section aria-label="PDF Tools" className="py-10">
      <div className="mx-auto max-w-5xl">
        <a
          href="https://pdf.theshieldit.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block overflow-hidden rounded-2xl border border-border/70 bg-card/70 p-6 sm:p-8 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_-6px_hsl(var(--primary)/0.15)]"
        >
          {/* Subtle gradient accent */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-300 group-hover:opacity-60"
            style={{
              background:
                "radial-gradient(ellipse 50% 80% at 90% 50%, hsl(var(--primary) / 0.08) 0%, transparent 100%)",
            }}
          />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Left content */}
            <div className="flex-1">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
                <Lock className="h-3 w-3" />
                Privacy First
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                PDF Toolkit
              </h2>

              <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
                100+ PDF tools running entirely in your browser. Merge, split, encrypt, sign, convert, compress, redact, and more — your files never leave your device.
              </p>

              {/* Feature pills */}
              <div className="mt-4 flex flex-wrap gap-2">
                {HIGHLIGHTS.map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-border/70 bg-secondary/50 px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right icon + arrow */}
            <div className="flex items-center gap-4 self-start sm:self-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
                <FileText className="h-7 w-7" />
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="relative mt-5 flex items-center gap-2 border-t border-border/50 pt-4">
            <Shield className="h-3.5 w-3.5 text-primary/70" />
            <span className="text-xs text-muted-foreground">
              Powered by <span className="font-semibold text-foreground">The Shield IT</span> — same privacy promise, zero server uploads
            </span>
          </div>
        </a>
      </div>
    </section>
  )
}
