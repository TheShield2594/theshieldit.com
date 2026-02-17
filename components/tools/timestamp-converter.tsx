"use client"

export default function TimestampConverter() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/timestamp-converter.html"
        title="Unix Timestamp Converter"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
