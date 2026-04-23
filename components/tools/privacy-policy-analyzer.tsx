"use client"

export default function PrivacyPolicyAnalyzer() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/privacy-policy-analyzer.html"
        title="Privacy Policy Analyzer"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
