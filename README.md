# The Shield IT Website

Modern, privacy-focused website for [theshieldit.com](https://theshieldit.com)

## 🛡️ Features

- **Next.js 15**: App Router with static export (`output: "export"`)
- **TypeScript + Tailwind v4**: Typed components styled with the Field Kit design system
- **Privacy-First**: Minimal tracking, uses privacy-friendly Umami analytics
- **Responsive**: Fully responsive design that works on all devices
- **Legacy Tool Pages**: Standalone HTML tools under `public/` get a shared nav/footer via `public/shared-shell.js`
- **SEO Optimized**: Generated sitemap, OG image, and proper meta tags

## 🔧 Local Development

This project uses [pnpm](https://pnpm.io/):

```bash
pnpm install
pnpm dev
```

This starts the Next.js dev server (with Turbopack) at `http://localhost:3000`.

To produce a production static export locally:

```bash
pnpm build
```

This generates the tools map, OG image, and sitemap, then exports static files to `out/`.

## 🚀 Deployment

This repo supports two deployment paths — check which one is actually wired up for your environment before assuming:

### Vercel

`vercel.json` configures the build (`pnpm build`), security headers, and CSP. If the project is connected to Vercel, pushes are deployed automatically.

### GitHub Pages

The workflow at `.github/workflows/deploy-pages.yml` builds the static export and publishes `out/` to GitHub Pages on every push to `main`. To use this path:

1. In GitHub, go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.

#### Custom Domain Setup (theshieldit.com)

- Keep `CNAME` in the repo root (already present).
- In your DNS provider, point the root domain to GitHub Pages with these `A` records:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- Add `www` as a CNAME to `<your-github-username>.github.io`.

#### CNAME Files

There are two `CNAME` files in this repo:

| File | Purpose |
|------|---------|
| `CNAME` (repo root) | GitHub Pages custom domain configuration |
| `public/CNAME` | Copied to `out/` during the Next.js static export build |

Both files **must contain the same domain** and be updated together if the
custom domain ever changes. The build copies everything in `public/` to the
output directory, so a mismatch would cause Pages to serve the wrong domain.

## 🎨 Customization

### Updating Site Content

The main site is built from React components under `app/` and `components/`. There's no single HTML file to edit — update the relevant component (e.g. `components/site-header.tsx`, `components/site-footer.tsx`) and the change will apply across the site.

### Changing Colors

The color scheme uses CSS custom properties defined in `app/globals.css`:

```css
:root {
  --background: 20 13% 5%;   /* #0d0b0a */
  --foreground: 30 50% 96%;  /* #faf5f0 */
  --primary: 25 95% 53%;     /* #f97316 */
  --border: 30 17% 14%;      /* #2a241e */
}
```

Legacy static tool pages under `public/` get their nav/footer styling from `public/shared-shell.js`, which mirrors this same palette and should be kept in sync if the theme changes.

### Analytics

The Umami analytics script is integrated site-wide. Your website ID is configured wherever the analytics script tag is rendered (search the codebase for `cloud.umami.is`).

## 📁 Adding More Pages

To add a new page to the Next.js app, create a new route under `app/` (e.g. `app/about/page.tsx`) following the conventions of existing routes.

To add a new standalone tool page, see `scripts/gen-tools-map.mjs` and the existing entries under `public/` and `app/tools/`.

## 📝 License

Feel free to use this as a template for your own privacy-focused website.

## 🤝 Contributing

This is a personal website, but suggestions are welcome! Open an issue if you spot any problems.

---

Built with privacy in mind 🛡️
