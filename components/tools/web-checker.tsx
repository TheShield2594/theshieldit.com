"use client"

export default function WebChecker() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/web-checker.html"
        title="Website Security Analyzer"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
