"use client"

export default function DnsLeakTest() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/dns-leak-test.html"
        title="DNS Leak Test"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
