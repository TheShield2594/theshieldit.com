import { ImageResponse } from "next/og"
import { TOOLS } from "@/lib/tools"

export const alt = "The Shield IT — Free IT & Privacy Tools"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #060a12 0%, #0d1525 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Shield icon */}
        <div
          style={{
            width: 96,
            height: 96,
            background: "rgba(59, 130, 246, 0.15)",
            borderRadius: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
          <svg
            width="52"
            height="52"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "white",
            letterSpacing: "-2px",
            marginBottom: 16,
          }}
        >
          The Shield IT
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 30,
            color: "#94a3b8",
            marginBottom: 40,
          }}
        >
          Free IT &amp; Privacy Tools You Can Trust
        </div>

        {/* Stats pills */}
        <div style={{ display: "flex", gap: 16 }}>
          {[`${TOOLS.length} Tools`, "No Sign-up", "100% In-browser"].map((stat) => (
            <div
              key={stat}
              style={{
                background: "rgba(59, 130, 246, 0.1)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                borderRadius: 999,
                padding: "10px 24px",
                fontSize: 20,
                color: "#3b82f6",
                fontWeight: 600,
              }}
            >
              {stat}
            </div>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
