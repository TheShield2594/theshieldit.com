export function BackgroundGlow() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Radial glow */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background: [
            "radial-gradient(ellipse 80% 40% at 50% -5%, hsl(var(--primary) / 0.12) 0%, transparent 65%)",
            "radial-gradient(ellipse 500px 400px at 85% 80%, hsl(var(--accent) / 0.05) 0%, transparent 100%)",
          ].join(", "),
        }}
      />
      {/* Subtle grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "linear-gradient(to right, hsl(var(--border) / 0.5) 1px, transparent 1px)",
            "linear-gradient(to bottom, hsl(var(--border) / 0.5) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 90% 60% at 50% 0%, black, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 60% at 50% 0%, black, transparent 80%)",
        }}
      />
    </div>
  )
}
