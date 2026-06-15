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
 * Old → Clawdia palette.
 * Source: Clawdia unified design system CSS.
 *   bg-0=#0d0b0a  bg-1=#141210  bg-2=#1c1916  ink-800=#2a241e
 *   text=#faf5f0  text-dim=#a49b92  text-mute=#6b6258
 *   claw-500=#d97742  claw-400=#e89163  claw-600=#c25f2e
 *   accent=#f97316 (orange-500)
 */
const HEX_MAP = {
  // backgrounds (near-black blue → Clawdia warm near-black)
  "#0b0d11": "#0d0b0a",
  "#0e1016": "#141210",
  "#181b22": "#1c1916",
  "#252830": "#221d18",
  "#363941": "#2a241e",
  // first-pass intermediate values → Clawdia (idempotent second pass)
  "#0d0d0d": "#0d0b0a",
  "#111111": "#141210",
  "#1a1a1a": "#1c1916",
  "#222222": "#221d18",
  "#2e2e2e": "#2a241e",
  "#e86c25": "#f97316",
  "#d45f1a": "#d97742",
  "#c05518": "#c25f2e",
  "#f08040": "#e89163",
  "#f5a870": "#f0ad88",
  "#f0a060": "#f0ad88",
  "#b04d14": "#b85520",
  "#a04510": "#a84a18",
  "#f0e8d8": "#faf5f0",
  "#ede3cf": "#f3ecdd",
  "#e0d8c0": "#e8dec6",
  "#c8c0a8": "#d4cbb9",
  "#a09880": "#a49b92",
  "#857868": "#6b6258",
  // legacy slate (unthemed pages)
  "#020617": "#0d0b0a",
  "#0f172a": "#141210",
  "#1e293b": "#1c1916",
  "#334155": "#221d18",
  "#475569": "#2a241e",
  // signal amber → claw-500 / accent orange
  "#e3a93c": "#f97316",
  "#d29a32": "#d97742",
  "#c08c2b": "#c25f2e",
  "#ecbc62": "#e89163",
  "#f2cf8d": "#f0ad88",
  // blues → claw-500 orange
  "#3b82f6": "#f97316",
  "#2563eb": "#d97742",
  "#1d4ed8": "#c25f2e",
  "#60a5fa": "#e89163",
  "#93c5fd": "#f0ad88",
  // purples → deeper claw oranges
  "#c98e2e": "#c25f2e",
  "#b87f27": "#b85520",
  "#d8a951": "#d97742",
  "#e6c685": "#e89163",
  "#a87422": "#a84a18",
  "#8b5cf6": "#c25f2e",
  "#7c3aed": "#b85520",
  "#a78bfa": "#d97742",
  "#c4b5fd": "#e89163",
  "#6d28d9": "#a84a18",
  // cobalt → claw-500 orange
  "#4f86e8": "#f97316",
  "#6f9ded": "#e89163",
  "#93b6f1": "#f0ad88",
  "#3f76d8": "#d97742",
  "#06b6d4": "#f97316",
  "#22d3ee": "#e89163",
  "#67e8f9": "#f0ad88",
  "#0891b2": "#d97742",
  // text (warm paper → Clawdia cream)
  "#f0ede5": "#faf5f0",
  "#e9e6dd": "#f3ecdd",
  "#ddd9cf": "#e8dec6",
  "#bcb9ae": "#d4cbb9",
  "#8e9088": "#a49b92",
  "#75776f": "#6b6258",
  "#f8fafc": "#faf5f0",
  "#f1f5f9": "#f3ecdd",
  "#e2e8f0": "#e8dec6",
  "#cbd5e1": "#d4cbb9",
  "#94a3b8": "#a49b92",
  "#64748b": "#6b6258",
}

/** rgba()/rgb() channel triplets for the same colors (used in shadows, glows, gradients). */
const RGB_MAP = {
  // near-black blue → Clawdia bg-0 warm near-black
  "11, 13, 17": "13, 11, 10",
  "11,13,17": "13,11,10",
  "14, 16, 22": "20, 18, 16",
  "14,16,22": "20,18,16",
  "24, 27, 34": "28, 25, 22",
  "24,27,34": "28,25,22",
  // legacy slate
  "2, 6, 23": "13, 11, 10",
  "2,6,23": "13,11,10",
  "15, 23, 42": "20, 18, 16",
  "15,23,42": "20,18,16",
  "30, 41, 59": "28, 25, 22",
  "30,41,59": "28,25,22",
  // amber/blue → accent orange (#f97316)
  "227, 169, 60": "249, 115, 22",
  "227,169,60": "249,115,22",
  "210, 154, 50": "217, 119, 66",
  "210,154,50": "217,119,66",
  "236, 188, 98": "232, 145, 99",
  "236,188,98": "232,145,99",
  "59, 130, 246": "249, 115, 22",
  "59,130,246": "249,115,22",
  "37, 99, 235": "217, 119, 66",
  "37,99,235": "217,119,66",
  "96, 165, 250": "232, 145, 99",
  "96,165,250": "232,145,99",
  "201, 142, 46": "194, 95, 46",
  "201,142,46": "194,95,46",
  "184, 127, 39": "217, 119, 66",
  "184,127,39": "217,119,66",
  "216, 169, 81": "232, 145, 99",
  "216,169,81": "232,145,99",
  // cobalt → accent orange
  "79, 134, 232": "249, 115, 22",
  "79,134,232": "249,115,22",
  "6, 182, 212": "249, 115, 22",
  "6,182,212": "249,115,22",
  "34, 211, 238": "232, 145, 99",
  "34,211,238": "232,145,99",
  // muted text → Clawdia text-dim
  "142, 144, 136": "164, 155, 146",
  "142,144,136": "164,155,146",
  "148, 163, 184": "164, 155, 146",
  "148,163,184": "164,155,146",
  // first-pass intermediate rgba triplets (idempotency — second pass)
  "232, 108, 37": "249, 115, 22",
  "232,108,37": "249,115,22",
  "192, 85, 24": "194, 95, 46",
  "192,85,24": "194,95,46",
  "13, 13, 13": "13, 11, 10",
  "13,13,13": "13,11,10",
  "17, 17, 17": "20, 18, 16",
  "17,17,17": "20,18,16",
  "26, 26, 26": "28, 25, 22",
  "26,26,26": "28,25,22",
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
