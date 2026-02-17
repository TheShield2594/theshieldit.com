"use client"

export default function UrlEncoder() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/url-encoder.html"
        title="URL Encoder / Decoder"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
