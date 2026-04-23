// Tools data — mirrors lib/tools.ts from the repo, adapted for our prototype.
// Categories + tools list for use across homepage, tool pages, command palette.

window.SHIELD_CATEGORIES = [
  { value: "all",       label: "All tools",   accent: "var(--primary)" },
  { value: "security",  label: "Security",    accent: "var(--c-security)" },
  { value: "developer", label: "Developer",   accent: "var(--c-dev)" },
  { value: "education", label: "Education",   accent: "var(--c-edu)" },
];

window.SHIELD_TOOLS = [
  { slug: "browser-fingerprint", title: "Browser Fingerprint Test", blurb: "See how unique your browser is and what sites can derive from it.", category: "security", tag: "Privacy", icon: "fingerprint" },
  { slug: "browser-comparison", title: "Browser Privacy Comparison", blurb: "Side-by-side privacy & hardening across Firefox, Brave, Safari, Chrome.", category: "education", tag: "Comparison", icon: "columns" },
  { slug: "certificate-decoder", title: "Certificate Decoder", blurb: "Decode X.509 / PEM — validity, SANs, issuer, extensions.", category: "security", tag: "Crypto", icon: "certificate" },
  { slug: "breach-timeline", title: "Data Breach Timeline", blurb: "Interactive history of major breaches — records, type, lessons.", category: "education", tag: "Timeline", icon: "activity" },
  { slug: "dev-tools", title: "Developer Swiss Army Knife", blurb: "Base64, JSON, hashes, regex, diff — one pane.", category: "developer", tag: "Multi-tool", icon: "wrench" },
  { slug: "digital-signature-verifier", title: "Digital Signature Verifier", blurb: "RSA-PKCS1 / PSS / ECDSA — verify entirely in the browser.", category: "security", tag: "Crypto", icon: "pen" },
  { slug: "dns-leak-test", title: "DNS Leak Test", blurb: "Check whether your VPN is leaking DNS queries to your ISP.", category: "security", tag: "Privacy", icon: "alert" },
  { slug: "email-analyzer", title: "Email Header Analyzer", blurb: "Trace SPF / DKIM / DMARC and the full delivery path.", category: "security", tag: "Security", icon: "mail" },
  { slug: "exif-remover", title: "EXIF Metadata Remover", blurb: "Strip GPS, camera, timestamps from photos before sharing.", category: "security", tag: "Privacy", icon: "image" },
  { slug: "favorites", title: "Favorite Tools", blurb: "Pin tools for instant access. Saved locally, exportable.", category: "developer", tag: "Utility", icon: "star" },
  { slug: "hash-generator", title: "Hash Generator & Verifier", blurb: "MD5, SHA-1/256/512 — file integrity + checksum compare.", category: "developer", tag: "Crypto", icon: "hash" },
  { slug: "ip-lookup", title: "IP Address Lookup", blurb: "Geo, ISP, ASN, WHOIS for any IPv4 or IPv6 address.", category: "security", tag: "Analysis", icon: "map" },
  { slug: "jwt-decoder", title: "JWT Decoder & Validator", blurb: "Inspect header, payload, signature & check expiry.", category: "developer", tag: "Decoder", icon: "key" },
  { slug: "link-safety-checker", title: "Link Safety Checker", blurb: "Flag phishing, malware & typosquatting — before you click.", category: "security", tag: "Security", icon: "link" },
  { slug: "message-encryptor", title: "Message Encryptor", blurb: "AES-256 password-based encryption, client-side.", category: "security", tag: "Crypto", icon: "lock" },
  { slug: "minify-me", title: "Minify Me", blurb: "Minify CSS, JSON, SQL, XML — strip whitespace & comments.", category: "developer", tag: "Minifier", icon: "minimize" },
  { slug: "network-defense-game", title: "Network Defense Game", blurb: "Defend nodes — patch, firewall, isolate under wave attacks.", category: "education", tag: "Game", icon: "shield" },
  { slug: "password-cracking-simulator", title: "Password Cracking Simulator", blurb: "Dictionary, GPU, bcrypt — see how long a password survives.", category: "education", tag: "Simulator", icon: "key" },
  { slug: "password-generator", title: "Password Generator", blurb: "Configurable random generator — entropy shown live.", category: "security", tag: "Security", icon: "key" },
  { slug: "password-manager-comparison", title: "Password Manager Comparison", blurb: "Bitwarden, 1Password, KeePassXC, Proton, Dashlane at a glance.", category: "security", tag: "Comparison", icon: "key" },
  { slug: "password-quest", title: "Password Strength Tester", blurb: "Real-time entropy with a playful scoring model.", category: "security", tag: "Security", icon: "key" },
  { slug: "phishing-quiz", title: "Phishing Email Quiz", blurb: "20 realistic scenarios — spot the tell in each.", category: "education", tag: "Quiz", icon: "help" },
  { slug: "port-scanner", title: "Port Scanner", blurb: "Audit localhost ports — find exposed DBs & dev services.", category: "developer", tag: "Scanner", icon: "scan" },
  { slug: "guide-privacy-101", title: "Privacy 101 Guide", blurb: "Plain-English onboarding into digital privacy for beginners.", category: "education", tag: "Guide", icon: "book" },
  { slug: "privacy-rpg", title: "Privacy Guardian", blurb: "Dialogue adventure where choices level up your security skills.", category: "education", tag: "Game", icon: "shield" },
  { slug: "privacy-policy-analyzer", title: "Privacy Policy Analyzer", blurb: "Auto-flag data selling, retention & user rights in any policy.", category: "security", tag: "Analyzer", icon: "search" },
  { slug: "privacy-score", title: "Privacy Score Calculator", blurb: "Rate your habits — get personalised next-step fixes.", category: "education", tag: "Assessment", icon: "shield-check" },
  { slug: "qr-code", title: "QR Code Generator", blurb: "Text, URL, WiFi — download as PNG or SVG.", category: "developer", tag: "Generator", icon: "qr" },
  { slug: "rsa-key-generator", title: "RSA Key Pair Generator", blurb: "Generate public/private key pairs with configurable sizing.", category: "security", tag: "Crypto", icon: "key-square" },
  { slug: "glossary", title: "Security & Privacy Glossary", blurb: "60+ A–Z terms. AES, zero-knowledge, GDPR — in plain English.", category: "education", tag: "Reference", icon: "book-marked" },
  { slug: "guide-security-basics", title: "Security Basics Guide", blurb: "Fundamentals — attacks, principles, phishing, backups.", category: "education", tag: "Guide", icon: "book" },
  { slug: "blog", title: "Security Blog", blurb: "News, guides and field notes from The Shield IT.", category: "education", tag: "Blog", icon: "news" },
  { slug: "cheat-sheets", title: "Security Cheat Sheets", blurb: "Quick-reference cards for passwords, phishing, IR, backups.", category: "education", tag: "Reference", icon: "clipboard" },
  { slug: "security-trivia", title: "Security Trivia Challenge", blurb: "A fast quiz game to pressure-test what you know.", category: "education", tag: "Game", icon: "trophy" },
  { slug: "social-engineering-escape-room", title: "Social Engineering Escape Room", blurb: "8 scenarios — phishing, vishing, pretexting, baiting, tailgating.", category: "education", tag: "Game", icon: "theater" },
  { slug: "subnet-calculator", title: "Subnet Calculator", blurb: "CIDR → mask, network, broadcast, host ranges.", category: "developer", tag: "Calculator", icon: "network" },
  { slug: "tool-history", title: "Tool History", blurb: "Your recently-used tools — stored only in your browser.", category: "developer", tag: "Utility", icon: "clock" },
  { slug: "tracker-blocker-test", title: "Tracker Blocker Test", blurb: "Confirm your ad-blocker kills Analytics, Pixel, and friends.", category: "security", tag: "Privacy", icon: "shield-off" },
  { slug: "timestamp-converter", title: "Unix Timestamp Converter", blurb: "Epoch ↔ human time. UTC, local, ISO 8601, seconds/ms.", category: "developer", tag: "Converter", icon: "clock" },
  { slug: "url-encoder", title: "URL Encoder / Decoder", blurb: "encodeURI, decodeURI, encodeURIComponent — all three modes.", category: "developer", tag: "Encoder", icon: "link" },
  { slug: "uuid-generator", title: "UUID Generator", blurb: "v1 + v4 in batch, with multiple output formats.", category: "developer", tag: "Generator", icon: "fingerprint" },
  { slug: "vendor-lock-in", title: "Vendor Lock-In Score", blurb: "Score SaaS dependencies across 9 dimensions; plan exits.", category: "education", tag: "Assessment", icon: "lock-closed" },
  { slug: "vpn-comparison", title: "VPN Comparison Matrix", blurb: "Privacy, logging, jurisdiction, price — Mullvad, Proton, Nord…", category: "security", tag: "Comparison", icon: "shield-check" },
  { slug: "webrtc-leak-test", title: "WebRTC Leak Test", blurb: "Detect whether WebRTC is revealing your real IP behind VPN.", category: "security", tag: "Privacy", icon: "wifi" },
  { slug: "web-checker", title: "Website Security Analyzer", blurb: "DNS, SSL/TLS, headers, infrastructure — graded.", category: "security", tag: "Analysis", icon: "radar" },
  { slug: "wifi-security-analyzer", title: "WiFi Security Analyzer", blurb: "Score WPA3, router config — get actionable hardening.", category: "security", tag: "Analyzer", icon: "wifi" },
];

window.LIVE_SLUGS = new Set([
  'password-generator', 'hash-generator', 'jwt-decoder', 'qr-code',
  'uuid-generator', 'password-quest', 'timestamp-converter', 'url-encoder',
]);

// counts
window.SHIELD_COUNTS = (() => {
  const c = { all: window.SHIELD_TOOLS.length };
  for (const t of window.SHIELD_TOOLS) c[t.category] = (c[t.category] || 0) + 1;
  return c;
})();
