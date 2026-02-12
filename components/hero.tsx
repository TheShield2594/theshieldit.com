import { Shield } from "lucide-react"

export function Hero() {
  return (
    <section className="py-12 text-center md:py-16">
      <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 ring-1 ring-primary/25">
        <Shield className="h-7 w-7 text-primary" />
      </div>
      <h1 className="mx-auto max-w-2xl text-balance text-3xl font-extrabold tracking-tight text-foreground md:text-5xl leading-[1.15]">
        IT & Privacy Tools
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
        Free, open-source tools that run entirely in your browser. No sign-up,
        no data collection.
      </p>
    </section>
  )
}
