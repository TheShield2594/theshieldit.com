"use client"

export default function BrowserFingerprint() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/browser-fingerprint.html"
        title="Browser Fingerprint Test"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
