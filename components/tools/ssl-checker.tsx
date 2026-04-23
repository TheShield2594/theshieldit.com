"use client"

export default function SslChecker() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/ssl-checker.html"
        title="SSL Certificate Checker"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
