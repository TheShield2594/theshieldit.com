export function BackgroundGlow() {
  return (
    <div
      aria-hidden="true"
      className="animate-float pointer-events-none fixed inset-0 z-0 opacity-30"
      style={{
        background: [
          "radial-gradient(ellipse 600px 400px at 15% 20%, hsl(210 100% 56% / 0.08) 0%, transparent 100%)",
          "radial-gradient(ellipse 500px 500px at 85% 75%, hsl(174 72% 46% / 0.06) 0%, transparent 100%)",
        ].join(", "),
      }}
    />
  )
}
