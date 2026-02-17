"use client"

import dynamic from "next/dynamic"
import type { ComponentType } from "react"

/*
 * Every entry is a static import path so webpack / Turbopack can create
 * individual code-split chunks — only the requested tool's JS is loaded.
 *
 * Tools that remain as iframe wrappers for now (complex canvas games):
 *   network-defense-game, password-cracking-simulator, password-quest,
 *   privacy-rpg, social-engineering-escape-room
 * All others are full React components sharing the design system.
 */
const TOOLS_MAP: Record<string, ComponentType> = {
  "password-generator": dynamic(() => import("@/components/tools/password-generator")),
  "hash-generator": dynamic(() => import("@/components/tools/hash-generator")),
  "url-encoder": dynamic(() => import("@/components/tools/url-encoder")),
  "uuid-generator": dynamic(() => import("@/components/tools/uuid-generator")),
  "timestamp-converter": dynamic(() => import("@/components/tools/timestamp-converter")),
  "subnet-calculator": dynamic(() => import("@/components/tools/subnet-calculator")),
  "jwt-decoder": dynamic(() => import("@/components/tools/jwt-decoder")),
  "message-encryptor": dynamic(() => import("@/components/tools/message-encryptor")),
  "digital-signature-verifier": dynamic(() => import("@/components/tools/digital-signature-verifier")),
  "rsa-key-generator": dynamic(() => import("@/components/tools/rsa-key-generator")),
  "certificate-decoder": dynamic(() => import("@/components/tools/certificate-decoder")),
  "email-analyzer": dynamic(() => import("@/components/tools/email-analyzer")),
  "exif-remover": dynamic(() => import("@/components/tools/exif-remover")),
  "qr-code": dynamic(() => import("@/components/tools/qr-code")),
  "ip-lookup": dynamic(() => import("@/components/tools/ip-lookup")),
  "link-safety-checker": dynamic(() => import("@/components/tools/link-safety-checker")),
  "ssl-checker": dynamic(() => import("@/components/tools/ssl-checker")),
  "web-checker": dynamic(() => import("@/components/tools/web-checker")),
  "dns-leak-test": dynamic(() => import("@/components/tools/dns-leak-test")),
  "port-scanner": dynamic(() => import("@/components/tools/port-scanner")),
  "webrtc-leak-test": dynamic(() => import("@/components/tools/webrtc-leak-test")),
  "browser-fingerprint": dynamic(() => import("@/components/tools/browser-fingerprint")),
  "tracker-blocker-test": dynamic(() => import("@/components/tools/tracker-blocker-test")),
  "privacy-score": dynamic(() => import("@/components/tools/privacy-score")),
  "wifi-security-analyzer": dynamic(() => import("@/components/tools/wifi-security-analyzer")),
  "privacy-policy-analyzer": dynamic(() => import("@/components/tools/privacy-policy-analyzer")),
  "breach-timeline": dynamic(() => import("@/components/tools/breach-timeline")),
  "browser-comparison": dynamic(() => import("@/components/tools/browser-comparison")),
  "vpn-comparison": dynamic(() => import("@/components/tools/vpn-comparison")),
  "password-manager-comparison": dynamic(() => import("@/components/tools/password-manager-comparison")),
  "vendor-lock-in": dynamic(() => import("@/components/tools/vendor-lock-in")),
  "cheat-sheets": dynamic(() => import("@/components/tools/cheat-sheets")),
  "glossary": dynamic(() => import("@/components/tools/glossary")),
  "guide-privacy-101": dynamic(() => import("@/components/tools/guide-privacy-101")),
  "guide-security-basics": dynamic(() => import("@/components/tools/guide-security-basics")),
  "blog": dynamic(() => import("@/components/tools/blog")),
  "favorites": dynamic(() => import("@/components/tools/favorites")),
  "tool-history": dynamic(() => import("@/components/tools/tool-history")),
  "phishing-quiz": dynamic(() => import("@/components/tools/phishing-quiz")),
  "security-trivia": dynamic(() => import("@/components/tools/security-trivia")),
  "dev-tools": dynamic(() => import("@/components/tools/dev-tools")),
  // Canvas games — thin iframe wrappers
  "network-defense-game": dynamic(() => import("@/components/tools/network-defense-game")),
  "password-cracking-simulator": dynamic(() => import("@/components/tools/password-cracking-simulator")),
  "password-quest": dynamic(() => import("@/components/tools/password-quest")),
  "privacy-rpg": dynamic(() => import("@/components/tools/privacy-rpg")),
  "social-engineering-escape-room": dynamic(() => import("@/components/tools/social-engineering-escape-room")),
}

function LoadingDots() {
  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <div className="flex gap-1.5">
        <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
      </div>
    </div>
  )
}

export function ToolClientContent({ slug }: { slug: string }) {
  const Component = TOOLS_MAP[slug]
  if (!Component) {
    // Safety net: iframe fallback for any slug not yet in the registry
    return (
      <iframe
        src={`/${slug}.html`}
        title={slug.replace(/-/g, " ")}
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 200px)" }}
      />
    )
  }
  return <Component />
}
