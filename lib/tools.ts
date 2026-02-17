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
  { value: "developer", label: "Developer" },
  { value: "education", label: "Education" },
  { value: "security", label: "Security" },
]

export const TOOLS: Tool[] = [
  {
    title: "Browser Fingerprint Test",
    description:
      "Test how unique your browser is and see what information websites can collect about you. Check your digital fingerprint.",
    href: "/browser-fingerprint.html",
    tags: "browser fingerprint privacy tracking canvas webgl uniqueness",
    category: "security",
    tagLabel: "Privacy",
    iconColor: "text-chart-5 bg-chart-5/10",
    icon: "fingerprint",
  },
  {
    title: "Browser Privacy Comparison",
    description:
      "Compare privacy and security features across popular browsers. Find the most private browser for your needs.",
    href: "/browser-comparison.html",
    tags: "browser comparison privacy security features firefox chrome brave safari edge",
    category: "education",
    tagLabel: "Comparison",
    iconColor: "text-chart-3 bg-chart-3/10",
    icon: "layout-grid",
  },
  {
    title: "Certificate Decoder",
    description:
      "Decode and analyze SSL/TLS certificates. View certificate details, validity dates, subject information, and extensions.",
    href: "/certificate-decoder.html",
    tags: "ssl tls certificate decoder x509 pem validity security",
    category: "security",
    tagLabel: "Crypto",
    iconColor: "text-chart-4 bg-chart-4/10",
    icon: "file-certificate",
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
    title: "Developer Swiss Army Knife",
    description:
      "All-in-one developer toolkit. Base64 encoding, JSON formatting, hash generation, regex testing, and text diff in one place.",
    href: "/dev-tools.html",
    tags: "base64 encoder decoder json formatter validator hash generator md5 sha256 regex tester text diff compare developer tools",
    category: "developer",
    tagLabel: "Developer",
    iconColor: "text-primary bg-primary/10",
    icon: "wrench",
  },
  {
    title: "DNS Leak Test",
    description:
      "Check if your VPN is leaking DNS requests. Verify that your DNS queries are being protected from your ISP.",
    href: "/dns-leak-test.html",
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
    href: "/email-analyzer.html",
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
    href: "/exif-remover.html",
    tags: "exif metadata remover photo privacy gps location camera data",
    category: "security",
    tagLabel: "Privacy",
    iconColor: "text-chart-4 bg-chart-4/10",
    icon: "image",
  },
  {
    title: "Hash Generator & Verifier",
    description:
      "Generate and verify cryptographic hashes (MD5, SHA-1, SHA-256, SHA-512). Check file integrity and verify checksums.",
    href: "/hash-generator.html",
    tags: "hash generator md5 sha1 sha256 sha512 checksum integrity verifier",
    category: "developer",
    tagLabel: "Crypto",
    iconColor: "text-primary bg-primary/10",
    icon: "hash",
  },
  {
    title: "IP Address Lookup",
    description:
      "Look up detailed information about any IP address including location, ISP, and network details.",
    href: "/ip-lookup.html",
    tags: "ip address lookup geolocation isp network whois information",
    category: "security",
    tagLabel: "Analysis",
    iconColor: "text-chart-5 bg-chart-5/10",
    icon: "map-pin",
  },
  {
    title: "JWT Decoder & Validator",
    description:
      "Decode and validate JSON Web Tokens. Inspect header, payload, signature, and check expiration dates.",
    href: "/jwt-decoder.html",
    tags: "jwt json web token decoder validator auth authentication bearer",
    category: "developer",
    tagLabel: "Decoder",
    iconColor: "text-primary bg-primary/10",
    icon: "key-round",
  },
  {
    title: "Link Safety Checker",
    description:
      "Analyze URLs for phishing, malware, and suspicious patterns before clicking. Check if a link is safe.",
    href: "/link-safety-checker.html",
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
    href: "/message-encryptor.html",
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
    href: "/password-generator.html",
    tags: "password generator random strong secure create",
    category: "security",
    tagLabel: "Security",
    iconColor: "text-chart-4 bg-chart-4/10",
    icon: "key",
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
    title: "Privacy Guardian",
    description:
      "Interactive dialogue adventure where you make real privacy decisions and level up your security skills through scenario-based choices.",
    href: "/privacy-rpg.html",
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
    href: "/privacy-score.html",
    tags: "privacy score calculator assessment digital habits security rating",
    category: "education",
    tagLabel: "Assessment",
    iconColor: "text-accent bg-accent/10",
    icon: "shield-check",
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
    title: "RSA Key Pair Generator",
    description:
      "Generate RSA key pairs for encryption and digital signatures. Create public and private keys with customizable key sizes.",
    href: "/rsa-key-generator.html",
    tags: "rsa key pair generator public private encryption signature crypto pgp",
    category: "security",
    tagLabel: "Crypto",
    iconColor: "text-chart-4 bg-chart-4/10",
    icon: "key-square",
  },
  {
    title: "Security Trivia Challenge",
    description:
      "Test your cybersecurity knowledge with our interactive trivia game. Learn about privacy, security, and best practices.",
    href: "/security-trivia.html",
    tags: "security trivia quiz game challenge test knowledge cybersecurity",
    category: "education",
    tagLabel: "Game",
    iconColor: "text-chart-3 bg-chart-3/10",
    icon: "trophy",
  },
  {
    title: "Subnet Calculator",
    description:
      "Calculate subnet masks, network addresses, broadcast addresses, and host ranges for IPv4 networks.",
    href: "/subnet-calculator.html",
    tags: "subnet calculator network cidr ip address mask networking",
    category: "developer",
    tagLabel: "Calculator",
    iconColor: "text-primary bg-primary/10",
    icon: "network",
  },
  {
    title: "URL Encoder / Decoder",
    description:
      "Encode and decode URLs and URL components. Supports encodeURI, decodeURI, and encodeURIComponent modes for safe URL handling.",
    href: "/url-encoder.html",
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
    href: "/uuid-generator.html",
    tags: "uuid generator v1 v4 guid unique identifier random batch developer utility",
    category: "developer",
    tagLabel: "Generator",
    iconColor: "text-chart-3 bg-chart-3/10",
    icon: "fingerprint",
  },
  {
    title: "Unix Timestamp Converter",
    description:
      "Convert between Unix timestamps and human-readable dates. Supports seconds and milliseconds with multiple output formats including UTC, local, and ISO 8601.",
    href: "/timestamp-converter.html",
    tags: "unix timestamp converter epoch date time utc iso 8601 developer utility",
    category: "developer",
    tagLabel: "Converter",
    iconColor: "text-primary bg-primary/10",
    icon: "clock",
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
  {
    title: "WebRTC Leak Test",
    description:
      "Test if WebRTC is leaking your real IP address. Check if your VPN can be bypassed by WebRTC.",
    href: "/webrtc-leak-test.html",
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
    href: "/web-checker.html",
    tags: "website checker dns ssl tls certificate security headers https infrastructure analysis web-check expiry grade",
    category: "security",
    tagLabel: "Analysis",
    iconColor: "text-chart-5 bg-chart-5/10",
    icon: "radar",
  },
]
