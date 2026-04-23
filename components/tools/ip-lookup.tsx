"use client"

export default function IpLookup() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/ip-lookup.html"
        title="IP Address Lookup"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
