"use client"

import { useState, useMemo, useRef } from "react"
import { Search, X, SlidersHorizontal } from "lucide-react"
import { TOOLS, CATEGORIES, CATEGORY_COUNTS } from "@/lib/tools"
import { ToolCard } from "@/components/tool-card"
import { cn } from "@/lib/utils"
import { useSearchShortcut } from "@/hooks/useSearchShortcut"

export function ToolsGrid() {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
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

  const hasFilters = query.length > 0 || activeCategory !== "all"

  useSearchShortcut(inputRef)

  function clearAll() {
    setQuery("")
    setActiveCategory("all")
    inputRef.current?.focus()
  }

  return (
    <section id="tools" aria-label="Tools directory">
      {/* Search bar */}
      <div className="mx-auto max-w-lg">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools..."
            aria-label="Search tools"
            className={cn(
              "w-full rounded-xl border border-border bg-card py-3 pl-11 pr-20 text-sm text-foreground placeholder:text-muted-foreground",
              "outline-none transition-all duration-200",
              "focus:border-primary/50 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
            )}
          />
          <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
            {query && (
              <button
                onClick={() => { setQuery(""); inputRef.current?.focus() }}
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

      {/* Category filters + count */}
      <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div
          className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-start"
          role="tablist"
          aria-label="Filter by category"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.value
            const count = CATEGORY_COUNTS[cat.value]

            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                role="tab"
                aria-selected={isActive}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {cat.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-border text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        <p className="text-xs text-muted-foreground" aria-live="polite">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
          of {TOOLS.length} tools
          {hasFilters && (
            <button
              onClick={clearAll}
              className="ml-2 inline-flex items-center gap-1 text-primary transition-colors hover:text-accent"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          )}
        </p>
      </div>

      {/* Grid */}
      <div className="mt-8">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((tool, i) => (
              <ToolCard key={tool.href} tool={tool} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
              <SlidersHorizontal className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold text-foreground">No tools found</p>
            <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
              Try a different search term or clear your filters to see all available tools.
            </p>
            <button
              onClick={clearAll}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
