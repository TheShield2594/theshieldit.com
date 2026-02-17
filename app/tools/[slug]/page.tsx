import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { TOOLS } from "@/lib/tools"
import { SiteHeader } from "@/components/site-header"

/** Strip the "/tools/" prefix to get the bare slug. */
function slugToHtmlPath(slug: string): string {
  return `/${slug}.html`
}

function hrefToSlug(href: string): string {
  return href.replace(/^\/tools\//, "")
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
  const tool = TOOLS.find((t) => hrefToSlug(t.href) === slug)
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
  const tool = TOOLS.find((t) => hrefToSlug(t.href) === slug)
  if (!tool) notFound()

  return (
    /*
     * The outer wrapper is exactly 100dvh tall with no overflow.
     * SiteHeader is sticky at the top; the iframe fills the rest.
     * The tool scrolls internally — no double scrollbars.
     */
    <div className="flex h-dvh flex-col overflow-hidden">
      <SiteHeader />
      <iframe
        src={slugToHtmlPath(slug)}
        title={tool.title}
        aria-label={tool.description}
        /*
         * #060a12 matches the background color used by all HTML tool pages,
         * preventing a white flash before the iframe's own CSS loads.
         */
        className="flex-1 w-full border-0 bg-[#060a12]"
      />
    </div>
  )
}
