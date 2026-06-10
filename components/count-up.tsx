"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Counts from 0 to `value` on mount. Renders the final value during SSR
 * and for users who prefer reduced motion, so nothing depends on JS.
 */
export function CountUp({ value, duration = 1100 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(value)
  const frame = useRef<number>(0)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const start = performance.now()
    function step(now: number) {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(eased * value))
      if (t < 1) frame.current = requestAnimationFrame(step)
    }
    setDisplay(0)
    frame.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame.current)
  }, [value, duration])

  return <span>{display}</span>
}
