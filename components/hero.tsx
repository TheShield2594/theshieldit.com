import { Shield, Zap, Lock, Globe } from "lucide-react"

const STATS = [
  { icon: Zap, label: "Free tools", value: "16" },
  { icon: Lock, label: "No sign-up", value: "100%" },
  { icon: Globe, label: "In-browser", value: "All" },
]

export function Hero() {
  return (
    <section className="relative py-16 text-center md:py-24">
      {/* Badge */}
      <div className="animate-fade-in-up mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-xs font-medium text-muted-foreground">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
        </span>
        Open source &middot; Privacy first
      </div>

      {/* Headline */}
      <h1 className="animate-fade-in-up stagger-1 mx-auto max-w-3xl text-balance text-4xl font-extrabold tracking-tight text-foreground md:text-6xl leading-[1.1]">
        IT & Privacy Tools{" "}
        <span className="text-primary">You Can Trust</span>
      </h1>

      {/* Subhead */}
      <p className="animate-fade-in-up stagger-2 mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
        Free, open-source utilities that run entirely in your browser.
        No accounts, no data collection, no compromises.
      </p>

      {/* Stats row */}
      <div className="animate-fade-in-up stagger-3 mx-auto mt-10 flex max-w-md items-center justify-center gap-8 md:gap-12">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <stat.icon className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-foreground">{stat.value}</span>
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
