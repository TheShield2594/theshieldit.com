"use client"

export default function DevTools() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/dev-tools.html"
        title="Developer Swiss Army Knife"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
