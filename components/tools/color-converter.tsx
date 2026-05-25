"use client"

export default function ColorConverter() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/color-converter.html"
        title="Color Code Converter"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
