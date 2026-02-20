export type ToolCategory = "security" | "developer" | "education"

/** All icon names that map to a Lucide component in tool-card.tsx ICON_MAP. */
export type ToolIcon =
  | "activity"
  | "book"
  | "book-marked"
  | "book-open"
  | "circle-help"
  | "clipboard-list"
  | "clock"
  | "drama"
  | "file-certificate"
  | "file-search"
  | "fingerprint"
  | "hash"
  | "history"
  | "image"
  | "key"
  | "key-round"
  | "key-square"
  | "layout-grid"
  | "link"
  | "lock"
  | "lock-keyhole"
  | "mail"
  | "map-pin"
  | "network"
  | "newspaper"
  | "pen-line"
  | "qr-code"
  | "radar"
  | "scan-search"
  | "shield"
  | "shield-alert"
  | "shield-check"
  | "shield-off"
  | "star"
  | "trophy"
  | "wifi"
  | "wrench"

export interface Tool {
  title: string
  description: string
  href: string
  tags: string
  category: ToolCategory
  tagLabel: string
  iconColor: string
  icon: ToolIcon
}

export const CATEGORIES: { value: string; label: string }[] = [
  { value: "all", label: "All Tools" },
  { value: "security", label: "Security" },
  { value: "developer", label: "Developer" },
  { value: "education", label: "Education" },
]

export const TOOLS: Tool[] = [
  // ─── Security ────────────────────────────────────────────────────────

  {
    title: "Browser Fingerprint Test",
    description:
      "Test how unique your browser is and see what information websites can collect about you. Check your digital fingerprint.",
    href: "/tools/browser-fingerprint",
    tags: "browser fingerprint privacy tracking canvas webgl uniqueness",
    category: "security",
    tagLabel: "Privacy",
    iconColor: "text-chart-5 bg-chart-5/10",
    icon: "fingerprint",
  },
  {
    title: "Certificate Decoder",
    description:
      "Decode and analyze SSL/TLS certificates. View certificate details, validity dates, subject information, and extensions.",
    href: "/tools/certificate-decoder",
    tags: "ssl tls certificate decoder x509 pem validity security",
    category: "security",
    tagLabel: "Crypto",
    iconColor: "text-chart-4 bg-chart-4/10",
    icon: "file-certificate",
  },
  {
    title: "Digital Signature Verifier",
    description:
      "Verify digital signatures using RSA-PKCS1, RSA-PSS, and ECDSA algorithms. Client-side verification with the Web Crypto API.",
    href: "/tools/digital-signature-verifier",
    tags: "digital signature verifier rsa ecdsa pkcs pss sha256 cryptography verify web crypto",
    category: "security",
    tagLabel: "Crypto",
    iconColor: "text-primary bg-primary/10",
    icon: "pen-line",
  },
  {
    title: "DNS Leak Test",
    description:
      "Check if your VPN is leaking DNS requests. Verify that your DNS queries are being protected from your ISP.",
    href: "/tools/dns-leak-test",
    tags: "dns leak test vpn privacy security isp dns-over-https",
    category: "security",
    tagLabel: "Privacy",
    iconColor: "text-chart-5 bg-chart-5/10",
    icon: "shield-alert",
  },
  {
    title: "Email Header Analyzer",
    description:
      "Identify phishing attempts by analyzing email headers, authentication, and delivery paths.",
    href: "/tools/email-analyzer",
    tags: "email header analyzer phishing detection spf dkim dmarc authentication",
    category: "security",
    tagLabel: "Security",
    iconColor: "text-chart-5 bg-chart-5/10",
    icon: "mail",
  },
  {
    title: "EXIF Metadata Remover",
    description:
      "Remove sensitive metadata from photos including GPS location, camera info, and timestamps. Protect your privacy before sharing images.",
    href: "/tools/exif-remover",
    tags: "exif metadata remover photo privacy gps location camera data",
    category: "security",
    tagLabel: "Privacy",
    iconColor: "text-chart-4 bg-chart-4/10",
    icon: "image",
  },
  {
    title: "IP Address Lookup",
    description:
      "Look up detailed information about any IP address including location, ISP, and network details.",
    href: "/tools/ip-lookup",
    tags: "ip address lookup geolocation isp network whois information",
    category: "security",
    tagLabel: "Analysis",
    iconColor: "text-chart-5 bg-chart-5/10",
    icon: "map-pin",
  },
  {
    title: "Link Safety Checker",
    description:
      "Analyze URLs for phishing, malware, and suspicious patterns before clicking. Check if a link is safe.",
    href: "/tools/link-safety-checker",
    tags: "link url safety checker phishing malware suspicious typosquatting",
    category: "security",
    tagLabel: "Security",
    iconColor: "text-chart-5 bg-chart-5/10",
    icon: "link",
  },
  {
    title: "Message Encryptor",
    description:
      "Encrypt and decrypt messages securely using AES-256 encryption. Protect your sensitive text with password-based encryption.",
    href: "/tools/message-encryptor",
    tags: "message encrypt decrypt aes encryption secure password crypto",
    category: "security",
    tagLabel: "Crypto",
    iconColor: "text-chart-4 bg-chart-4/10",
    icon: "lock",
  },
  {
    title: "Password Generator",
    description:
      "Generate strong, secure passwords with customizable options. Create random passwords with uppercase, lowercase, numbers, and symbols.",
    href: "/tools/password-generator",
    tags: "password generator random strong secure create",
    category: "security",
    tagLabel: "Security",
    iconColor: "text-chart-4 bg-chart-4/10",
    icon: "key",
  },
  {
    title: "Password Manager Comparison",
    description:
      "Compare the top password managers: Bitwarden, 1Password, KeePassXC, Proton Pass, Dashlane, and more on features, security, and pricing.",
    href: "/tools/password-manager-comparison",
    tags: "password manager comparison bitwarden 1password keepass proton security open source",
    category: "security",
    tagLabel: "Comparison",
    iconColor: "text-chart-2 bg-chart-2/10",
    icon: "key-round",
  },
  {
    title: "Password Strength Tester",
    description:
      "Test password strength with real-time entropy calculation and visual indicators.",
    href: "/tools/password-quest",
    tags: "password strength tester checker security entropy",
    category: "security",
    tagLabel: "Security",
    iconColor: "text-chart-4 bg-chart-4/10",
    icon: "key-round",
  },
  {
    title: "Privacy Policy Analyzer",
    description:
      "Analyze any privacy policy for red flags, data selling, tracking, retention practices, and user rights. Get an instant risk score.",
    href: "/tools/privacy-policy-analyzer",
    tags: "privacy policy analyzer gdpr ccpa data selling tracking cookies red flags risk score",
    category: "security",
    tagLabel: "Analyzer",
    iconColor: "text-chart-4 bg-chart-4/10",
    icon: "file-search",
  },
  {
    title: "RSA Key Pair Generator",
    description:
      "Generate RSA key pairs for encryption and digital signatures. Create public and private keys with customizable key sizes.",
    href: "/tools/rsa-key-generator",
    tags: "rsa key pair generator public private encryption signature crypto pgp",
    category: "security",
    tagLabel: "Crypto",
    iconColor: "text-chart-4 bg-chart-4/10",
    icon: "key-square",
  },
  {
    title: "Tracker Blocker Test",
    description:
      "Test if your ad blocker or privacy extension is blocking known trackers. Check protection against Google Analytics, Facebook Pixel, and more.",
    href: "/tools/tracker-blocker-test",
    tags: "tracker blocker test ad block ublock privacy extension google analytics facebook pixel protection",
    category: "security",
    tagLabel: "Privacy",
    iconColor: "text-chart-2 bg-chart-2/10",
    icon: "shield-off",
  },
  {
    title: "VPN Comparison Matrix",
    description:
      "Compare leading VPN services on privacy, logging policy, jurisdiction, features, and price. Includes Mullvad, ProtonVPN, NordVPN, and more.",
    href: "/tools/vpn-comparison",
    tags: "vpn comparison matrix mullvad protonvpn nordvpn wireguard no-logs jurisdiction privacy",
    category: "security",
    tagLabel: "Comparison",
    iconColor: "text-chart-1 bg-chart-1/10",
    icon: "shield-check",
  },
  {
    title: "WebRTC Leak Test",
    description:
      "Test if WebRTC is leaking your real IP address. Check if your VPN can be bypassed by WebRTC.",
    href: "/tools/webrtc-leak-test",
    tags: "webrtc leak test vpn privacy ip address real local",
    category: "security",
    tagLabel: "Privacy",
    iconColor: "text-chart-5 bg-chart-5/10",
    icon: "wifi",
  },
  {
    title: "Website Security Analyzer",
    description:
      "Comprehensive website security analysis. Check DNS records, SSL/TLS certificates, security headers, and infrastructure all in one place.",
    href: "/tools/web-checker",
    tags: "website checker dns ssl tls certificate security headers https infrastructure analysis web-check expiry grade",
    category: "security",
    tagLabel: "Analysis",
    iconColor: "text-chart-5 bg-chart-5/10",
    icon: "radar",
  },
  {
    title: "WiFi Security Analyzer",
    description:
      "Assess your wireless network security settings. Check WPA3 encryption, router configuration, and get actionable recommendations.",
    href: "/tools/wifi-security-analyzer",
    tags: "wifi security analyzer wpa3 wpa2 router encryption wireless network security assessment",
    category: "security",
    tagLabel: "Analyzer",
    iconColor: "text-chart-1 bg-chart-1/10",
    icon: "wifi",
  },

  // ─── Developer ───────────────────────────────────────────────────────

  {
    title: "Developer Swiss Army Knife",
    description:
      "All-in-one developer toolkit. Base64 encoding, JSON formatting, hash generation, regex testing, and text diff in one place.",
    href: "/tools/dev-tools",
    tags: "base64 encoder decoder json formatter validator hash generator md5 sha256 regex tester text diff compare developer tools",
    category: "developer",
    tagLabel: "Developer",
    iconColor: "text-primary bg-primary/10",
    icon: "wrench",
  },
  {
    title: "Hash Generator & Verifier",
    description:
      "Generate and verify cryptographic hashes (MD5, SHA-1, SHA-256, SHA-512). Check file integrity and verify checksums.",
    href: "/tools/hash-generator",
    tags: "hash generator md5 sha1 sha256 sha512 checksum integrity verifier",
    category: "developer",
    tagLabel: "Crypto",
    iconColor: "text-primary bg-primary/10",
    icon: "hash",
  },
  {
    title: "JWT Decoder & Validator",
    description:
      "Decode and validate JSON Web Tokens. Inspect header, payload, signature, and check expiration dates.",
    href: "/tools/jwt-decoder",
    tags: "jwt json web token decoder validator auth authentication bearer",
    category: "developer",
    tagLabel: "Decoder",
    iconColor: "text-primary bg-primary/10",
    icon: "key-round",
  },
  {
    title: "Port Scanner",
    description:
      "Scan common ports on localhost to audit locally running services. Useful for developers to discover exposed databases and servers.",
    href: "/tools/port-scanner",
    tags: "port scanner localhost network scan open ports tcp services security audit developer",
    category: "developer",
    tagLabel: "Scanner",
    iconColor: "text-chart-5 bg-chart-5/10",
    icon: "scan-search",
  },
  {
    title: "QR Code Generator",
    description:
      "Generate QR codes from text, URLs, WiFi credentials, and more. Download as PNG or SVG.",
    href: "/tools/qr-code",
    tags: "qr code generator encode barcode",
    category: "developer",
    tagLabel: "Generator",
    iconColor: "text-primary bg-primary/10",
    icon: "qr-code",
  },
  {
    title: "Subnet Calculator",
    description:
      "Calculate subnet masks, network addresses, broadcast addresses, and host ranges for IPv4 networks.",
    href: "/tools/subnet-calculator",
    tags: "subnet calculator network cidr ip address mask networking",
    category: "developer",
    tagLabel: "Calculator",
    iconColor: "text-primary bg-primary/10",
    icon: "network",
  },
  {
    title: "Unix Timestamp Converter",
    description:
      "Convert between Unix timestamps and human-readable dates. Supports seconds and milliseconds with multiple output formats including UTC, local, and ISO 8601.",
    href: "/tools/timestamp-converter",
    tags: "unix timestamp converter epoch date time utc iso 8601 developer utility",
    category: "developer",
    tagLabel: "Converter",
    iconColor: "text-primary bg-primary/10",
    icon: "clock",
  },
  {
    title: "URL Encoder / Decoder",
    description:
      "Encode and decode URLs and URL components. Supports encodeURI, decodeURI, and encodeURIComponent modes for safe URL handling.",
    href: "/tools/url-encoder",
    tags: "url encoder decoder encodeURI decodeURI encodeURIComponent percent encoding developer utility",
    category: "developer",
    tagLabel: "Encoder",
    iconColor: "text-chart-2 bg-chart-2/10",
    icon: "link",
  },
  {
    title: "UUID Generator",
    description:
      "Generate universally unique identifiers (UUIDs). Supports v1 (timestamp-based) and v4 (random) with batch generation and multiple format options.",
    href: "/tools/uuid-generator",
    tags: "uuid generator v1 v4 guid unique identifier random batch developer utility",
    category: "developer",
    tagLabel: "Generator",
    iconColor: "text-chart-3 bg-chart-3/10",
    icon: "fingerprint",
  },
  {
    title: "Minify Me",
    description:
      "Minify CSS, JSON, SQL, and XML in your browser. Strips comments and whitespace to shrink file sizes — nothing leaves your device.",
    href: "/tools/minify-me",
    tags: "minify css json sql xml compress whitespace remove comments size reduction developer utility",
    category: "developer",
    tagLabel: "Minifier",
    iconColor: "text-chart-3 bg-chart-3/10",
    icon: "minimize-2",
  },
  {
    title: "Favorite Tools",
    description:
      "Bookmark your most-used security tools for quick access. Favorites stored locally in your browser — export and import across devices.",
    href: "/tools/favorites",
    tags: "favorites bookmarks saved tools localStorage quick access",
    category: "developer",
    tagLabel: "Utility",
    iconColor: "text-chart-2 bg-chart-2/10",
    icon: "star",
  },
  {
    title: "Tool History",
    description:
      "View your recently used tools. History stored entirely in your browser's localStorage — nothing is sent to any server.",
    href: "/tools/tool-history",
    tags: "tool history recent visited localStorage browser privacy",
    category: "developer",
    tagLabel: "Utility",
    iconColor: "text-chart-1 bg-chart-1/10",
    icon: "history",
  },

  // ─── Education ───────────────────────────────────────────────────────

  {
    title: "Browser Privacy Comparison",
    description:
      "Compare privacy and security features across popular browsers. Find the most private browser for your needs.",
    href: "/tools/browser-comparison",
    tags: "browser comparison privacy security features firefox chrome brave safari edge",
    category: "education",
    tagLabel: "Comparison",
    iconColor: "text-chart-3 bg-chart-3/10",
    icon: "layout-grid",
  },
  {
    title: "Data Breach Timeline",
    description:
      "Interactive timeline of major data breaches with records affected, types, and lessons learned.",
    href: "/tools/breach-timeline",
    tags: "data breach timeline history visualization cybersecurity incidents",
    category: "education",
    tagLabel: "Timeline",
    iconColor: "text-chart-5 bg-chart-5/10",
    icon: "activity",
  },
  {
    title: "Network Defense Game",
    description:
      "Defend your network from waves of cyber attacks. Patch, firewall, and isolate nodes under attack in this educational security management game.",
    href: "/tools/network-defense-game",
    tags: "network defense game cyber attack waves firewall patch security educational",
    category: "education",
    tagLabel: "Game",
    iconColor: "text-primary bg-primary/10",
    icon: "shield",
  },
  {
    title: "Password Cracking Simulator",
    description:
      "See how long it takes to crack any password using dictionary attacks, GPU brute force, and bcrypt. Educational — nothing is sent to any server.",
    href: "/tools/password-cracking-simulator",
    tags: "password cracking simulator brute force dictionary gpu strength entropy educational",
    category: "education",
    tagLabel: "Simulator",
    iconColor: "text-chart-5 bg-chart-5/10",
    icon: "key",
  },
  {
    title: "Phishing Email Quiz",
    description:
      "Test your ability to spot phishing emails with 20 realistic scenarios and detailed explanations.",
    href: "/tools/phishing-quiz",
    tags: "phishing quiz test email scam awareness training spot phishing",
    category: "education",
    tagLabel: "Quiz",
    iconColor: "text-chart-4 bg-chart-4/10",
    icon: "circle-help",
  },
  {
    title: "Privacy 101 Guide",
    description:
      "Beginner's guide to digital privacy. Learn what data is collected, how to protect it, and which tools matter most — no tech background needed.",
    href: "/tools/guide-privacy-101",
    tags: "privacy guide beginner 101 data protection tracker browser vpn tips tools",
    category: "education",
    tagLabel: "Guide",
    iconColor: "text-chart-1 bg-chart-1/10",
    icon: "book-open",
  },
  {
    title: "Privacy Guardian",
    description:
      "Interactive dialogue adventure where you make real privacy decisions and level up your security skills through scenario-based choices.",
    href: "/tools/privacy-rpg",
    tags: "privacy guardian game dialogue adventure security scenarios interactive",
    category: "education",
    tagLabel: "Game",
    iconColor: "text-chart-3 bg-chart-3/10",
    icon: "shield",
  },
  {
    title: "Privacy Score Calculator",
    description:
      "Rate your digital privacy habits and get personalized recommendations to improve.",
    href: "/tools/privacy-score",
    tags: "privacy score calculator assessment digital habits security rating",
    category: "education",
    tagLabel: "Assessment",
    iconColor: "text-accent bg-accent/10",
    icon: "shield-check",
  },
  {
    title: "Security & Privacy Glossary",
    description:
      "A–Z definitions for 60+ cybersecurity and privacy terms. Search AES, zero-knowledge, phishing, GDPR, VPN, and more in plain English.",
    href: "/tools/glossary",
    tags: "glossary security privacy terms definitions aes encryption vpn gdpr phishing terminology",
    category: "education",
    tagLabel: "Reference",
    iconColor: "text-chart-3 bg-chart-3/10",
    icon: "book-marked",
  },
  {
    title: "Security Basics Guide",
    description:
      "Understand cybersecurity fundamentals. Learn about common attacks, core security principles, phishing recognition, malware prevention, and backups.",
    href: "/tools/guide-security-basics",
    tags: "security basics guide beginner phishing malware ransomware updates backup principles",
    category: "education",
    tagLabel: "Guide",
    iconColor: "text-chart-2 bg-chart-2/10",
    icon: "book",
  },
  {
    title: "Security Blog",
    description:
      "Security news, privacy guides, and expert analysis. Stay informed about the latest threats, breaches, and how to protect yourself online.",
    href: "/tools/blog",
    tags: "blog security privacy news guides tips analysis breach phishing latest updates",
    category: "education",
    tagLabel: "Blog",
    iconColor: "text-chart-5 bg-chart-5/10",
    icon: "newspaper",
  },
  {
    title: "Security Cheat Sheets",
    description:
      "Quick reference cards for security and privacy: password rules, phishing red flags, incident response, backup strategy, and browser hardening.",
    href: "/tools/cheat-sheets",
    tags: "cheat sheets security privacy reference quick guide passwords phishing backup 2fa",
    category: "education",
    tagLabel: "Reference",
    iconColor: "text-chart-4 bg-chart-4/10",
    icon: "clipboard-list",
  },
  {
    title: "Security Trivia Challenge",
    description:
      "Test your cybersecurity knowledge with our interactive trivia game. Learn about privacy, security, and best practices.",
    href: "/tools/security-trivia",
    tags: "security trivia quiz game challenge test knowledge cybersecurity",
    category: "education",
    tagLabel: "Game",
    iconColor: "text-chart-3 bg-chart-3/10",
    icon: "trophy",
  },
  {
    title: "Social Engineering Escape Room",
    description:
      "Interactive escape room with 8 scenarios. Identify and avoid phishing, vishing, pretexting, baiting, and tailgating attacks before it's too late.",
    href: "/tools/social-engineering-escape-room",
    tags: "social engineering escape room phishing vishing pretexting baiting tailgating interactive game",
    category: "education",
    tagLabel: "Game",
    iconColor: "text-chart-4 bg-chart-4/10",
    icon: "drama",
  },
  {
    title: "Vendor Lock-In Score",
    description:
      "Score your vendor lock-in risk across 9 dimensions. Track services and plan your exit strategy.",
    href: "/tools/vendor-lock-in",
    tags: "vendor lock-in score risk assessment cloud saas dependency portability",
    category: "education",
    tagLabel: "Assessment",
    iconColor: "text-chart-4 bg-chart-4/10",
    icon: "lock-keyhole",
  },
]

/** Per-category tool counts, precomputed to avoid repeated TOOLS.filter() calls in render. */
export const CATEGORY_COUNTS: Record<string, number> = Object.fromEntries(
  CATEGORIES.map((c) => [
    c.value,
    c.value === "all" ? TOOLS.length : TOOLS.filter((t) => t.category === c.value).length,
  ])
)
