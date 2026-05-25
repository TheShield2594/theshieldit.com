"use client"

export default function DnsLookup() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/dns-lookup.html"
        title="DNS Record Lookup"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
