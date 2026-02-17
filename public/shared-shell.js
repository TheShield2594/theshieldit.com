/**
 * shared-shell.js — The Shield IT
 *
 * Injects a consistent top navigation bar and footer into every static tool
 * page under /public, matching the design language of the main Next.js site.
 *
 * Usage (added automatically to all tool HTML files):
 *   <script src="/shared-shell.js" defer></script>
 */
(function () {
  "use strict";

  var SITE_URL = "/";
  var SITE_NAME = "The Shield IT";
  var NAV_HEIGHT = 48;

  var css = [
    /* ── Top bar ── */
    "#ts-topbar {",
    "  position: fixed; top: 0; left: 0; right: 0; z-index: 999999;",
    "  height: " + NAV_HEIGHT + "px;",
    "  background: rgba(6, 10, 18, 0.92);",
    "  backdrop-filter: blur(16px);",
    "  -webkit-backdrop-filter: blur(16px);",
    "  border-bottom: 1px solid rgba(255, 255, 255, 0.07);",
    "  display: flex; align-items: center; padding: 0 16px; gap: 10px;",
    "  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;",
    "  box-sizing: border-box;",
    "}",
    "#ts-topbar a { text-decoration: none; }",
    "#ts-topbar .ts-back {",
    "  display: flex; align-items: center; gap: 6px;",
    "  color: #94a3b8; font-size: 13px; font-weight: 500;",
    "  padding: 5px 10px; border-radius: 6px;",
    "  transition: background 0.15s, color 0.15s;",
    "}",
    "#ts-topbar .ts-back:hover { background: rgba(255,255,255,0.06); color: #e2e8f0; }",
    "#ts-topbar .ts-divider {",
    "  width: 1px; height: 16px; background: rgba(255,255,255,0.1);",
    "  flex-shrink: 0;",
    "}",
    "#ts-topbar .ts-brand {",
    "  display: flex; align-items: center; gap: 7px;",
    "  font-size: 14px; font-weight: 600; color: #f1f5f9;",
    "}",
    "#ts-topbar .ts-flex { flex: 1; }",
    "#ts-topbar .ts-home-link {",
    "  font-size: 12px; font-weight: 500; color: #3b82f6;",
    "  padding: 5px 12px; border-radius: 6px;",
    "  border: 1px solid rgba(59, 130, 246, 0.3);",
    "  transition: background 0.15s, border-color 0.15s;",
    "}",
    "#ts-topbar .ts-home-link:hover {",
    "  background: rgba(59, 130, 246, 0.1); border-color: rgba(59, 130, 246, 0.5);",
    "}",
    /* ── Spacer that prevents content from hiding behind the fixed bar ── */
    "#ts-spacer { height: " + NAV_HEIGHT + "px; flex-shrink: 0; }",
    /* ── Footer ── */
    "#ts-footer {",
    "  border-top: 1px solid rgba(255, 255, 255, 0.07);",
    "  background: rgba(6, 10, 18, 0.6);",
    "  padding: 14px 16px;",
    "  display: flex; flex-wrap: wrap; align-items: center;",
    "  justify-content: center; gap: 6px 12px;",
    "  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;",
    "  font-size: 12px; color: #64748b;",
    "  margin-top: 40px;",
    "}",
    "#ts-footer a { color: #3b82f6; text-decoration: none; }",
    "#ts-footer a:hover { color: #60a5fa; }",
    "#ts-footer .ts-dot { opacity: 0.4; }",
  ].join("\n");

  function shieldSVG(size) {
    return (
      '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24"' +
      ' fill="none" stroke="#3b82f6" stroke-width="2.5"' +
      ' stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' +
      '</svg>'
    );
  }

  function chevronSVG() {
    return (
      '<svg width="14" height="14" viewBox="0 0 24 24"' +
      ' fill="none" stroke="currentColor" stroke-width="2.5"' +
      ' stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="m15 18-6-6 6-6"/>' +
      '</svg>'
    );
  }

  function inject() {
    /* Inject styles */
    var styleEl = document.createElement("style");
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    /* ── Top bar ── */
    var topbar = document.createElement("div");
    topbar.id = "ts-topbar";
    topbar.setAttribute("role", "navigation");
    topbar.setAttribute("aria-label", "Site navigation");
    topbar.innerHTML =
      '<a href="' + SITE_URL + '" class="ts-back" aria-label="Back to all tools">' +
        chevronSVG() +
        '<span>All Tools</span>' +
      '</a>' +
      '<div class="ts-divider" aria-hidden="true"></div>' +
      '<div class="ts-brand">' +
        shieldSVG(15) +
        '<span>' + SITE_NAME + '</span>' +
      '</div>' +
      '<div class="ts-flex"></div>' +
      '<a href="' + SITE_URL + '" class="ts-home-link">Home</a>';

    /* ── Spacer ── */
    var spacer = document.createElement("div");
    spacer.id = "ts-spacer";
    spacer.setAttribute("aria-hidden", "true");

    /* ── Footer ── */
    var footer = document.createElement("footer");
    footer.id = "ts-footer";
    footer.setAttribute("role", "contentinfo");
    var year = new Date().getFullYear();
    footer.innerHTML =
      shieldSVG(13) +
      '<a href="' + SITE_URL + '">' + SITE_NAME + '</a>' +
      '<span class="ts-dot">&middot;</span>' +
      '<span>&copy; ' + year + '</span>' +
      '<span class="ts-dot">&middot;</span>' +
      '<span>Free, open-source privacy tools</span>' +
      '<span class="ts-dot">&middot;</span>' +
      '<a href="https://github.com/TheShield2594/theshieldit.com"' +
      ' target="_blank" rel="noopener noreferrer">GitHub</a>';

    /* Insert: topbar + spacer at start of body, footer at end */
    document.body.insertBefore(spacer, document.body.firstChild);
    document.body.insertBefore(topbar, document.body.firstChild);
    document.body.appendChild(footer);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
