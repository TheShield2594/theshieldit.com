export type ToolCategory = "security" | "developer" | "education"

export interface Tool {
  title: string
  description: string
  href: string
  tags: string
  category: ToolCategory
  tagLabel: string
  iconColor: string
  icon: string
}

export const CATEGORIES: { value: string; label: string }[] = [
  { value: "all", label: "All Tools" },
  { value: "security", label: "Security" },
  { value: "developer", label: "Developer" },
  { value: "education", label: "Education" },
]

export const TOOLS: Tool[] = [
  {
    title: "Email Header Analyzer",
    description:
      "Identify phishing attempts by analyzing email headers, authentication, and delivery paths.",
    href: "/email-analyzer.html",
    tags: "email header analyzer phishing detection spf dkim dmarc authentication",
    category: "security",
    tagLabel: "Security",
    iconColor: "text-chart-5 bg-chart-5/10",
    icon: "mail",
  },
  {
    title: "WHOIS Lookup",
    description:
      "Look up domain registration details, registrar, nameservers, and expiration dates.",
    href: "/whois-lookup.html",
    tags: "whois lookup domain registration registrar nameserver expiry",
    category: "security",
    tagLabel: "Investigation",
    iconColor: "text-primary bg-primary/10",
    icon: "search",
  },
  {
    title: "SSL/TLS Certificate Checker",
    description:
      "Check certificate details, expiration, issuer, and security grade for any website.",
    href: "/ssl-checker.html",
    tags: "ssl tls certificate checker https security expiry grade",
    category: "security",
    tagLabel: "Security",
    iconColor: "text-chart-3 bg-chart-3/10",
    icon: "lock",
  },
  {
    title: "DNS Lookup Tester",
    description:
      "Query DNS records for any domain. Supports A, AAAA, MX, NS, TXT, CNAME, and SOA lookups.",
    href: "/dns-tester.html",
    tags: "dns lookup tester records domain mx ns txt cname soa networking",
    category: "security",
    tagLabel: "Networking",
    iconColor: "text-accent bg-accent/10",
    icon: "globe",
  },
  {
    title: "Password Strength Tester",
    description:
      "Test password strength with real-time entropy calculation and visual indicators.",
    href: "/password-quest.html",
    tags: "password strength tester checker security entropy",
    category: "security",
    tagLabel: "Security",
    iconColor: "text-chart-4 bg-chart-4/10",
    icon: "key-round",
  },
  {
    title: "Text Diff / Compare",
    description:
      "Compare two text blocks side by side. See additions, deletions, and changes highlighted.",
    href: "/text-diff.html",
    tags: "text diff compare difference config code compare tool",
    category: "developer",
    tagLabel: "Developer",
    iconColor: "text-accent bg-accent/10",
    icon: "file-diff",
  },
  {
    title: "Hash Generator & Verifier",
    description:
      "Generate MD5, SHA-1, SHA-256, SHA-384, SHA-512 hashes for text and files.",
    href: "/hash-generator.html",
    tags: "hash generator md5 sha256 sha1 sha512 checksum verifier file integrity",
    category: "developer",
    tagLabel: "Developer",
    iconColor: "text-chart-4 bg-chart-4/10",
    icon: "hash",
  },
  {
    title: "Base64 Encoder / Decoder",
    description:
      "Convert text to Base64 and back instantly. Supports UTF-8 and binary data.",
    href: "/base64.html",
    tags: "base64 encoder decoder converter encode decode",
    category: "developer",
    tagLabel: "Developer",
    iconColor: "text-primary bg-primary/10",
    icon: "code",
  },
  {
    title: "JSON Formatter & Validator",
    description:
      "Beautify, minify, and validate JSON with real-time error detection and stats.",
    href: "/json-formatter.html",
    tags: "json formatter validator beautifier minifier parser format validate",
    category: "developer",
    tagLabel: "Developer",
    iconColor: "text-chart-3 bg-chart-3/10",
    icon: "braces",
  },
  {
    title: "Regex Tester",
    description:
      "Test regex patterns in real-time with match highlighting, capture groups, and quick reference.",
    href: "/regex-tester.html",
    tags: "regex regular expression tester pattern matching capture groups",
    category: "developer",
    tagLabel: "Developer",
    iconColor: "text-chart-5 bg-chart-5/10",
    icon: "regex",
  },
  {
    title: "QR Code Generator",
    description:
      "Generate QR codes from text, URLs, WiFi credentials, and more. Download as PNG or SVG.",
    href: "/qr-code.html",
    tags: "qr code generator encode barcode",
    category: "developer",
    tagLabel: "Generator",
    iconColor: "text-primary bg-primary/10",
    icon: "qr-code",
  },
  {
    title: "Phishing Email Quiz",
    description:
      "Test your ability to spot phishing emails with 20 realistic scenarios and detailed explanations.",
    href: "/phishing-quiz.html",
    tags: "phishing quiz test email scam awareness training spot phishing",
    category: "education",
    tagLabel: "Quiz",
    iconColor: "text-chart-4 bg-chart-4/10",
    icon: "circle-help",
  },
  {
    title: "Privacy Score Calculator",
    description:
      "Rate your digital privacy habits and get personalized recommendations to improve.",
    href: "/privacy-score.html",
    tags: "privacy score calculator assessment digital habits security rating",
    category: "education",
    tagLabel: "Assessment",
    iconColor: "text-accent bg-accent/10",
    icon: "shield-check",
  },
  {
    title: "Data Breach Timeline",
    description:
      "Interactive timeline of major data breaches with records affected, types, and lessons learned.",
    href: "/breach-timeline.html",
    tags: "data breach timeline history visualization cybersecurity incidents",
    category: "education",
    tagLabel: "Timeline",
    iconColor: "text-chart-5 bg-chart-5/10",
    icon: "activity",
  },
  {
    title: "Privacy Guardian RPG",
    description:
      "Level up your digital privacy through practical quests and real-world security tasks.",
    href: "/privacy-rpg.html",
    tags: "privacy guardian rpg security quests audit",
    category: "education",
    tagLabel: "Game",
    iconColor: "text-chart-3 bg-chart-3/10",
    icon: "shield",
  },
  {
    title: "Vendor Lock-In Score",
    description:
      "Score your vendor lock-in risk across 9 dimensions. Track services and plan your exit strategy.",
    href: "/vendor-lock-in.html",
    tags: "vendor lock-in score risk assessment cloud saas dependency portability",
    category: "education",
    tagLabel: "Assessment",
    iconColor: "text-chart-4 bg-chart-4/10",
    icon: "lock-keyhole",
  },
]
