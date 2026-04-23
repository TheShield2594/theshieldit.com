"use client"

export default function UuidGenerator() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/uuid-generator.html"
        title="UUID Generator"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
