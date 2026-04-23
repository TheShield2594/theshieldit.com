"use client"

export default function CertificateDecoder() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/certificate-decoder.html"
        title="Certificate Decoder"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
