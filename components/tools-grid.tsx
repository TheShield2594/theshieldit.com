"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { TOOLS, CATEGORIES } from "@/lib/tools"
import { ToolCard } from "@/components/tool-card"
import { cn } from "@/lib/utils"

export function ToolsGrid() {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

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

  return (
    <div>
      {/* Search */}
      <div className="mx-auto max-w-lg">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools..."
            aria-label="Search tools"
            className="w-full rounded-xl border border-border bg-card/60 py-2.5 pl-10 pr-4 text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
          />
        </div>
      </div>

      {/* Tool count */}
      <p className="mt-4 mb-5 text-center text-sm text-muted-foreground">
        <span className="font-semibold text-primary">{filtered.length}</span>{" "}
        {filtered.length === 1 ? "tool" : "tools"} available
      </p>

      {/* Category filters */}
      <div
        className="flex flex-wrap items-center justify-center gap-2 mb-8"
        role="tablist"
        aria-label="Filter by category"
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            role="tab"
            aria-selected={activeCategory === cat.value}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
              activeCategory === cat.value
                ? "border-primary/50 bg-primary/15 text-primary"
                : "border-border bg-card/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool, i) => (
            <ToolCard key={tool.href} tool={tool} index={i} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-muted-foreground">
          <p className="text-lg font-medium">No tools match your search</p>
          <p className="mt-1 text-sm">Try a different keyword or category.</p>
        </div>
      )}
    </div>
  )
}
