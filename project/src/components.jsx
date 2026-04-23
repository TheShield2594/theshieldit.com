// Homepage components — header, hero, tools grid, command palette, PDF CTA, footer.
// Uses ShieldIcon, SHIELD_TOOLS, SHIELD_CATEGORIES.

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ── Header ───────────────────────────────────────────────────────────
function SiteHeader({ onOpenPalette, theme, setTheme }) {
  return (
    <header className="s-header">
      <div className="s-header-inner">
        <a href="#" className="s-brand" aria-label="The Shield IT">
          <div className="s-brand-mark">
            <ShieldIcon name="shield" size={18} strokeWidth={2} />
          </div>
          <div className="s-brand-text">
            <span className="s-brand-name">The Shield IT</span>
            <span className="s-brand-sub">v2.0 · Tool Workshop</span>
          </div>
        </a>

        <nav className="s-nav" aria-label="Primary">
          <a href="#tools">Tools</a>
          <a href="#pdf">PDF Kit</a>
          <a href="#about">About</a>
          <a href="#blog">Blog</a>
        </nav>

        <div className="s-header-actions">
          <button className="s-kbd-btn" onClick={onOpenPalette} aria-label="Open command palette">
            <ShieldIcon name="search" size={14} />
            <span>Jump to tool…</span>
            <kbd>⌘K</kbd>
          </button>
          <button className="s-icon-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
            <ShieldIcon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
          </button>
          <a className="s-icon-btn" href="https://github.com/TheShield2594/theshieldit.com" aria-label="GitHub">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.7.08-.7 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.4-1.27.74-1.56-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.19 1.18a11 11 0 0 1 5.81 0c2.22-1.49 3.19-1.18 3.19-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>
          </a>
        </div>
      </div>
    </header>
  );
}

// ── Hero (v2 — workshop style) ───────────────────────────────────────
function Hero({ variant }) {
  if (variant === 'terminal') return <HeroTerminal />;
  if (variant === 'minimal')  return <HeroMinimal />;
  return <HeroWorkshop />;
}

function HeroWorkshop() {
  const featured = window.SHIELD_TOOLS.slice(0, 4);
  return (
    <section className="hero hero-workshop">
      <div className="hero-grid">
        <div className="hero-left">
          <div className="hero-tag">
            <span className="pulse-dot" /> Open source · Privacy first · All in-browser
          </div>
          <h1 className="hero-title">
            The quiet IT toolkit<br/>
            <span className="hero-title-accent">you can actually trust.</span>
          </h1>
          <p className="hero-sub">
            46 security, developer, and education tools. Nothing leaves your browser —
            no accounts, no telemetry, no dark patterns. Built by one IT pro, used by thousands.
          </p>
          <div className="hero-cta">
            <a className="btn-primary" href="#tools">
              Browse the library <ShieldIcon name="arrowRight" size={16} />
            </a>
            <a className="btn-ghost" href="#about">
              The story <ShieldIcon name="arrowUpRight" size={14} />
            </a>
          </div>
          <dl className="hero-stats">
            <div><dt>46</dt><dd>free tools</dd></div>
            <div><dt>0</dt><dd>accounts required</dd></div>
            <div><dt>100%</dt><dd>in-browser</dd></div>
            <div><dt>MIT</dt><dd>open source</dd></div>
          </dl>
        </div>
        <div className="hero-right">
          <HeroPanel featured={featured} />
        </div>
      </div>
    </section>
  );
}

function HeroPanel({ featured }) {
  return (
    <div className="hero-panel">
      <div className="hero-panel-chrome">
        <span className="dot dot-r" /><span className="dot dot-y" /><span className="dot dot-g" />
        <span className="hero-panel-title">shieldit://workshop</span>
        <span className="hero-panel-live"><span className="live-dot" /> live</span>
      </div>
      <div className="hero-panel-body">
        <div className="panel-row panel-head">
          <span>Featured tools</span>
          <span className="muted">updated weekly</span>
        </div>
        {featured.map((t, i) => (
          <a key={t.slug} className="panel-row panel-tool" href={`tool.html?slug=${t.slug}`}>
            <span className={`panel-dot cat-${t.category}`} />
            <span className="panel-title">{t.title}</span>
            <span className="panel-tag">{t.tag}</span>
            <ShieldIcon name="arrowRight" size={14} className="panel-arrow" />
          </a>
        ))}
        <div className="panel-row panel-foot">
          <span className="muted">Press <kbd>⌘K</kbd> to search everything</span>
        </div>
      </div>
    </div>
  );
}

function HeroTerminal() {
  const lines = [
    { p: "$", t: "shieldit --list --category=security" },
    { p: ">", t: "46 tools loaded · 0 trackers · 0 external calls", cls: "muted" },
    { p: "$", t: "open password-generator" },
    { p: "✓", t: "launched in-browser · nothing sent to server", cls: "ok" },
  ];
  return (
    <section className="hero hero-terminal">
      <div className="hero-tag"><span className="pulse-dot" /> Privacy first · MIT licensed</div>
      <h1 className="hero-title">
        An IT tool workshop<br/>
        <span className="hero-title-accent">that runs in your tab.</span>
      </h1>
      <div className="terminal">
        <div className="term-chrome"><span className="dot dot-r"/><span className="dot dot-y"/><span className="dot dot-g"/><span className="term-title">~/shieldit</span></div>
        <div className="term-body">
          {lines.map((l, i) => (
            <div key={i} className={`term-line ${l.cls || ''}`}>
              <span className="term-prompt">{l.p}</span><span>{l.t}</span>
            </div>
          ))}
          <div className="term-line"><span className="term-prompt">$</span><span className="caret">_</span></div>
        </div>
      </div>
      <div className="hero-cta"><a className="btn-primary" href="#tools">Enter the library <ShieldIcon name="arrowRight" size={16} /></a></div>
    </section>
  );
}

function HeroMinimal() {
  return (
    <section className="hero hero-minimal">
      <h1 className="hero-title xl">
        Security tools<br/>
        <span className="hero-title-accent">without the surveillance.</span>
      </h1>
      <p className="hero-sub">46 tools. Zero accounts. Everything in your browser.</p>
      <div className="hero-cta"><a className="btn-primary" href="#tools">Browse library <ShieldIcon name="arrowRight" size={16} /></a></div>
    </section>
  );
}

// ── Tools Grid (new: dense, groupable, with live preview) ────────────
function ToolsSection({ onOpenPalette }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const [view, setView] = useState("grid"); // grid | list
  const [hover, setHover] = useState(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return window.SHIELD_TOOLS.filter(t => {
      const inCat = cat === "all" || t.category === cat;
      const inQ = !q || t.title.toLowerCase().includes(q) || t.blurb.toLowerCase().includes(q) || t.tag.toLowerCase().includes(q);
      return inCat && inQ;
    });
  }, [query, cat]);

  const active = filtered[hover ?? 0];

  return (
    <section id="tools" className="tools">
      <header className="section-head">
        <div>
          <p className="eyebrow">The library</p>
          <h2>Every tool, one browser tab.</h2>
          <p className="section-lead">
            Search, filter, or press <kbd>⌘K</kbd> to jump. Hover a card to preview what it does.
          </p>
        </div>
        <div className="section-meta">
          <span className="count-pill">{filtered.length} <span className="muted">of {window.SHIELD_TOOLS.length}</span></span>
        </div>
      </header>

      <div className="tools-controls">
        <div className="cat-tabs" role="tablist">
          {window.SHIELD_CATEGORIES.map(c => (
            <button key={c.value} role="tab" aria-selected={cat === c.value}
              className={`cat-tab ${cat === c.value ? 'active' : ''}`}
              onClick={() => setCat(c.value)}
              style={cat === c.value ? { '--tab-accent': c.accent } : {}}>
              {c.label}
              <span className="cat-count">{window.SHIELD_COUNTS[c.value]}</span>
            </button>
          ))}
        </div>
        <div className="tools-tools">
          <div className="search">
            <ShieldIcon name="search" size={14} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Filter tools…"
              aria-label="Filter tools"
            />
            {query && <button className="search-clear" onClick={() => setQuery("")}><ShieldIcon name="x" size={12}/></button>}
            <kbd>/</kbd>
          </div>
          <div className="view-toggle">
            <button className={view==='grid' ? 'on' : ''} onClick={() => setView('grid')} aria-label="Grid view"><ShieldIcon name="layers" size={14}/></button>
            <button className={view==='list' ? 'on' : ''} onClick={() => setView('list')} aria-label="List view"><ShieldIcon name="menu" size={14}/></button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <ShieldIcon name="search" size={24} />
          <h3>No tools match.</h3>
          <p>Try a broader term — or browse by category above.</p>
          <button className="btn-ghost" onClick={() => { setQuery(""); setCat("all"); }}>Reset</button>
        </div>
      ) : view === 'grid' ? (
        <div className="tool-grid">
          {filtered.map((t, i) => (
            <ToolCard key={t.slug} tool={t} index={i}
              onHover={() => setHover(i)}
              featured={active?.slug === t.slug} />
          ))}
        </div>
      ) : (
        <div className="tool-list">
          {filtered.map((t) => (
            <a key={t.slug} href={`tool.html?slug=${t.slug}`} className="tool-row">
              <span className={`tool-row-dot cat-${t.category}`}/>
              <span className="tool-row-icon"><ShieldIcon name={window.toolIcon(t.icon)} size={16}/></span>
              <span className="tool-row-title">{t.title}</span>
              <span className="tool-row-blurb">{t.blurb}</span>
              <span className="tool-row-tag">{t.tag}</span>
              <ShieldIcon name="arrowRight" size={14} className="tool-row-arrow"/>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

function ToolCard({ tool, index, onHover, featured }) {
  const ref = useRef(null);
  return (
    <a
      ref={ref}
      href={`tool.html?slug=${tool.slug}`}
      className={`tool-card cat-${tool.category} ${featured ? 'featured' : ''}`}
      onMouseEnter={onHover}
      onFocus={onHover}
      style={{ animationDelay: `${Math.min(index, 18) * 25}ms` }}
    >
      <div className="tool-card-top">
        <div className="tool-card-icon">
          <ShieldIcon name={window.toolIcon(tool.icon)} size={18} />
        </div>
        <span className="tool-card-tag">{tool.tag}</span>
      </div>
      <div className="tool-card-body">
        <h3>{tool.title}</h3>
        <p>{tool.blurb}</p>
      </div>
      <div className="tool-card-foot">
        <span className={`tool-card-cat cat-${tool.category}`}>
          <span className="dot" /> {tool.category}
        </span>
        <span className="tool-card-go">
          Open <ShieldIcon name="arrowRight" size={13} />
        </span>
      </div>
    </a>
  );
}

// ── PDF Kit CTA ─────────────────────────────────────────────────────
function PdfCta() {
  const items = ["Merge & Split", "Encrypt & Sign", "Convert & Compress", "OCR & Redact", "Form-fill", "Watermark"];
  return (
    <section id="pdf" className="pdf-cta">
      <div className="pdf-cta-inner">
        <div className="pdf-cta-left">
          <div className="badge-soft"><ShieldIcon name="lock" size={11}/> Privacy first</div>
          <span className="coming-soon">Coming soon</span>
          <h2>A 100-tool PDF kit.<br/>Never touches a server.</h2>
          <p>Every operation — merge, split, OCR, encrypt, redact, fill — runs locally via WebAssembly. Drop a file, get a file.</p>
          <div className="pdf-pills">
            {items.map(i => <span key={i} className="pill">{i}</span>)}
          </div>
          <a className="btn-primary" href="#">Get notified <ShieldIcon name="arrowRight" size={14}/></a>
        </div>
        <div className="pdf-cta-right">
          <PdfVisual />
        </div>
      </div>
    </section>
  );
}

function PdfVisual() {
  return (
    <div className="pdf-stack">
      {[0,1,2,3].map(i => (
        <div key={i} className={`pdf-sheet pdf-sheet-${i}`} style={{ '--i': i }}>
          <div className="pdf-sheet-head"><span className="pdf-sheet-name">document-{i+1}.pdf</span><span className="pdf-sheet-lock"><ShieldIcon name="lock" size={10}/></span></div>
          <div className="pdf-sheet-lines">
            {Array.from({ length: 7 }).map((_, j) => <div key={j} className="pdf-sheet-line" style={{ width: `${60 + Math.sin(i+j)*25}%` }}/>)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Pillars (why this site exists) ──────────────────────────────────
function Pillars() {
  const items = [
    { icon: "lock",   title: "Local-first by default", body: "Every tool runs in-browser. Your data never reaches a server — because there isn't one." },
    { icon: "zap",    title: "No account, no friction", body: "Open a URL, use the tool, close the tab. No sign-up, no funnel, no newsletter wall." },
    { icon: "code",   title: "Open source & auditable", body: "Source lives on GitHub. Fork it, read it, run it offline — the code tells the whole story." },
  ];
  return (
    <section id="about" className="pillars">
      <header className="section-head">
        <p className="eyebrow">What makes it different</p>
        <h2>Three promises, wired into every tool.</h2>
      </header>
      <div className="pillar-grid">
        {items.map(p => (
          <div key={p.title} className="pillar">
            <div className="pillar-icon"><ShieldIcon name={p.icon} size={20}/></div>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Footer ──────────────────────────────────────────────────────────
function SiteFooter() {
  return (
    <footer className="s-footer">
      <div className="s-footer-inner">
        <div className="s-footer-brand">
          <div className="s-brand-mark"><ShieldIcon name="shield" size={14} strokeWidth={2}/></div>
          <div>
            <div className="s-brand-name">The Shield IT</div>
            <div className="muted tiny">Built by Brandon · since 2024</div>
          </div>
        </div>
        <div className="s-footer-cols">
          <div>
            <h4>Tools</h4>
            <a href="#tools">Security</a><a href="#tools">Developer</a><a href="#tools">Education</a><a href="#pdf">PDF Kit</a>
          </div>
          <div>
            <h4>Resources</h4>
            <a href="#">Blog</a><a href="#">Cheat sheets</a><a href="#">Glossary</a>
          </div>
          <div>
            <h4>Connect</h4>
            <a href="https://linkedin.com/in/theshieldit">LinkedIn</a>
            <a href="mailto:brandon@theshieldit.com">Email</a>
            <a href="https://github.com/TheShield2594">GitHub</a>
          </div>
        </div>
      </div>
      <div className="s-footer-bar">
        <span>© {new Date().getFullYear()} The Shield IT · No tracking except privacy-friendly analytics.</span>
        <span className="muted">v2.0 · open source</span>
      </div>
    </footer>
  );
}

// ── Command palette ─────────────────────────────────────────────────
function CommandPalette({ open, onClose }) {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQ(""); setIdx(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  const results = useMemo(() => {
    const ql = q.toLowerCase().trim();
    const list = window.SHIELD_TOOLS.filter(t => !ql ||
      t.title.toLowerCase().includes(ql) || t.blurb.toLowerCase().includes(ql) || t.tag.toLowerCase().includes(ql));
    return list.slice(0, 8);
  }, [q]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      if (e.key === 'ArrowDown') { e.preventDefault(); setIdx(i => Math.min(i+1, results.length-1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setIdx(i => Math.max(i-1, 0)); }
      if (e.key === 'Enter' && results[idx]) { e.preventDefault(); window.location.href = `tool.html?slug=${results[idx].slug}`; }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, results, idx, onClose]);

  if (!open) return null;

  return (
    <div className="cmdk-backdrop" onClick={onClose}>
      <div className="cmdk" onClick={e => e.stopPropagation()}>
        <div className="cmdk-input">
          <ShieldIcon name="command" size={16}/>
          <input ref={inputRef} placeholder="Search tools, guides, categories…" value={q} onChange={e => { setQ(e.target.value); setIdx(0); }}/>
          <kbd>esc</kbd>
        </div>
        <div className="cmdk-results">
          {results.length === 0 && <div className="cmdk-empty">No tools found for "{q}"</div>}
          {results.map((t, i) => (
            <a key={t.slug} href={`tool.html?slug=${t.slug}`}
               className={`cmdk-row ${i === idx ? 'active' : ''}`}
               onMouseEnter={() => setIdx(i)}>
              <span className={`cmdk-icon cat-${t.category}`}><ShieldIcon name={window.toolIcon(t.icon)} size={14}/></span>
              <span className="cmdk-title">{t.title}</span>
              <span className="cmdk-tag">{t.tag}</span>
              <ShieldIcon name="arrowRight" size={12} className="cmdk-arrow"/>
            </a>
          ))}
        </div>
        <div className="cmdk-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}

// ── Tweaks panel ────────────────────────────────────────────────────
function TweaksPanel({ open, tweaks, setTweak }) {
  if (!open) return null;

  const accents = [
    { key: 'blue',    label: 'Signal blue',  hex: '#2E8BFF' },
    { key: 'teal',    label: 'Teal',         hex: '#17C3B2' },
    { key: 'amber',   label: 'Amber',        hex: '#F5A524' },
    { key: 'violet',  label: 'Violet',       hex: '#8B5CF6' },
    { key: 'lime',    label: 'Terminal lime', hex: '#9FEF00' },
    { key: 'coral',   label: 'Coral',        hex: '#FF6B6B' },
  ];

  return (
    <div className="tweaks">
      <div className="tweaks-head"><ShieldIcon name="palette" size={14}/> Tweaks</div>
      <div className="tweaks-row">
        <label>Hero style</label>
        <div className="tweaks-seg">
          {['workshop','terminal','minimal'].map(v => (
            <button key={v} className={tweaks.hero===v?'on':''} onClick={() => setTweak('hero', v)}>{v}</button>
          ))}
        </div>
      </div>
      <div className="tweaks-row">
        <label>Theme</label>
        <div className="tweaks-seg">
          {['dark','light'].map(v => (
            <button key={v} className={tweaks.theme===v?'on':''} onClick={() => setTweak('theme', v)}>{v}</button>
          ))}
        </div>
      </div>
      <div className="tweaks-row">
        <label>Accent</label>
        <div className="tweaks-swatches">
          {accents.map(a => (
            <button key={a.key} className={`swatch ${tweaks.accent===a.key?'on':''}`}
              style={{ '--sw': a.hex }} onClick={() => setTweak('accent', a.key)} title={a.label}/>
          ))}
        </div>
      </div>
      <div className="tweaks-row">
        <label>Density</label>
        <div className="tweaks-seg">
          {['cozy','dense'].map(v => (
            <button key={v} className={tweaks.density===v?'on':''} onClick={() => setTweak('density', v)}>{v}</button>
          ))}
        </div>
      </div>
      <div className="tweaks-row">
        <label>Grid bg</label>
        <div className="tweaks-seg">
          {['off','subtle','strong'].map(v => (
            <button key={v} className={tweaks.grid===v?'on':''} onClick={() => setTweak('grid', v)}>{v}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Expose
Object.assign(window, {
  SiteHeader, Hero, ToolsSection, PdfCta, Pillars, SiteFooter, CommandPalette, TweaksPanel
});
