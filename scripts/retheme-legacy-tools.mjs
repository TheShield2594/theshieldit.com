/**
 * One-shot codemod: re-themes the legacy standalone tool pages in public/
 * from the old slate/blue/purple palette to the Field Kit palette
 * (see app/globals.css), and links the shared override stylesheet.
 *
 * Safe to re-run — substitutions are idempotent and the stylesheet link
 * is only injected once.
 *
 * Run: node scripts/retheme-legacy-tools.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const PUBLIC = join(__dirname, "..", "public")

/**
 * Old → new palette. Field Kit blue-base → Clawdia black/orange/cream.
 * Ambers and blues become orange; near-black blues become pure black.
 */
const HEX_MAP = {
  // backgrounds (near-black blue → pure black)
  "#0b0d11": "#0d0d0d",
  "#0e1016": "#111111",
  "#181b22": "#1a1a1a",
  "#252830": "#222222",
  "#363941": "#2e2e2e",
  // legacy slate backgrounds (in case of unthemed pages)
  "#020617": "#0d0d0d",
  "#0f172a": "#111111",
  "#1e293b": "#1a1a1a",
  "#334155": "#222222",
  "#475569": "#2e2e2e",
  // signal amber / blues → bold orange
  "#e3a93c": "#e86c25",
  "#d29a32": "#d45f1a",
  "#c08c2b": "#c05518",
  "#ecbc62": "#f08040",
  "#f2cf8d": "#f5a870",
  "#3b82f6": "#e86c25",
  "#2563eb": "#d45f1a",
  "#1d4ed8": "#c05518",
  "#60a5fa": "#f08040",
  "#93c5fd": "#f5a870",
  // purples / darker amber → burnt orange
  "#c98e2e": "#c05518",
  "#b87f27": "#b04d14",
  "#d8a951": "#e07030",
  "#e6c685": "#f0a060",
  "#a87422": "#a04510",
  "#8b5cf6": "#c05518",
  "#7c3aed": "#b04d14",
  "#a78bfa": "#e07030",
  "#c4b5fd": "#f0a060",
  "#6d28d9": "#a04510",
  // cobalt → warm orange accent
  "#4f86e8": "#e86c25",
  "#6f9ded": "#f08040",
  "#93b6f1": "#f5a870",
  "#3f76d8": "#d45f1a",
  "#06b6d4": "#e86c25",
  "#22d3ee": "#f08040",
  "#67e8f9": "#f5a870",
  "#0891b2": "#d45f1a",
  // text (warm paper → cream)
  "#f0ede5": "#f0e8d8",
  "#e9e6dd": "#ede3cf",
  "#ddd9cf": "#e0d8c0",
  "#bcb9ae": "#c8c0a8",
  "#8e9088": "#a09880",
  "#75776f": "#857868",
  "#f8fafc": "#f0e8d8",
  "#f1f5f9": "#ede3cf",
  "#e2e8f0": "#e0d8c0",
  "#cbd5e1": "#c8c0a8",
  "#94a3b8": "#a09880",
  "#64748b": "#857868",
}

/** rgba()/rgb() channel triplets for the same colors (used in shadows, glows, gradients). */
const RGB_MAP = {
  // near-black blue → pure black
  "11, 13, 17": "13, 13, 13",
  "11,13,17": "13,13,13",
  "14, 16, 22": "17, 17, 17",
  "14,16,22": "17,17,17",
  "24, 27, 34": "26, 26, 26",
  "24,27,34": "26,26,26",
  // legacy slate
  "2, 6, 23": "13, 13, 13",
  "2,6,23": "13,13,13",
  "15, 23, 42": "17, 17, 17",
  "15,23,42": "17,17,17",
  "30, 41, 59": "26, 26, 26",
  "30,41,59": "26,26,26",
  // amber/blue → orange
  "227, 169, 60": "232, 108, 37",
  "227,169,60": "232,108,37",
  "210, 154, 50": "212, 95, 26",
  "210,154,50": "212,95,26",
  "236, 188, 98": "240, 128, 64",
  "236,188,98": "240,128,64",
  "59, 130, 246": "232, 108, 37",
  "59,130,246": "232,108,37",
  "37, 99, 235": "212, 95, 26",
  "37,99,235": "212,95,26",
  "96, 165, 250": "240, 128, 64",
  "96,165,250": "240,128,64",
  "201, 142, 46": "192, 85, 24",
  "201,142,46": "192,85,24",
  "184, 127, 39": "176, 77, 20",
  "184,127,39": "176,77,20",
  "216, 169, 81": "224, 112, 48",
  "216,169,81": "224,112,48",
  // cobalt → orange
  "79, 134, 232": "232, 108, 37",
  "79,134,232": "232,108,37",
  "6, 182, 212": "232, 108, 37",
  "6,182,212": "232,108,37",
  "34, 211, 238": "240, 128, 64",
  "34,211,238": "240,128,64",
  // muted text
  "142, 144, 136": "160, 152, 128",
  "142,144,136": "160,152,128",
  "148, 163, 184": "160, 152, 128",
  "148,163,184": "160,152,128",
}

const THEME_LINK = `<link rel="stylesheet" href="/field-kit-theme.css">`

const files = readdirSync(PUBLIC).filter((f) => f.endsWith(".html"))
let changed = 0

for (const file of files) {
  const path = join(PUBLIC, file)
  const before = readFileSync(path, "utf8")
  let after = before

  for (const [oldHex, newHex] of Object.entries(HEX_MAP)) {
    after = after.replaceAll(oldHex, newHex).replaceAll(oldHex.toUpperCase(), newHex)
  }
  for (const [oldRgb, newRgb] of Object.entries(RGB_MAP)) {
    after = after.replaceAll(oldRgb, newRgb)
  }

  if (!after.includes("field-kit-theme.css") && after.includes("</head>")) {
    after = after.replace("</head>", `  ${THEME_LINK}\n</head>`)
  }

  if (after !== before) {
    writeFileSync(path, after)
    changed++
  }
}

console.log(`✓ Re-themed ${changed}/${files.length} legacy tool pages`)
