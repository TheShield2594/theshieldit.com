"use client"

export default function PhishingQuiz() {
  return (
    <div className="flex flex-1 flex-col">
      <iframe
        src="/phishing-quiz.html"
        title="Phishing Email Quiz"
        className="flex-1 w-full border-0 bg-background"
        style={{ minHeight: "calc(100dvh - 220px)" }}
        allow="fullscreen"
      />
    </div>
  )
}
