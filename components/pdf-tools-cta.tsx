import Link from "next/link"
import { FileText, Shield, Lock } from "lucide-react"

const TOOLS = [
  { label: "Merge & Split", href: "/tools/pdf-merge" },
  { label: "Rotate Pages", href: "/tools/pdf-rotate" },
  { label: "Image to PDF", href: "/tools/image-to-pdf" },
  { label: "View Metadata", href: "/tools/pdf-metadata" },
]

export function PdfToolsCta() {
  return (
    <section aria-label="PDF Tools" className="py-10">
      <div className="mx-auto max-w-5xl">
        <div className="group relative block overflow-hidden rounded-2xl border border-border/70 bg-card/70 p-6 sm:p-8">
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
                5 PDF tools running entirely in your browser. Merge, split, rotate, convert, and inspect metadata — your files never leave your device.
              </p>

              {/* Tool links */}
              <div className="mt-4 flex flex-wrap gap-2">
                {TOOLS.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className="rounded-full border border-border/70 bg-secondary/50 px-3 py-1 text-xs font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right icon */}
            <div className="flex items-center gap-4 self-start sm:self-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <FileText className="h-7 w-7" />
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
        </div>
      </div>
    </section>
  )
}
