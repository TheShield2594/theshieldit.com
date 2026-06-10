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

// Field Kit palette — keep in sync with app/globals.css
const BG = "#0b0d11"
const INK = "#e9e6dd"
const MUTED = "#8e9088"
const LINE = "rgba(233,230,221,0.16)"
const AMBER = "#e3a93c"
const COBALT = "#4f86e8"

// Body font for satori — prefer system Liberation, fall back to vendored copy
function loadBodyFonts() {
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

const { regular: fontRegular, bold: fontBold } = loadBodyFonts()
const fontDisplay = readFileSync(join(ROOT, "assets/fonts/BigShoulders-ExtraBold.ttf"))

// Count tools from the TOOLS array only (skip the Tool interface definition)
const toolsSrc = readFileSync(join(ROOT, "lib/tools.ts"), "utf8")
const toolsArraySrc = toolsSrc.slice(toolsSrc.indexOf("export const TOOLS"))
const toolCount = (toolsArraySrc.match(/^\s+title:/gm) || []).length

const specChip = (label) => ({
  type: "div",
  props: {
    style: {
      border: `1px solid ${LINE}`,
      padding: "12px 22px",
      fontSize: 19,
      letterSpacing: "2px",
      color: MUTED,
      fontWeight: 400,
    },
    children: label,
  },
})

const svg = await satori(
  {
    type: "div",
    props: {
      style: {
        background: BG,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px 72px",
        fontFamily: "sans-serif",
      },
      children: [
        // Header row: shield mark + wordmark + status
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            },
            children: [
              {
                type: "div",
                props: {
                  style: { display: "flex", alignItems: "center", gap: 18 },
                  children: [
                    {
                      type: "svg",
                      props: {
                        width: 44,
                        height: 44,
                        viewBox: "0 0 24 24",
                        fill: "none",
                        children: [
                          {
                            type: "path",
                            props: {
                              d: "M12 2.5 4 5.5v6c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10v-6l-8-3z",
                              stroke: COBALT,
                              strokeWidth: 1.6,
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                            },
                          },
                          {
                            type: "path",
                            props: { d: "M12 2.5v19", stroke: COBALT, strokeWidth: 0.9 },
                          },
                          {
                            type: "path",
                            props: { d: "M4.6 9h14.8", stroke: COBALT, strokeWidth: 0.9 },
                          },
                        ],
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          fontFamily: "Big Shoulders",
                          fontSize: 38,
                          fontWeight: 800,
                          color: INK,
                          letterSpacing: "2px",
                        },
                        children: "THE SHIELD IT",
                      },
                    },
                  ],
                },
              },
              {
                type: "div",
                props: {
                  style: { fontSize: 18, color: MUTED, letterSpacing: "3px" },
                  children: "FIELD KIT · REV. " + new Date().getFullYear(),
                },
              },
            ],
          },
        },
        // Headline
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              fontFamily: "Big Shoulders",
              fontSize: 142,
              fontWeight: 800,
              lineHeight: 0.94,
              letterSpacing: "1px",
            },
            children: [
              { type: "div", props: { style: { color: INK }, children: "CHECK IT. TEST IT." } },
              { type: "div", props: { style: { color: AMBER }, children: "SHIELD IT." } },
            ],
          },
        },
        // Spec chips
        {
          type: "div",
          props: {
            style: { display: "flex", gap: 14 },
            children: [
              specChip(`${toolCount} FREE TOOLS`),
              specChip("NO SIGN-UP"),
              specChip("RUNS IN YOUR BROWSER"),
            ],
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
      { name: "Big Shoulders", data: fontDisplay, weight: 800, style: "normal" },
    ],
  }
)

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 1200 },
})
const png = resvg.render().asPng()

writeFileSync(join(ROOT, "public/og-image.png"), png)
console.log(`✓ Generated public/og-image.png (${toolCount} tools)`)
