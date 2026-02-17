"use client"

export default function EmailAnalyzer() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/email-analyzer.html"
        title="Email Header Analyzer"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
