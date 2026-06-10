"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Search, X, SlidersHorizontal, Star, LayoutGrid, GalleryHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
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
  const activeIndex = activeTool ? filtered.indexOf(activeTool) : -1
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
    <section id="tools" aria-label="Tools directory" className="pb-8 pt-14">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="animate-fade-in flex items-baseline justify-between border-b border-border pb-4">
          <h2 className="font-display text-3xl font-bold uppercase tracking-[0.03em] text-foreground">
            Tool Console
          </h2>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Index 01 — {String(TOOLS.length).padStart(2, "0")}
          </p>
        </div>

        {/* Category filters + search + view toggle */}
        <div className="animate-fade-in-up mt-6 flex flex-wrap items-center gap-2">
          <div
            className="flex flex-wrap items-center gap-1.5"
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
                    "border px-3.5 py-2 font-mono text-[11.5px] uppercase tracking-[0.04em] transition-colors duration-200",
                    isActive
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/70 text-muted-foreground hover:border-border hover:text-foreground"
                  )}
                >
                  {cat.label}
                  <span className={cn("ml-2", isActive ? "opacity-70" : "opacity-50")}>
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
                "flex items-center gap-1.5 border px-3.5 py-2 font-mono text-[11.5px] uppercase tracking-[0.04em] transition-colors duration-200",
                showFavorites
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/70 text-muted-foreground hover:border-border hover:text-foreground"
              )}
            >
              <Star className="h-3 w-3" fill={showFavorites ? "currentColor" : "none"} />
              Saved
              {favorites.size > 0 && (
                <span className={cn(showFavorites ? "opacity-70" : "opacity-50")}>
                  {favorites.size}
                </span>
              )}
            </button>
          </div>

          {/* Search */}
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the kit…"
              aria-label="Search tools"
              className={cn(
                "w-full border border-border/70 bg-transparent py-2 pl-10 pr-16 font-mono text-[12.5px] text-foreground placeholder:text-muted-foreground",
                "outline-none transition-colors duration-200 focus:border-primary"
              )}
            />
            <div className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
              {query && (
                <button
                  type="button"
                  onClick={() => { setQuery(""); inputRef.current?.focus() }}
                  className="flex h-6 w-6 items-center justify-center text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <kbd className="hidden border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-flex">
                /
              </kbd>
            </div>
          </div>

          {/* View mode toggle */}
          <button
            type="button"
            onClick={toggleViewMode}
            aria-label={viewMode === "carousel" ? "Switch to grid view" : "Switch to carousel view"}
            className="flex items-center gap-1.5 border border-border/70 px-3.5 py-2 font-mono text-[11.5px] uppercase tracking-[0.04em] text-muted-foreground transition-colors hover:border-border hover:text-foreground"
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
                      "absolute -left-3.5 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center border border-border bg-card transition-all duration-200 hover:border-primary",
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
                      "absolute -right-3.5 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center border border-border bg-card transition-all duration-200 hover:border-primary",
                      canScrollRight ? "opacity-100" : "pointer-events-none opacity-0"
                    )}
                  >
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}

                <div
                  ref={scrollRef}
                  className="overflow-x-auto border border-border/70 scrollbar-hide"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  <div className="flex min-w-full divide-x divide-border/70">
                    {filtered.map((tool, i) => (
                      <ToolCard
                        key={tool.href}
                        tool={tool}
                        index={i}
                        selected={activeTool?.href === tool.href}
                        onHover={() => setActiveToolHref(tool.href)}
                        isFavorited={favorites.has(tool.href)}
                        onFavorite={() => toggleFavorite(tool.href)}
                        variant="carousel"
                      />
                    ))}
                  </div>
                </div>

                {/* Selected tool readout — attached to the card rail */}
                {restored && activeTool && (
                  <div className="grid items-center gap-6 border border-t-0 border-border/70 bg-card p-5 sm:grid-cols-[1fr_auto] sm:p-7">
                    <div>
                      <p className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-primary">
                        Now selected — {String(activeIndex + 1).padStart(2, "0")} /{" "}
                        {String(filtered.length).padStart(2, "0")}
                      </p>
                      <h3 className="mt-2 font-display text-3xl font-bold uppercase tracking-[0.02em] text-foreground">
                        {activeTool.title}
                      </h3>
                      <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                        {activeTool.description}
                      </p>
                    </div>
                    <a
                      href={activeTool.href}
                      className="justify-self-start bg-primary px-7 py-3.5 font-mono text-[13px] font-medium tracking-[0.08em] text-primary-foreground transition-colors hover:bg-foreground sm:justify-self-end"
                    >
                      LAUNCH →
                    </a>
                  </div>
                )}
              </div>
            ) : (
              /* Grid view — shared hairline borders between plates */
              <div className="mt-8 grid grid-cols-2 border-l border-t border-border/70 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {filtered.map((tool, i) => (
                  <ToolCard
                    key={tool.href}
                    tool={tool}
                    index={i}
                    selected={false}
                    onHover={() => {}}
                    isFavorited={favorites.has(tool.href)}
                    onFavorite={() => toggleFavorite(tool.href)}
                    variant="grid"
                  />
                ))}
              </div>
            )}

            <p
              className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground"
              aria-live="polite"
            >
              Showing <span className="text-foreground">{filtered.length}</span> / {TOOLS.length}
              {restored && viewMode === "carousel" && (
                <span className="hidden sm:inline"> &middot; ← → to navigate</span>
              )}
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="ml-3 inline-flex items-center gap-1 uppercase text-primary transition-colors hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                  Clear filters
                </button>
              )}
            </p>
          </>
        ) : (
          <div className="mt-10 flex flex-col items-center justify-center border border-border/70 px-6 py-14 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center border border-border/70 text-muted-foreground">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
            <p className="text-lg font-semibold text-foreground">No tools found</p>
            <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
              {showFavorites && favorites.size === 0
                ? "Star any tool to add it to your saved set."
                : "Try a different search term or clear your filters."}
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-5 bg-primary px-5 py-2.5 font-mono text-[12px] tracking-[0.06em] text-primary-foreground transition-colors hover:bg-foreground"
            >
              RESET FILTERS
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
