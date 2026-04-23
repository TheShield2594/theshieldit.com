"use client"

export default function SecurityTrivia() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/security-trivia.html"
        title="Security Trivia Challenge"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
