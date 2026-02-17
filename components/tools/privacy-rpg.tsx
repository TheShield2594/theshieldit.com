"use client"

export default function PrivacyRpg() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/privacy-rpg.html"
        title="Privacy Guardian"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
