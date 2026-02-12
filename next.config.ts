import type { NextConfig } from "next"
import fs from "node:fs"
import path from "node:path"

const publicDir = path.join(process.cwd(), "public")
const htmlToolSlugs = fs
  .readdirSync(publicDir)
  .filter((name) => name.endsWith(".html"))
  .map((name) => name.replace(/\.html$/, ""))

const nextConfig: NextConfig = {
  async redirects() {
    return htmlToolSlugs.map((slug) => ({
      source: `/${slug}/`,
      destination: `/${slug}`,
      permanent: true,
    }))
  },
  async rewrites() {
    return [
      { source: "/favicon.ico", destination: "/favicon.svg" },
      ...htmlToolSlugs.map((slug) => ({
        source: `/${slug}`,
        destination: `/${slug}.html`,
      })),
    ]
  },
}

export default nextConfig
