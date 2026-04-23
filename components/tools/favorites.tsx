"use client"

export default function Favorites() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/favorites.html"
        title="Favorite Tools"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
