"use client"

export default function BrowserComparison() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/browser-comparison.html"
        title="Browser Privacy Comparison"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
