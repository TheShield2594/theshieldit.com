"use client"

export default function PrivacyScore() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/privacy-score.html"
        title="Privacy Score Calculator"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
