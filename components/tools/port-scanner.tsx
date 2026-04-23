"use client"

export default function PortScanner() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/port-scanner.html"
        title="Port Scanner"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
