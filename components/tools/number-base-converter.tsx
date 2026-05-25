"use client"

export default function NumberBaseConverter() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/number-base-converter.html"
        title="Number Base Converter"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
