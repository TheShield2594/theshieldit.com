"use client"

export default function TextCaseConverter() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/text-case-converter.html"
        title="Text Case Converter"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
