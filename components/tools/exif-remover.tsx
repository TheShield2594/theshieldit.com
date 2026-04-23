"use client"

export default function ExifRemover() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/exif-remover.html"
        title="EXIF Metadata Remover"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
