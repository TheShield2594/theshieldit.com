"use client"

export default function NetworkDefenseGame() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/network-defense-game.html"
        title="Network Defense Game"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
