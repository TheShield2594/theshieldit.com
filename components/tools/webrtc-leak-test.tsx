"use client"

export default function WebrtcLeakTest() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/webrtc-leak-test.html"
        title="WebRTC Leak Test"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
