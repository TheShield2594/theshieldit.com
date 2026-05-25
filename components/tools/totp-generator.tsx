"use client"

export default function TotpGenerator() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/totp-generator.html"
        title="TOTP / 2FA Code Generator"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
