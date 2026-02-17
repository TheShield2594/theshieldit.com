"use client"

export default function CheatSheets() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/cheat-sheets.html"
        title="Security Cheat Sheets"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
