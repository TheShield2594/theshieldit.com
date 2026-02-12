import type { NextConfig } from "next"

const HTML_TOOLS = [
  "base64",
  "breach-timeline",
  "dns-tester",
  "email-analyzer",
  "hash-generator",
  "json-formatter",
  "password-quest",
  "phishing-quiz",
  "privacy-rpg",
  "privacy-score",
  "qr-code",
  "regex-tester",
  "ssl-checker",
  "text-diff",
  "tools",
  "vendor-lock-in",
  "whois-lookup",
]

const nextConfig: NextConfig = {
  async redirects() {
    return HTML_TOOLS.map((slug) => ({
      source: `/${slug}/`,
      destination: `/${slug}`,
      permanent: true,
    }))
  },
  async rewrites() {
    return HTML_TOOLS.map((slug) => ({
      source: `/${slug}`,
      destination: `/${slug}.html`,
    }))
  },
}

export default nextConfig
