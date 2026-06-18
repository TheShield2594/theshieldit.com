"use client"
import { useState, useEffect } from "react"

export interface FingerprintData {
  userAgent: string
  platform: string
  language: string
  screenWidth: number
  screenHeight: number
  colorDepth: number
  deviceMemory: number | undefined
  hardwareConcurrency: number | undefined
  timezone: string
  timezoneOffset: number
  touchSupport: boolean
  maxTouchPoints: number
  pixelRatio: number
  batteryLevel: number | undefined
  batteryCharging: boolean | undefined
  canvasFingerprint: string
  audioFingerprint: string
  plugins: string
  doNotTrack: string | undefined
  cookiesEnabled: boolean
  languages: string
  connectionType: string | undefined
}

export interface SeedData {
  seed: number
  shape: "sphere" | "cube" | "torus" | "octahedron" | "icosahedron"
  colorHue: number
  colorSaturation: number
  complexity: number
  brightness: number
  rotationSpeed: number
  wireframe: boolean
  glowIntensity: number
}

// Non-standard navigator extensions
interface NavigatorExtended extends Navigator {
  getBattery?: () => Promise<{ level: number; charging: boolean }>
  deviceMemory?: number
  connection?: { effectiveType?: string }
  mozConnection?: { effectiveType?: string }
  webkitConnection?: { effectiveType?: string }
  userAgentData?: {
    platform?: string
    mobile?: boolean
    brands?: Array<{ brand: string; version: string }>
  }
}

const hashString = (str: string): number => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

const generateCanvasFingerprint = (): string => {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  if (!ctx) return ""
  canvas.width = 200
  canvas.height = 50
  ctx.textBaseline = "top"
  ctx.font = "14px Arial"
  ctx.fillStyle = "#f60"
  ctx.fillRect(125, 1, 62, 20)
  ctx.fillStyle = "#069"
  ctx.fillText("Identity Prism", 2, 15)
  ctx.fillStyle = "rgba(102, 204, 0, 0.7)"
  ctx.fillText("Identity Prism", 4, 17)
  return canvas.toDataURL()
}

/**
 * Generate an audio fingerprint using an OfflineAudioContext.
 *
 * This replaces the deprecated createScriptProcessor approach with a
 * render-free method that reads the analyser bin after a short render.
 * Falls back gracefully on unsupported browsers.
 */
const generateAudioFingerprint = async (): Promise<string> => {
  try {
    const sampleRate = 44100
    const OfflineCtx =
      window.OfflineAudioContext ??
      (window as Window & { webkitOfflineAudioContext?: typeof OfflineAudioContext }).webkitOfflineAudioContext
    if (!OfflineCtx) return "audio-unavailable"

    const ctx = new OfflineCtx(1, sampleRate, sampleRate)
    const oscillator = ctx.createOscillator()
    oscillator.type = "triangle"
    oscillator.frequency.value = 10000

    const compressor = ctx.createDynamicsCompressor()
    compressor.threshold.value = -50
    compressor.knee.value = 40
    compressor.ratio.value = 12
    compressor.attack.value = 0
    compressor.release.value = 0.25

    oscillator.connect(compressor)
    compressor.connect(ctx.destination)
    oscillator.start(0)

    const buffer = await ctx.startRendering()
    const data = buffer.getChannelData(0)
    let sum = 0
    for (let i = 0; i < data.length; i++) sum += Math.abs(data[i])
    return sum.toString()
  } catch {
    return "audio-error"
  }
}

const getConnectionType = (): string | undefined => {
  const nav = navigator as NavigatorExtended
  const connection = nav.connection ?? nav.mozConnection ?? nav.webkitConnection
  return connection?.effectiveType
}

/**
 * Get the platform string using userAgentData where available,
 * falling back to the deprecated navigator.platform.
 */
const getPlatform = (): string => {
  const nav = navigator as NavigatorExtended
  if (nav.userAgentData?.platform) return nav.userAgentData.platform
  return navigator.platform
}

export const useFingerprint = () => {
  const [fingerprint, setFingerprint] = useState<FingerprintData | null>(null)
  const [seedData, setSeedData] = useState<SeedData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const collectFingerprint = async () => {
      let batteryLevel: number | undefined
      let batteryCharging: boolean | undefined

      // Battery API is deprecated and removed in some browsers (e.g. Firefox).
      // Intentionally best-effort — fingerprint data will simply omit battery
      // info on unsupported browsers.
      try {
        const nav = navigator as NavigatorExtended
        if (nav.getBattery) {
          const battery = await nav.getBattery()
          batteryLevel = battery.level
          batteryCharging = battery.charging
        }
      } catch {
        // Battery API not supported
      }

      const audioFingerprint = await generateAudioFingerprint()

      const nav = navigator as NavigatorExtended
      const data: FingerprintData = {
        userAgent: navigator.userAgent,
        platform: getPlatform(),
        language: navigator.language,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        colorDepth: window.screen.colorDepth,
        deviceMemory: nav.deviceMemory,
        hardwareConcurrency: navigator.hardwareConcurrency,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezoneOffset: new Date().getTimezoneOffset(),
        touchSupport: "ontouchstart" in window,
        maxTouchPoints: navigator.maxTouchPoints,
        pixelRatio: window.devicePixelRatio,
        batteryLevel,
        batteryCharging,
        canvasFingerprint: generateCanvasFingerprint(),
        audioFingerprint,
        plugins: Array.from(navigator.plugins)
          .map((p) => p.name)
          .join(","),
        // doNotTrack is string | null in DOM types; coerce null → undefined
        doNotTrack: navigator.doNotTrack ?? undefined,
        cookiesEnabled: navigator.cookieEnabled,
        languages: navigator.languages?.join(",") || navigator.language,
        connectionType: getConnectionType(),
      }

      setFingerprint(data)
      generateSeedData(data)
      setIsLoading(false)
    }

    const timeout = setTimeout(collectFingerprint, 1500)
    return () => clearTimeout(timeout)
  }, [])

  const generateSeedData = (fp: FingerprintData, includeTimestamp = false) => {
    const parts = [
      fp.userAgent,
      fp.platform,
      fp.screenWidth.toString(),
      fp.screenHeight.toString(),
      fp.language,
      fp.timezone,
      fp.canvasFingerprint.slice(0, 50),
    ]
    // Timestamp is only included when regenerating so the initial seed is
    // deterministic for the same browser/device combination.
    if (includeTimestamp) parts.push(Date.now().toString())
    const combinedString = parts.join("|")

    const seed = hashString(combinedString)

    let shape: SeedData["shape"]
    const platformHash = hashString(fp.platform)
    const shapeIndex = platformHash % 5
    switch (shapeIndex) {
      case 0:
        shape = "sphere"
        break
      case 1:
        shape = "cube"
        break
      case 2:
        shape = "torus"
        break
      case 3:
        shape = "octahedron"
        break
      default:
        shape = "icosahedron"
    }

    const colorHue = seed % 360
    const colorSaturation = 50 + (seed % 40)
    const complexity = fp.hardwareConcurrency
      ? Math.min(Math.max(fp.hardwareConcurrency / 8, 0.2), 1)
      : 0.5
    const brightness = fp.batteryLevel !== undefined ? fp.batteryLevel : 0.8
    const rotationSpeed = 0.002 + (seed % 10) * 0.001
    const wireframe = seed % 3 === 0
    const glowIntensity = 0.5 + (seed % 50) / 100

    setSeedData({
      seed,
      shape,
      colorHue,
      colorSaturation,
      complexity,
      brightness,
      rotationSpeed,
      wireframe,
      glowIntensity,
    })
  }

  const regenerate = () => {
    setIsLoading(true)
    setTimeout(() => {
      if (fingerprint) {
        generateSeedData(fingerprint, true)
      }
      setIsLoading(false)
    }, 100)
  }

  return { fingerprint, seedData, isLoading, regenerate }
}

export const getDataDescription = (
  key: keyof FingerprintData,
  value: unknown
): string => {
  const descriptions: Record<string, string> = {
    userAgent: "Your browser's unique signature",
    platform: "Your operating system",
    language: "Your preferred language",
    screenWidth: "Display width in pixels",
    screenHeight: "Display height in pixels",
    colorDepth: "Color depth for display",
    deviceMemory: "Amount of RAM detected",
    hardwareConcurrency: "Number of CPU cores",
    timezone: "Your timezone location",
    timezoneOffset: "Timezone offset from UTC",
    touchSupport: "Touch screen capability",
    maxTouchPoints: "Number of touch points",
    pixelRatio: "Display pixel density",
    batteryLevel: "Current battery percentage",
    batteryCharging: "Battery charging status",
    canvasFingerprint: "Unique canvas rendering signature",
    audioFingerprint: "Unique audio processing signature",
    plugins: "Installed browser plugins",
    doNotTrack: "Do Not Track setting",
    cookiesEnabled: "Cookie support status",
    languages: "All detected languages",
    connectionType: "Network connection type",
  }
  return descriptions[key] || key
}
