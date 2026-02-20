"use client"

import dynamic from "next/dynamic"
import type { ComponentType } from "react"

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

const loading = () => <LoadingDots />

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
  "password-generator": dynamic(() => import("@/components/tools/password-generator"), { loading }),
  "hash-generator": dynamic(() => import("@/components/tools/hash-generator"), { loading }),
  "url-encoder": dynamic(() => import("@/components/tools/url-encoder"), { loading }),
  "uuid-generator": dynamic(() => import("@/components/tools/uuid-generator"), { loading }),
  "timestamp-converter": dynamic(() => import("@/components/tools/timestamp-converter"), { loading }),
  "subnet-calculator": dynamic(() => import("@/components/tools/subnet-calculator"), { loading }),
  "jwt-decoder": dynamic(() => import("@/components/tools/jwt-decoder"), { loading }),
  "message-encryptor": dynamic(() => import("@/components/tools/message-encryptor"), { loading }),
  "digital-signature-verifier": dynamic(() => import("@/components/tools/digital-signature-verifier"), { loading }),
  "rsa-key-generator": dynamic(() => import("@/components/tools/rsa-key-generator"), { loading }),
  "certificate-decoder": dynamic(() => import("@/components/tools/certificate-decoder"), { loading }),
  "email-analyzer": dynamic(() => import("@/components/tools/email-analyzer"), { loading }),
  "exif-remover": dynamic(() => import("@/components/tools/exif-remover"), { loading }),
  "qr-code": dynamic(() => import("@/components/tools/qr-code"), { loading }),
  "ip-lookup": dynamic(() => import("@/components/tools/ip-lookup"), { loading }),
  "link-safety-checker": dynamic(() => import("@/components/tools/link-safety-checker"), { loading }),
  "ssl-checker": dynamic(() => import("@/components/tools/ssl-checker"), { loading }),
  "web-checker": dynamic(() => import("@/components/tools/web-checker"), { loading }),
  "dns-leak-test": dynamic(() => import("@/components/tools/dns-leak-test"), { loading }),
  "port-scanner": dynamic(() => import("@/components/tools/port-scanner"), { loading }),
  "webrtc-leak-test": dynamic(() => import("@/components/tools/webrtc-leak-test"), { loading }),
  "browser-fingerprint": dynamic(() => import("@/components/tools/browser-fingerprint"), { loading }),
  "tracker-blocker-test": dynamic(() => import("@/components/tools/tracker-blocker-test"), { loading }),
  "privacy-score": dynamic(() => import("@/components/tools/privacy-score"), { loading }),
  "wifi-security-analyzer": dynamic(() => import("@/components/tools/wifi-security-analyzer"), { loading }),
  "privacy-policy-analyzer": dynamic(() => import("@/components/tools/privacy-policy-analyzer"), { loading }),
  "breach-timeline": dynamic(() => import("@/components/tools/breach-timeline"), { loading }),
  "browser-comparison": dynamic(() => import("@/components/tools/browser-comparison"), { loading }),
  "vpn-comparison": dynamic(() => import("@/components/tools/vpn-comparison"), { loading }),
  "password-manager-comparison": dynamic(() => import("@/components/tools/password-manager-comparison"), { loading }),
  "vendor-lock-in": dynamic(() => import("@/components/tools/vendor-lock-in"), { loading }),
  "cheat-sheets": dynamic(() => import("@/components/tools/cheat-sheets"), { loading }),
  "glossary": dynamic(() => import("@/components/tools/glossary"), { loading }),
  "guide-privacy-101": dynamic(() => import("@/components/tools/guide-privacy-101"), { loading }),
  "guide-security-basics": dynamic(() => import("@/components/tools/guide-security-basics"), { loading }),
  "blog": dynamic(() => import("@/components/tools/blog"), { loading }),
  "favorites": dynamic(() => import("@/components/tools/favorites"), { loading }),
  "tool-history": dynamic(() => import("@/components/tools/tool-history"), { loading }),
  "phishing-quiz": dynamic(() => import("@/components/tools/phishing-quiz"), { loading }),
  "security-trivia": dynamic(() => import("@/components/tools/security-trivia"), { loading }),
  "dev-tools": dynamic(() => import("@/components/tools/dev-tools"), { loading }),
  "minify-me": dynamic(() => import("@/components/tools/minify-me"), { loading }),
  // Canvas games — thin iframe wrappers
  "network-defense-game": dynamic(() => import("@/components/tools/network-defense-game"), { loading }),
  "password-cracking-simulator": dynamic(() => import("@/components/tools/password-cracking-simulator"), { loading }),
  "password-quest": dynamic(() => import("@/components/tools/password-quest"), { loading }),
  "privacy-rpg": dynamic(() => import("@/components/tools/privacy-rpg"), { loading }),
  "social-engineering-escape-room": dynamic(() => import("@/components/tools/social-engineering-escape-room"), { loading }),
}

export function ToolClientContent({ slug }: { slug: string }) {
  const Component = TOOLS_MAP[slug]
  if (!Component) {
    console.error(`ToolClientContent: no component registered for slug "${slug}"`)
    return null
  }
  return <Component />
}
