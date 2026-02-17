"use client"

export default function PasswordCrackingSimulator() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/password-cracking-simulator.html"
        title="Password Cracking Simulator"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
