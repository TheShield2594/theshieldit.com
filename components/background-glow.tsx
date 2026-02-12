export function BackgroundGlow() {
  return (
    <div
      aria-hidden="true"
      className="animate-float pointer-events-none fixed inset-0 z-0 opacity-40"
      style={{
        background: [
          "radial-gradient(circle at 20% 50%, hsl(217 91% 60% / 0.08) 0%, transparent 50%)",
          "radial-gradient(circle at 80% 80%, hsl(188 95% 43% / 0.08) 0%, transparent 50%)",
          "radial-gradient(circle at 40% 20%, hsl(217 91% 60% / 0.06) 0%, transparent 50%)",
        ].join(", "),
      }}
    />
  )
}
