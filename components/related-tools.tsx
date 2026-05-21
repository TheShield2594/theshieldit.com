import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { TOOLS, type Tool } from "@/lib/tools"

function getRelated(current: Tool, count = 3): Tool[] {
  const currentTags = new Set(current.tags.split(" "))
  return TOOLS
    .filter((t) => t.href !== current.href)
    .map((t) => {
      const tagOverlap = t.tags.split(" ").filter((tag) => currentTags.has(tag)).length
      const categoryBonus = t.category === current.category ? 2 : 0
      return { tool: t, score: tagOverlap + categoryBonus }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(({ tool }) => tool)
}

export function RelatedTools({ tool }: { tool: Tool }) {
  const related = getRelated(tool)
  if (related.length === 0) return null

  return (
    <section className="border-t border-border/50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Related Tools
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {related.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group flex items-start justify-between gap-2 rounded-xl border border-border/70 bg-card/50 p-4 transition-all hover:border-primary/40 hover:bg-card"
            >
              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {t.tagLabel}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">{t.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{t.description}</p>
              </div>
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary/60" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
