/**
 * Generates a static OG image (public/og-image.png) at build time.
 *
 * Uses satori to render JSX to SVG, then @resvg/resvg-js to convert to PNG.
 * Run manually:   node scripts/gen-og-image.mjs
 * Runs automatically before every build via the prebuild hook.
 */

import satori from "satori"
import { Resvg } from "@resvg/resvg-js"
import { readFileSync, writeFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..")

// Load fonts for satori — prefer system Liberation, fall back to vendored copy
function loadFonts() {
  const systemRegular = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
  const systemBold = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
  const localRegular = join(ROOT, "assets/fonts/LiberationSans-Regular.ttf")
  const localBold = join(ROOT, "assets/fonts/LiberationSans-Bold.ttf")
  try {
    return {
      regular: readFileSync(systemRegular),
      bold: readFileSync(systemBold),
    }
  } catch {
    return {
      regular: readFileSync(localRegular),
      bold: readFileSync(localBold),
    }
  }
}

const { regular: fontRegular, bold: fontBold } = loadFonts()

// Count tools from the TOOLS array only (skip the Tool interface definition)
const toolsSrc = readFileSync(join(ROOT, "lib/tools.ts"), "utf8")
const toolsArraySrc = toolsSrc.slice(toolsSrc.indexOf("export const TOOLS"))
const toolCount = (toolsArraySrc.match(/^\s+title:/gm) || []).length

const svg = await satori(
  {
    type: "div",
    props: {
      style: {
        background: "linear-gradient(135deg, #060a12 0%, #0d1525 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              width: 96,
              height: 96,
              background: "rgba(59, 130, 246, 0.15)",
              borderRadius: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 32,
            },
            children: {
              type: "svg",
              props: {
                width: 52,
                height: 52,
                viewBox: "0 0 24 24",
                fill: "none",
                children: {
                  type: "path",
                  props: {
                    d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
                    stroke: "#3b82f6",
                    strokeWidth: 2,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                  },
                },
              },
            },
          },
        },
        {
          type: "div",
          props: {
            style: {
              fontSize: 72,
              fontWeight: 800,
              color: "white",
              letterSpacing: "-2px",
              marginBottom: 16,
            },
            children: "The Shield IT",
          },
        },
        {
          type: "div",
          props: {
            style: {
              fontSize: 30,
              color: "#94a3b8",
              marginBottom: 40,
            },
            children: "Free IT & Privacy Tools You Can Trust",
          },
        },
        {
          type: "div",
          props: {
            style: { display: "flex", gap: 16 },
            children: [`${toolCount} Tools`, "No Sign-up", "100% In-browser"].map(
              (stat) => ({
                type: "div",
                props: {
                  style: {
                    background: "rgba(59, 130, 246, 0.1)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    borderRadius: 999,
                    padding: "10px 24px",
                    fontSize: 20,
                    color: "#3b82f6",
                    fontWeight: 600,
                  },
                  children: stat,
                },
              })
            ),
          },
        },
      ],
    },
  },
  {
    width: 1200,
    height: 630,
    fonts: [
      { name: "sans-serif", data: fontRegular, weight: 400, style: "normal" },
      { name: "sans-serif", data: fontBold, weight: 600, style: "normal" },
      { name: "sans-serif", data: fontBold, weight: 800, style: "normal" },
    ],
  }
)

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 1200 },
})
const png = resvg.render().asPng()

writeFileSync(join(ROOT, "public/og-image.png"), png)
console.log(`✓ Generated public/og-image.png (${toolCount} tools)`)
