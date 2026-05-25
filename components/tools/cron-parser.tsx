"use client"

export default function CronParser() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/cron-parser.html"
        title="Cron Expression Parser"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
