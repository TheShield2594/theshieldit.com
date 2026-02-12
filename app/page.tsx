import { BackgroundGlow } from "@/components/background-glow"
import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { ToolsGrid } from "@/components/tools-grid"
import { SiteFooter } from "@/components/site-footer"

export default function HomePage() {
  return (
    <>
      <BackgroundGlow />
      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-8">
        <SiteHeader />
        <main>
          <Hero />
          <ToolsGrid />
          <div className="h-16" />
        </main>
        <SiteFooter />
      </div>
    </>
  )
}
