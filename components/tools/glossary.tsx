"use client"

export default function Glossary() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/glossary.html"
        title="Security & Privacy Glossary"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
