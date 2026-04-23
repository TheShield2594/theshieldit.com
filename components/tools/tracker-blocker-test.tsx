"use client"

export default function TrackerBlockerTest() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/tracker-blocker-test.html"
        title="Tracker Blocker Test"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
