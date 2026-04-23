import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { TOOLS } from "@/lib/tools"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ToolClientContent } from "./client"

function hrefToSlug(href: string): string {
  return href.replace(/^\/tools\//, "")
}

function findToolBySlug(slug: string) {
  return TOOLS.find((t) => hrefToSlug(t.href) === slug)
}

export function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: hrefToSlug(tool.href) }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const tool = findToolBySlug(slug)
  if (!tool) return {}
  return {
    title: `${tool.title} — The Shield IT`,
    description: tool.description,
    openGraph: {
      title: `${tool.title} — The Shield IT`,
      description: tool.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.title} — The Shield IT`,
      description: tool.description,
    },
  }
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tool = findToolBySlug(slug)
  if (!tool) notFound()

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />

      {/* Per-tool breadcrumb + title bar */}
      <div className="border-b border-border/50 bg-card/30 px-4 py-5 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/"
            className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            All Tools
          </Link>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">
            {tool.title}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {tool.description}
          </p>
        </div>
      </div>

      <main className="flex flex-1 flex-col">
        <ToolClientContent slug={slug} />
      </main>

      <SiteFooter />
    </div>
  )
}
