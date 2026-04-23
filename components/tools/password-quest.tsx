"use client"

export default function PasswordQuest() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/password-quest.html"
        title="Password Strength Tester"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
