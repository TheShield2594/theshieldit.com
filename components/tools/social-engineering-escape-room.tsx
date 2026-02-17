"use client"

export default function SocialEngineeringEscapeRoom() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/social-engineering-escape-room.html"
        title="Social Engineering Escape Room"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
