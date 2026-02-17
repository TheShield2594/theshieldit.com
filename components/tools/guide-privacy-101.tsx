"use client"

export default function GuidePrivacy101() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/guide-privacy-101.html"
        title="Privacy 101 Guide"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
