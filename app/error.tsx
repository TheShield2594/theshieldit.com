"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { BackgroundGlow } from "@/components/background-glow"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="relative min-h-dvh flex flex-col">
      <BackgroundGlow />
      <SiteHeader />
      <main
        id="main-content"
        className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-24 text-center"
      >
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground">
          Something went wrong
        </h1>
        <p className="mb-8 max-w-md text-lg text-muted-foreground">
          An unexpected error occurred. Please try again or return to the home page.
        </p>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-lg border border-border bg-secondary px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/80"
          >
            Go home
          </a>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
