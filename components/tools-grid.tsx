"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Search, X, SlidersHorizontal, ArrowRight, Star, LayoutGrid, GalleryHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { TOOLS, CATEGORIES, CATEGORY_COUNTS } from "@/lib/tools"
import { ToolCard } from "@/components/tool-card"
import { useFavorites } from "@/hooks/useFavorites"
import { cn } from "@/lib/utils"
import { useSearchShortcut } from "@/hooks/useSearchShortcut"

type ViewMode = "carousel" | "grid"

export function ToolsGrid() {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [showFavorites, setShowFavorites] = useState(false)
  const [activeToolHref, setActiveToolHref] = useState(TOOLS[0]?.href ?? "")
  const [viewMode, setViewMode] = useState<ViewMode>("carousel")
  // Tracks whether the persisted view mode has been read from localStorage.
  // Gates carousel-only chrome to avoid a flash for stored-grid users.
  const [restored, setRestored] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { favorites, toggle: toggleFavorite } = useFavorites()

  // Restore view mode preference, then mark as restored
  useEffect(() => {
    try {
      const stored = localStorage.getItem("shield-view-mode")
      if (stored === "grid" || stored === "carousel") setViewMode(stored)
    } catch {}
    setRestored(true)
  }, [])

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
      const matchFav = !showFavorites || favorites.has(tool.href)
      return matchSearch && matchCat && matchFav
    })
  }, [query, activeCategory, showFavorites, favorites])

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

  // Scroll arrow state
  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  // Mount-only: bind scroll listener and ResizeObserver once
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener("scroll", updateScrollState, { passive: true })
    const ro = new ResizeObserver(updateScrollState)
    ro.observe(el)
    return () => {
      el.removeEventListener("scroll", updateScrollState)
      ro.disconnect()
    }
  }, [updateScrollState])

  // Re-check scroll state after filter changes (without re-binding listeners)
  useEffect(() => {
    updateScrollState()
  }, [filtered, updateScrollState])

  // Keyboard navigation (carousel only)
  useEffect(() => {
    if (viewMode === "grid") return
    function onKeyDown(e: KeyboardEvent) {
      // Only handle when focus is inside the carousel scroll container
      if (!scrollRef.current?.contains(e.target as Node)) return
      // Skip interactive elements
      const target = e.target as HTMLElement
      if (
        ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) ||
        target.contentEditable === "true"
      ) return
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return
      // Guard before preventDefault: ensure there's actually somewhere to go
      const idx = filtered.findIndex((t) => t.href === activeToolHref)
      if (idx === -1) return
      const next =
        e.key === "ArrowRight"
          ? Math.min(idx + 1, filtered.length - 1)
          : Math.max(idx - 1, 0)
      if (next === idx) return
      e.preventDefault()
      const nextHref = filtered[next].href
      setActiveToolHref(nextHref)
      requestAnimationFrame(() => {
        const el = scrollRef.current?.querySelector(`[data-tool-href="${nextHref}"]`)
        el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" })
      })
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [filtered, activeToolHref, viewMode])

  useSearchShortcut(inputRef)

  const activeTool = filtered.find((tool) => tool.href === activeToolHref) ?? filtered[0]
  const hasFilters = query.length > 0 || activeCategory !== "all" || showFavorites

  function clearAll() {
    setQuery("")
    setActiveCategory("all")
    setShowFavorites(false)
    inputRef.current?.focus()
  }

  function toggleViewMode() {
    const next: ViewMode = viewMode === "carousel" ? "grid" : "carousel"
    setViewMode(next)
    try { localStorage.setItem("shield-view-mode", next) } catch {}
  }

  function scrollCarousel(dir: -1 | 1) {
    scrollRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" })
  }

  return (
    <section id="tools" aria-label="Tools directory" className="pb-8">
      <div className="mx-auto max-w-5xl">
        <p className="animate-fade-in text-center text-xs uppercase tracking-[0.24em] text-muted-foreground/80">
          Tool Console
        </p>

        {/* Category filters + view toggle row */}
        <div className="animate-fade-in-up mt-5 flex flex-wrap items-center justify-between gap-2">
          <div
            className="flex flex-wrap items-center gap-2"
            role="group"
            aria-label="Filter by category"
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.value && !showFavorites
              const count = CATEGORY_COUNTS[cat.value]
              return (
                <button
                  type="button"
                  key={cat.value}
                  onClick={() => { setActiveCategory(cat.value); setShowFavorites(false) }}
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

            {/* Favorites filter tab */}
            <button
              type="button"
              onClick={() => setShowFavorites((v) => !v)}
              aria-pressed={showFavorites}
              className={cn(
                "flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-all duration-200",
                showFavorites
                  ? "border-amber-400/70 bg-amber-400/15 text-amber-400"
                  : "border-border/70 bg-card/40 text-muted-foreground hover:border-amber-400/35 hover:text-foreground"
              )}
            >
              <Star
                className="h-3 w-3"
                fill={showFavorites ? "currentColor" : "none"}
              />
              Favorites
              {favorites.size > 0 && (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none",
                    showFavorites
                      ? "bg-amber-400/20 text-amber-400"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  {favorites.size}
                </span>
              )}
            </button>
          </div>

          {/* View mode toggle */}
          <button
            type="button"
            onClick={toggleViewMode}
            aria-label={viewMode === "carousel" ? "Switch to grid view" : "Switch to carousel view"}
            className="flex items-center gap-1.5 rounded-full border border-border/70 bg-card/40 px-3 py-2 text-xs font-medium text-muted-foreground transition-all hover:border-primary/35 hover:text-foreground"
          >
            {viewMode === "carousel" ? (
              <>
                <LayoutGrid className="h-3.5 w-3.5" />
                Grid
              </>
            ) : (
              <>
                <GalleryHorizontal className="h-3.5 w-3.5" />
                Carousel
              </>
            )}
          </button>
        </div>

        {/* Search bar */}
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

        {filtered.length > 0 ? (
          <>
            {viewMode === "carousel" ? (
              /* Carousel view */
              <div className="relative mt-8">
                {/* Scroll arrows — gated by restored to avoid hydration flash */}
                {restored && (
                  <button
                    type="button"
                    onClick={() => scrollCarousel(-1)}
                    aria-label="Scroll left"
                    className={cn(
                      "absolute -left-4 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border/70 bg-card shadow-sm transition-all duration-200 hover:border-primary/40 hover:bg-card",
                      canScrollLeft ? "opacity-100" : "pointer-events-none opacity-0"
                    )}
                  >
                    <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
                {restored && (
                  <button
                    type="button"
                    onClick={() => scrollCarousel(1)}
                    aria-label="Scroll right"
                    className={cn(
                      "absolute -right-4 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border/70 bg-card shadow-sm transition-all duration-200 hover:border-primary/40 hover:bg-card",
                      canScrollRight ? "opacity-100" : "pointer-events-none opacity-0"
                    )}
                  >
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}

                <div
                  ref={scrollRef}
                  className="overflow-x-auto pb-2 scrollbar-hide"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  <div className="flex min-w-full gap-3 sm:gap-4">
                    {filtered.map((tool, i) => (
                      <ToolCard
                        key={tool.href}
                        tool={tool}
                        index={i}
                        selected={activeTool?.href === tool.href}
                        onHover={() => setActiveToolHref(tool.href)}
                        isFavorited={favorites.has(tool.href)}
                        onFavorite={() => toggleFavorite(tool.href)}
                      />
                    ))}
                  </div>
                </div>

                {/* Keyboard nav hint — gated by restored */}
                {restored && (
                  <p className="mt-2 text-center text-[10px] text-muted-foreground/50">
                    <kbd className="rounded border border-border/50 bg-secondary px-1 py-0.5 font-mono">←</kbd>
                    {" "}
                    <kbd className="rounded border border-border/50 bg-secondary px-1 py-0.5 font-mono">→</kbd>
                    {" "}to navigate
                  </p>
                )}
              </div>
            ) : (
              /* Grid view */
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {filtered.map((tool, i) => (
                  <ToolCard
                    key={tool.href}
                    tool={tool}
                    index={i}
                    selected={false}
                    onHover={() => {}}
                    isFavorited={favorites.has(tool.href)}
                    onFavorite={() => toggleFavorite(tool.href)}
                  />
                ))}
              </div>
            )}

            {/* Selected tool preview — carousel only, gated by restored */}
            {restored && viewMode === "carousel" && activeTool && (
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
              {showFavorites && favorites.size === 0
                ? "Star any tool to add it to your favorites."
                : "Try a different search term or clear your filters to reload your tool carousel."}
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
