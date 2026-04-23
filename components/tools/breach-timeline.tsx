"use client"

export default function BreachTimeline() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/breach-timeline.html"
        title="Data Breach Timeline"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
