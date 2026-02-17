"use client"

export default function LinkSafetyChecker() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/link-safety-checker.html"
        title="Link Safety Checker"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
