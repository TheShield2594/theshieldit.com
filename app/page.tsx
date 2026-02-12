import { BackgroundGlow } from "@/components/background-glow"
import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { ToolsGrid } from "@/components/tools-grid"
import { SiteFooter } from "@/components/site-footer"

export default function HomePage() {
  return (
    <div className="relative min-h-dvh flex flex-col">
      <BackgroundGlow />

      <SiteHeader />

      <main id="main-content" className="relative z-10 flex-1 mx-auto w-full max-w-6xl px-4 md:px-8">
        <Hero />
        <ToolsGrid />
        <div className="h-16" aria-hidden="true" />
      </main>

      <SiteFooter />
    </div>
  )
}
