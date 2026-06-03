"use client"

import { useState, useRef, useCallback } from "react"
import dynamic from "next/dynamic"
import {
  Shield,
  RefreshCw,
  Download,
  Info,
  X,
  ChevronRight,
  Cpu,
  Monitor,
  Globe,
  Battery,
  Eye,
} from "lucide-react"
import { useFingerprint, type SeedData, type FingerprintData } from "@/hooks/useFingerprint"

const PrismCanvas = dynamic(
  () => import("./identity-prism/PrismCanvas").then((m) => m.PrismCanvas),
  { ssr: false }
)

const scanningMessages = [
  "Analyzing user agent signature...",
  "Mapping screen dimensions...",
  "Detecting GPU renderer...",
  "Probing hardware concurrency...",
  "Reading timezone data...",
  "Scanning canvas fingerprint...",
  "Processing audio context...",
  "Collecting battery status...",
  "Evaluating touch capabilities...",
  "Finalizing unique identifier...",
]

function DataItem({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string | number | undefined
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3 transition-colors hover:bg-white/10">
      <div className="rounded-lg bg-cyan-500/20 p-2">
        <Icon className="h-4 w-4 text-cyan-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="truncate text-sm font-medium">{value ?? "N/A"}</p>
      </div>
    </div>
  )
}

function LoadingScreen({ messageIndex }: { messageIndex: number }) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="relative h-32 w-32">
        <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-cyan-400" />
        <div
          className="absolute inset-4 rounded-full border-4 border-transparent border-t-pink-400"
          style={{ animationDirection: "reverse", animationDuration: "1.5s", animation: "spin 1.5s linear infinite reverse" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Shield className="h-8 w-8 text-cyan-400" />
        </div>
      </div>
      <div className="mt-8 text-center">
        <p
          className="font-mono text-lg"
          style={{
            background: "linear-gradient(90deg, #38bdf8 0%, #f472b6 50%, #38bdf8 100%)",
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "shimmer 2s infinite",
          }}
        >
          {scanningMessages[messageIndex]}
        </p>
      </div>
      <div className="mt-2 flex gap-1">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-1 w-1 rounded-full bg-cyan-400"
            style={{ opacity: 0.3 + (i % 3) * 0.3, animation: `pulse 1s infinite ${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  )
}

function AboutModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-8"
        style={{
          background: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(56, 189, 248, 0.2)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 transition-colors hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-cyan-500 to-pink-500 p-3">
            <Eye className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">About Your Digital Fingerprint</h2>
            <p className="text-slate-400">Why your browser is uniquely identifiable</p>
          </div>
        </div>

        <div className="space-y-4 text-slate-300">
          <p>
            Your browser reveals a surprising amount of information about you and your device, even without you logging
            in or accepting cookies. This is called{" "}
            <span className="font-semibold text-cyan-400">browser fingerprinting</span>.
          </p>

          <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4">
            <h3 className="mb-2 font-semibold text-cyan-400">What we collected:</h3>
            <ul className="space-y-2 text-sm">
              {[
                "Browser type, version, and platform",
                "Screen resolution and pixel density",
                "Installed fonts and plugins",
                "Hardware capabilities (CPU cores, RAM)",
                "Battery status and charging state",
                "Timezone and language preferences",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-cyan-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <p>
            Advertisers and trackers combine these data points to create a unique "fingerprint" that can identify you
            across different websites, even in incognito mode. This is why the art piece you see is unique to your
            browser!
          </p>

          <div className="rounded-xl border border-pink-500/30 bg-pink-500/10 p-4">
            <h3 className="mb-2 font-semibold text-pink-400">Protect yourself:</h3>
            <ul className="space-y-2 text-sm">
              {[
                "Use privacy-focused browsers (Brave, Firefox)",
                'Enable "Resist Fingerprinting" in browser settings',
                "Use browser extensions like Privacy Badger",
                "Disable JavaScript on untrusted sites",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-pink-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-slate-500">
            <span className="font-semibold">Privacy Note:</span> This app runs entirely in your browser. No data is
            sent to any server. Your fingerprint is generated locally and never stored.
          </p>
        </div>
      </div>
    </div>
  )
}

function DataPanel({
  fingerprint,
  seedData,
  onClose,
}: {
  fingerprint: FingerprintData
  seedData: SeedData
  onClose: () => void
}) {
  const shapeDescriptions: Record<string, string> = {
    sphere: "Mac / iOS detected — Smooth curves",
    cube: "Windows detected — Boxy architecture",
    torus: "Linux detected — Ring-like structure",
    octahedron: "Gaming platform detected — Sharp geometry",
    icosahedron: "Mobile device detected — Complex facets",
  }

  return (
    <div
      className="absolute right-4 top-4 bottom-20 w-72 z-20 flex flex-col overflow-hidden rounded-2xl p-4"
      style={{
        background: "rgba(15, 23, 42, 0.8)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(56, 189, 248, 0.2)",
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold text-white">
          <Cpu className="h-4 w-4 text-cyan-400" />
          Fingerprint DNA
        </h3>
        <button onClick={onClose} className="rounded p-1 transition-colors hover:bg-white/10">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        <div
          className="rounded-lg p-3"
          style={{ background: "linear-gradient(to right, rgba(6,182,212,0.2), rgba(244,114,182,0.2))", border: "1px solid rgba(6,182,212,0.3)" }}
        >
          <p className="mb-1 text-xs text-slate-400">Unique Seed</p>
          <p
            className="font-mono text-lg font-bold"
            style={{
              background: "linear-gradient(135deg, #38bdf8 0%, #f472b6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {seedData.seed}
          </p>
        </div>

        <div className="rounded-lg bg-white/5 p-3">
          <p className="mb-1 text-xs text-slate-400">Shape Origin</p>
          <p className="text-sm font-medium text-white">
            {seedData.shape} — {shapeDescriptions[seedData.shape] ?? "Unique geometry"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Hue", value: `${seedData.colorHue}°` },
            { label: "Saturation", value: `${seedData.colorSaturation}%` },
            { label: "Complexity", value: `${(seedData.complexity * 100).toFixed(0)}%` },
            { label: "Glow", value: seedData.glowIntensity.toFixed(2) },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg bg-white/5 p-2">
              <p className="text-xs text-slate-400">{label}</p>
              <p className="font-mono text-sm text-white">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 border-t border-white/10 pt-3">
          <p className="mb-2 text-xs text-slate-400">Detected Data Points</p>
          <div className="space-y-2">
            <DataItem label="Platform" value={fingerprint.platform} icon={Monitor} />
            <DataItem
              label="Screen"
              value={`${fingerprint.screenWidth} × ${fingerprint.screenHeight}`}
              icon={Monitor}
            />
            <DataItem label="Language" value={fingerprint.language} icon={Globe} />
            <DataItem label="CPU Cores" value={fingerprint.hardwareConcurrency} icon={Cpu} />
            <DataItem
              label="Battery"
              value={
                fingerprint.batteryLevel !== undefined
                  ? `${Math.round(fingerprint.batteryLevel * 100)}%`
                  : undefined
              }
              icon={Battery}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BrowserFingerprint() {
  const { fingerprint, seedData, isLoading, regenerate } = useFingerprint()
  const [showAbout, setShowAbout] = useState(false)
  const [showData, setShowData] = useState(false)
  const [msgIndex, setMsgIndex] = useState(0)

  // Cycle scanning messages during load
  useState(() => {
    if (!isLoading) return
    const id = setInterval(() => setMsgIndex((i) => (i + 1) % scanningMessages.length), 200)
    return () => clearInterval(id)
  })

  const handleDownload = useCallback(() => {
    const canvas = document.querySelector("canvas")
    if (canvas) {
      const link = document.createElement("a")
      link.download = `identity-prism-${seedData?.seed ?? "art"}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    }
  }, [seedData])

  return (
    <>
      {/* Inject shimmer keyframe once */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      <div className="relative flex flex-1 flex-col overflow-hidden bg-slate-900" style={{ minHeight: "calc(100dvh - 220px)" }}>
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 30% 20%, rgba(56,189,248,0.1), transparent 50%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 70% 80%, rgba(244,114,182,0.1), transparent 50%)" }} />

        {isLoading || !seedData ? (
          <div className="relative z-10 flex flex-1 items-center justify-center">
            <LoadingScreen messageIndex={msgIndex} />
          </div>
        ) : (
          <>
            {/* 3D Canvas */}
            <div className="absolute inset-0 z-10">
              <PrismCanvas seedData={seedData} isLoading={isLoading} />
            </div>

            {/* Status badge */}
            <div className="absolute right-4 top-4 z-30 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              <span className="text-slate-300">Local Only</span>
            </div>

            {/* Controls */}
            <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-3">
              {[
                { onClick: regenerate, icon: <RefreshCw className="h-5 w-5 text-cyan-400" />, label: "Regenerate" },
                { onClick: handleDownload, icon: <Download className="h-5 w-5 text-pink-400" />, label: "Download" },
                {
                  onClick: () => setShowData((v) => !v),
                  icon: <Cpu className={`h-5 w-5 ${showData ? "text-cyan-400" : "text-slate-400"}`} />,
                  label: "DNA",
                  active: showData,
                },
                { onClick: () => setShowAbout(true), icon: <Info className="h-5 w-5 text-slate-400" />, label: "About" },
              ].map(({ onClick, icon, label, active }) => (
                <button
                  key={label}
                  onClick={onClick}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: active ? "rgba(6,182,212,0.2)" : "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(20px)",
                    border: active ? "1px solid rgba(6,182,212,0.5)" : "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {icon}
                  <span>{label}</span>
                </button>
              ))}
            </div>

            <p className="absolute bottom-20 left-1/2 z-20 -translate-x-1/2 rounded-full px-4 py-2 text-xs text-slate-500" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)" }}>
              Drag to rotate • Scroll to zoom
            </p>

            {/* DNA panel */}
            {showData && fingerprint && seedData && (
              <DataPanel fingerprint={fingerprint} seedData={seedData} onClose={() => setShowData(false)} />
            )}
          </>
        )}

        {/* About modal */}
        {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      </div>
    </>
  )
}
