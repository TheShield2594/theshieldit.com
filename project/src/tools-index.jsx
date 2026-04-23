// Tools Index page — split-view with sidebar filtering + dense results area.
// Requires: SHIELD_TOOLS, SHIELD_CATEGORIES, SHIELD_COUNTS, LIVE_SLUGS from tools-data.js
//           ShieldIcon from icons.jsx
//           SiteHeader, SiteFooter, CommandPalette from components.jsx

(function () {
  const { useState, useMemo, useEffect, useRef, useCallback } = React;

  // ── Derive unique tags from tool list ────────────────────────────────
  const ALL_TAGS = (() => {
    const counts = {};
    for (const t of window.SHIELD_TOOLS) {
      counts[t.tag] = (counts[t.tag] || 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }));
  })();

  const SORT_OPTIONS = [
    { value: 'az',       label: 'A → Z' },
    { value: 'za',       label: 'Z → A' },
    { value: 'category', label: 'Category' },
    { value: 'live',     label: 'Live first' },
  ];

  // ── Category sidebar item ────────────────────────────────────────────
  function CatItem({ cat, active, onClick }) {
    const color = cat.value === 'all' ? 'var(--primary)' :
                  cat.value === 'security' ? 'var(--c-security)' :
                  cat.value === 'developer' ? 'var(--c-dev)' : 'var(--c-edu)';
    return (
      <button
        className={`ti-cat-item ${active ? 'active' : ''}`}
        onClick={onClick}
        style={active ? { '--ti-cat-color': color } : {}}
      >
        <span className="ti-cat-dot" style={{ background: color }} />
        <span className="ti-cat-name">{cat.label}</span>
        <span className="ti-cat-count">{window.SHIELD_COUNTS[cat.value]}</span>
      </button>
    );
  }

  // ── Tag chip ─────────────────────────────────────────────────────────
  function TagChip({ tag, count, active, onClick }) {
    return (
      <button className={`ti-tag-chip ${active ? 'active' : ''}`} onClick={onClick}>
        {tag}
        <span className="ti-tag-count">{count}</span>
      </button>
    );
  }

  // ── Tool card (index-specific, with live badge) ───────────────────────
  function IndexToolCard({ tool, view }) {
    const isLive = window.LIVE_SLUGS.has(tool.slug);
    const catColor = tool.category === 'developer' ? 'var(--c-dev)' :
                     tool.category === 'education'  ? 'var(--c-edu)' :
                     'var(--c-security)';
    if (view === 'list') {
      return (
        <a href={`tool.html?slug=${tool.slug}`} className={`ti-list-row cat-${tool.category}`}>
          <span className="ti-list-dot" style={{ background: catColor }} />
          <span className="ti-list-icon">
            <ShieldIcon name={window.toolIcon(tool.icon)} size={15} />
          </span>
          <span className="ti-list-title">{tool.title}</span>
          <span className="ti-list-blurb">{tool.blurb}</span>
          <span className="ti-list-tag">{tool.tag}</span>
          {isLive && <span className="ti-live-badge"><span className="ti-live-dot" />Live</span>}
          <ShieldIcon name="arrowRight" size={13} className="ti-list-arrow" />
        </a>
      );
    }
    return (
      <a href={`tool.html?slug=${tool.slug}`} className={`ti-card cat-${tool.category}`}
         style={{ '--cat-color': catColor }}>
        {isLive && (
          <span className="ti-live-badge ti-live-corner">
            <span className="ti-live-dot" />Live
          </span>
        )}
        <div className="ti-card-top">
          <div className="ti-card-icon">
            <ShieldIcon name={window.toolIcon(tool.icon)} size={18} />
          </div>
          <span className="ti-card-tag">{tool.tag}</span>
        </div>
        <div className="ti-card-body">
          <h3>{tool.title}</h3>
          <p>{tool.blurb}</p>
        </div>
        <div className="ti-card-foot">
          <span className="ti-card-cat">
            <span className="dot" />
            {tool.category}
          </span>
          <span className="ti-card-go">
            Open <ShieldIcon name="arrowRight" size={12} />
          </span>
        </div>
      </a>
    );
  }

  // ── Sidebar ───────────────────────────────────────────────────────────
  function Sidebar({ cat, setCat, activeTags, toggleTag, clearTags, liveOnly, setLiveOnly }) {
    return (
      <aside className="ti-sidebar">
        <div className="ti-sidebar-section">
          <div className="ti-sidebar-head">Categories</div>
          <div className="ti-cat-list">
            {window.SHIELD_CATEGORIES.map(c => (
              <CatItem key={c.value} cat={c} active={cat === c.value} onClick={() => setCat(c.value)} />
            ))}
          </div>
        </div>

        <div className="ti-sidebar-section">
          <div className="ti-sidebar-head">Status</div>
          <div className="ti-status-row">
            <button className={`ti-status-btn ${!liveOnly ? 'active' : ''}`} onClick={() => setLiveOnly(false)}>
              All tools
              <span className="ti-cat-count">{window.SHIELD_TOOLS.length}</span>
            </button>
            <button className={`ti-status-btn ${liveOnly ? 'active' : ''}`} onClick={() => setLiveOnly(true)}>
              <span className="ti-live-dot" /> Live only
              <span className="ti-cat-count">{window.LIVE_SLUGS.size}</span>
            </button>
          </div>
        </div>

        <div className="ti-sidebar-section">
          <div className="ti-sidebar-head">
            Tags
            {activeTags.size > 0 && (
              <button className="ti-clear-tags" onClick={clearTags}>
                Clear
              </button>
            )}
          </div>
          <div className="ti-tag-grid">
            {ALL_TAGS.map(({ tag, count }) => (
              <TagChip
                key={tag}
                tag={tag}
                count={count}
                active={activeTags.has(tag)}
                onClick={() => toggleTag(tag)}
              />
            ))}
          </div>
        </div>

        <div className="ti-sidebar-section ti-sidebar-privacy">
          <ShieldIcon name="lock" size={14} />
          <p>Every tool runs entirely in your browser. Nothing is sent to a server.</p>
        </div>
      </aside>
    );
  }

  // ── Main page ─────────────────────────────────────────────────────────
  function ToolsIndexPage() {
    const [cat, setCat] = useState('all');
    const [activeTags, setActiveTags] = useState(new Set());
    const [liveOnly, setLiveOnly] = useState(false);
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState('az');
    const [view, setView] = useState('grid');
    const [paletteOpen, setPaletteOpen] = useState(false);
    const [theme, setTheme] = useState('dark');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);

    useEffect(() => {
      const h = (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setPaletteOpen(o => !o); }
        if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
          e.preventDefault();
          searchRef.current?.focus();
        }
      };
      window.addEventListener('keydown', h);
      return () => window.removeEventListener('keydown', h);
    }, []);

    const toggleTag = useCallback((tag) => {
      setActiveTags(prev => {
        const next = new Set(prev);
        next.has(tag) ? next.delete(tag) : next.add(tag);
        return next;
      });
    }, []);

    const clearTags = useCallback(() => setActiveTags(new Set()), []);

    const filtered = useMemo(() => {
      const q = query.toLowerCase().trim();
      let list = window.SHIELD_TOOLS.filter(t => {
        if (cat !== 'all' && t.category !== cat) return false;
        if (liveOnly && !window.LIVE_SLUGS.has(t.slug)) return false;
        if (activeTags.size > 0 && !activeTags.has(t.tag)) return false;
        if (q && !t.title.toLowerCase().includes(q) && !t.blurb.toLowerCase().includes(q) && !t.tag.toLowerCase().includes(q)) return false;
        return true;
      });

      if (sort === 'az') list = [...list].sort((a, b) => a.title.localeCompare(b.title));
      if (sort === 'za') list = [...list].sort((a, b) => b.title.localeCompare(a.title));
      if (sort === 'category') list = [...list].sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title));
      if (sort === 'live') list = [...list].sort((a, b) => {
        const aL = window.LIVE_SLUGS.has(a.slug) ? 0 : 1;
        const bL = window.LIVE_SLUGS.has(b.slug) ? 0 : 1;
        return aL - bL || a.title.localeCompare(b.title);
      });

      return list;
    }, [cat, activeTags, liveOnly, query, sort]);

    const hasFilters = cat !== 'all' || activeTags.size > 0 || liveOnly || query;

    const resetAll = useCallback(() => {
      setCat('all');
      setActiveTags(new Set());
      setLiveOnly(false);
      setQuery('');
    }, []);

    return (
      <>
        <div className="app-bg"><div className="glow" /><div className="grid-layer" /></div>

        <SiteHeader onOpenPalette={() => setPaletteOpen(true)} theme={theme} setTheme={setTheme} />

        <main>
          {/* Page header */}
          <div className="ti-page-hero">
            <div className="wrap">
              <p className="eyebrow">Tool library</p>
              <h1 className="ti-page-title">
                {window.SHIELD_TOOLS.length} tools.<br />
                <span className="hero-title-accent">Zero accounts.</span>
              </h1>
              <p className="ti-page-sub">
                Every security, developer, and education tool runs entirely in your browser.
                Filter by category, tag, or search to find exactly what you need.
              </p>
              <div className="ti-page-stats">
                <div>
                  <strong>{window.SHIELD_COUNTS.security}</strong>
                  <span className="cat-security-label">Security</span>
                </div>
                <div>
                  <strong>{window.SHIELD_COUNTS.developer}</strong>
                  <span className="cat-dev-label">Developer</span>
                </div>
                <div>
                  <strong>{window.SHIELD_COUNTS.education}</strong>
                  <span className="cat-edu-label">Education</span>
                </div>
                <div>
                  <strong>{window.LIVE_SLUGS.size}</strong>
                  <span>Live now</span>
                </div>
              </div>
            </div>
          </div>

          <div className="wrap ti-wrap">
            {/* Mobile sidebar toggle */}
            <button className="ti-mobile-sidebar-btn" onClick={() => setSidebarOpen(o => !o)}>
              <ShieldIcon name="menu" size={14} />
              Filters
              {hasFilters && <span className="ti-filter-badge" />}
            </button>

            <div className={`ti-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
              <Sidebar
                cat={cat}
                setCat={v => { setCat(v); setSidebarOpen(false); }}
                activeTags={activeTags}
                toggleTag={toggleTag}
                clearTags={clearTags}
                liveOnly={liveOnly}
                setLiveOnly={setLiveOnly}
              />

              <div className="ti-main">
                {/* Sticky toolbar */}
                <div className="ti-toolbar">
                  <div className="ti-search">
                    <ShieldIcon name="search" size={14} />
                    <input
                      ref={searchRef}
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      placeholder="Search tools…"
                      aria-label="Search tools"
                    />
                    {query && (
                      <button className="ti-search-clear" onClick={() => setQuery('')}>
                        <ShieldIcon name="x" size={12} />
                      </button>
                    )}
                    <kbd>/</kbd>
                  </div>

                  <div className="ti-toolbar-right">
                    <div className="ti-count">
                      <span className="ti-count-num">{filtered.length}</span>
                      <span className="ti-count-of">/ {window.SHIELD_TOOLS.length}</span>
                    </div>

                    <select
                      className="ti-sort"
                      value={sort}
                      onChange={e => setSort(e.target.value)}
                      aria-label="Sort tools"
                    >
                      {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>

                    <div className="ti-view-toggle">
                      <button className={view === 'grid' ? 'on' : ''} onClick={() => setView('grid')} aria-label="Grid view">
                        <ShieldIcon name="layers" size={14} />
                      </button>
                      <button className={view === 'list' ? 'on' : ''} onClick={() => setView('list')} aria-label="List view">
                        <ShieldIcon name="menu" size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Active filter chips */}
                {hasFilters && (
                  <div className="ti-active-filters">
                    {cat !== 'all' && (
                      <span className="ti-filter-chip">
                        {cat}
                        <button onClick={() => setCat('all')}><ShieldIcon name="x" size={10} /></button>
                      </span>
                    )}
                    {liveOnly && (
                      <span className="ti-filter-chip live">
                        <span className="ti-live-dot" /> Live only
                        <button onClick={() => setLiveOnly(false)}><ShieldIcon name="x" size={10} /></button>
                      </span>
                    )}
                    {[...activeTags].map(tag => (
                      <span key={tag} className="ti-filter-chip">
                        {tag}
                        <button onClick={() => toggleTag(tag)}><ShieldIcon name="x" size={10} /></button>
                      </span>
                    ))}
                    {query && (
                      <span className="ti-filter-chip">
                        "{query}"
                        <button onClick={() => setQuery('')}><ShieldIcon name="x" size={10} /></button>
                      </span>
                    )}
                    <button className="ti-reset-btn" onClick={resetAll}>
                      Reset all
                    </button>
                  </div>
                )}

                {/* Results */}
                {filtered.length === 0 ? (
                  <div className="empty">
                    <ShieldIcon name="search" size={28} />
                    <h3>No tools match.</h3>
                    <p>Try adjusting your filters or search term.</p>
                    <button className="btn-ghost" onClick={resetAll}>Reset filters</button>
                  </div>
                ) : view === 'grid' ? (
                  <div className="ti-grid">
                    {filtered.map((t, i) => (
                      <IndexToolCard key={t.slug} tool={t} view="grid" />
                    ))}
                  </div>
                ) : (
                  <div className="ti-list">
                    {filtered.map(t => (
                      <IndexToolCard key={t.slug} tool={t} view="list" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <SiteFooter />
        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      </>
    );
  }

  window.ToolsIndexPage = ToolsIndexPage;
})();
