"use client"

export default function PasswordManagerComparison() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/password-manager-comparison.html"
        title="Password Manager Comparison"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
