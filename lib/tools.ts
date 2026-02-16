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
