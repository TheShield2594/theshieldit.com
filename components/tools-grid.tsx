"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Search, X, SlidersHorizontal, ArrowRight } from "lucide-react"
import { TOOLS, CATEGORIES, CATEGORY_COUNTS } from "@/lib/tools"
import { ToolCard } from "@/components/tool-card"
import { cn } from "@/lib/utils"
import { useSearchShortcut } from "@/hooks/useSearchShortcut"

export function ToolsGrid() {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeToolHref, setActiveToolHref] = useState(TOOLS[0]?.href ?? "")
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return TOOLS.filter((tool) => {
      const matchSearch =
        !q ||
        tool.title.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.tags.toLowerCase().includes(q)
      const matchCat =
        activeCategory === "all" || tool.category === activeCategory
      return matchSearch && matchCat
    })
  }, [query, activeCategory])

  useEffect(() => {
    if (filtered.length === 0) {
      setActiveToolHref("")
      return
    }

    setActiveToolHref((current) => {
      const exists = filtered.some((tool) => tool.href === current)
      return exists ? current : filtered[0].href
    })
  }, [filtered])

  useSearchShortcut(inputRef)

  const activeTool = filtered.find((tool) => tool.href === activeToolHref) ?? filtered[0]
  const hasFilters = query.length > 0 || activeCategory !== "all"

  function clearAll() {
    setQuery("")
    setActiveCategory("all")
    inputRef.current?.focus()
  }

  return (
    <section id="tools" aria-label="Tools directory" className="pb-8">
      <div className="mx-auto max-w-5xl">
        <p className="animate-fade-in text-center text-xs uppercase tracking-[0.24em] text-muted-foreground/80">
          Tool Console
        </p>

        <div
          className="animate-fade-in-up mt-5 flex flex-wrap items-center justify-center gap-2"
          role="group"
          aria-label="Filter by category"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.value
            const count = CATEGORY_COUNTS[cat.value]

            return (
              <button
                type="button"
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                aria-pressed={isActive}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-all duration-200",
                  isActive
                    ? "border-primary/70 bg-primary/15 text-primary"
                    : "border-border/70 bg-card/40 text-muted-foreground hover:border-primary/35 hover:text-foreground"
                )}
              >
                {cat.label}
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none",
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        <div className="animate-fade-in-up mt-5 mx-auto max-w-xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your tool library..."
              aria-label="Search tools"
              className={cn(
                "w-full rounded-full border border-border/70 bg-card/70 py-3 pl-11 pr-20 text-sm text-foreground placeholder:text-muted-foreground",
                "outline-none transition-all duration-200",
                "focus:border-primary/50 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
              )}
            />
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("")
                    inputRef.current?.focus()
                  }}
                  className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <kbd className="hidden items-center gap-0.5 rounded-md border border-border bg-secondary px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground sm:inline-flex">
                /
              </kbd>
            </div>
          </div>
        </div>

        {filtered.length > 0 ? (
          <>
            <div className="mt-8 overflow-x-auto pb-2">
              <div className="flex min-w-full gap-3 sm:gap-4">
                {filtered.map((tool, i) => (
                  <ToolCard
                    key={tool.href}
                    tool={tool}
                    index={i}
                    selected={activeTool?.href === tool.href}
                    onHover={() => setActiveToolHref(tool.href)}
                  />
                ))}
              </div>
            </div>

            {activeTool && (
              <div className="animate-fade-in-up mt-7 rounded-2xl border border-border/70 bg-card/70 p-5 sm:p-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-primary/80">Now Selected</p>
                    <h3 className="mt-2 text-2xl font-semibold text-foreground">{activeTool.title}</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      {activeTool.description}
                    </p>
                  </div>

                  <a
                    href={activeTool.href}
                    className="inline-flex items-center gap-2 self-start rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Launch
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            )}

            <p className="mt-4 text-center text-xs text-muted-foreground" aria-live="polite">
              Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {TOOLS.length} tools
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="ml-2 inline-flex items-center gap-1 text-primary transition-colors hover:text-accent"
                >
                  <X className="h-3 w-3" />
                  Clear filters
                </button>
              )}
            </p>
          </>
        ) : (
          <div className="mt-12 flex flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
              <SlidersHorizontal className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold text-foreground">No tools found</p>
            <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
              Try a different search term or clear your filters to reload your tool carousel.
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
