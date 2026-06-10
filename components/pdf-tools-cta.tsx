import Link from "next/link"
import { FileText, Shield } from "lucide-react"

const TOOLS = [
  { label: "Merge PDFs", href: "/tools/pdf-merge" },
  { label: "Split Pages", href: "/tools/pdf-split" },
  { label: "Rotate Pages", href: "/tools/pdf-rotate" },
  { label: "Image to PDF", href: "/tools/image-to-pdf" },
  { label: "View Metadata", href: "/tools/pdf-metadata" },
]

export function PdfToolsCta() {
  return (
    <section aria-label="PDF Tools" className="py-10">
      <div className="mx-auto max-w-6xl border border-border/70">
        {/* Plate header */}
        <div className="flex items-center justify-between border-b border-border/70 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:px-7">
          <span>Annex — PDF toolkit</span>
          <span>{TOOLS.length} instruments</span>
        </div>

        <div className="flex flex-col gap-6 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex-1">
            <h2 className="font-display text-3xl font-bold uppercase tracking-[0.02em] text-foreground">
              PDF Toolkit
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Merge, split, rotate, convert, and inspect metadata — processed entirely in your
              browser, so your files never leave your device.
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {TOOLS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="border border-border/70 px-3 py-1.5 font-mono text-[11.5px] uppercase tracking-[0.04em] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden h-16 w-16 items-center justify-center border border-border/70 text-muted-foreground sm:flex">
            <FileText className="h-7 w-7" />
          </div>
        </div>

        <div className="flex items-center gap-2.5 border-t border-border/70 px-5 py-3.5 sm:px-7">
          <Shield className="h-3.5 w-3.5 text-primary/80" />
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
            Same privacy promise — zero server uploads
          </span>
        </div>
      </div>
    </section>
  )
}
