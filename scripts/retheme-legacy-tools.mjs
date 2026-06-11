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
 * Old → new palette. Purples map to a darker amber so the template's
 * blue→purple gradients become a single amber ramp instead of a two-hue clash.
 */
const HEX_MAP = {
  // backgrounds (slate → near-black blue)
  "#020617": "#0b0d11",
  "#0f172a": "#0e1016",
  "#1e293b": "#181b22",
  "#334155": "#252830",
  "#475569": "#363941",
  // blues (interactive) → signal amber
  "#3b82f6": "#e3a93c",
  "#2563eb": "#d29a32",
  "#1d4ed8": "#c08c2b",
  "#60a5fa": "#ecbc62",
  "#93c5fd": "#f2cf8d",
  // purples / violets → darker amber (gradient partner)
  "#8b5cf6": "#c98e2e",
  "#7c3aed": "#b87f27",
  "#a78bfa": "#d8a951",
  "#c4b5fd": "#e6c685",
  "#6d28d9": "#a87422",
  // cyans → cobalt (brand secondary)
  "#06b6d4": "#4f86e8",
  "#22d3ee": "#6f9ded",
  "#67e8f9": "#93b6f1",
  "#0891b2": "#3f76d8",
  // text (cool white → warm paper)
  "#f8fafc": "#f0ede5",
  "#f1f5f9": "#e9e6dd",
  "#e2e8f0": "#ddd9cf",
  "#cbd5e1": "#bcb9ae",
  "#94a3b8": "#8e9088",
  "#64748b": "#75776f",
}

/** rgba()/rgb() channel triplets for the same colors (used in shadows, glows, gradients). */
const RGB_MAP = {
  "2, 6, 23": "11, 13, 17",
  "2,6,23": "11,13,17",
  "15, 23, 42": "14, 16, 22",
  "15,23,42": "14,16,22",
  "30, 41, 59": "24, 27, 34",
  "30,41,59": "24,27,34",
  "59, 130, 246": "227, 169, 60",
  "59,130,246": "227,169,60",
  "37, 99, 235": "210, 154, 50",
  "37,99,235": "210,154,50",
  "96, 165, 250": "236, 188, 98",
  "96,165,250": "236,188,98",
  "139, 92, 246": "201, 142, 46",
  "139,92,246": "201,142,46",
  "124, 58, 237": "184, 127, 39",
  "124,58,237": "184,127,39",
  "167, 139, 250": "216, 169, 81",
  "167,139,250": "216,169,81",
  "6, 182, 212": "79, 134, 232",
  "6,182,212": "79,134,232",
  "34, 211, 238": "111, 157, 237",
  "34,211,238": "111,157,237",
  "148, 163, 184": "142, 144, 136",
  "148,163,184": "142,144,136",
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
