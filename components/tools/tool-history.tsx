"use client"

export default function ToolHistory() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/tool-history.html"
        title="Tool History"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
