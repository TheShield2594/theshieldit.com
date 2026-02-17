"use client"

export default function WifiSecurityAnalyzer() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/wifi-security-analyzer.html"
        title="WiFi Security Analyzer"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
