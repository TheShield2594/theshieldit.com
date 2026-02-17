import Link from "next/link"
import { Shield } from "lucide-react"
import { BackgroundGlow } from "@/components/background-glow"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function NotFound() {
  return (
    <div className="relative min-h-dvh flex flex-col">
      <BackgroundGlow />
      <SiteHeader />
      <main
        id="main-content"
        className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-24 text-center"
      >
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <Shield className="h-10 w-10 text-primary" />
        </div>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground">
          404 — Page Not Found
        </h1>
        <p className="mb-8 max-w-md text-lg text-muted-foreground">
          This tool or page doesn&apos;t exist. It may have moved or been retired.
        </p>
        <Link
          href="/"
          className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Browse all tools
        </Link>
      </main>
      <SiteFooter />
    </div>
  )
}
