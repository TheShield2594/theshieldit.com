/**
 * Generates public/sitemap.xml from the TOOLS array in lib/tools.ts.
 *
 * Run manually:   node scripts/gen-sitemap.mjs
 * Runs automatically before every build via the prebuild hook.
 */

import { readFileSync, writeFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..")

const today = new Date().toISOString().split("T")[0]
const BASE_URL = "https://theshieldit.com"

// Extract slugs from the TOOLS array in lib/tools.ts
const toolsSrc = readFileSync(join(ROOT, "lib/tools.ts"), "utf8")

// Parse href values from the TOOLS array
const hrefMatches = [...toolsSrc.matchAll(/href:\s*"([^"]+)"/g)]
const toolHrefs = hrefMatches
  .map((m) => m[1])
  .filter((href) => href.startsWith("/tools/"))

const urls = [
  // Homepage
  {
    loc: `${BASE_URL}/`,
    lastmod: today,
    changefreq: "weekly",
    priority: "1.0",
  },
  // Tool pages
  ...toolHrefs.map((href) => ({
    loc: `${BASE_URL}${href}`,
    lastmod: today,
    changefreq: "monthly",
    priority: "0.8",
  })),
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n\n")}
</urlset>
`

writeFileSync(join(ROOT, "public/sitemap.xml"), xml)
console.log(`gen-sitemap: wrote ${urls.length} URLs to public/sitemap.xml`)
