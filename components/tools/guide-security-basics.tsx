"use client"

export default function GuideSecurityBasics() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/guide-security-basics.html"
        title="Security Basics Guide"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
