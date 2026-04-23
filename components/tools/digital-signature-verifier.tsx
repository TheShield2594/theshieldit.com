"use client"

export default function DigitalSignatureVerifier() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/digital-signature-verifier.html"
        title="Digital Signature Verifier"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
