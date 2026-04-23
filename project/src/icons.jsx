// Inline SVG icon set — shield-tuned, 1.6 stroke, 24px viewbox.
// Exported as window.ShieldIcon({ name, size, className, style })

(function () {
  const STROKE = 1.75;
  const paths = {
    shield:     <path d="M12 2l8 3.5v6.2c0 4.7-3.2 9.1-8 10.3-4.8-1.2-8-5.6-8-10.3V5.5L12 2z"/>,
    "shield-check": <><path d="M12 2l8 3.5v6.2c0 4.7-3.2 9.1-8 10.3-4.8-1.2-8-5.6-8-10.3V5.5L12 2z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></>,
    "shield-off": <><path d="M19.7 14.3a10 10 0 0 0 .3-2.6V5.5L12 2 6.4 4.4M4 5.5v6.2c0 4.7 3.2 9.1 8 10.3 2-.5 3.8-1.6 5.2-3.2M3 3l18 18"/></>,
    lock:       <><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 1 1 8 0v4"/></>,
    "lock-closed": <><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 1 1 8 0v4"/></>,
    key:        <><circle cx="8" cy="15" r="3.5"/><path d="M11 13l9-9M17 7l2 2M15 9l2 2"/></>,
    "key-square": <><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="15" r="2"/><path d="M11 13l5-5M14 6l2 2"/></>,
    hash:       <><path d="M5 9h14M5 15h14M10 4l-2 16M16 4l-2 16"/></>,
    mail:       <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></>,
    fingerprint: <><path d="M6 11a6 6 0 0 1 12 0v2M8 13v1a4 4 0 0 0 8 0v-3"/><path d="M12 7v7M6 17c1 1.5 3 2.5 6 2.5s5-1 6-2.5"/></>,
    search:     <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    "file-search": <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><circle cx="11.5" cy="14.5" r="2.5"/><path d="m15 18-1.5-1.5"/></>,
    activity:   <path d="M3 12h4l3-8 4 16 3-8h4"/>,
    alert:      <><path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/></>,
    image:      <><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="m3 17 5-5 5 5 3-3 5 5"/></>,
    link:       <><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></>,
    qr:         <><rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><path d="M14 14h2v2M18 14v2M14 18h2M20 20h-2v-2"/></>,
    scan:       <><path d="M4 7V5a1 1 0 0 1 1-1h2M20 7V5a1 1 0 0 0-1-1h-2M4 17v2a1 1 0 0 0 1 1h2M20 17v2a1 1 0 0 1-1 1h-2"/><circle cx="12" cy="12" r="3"/><path d="m17 17-2-2"/></>,
    wrench:     <path d="M15 4a4 4 0 0 0-3 6.8L4 19l2 2 8-8a4 4 0 1 0 1-9zM16 8h.01"/>,
    wifi:       <><path d="M5 12.5a10 10 0 0 1 14 0M8 15.5a6 6 0 0 1 8 0"/><circle cx="12" cy="19" r="1"/></>,
    radar:      <><circle cx="12" cy="12" r="9"/><path d="M12 12 19 5"/><circle cx="12" cy="12" r="3.5"/></>,
    pen:        <><path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="m13 6 3 3"/></>,
    columns:    <><rect x="3" y="4" width="7" height="16" rx="1.5"/><rect x="14" y="4" width="7" height="16" rx="1.5"/></>,
    certificate:<><rect x="3" y="3" width="18" height="14" rx="2"/><circle cx="12" cy="10" r="2.5"/><path d="M10 17l-1 4 3-2 3 2-1-4"/></>,
    minimize:   <path d="M4 14h6v6M20 10h-6V4M14 10l6-6M10 14l-6 6"/>,
    help:       <><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 4.9.7c0 2-2.4 2-2.4 3.8M12 17h.01"/></>,
    book:       <path d="M4 4h10a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4V4zM4 16a4 4 0 0 1 4-4h10"/>,
    "book-marked": <><path d="M4 4h10a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4V4z"/><path d="M10 4v7l2.5-1.5L15 11V4"/></>,
    star:       <path d="m12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.4-5.8-3-5.8 3 1.1-6.4L2.6 9.8l6.5-.9z"/>,
    clock:      <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    clipboard:  <><rect x="6" y="5" width="12" height="16" rx="2"/><path d="M9 5V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1"/><path d="M9 11h6M9 15h4"/></>,
    trophy:     <><path d="M8 4h8v5a4 4 0 0 1-8 0zM6 5H3v2a3 3 0 0 0 3 3M18 5h3v2a3 3 0 0 1-3 3M10 13h4l-1 4h-2z"/><path d="M8 21h8"/></>,
    theater:    <><circle cx="9" cy="11" r="6"/><circle cx="16" cy="13" r="5"/><path d="M7 11h.01M11 11h.01M7 13c.5.8 1.3 1.3 2 1.3"/></>,
    network:    <><circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M12 7.5v4M12 11.5l-5 5M12 11.5l5 5"/></>,
    "shield-alert": <><path d="M12 2l8 3.5v6.2c0 4.7-3.2 9.1-8 10.3-4.8-1.2-8-5.6-8-10.3V5.5L12 2z"/><path d="M12 8v5M12 16v.5"/></>,
    news:       <><rect x="3" y="4" width="14" height="16" rx="1.5"/><path d="M17 8h4v10a2 2 0 0 1-2 2H7"/><path d="M6 8h7M6 12h7M6 16h4"/></>,
    map:        <><path d="M12 21s-7-7.5-7-12a7 7 0 0 1 14 0c0 4.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></>,
    command:    <path d="M8 5a3 3 0 1 0 0 6h8a3 3 0 1 0 0-6M8 13a3 3 0 1 0 0 6h8a3 3 0 1 0 0-6M8 5v14M16 5v14"/>,
    arrowRight: <path d="M4 12h15M13 6l6 6-6 6"/>,
    arrowUpRight: <path d="M7 17 17 7M9 7h8v8"/>,
    arrowDown:  <path d="M12 4v15M6 13l6 6 6-6"/>,
    terminal:   <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3M13 15h5"/></>,
    play:       <path d="M7 5v14l12-7z"/>,
    x:          <path d="M6 6l12 12M18 6 6 18"/>,
    check:      <path d="m5 12 5 5 9-11"/>,
    copy:       <><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></>,
    sparkles:   <path d="M12 3v4M12 17v4M4.2 7l2.8 2.8M17 14.2l2.8 2.8M3 12h4M17 12h4M4.2 17l2.8-2.8M17 9.8l2.8-2.8"/>,
    zap:        <path d="M13 2 4 14h7l-1 8 9-12h-7z"/>,
    globe:      <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 4 6 4 9s-1 6-4 9M12 3c-3 3-4 6-4 9s1 6 4 9"/></>,
    users:      <><circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.5c2.5.5 5.5 2 5.5 5.5"/></>,
    bolt:       <path d="M13 2 4 14h7l-1 8 9-12h-7z"/>,
    code:       <path d="m9 8-5 4 5 4M15 8l5 4-5 4M13 5l-2 14"/>,
    menu:       <path d="M4 7h16M4 12h16M4 17h16"/>,
    chevronRight: <path d="m9 6 6 6-6 6"/>,
    chevronDown: <path d="m6 9 6 6 6-6"/>,
    plus:       <path d="M12 5v14M5 12h14"/>,
    heart:      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>,
    eye:        <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></>,
    "sun":      <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/></>,
    moon:       <path d="M20 14a8 8 0 0 1-10.5-10.5A9 9 0 1 0 20 14z"/>,
    palette:    <><path d="M12 3a9 9 0 0 0 0 18c1.7 0 2-1.5 2-3s1-2.5 3-2.5h1.5a3.5 3.5 0 0 0 3.5-3.5A9 9 0 0 0 12 3z"/><circle cx="7.5" cy="10.5" r="1"/><circle cx="12" cy="7" r="1"/><circle cx="16.5" cy="10.5" r="1"/></>,
    rocket:     <path d="M14 4c4 0 6 2 6 6l-7 7-3-3 7-7M4 20l4-4M9 15l-5 5v-5zM4 15l-2 2M10 10 6 6"/>,
    layers:     <><path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5M3 18l9 5 9-5"/></>,
  };

  function ShieldIcon({ name, size = 20, className = "", style = {}, strokeWidth }) {
    const p = paths[name] || paths.shield;
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth ?? STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={style}
        aria-hidden="true"
      >
        {p}
      </svg>
    );
  }

  // Map tool icon keys -> icon names (fallback to shield)
  const TOOL_ICON_MAP = {
    fingerprint: "fingerprint", columns: "columns", certificate: "certificate",
    activity: "activity", wrench: "wrench", pen: "pen", alert: "shield-alert",
    mail: "mail", image: "image", star: "star", hash: "hash", map: "map",
    key: "key", "key-square": "key-square", link: "link", lock: "lock",
    "lock-closed": "lock-closed", minimize: "minimize", shield: "shield",
    help: "help", book: "book", "book-marked": "book-marked", search: "search",
    "shield-check": "shield-check", qr: "qr", news: "news", clipboard: "clipboard",
    trophy: "trophy", theater: "theater", network: "network", clock: "clock",
    "shield-off": "shield-off", wifi: "wifi", radar: "radar", scan: "scan",
  };
  window.toolIcon = (key) => TOOL_ICON_MAP[key] || "shield";

  window.ShieldIcon = ShieldIcon;
})();
