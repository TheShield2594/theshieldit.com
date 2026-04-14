# The Shield IT Website

Modern, privacy-focused website for [theshieldit.com](https://theshieldit.com)

## 🛡️ Features

- **Modern Design**: Clean, gradient-based design with smooth animations
- **Privacy-First**: Minimal tracking, uses privacy-friendly Umami analytics
- **Responsive**: Fully responsive design that works on all devices
- **Fast Loading**: Pure HTML/CSS with no external dependencies (except analytics)
- **Animated Background**: Subtle floating gradient animation
- **Interactive Cards**: Hover effects and smooth transitions
- **SEO Optimized**: Proper meta tags and semantic HTML

## 🚀 Deployment to GitHub Pages

This repo is now a **Next.js static export** and should be deployed with **GitHub Actions** (not “Deploy from branch”).

1. Push to `main`.
2. In GitHub, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. The included workflow (`.github/workflows/deploy-pages.yml`) will:
   - run `pnpm install --frozen-lockfile`
   - run `pnpm run build` (exports static files to `out/`)
   - publish `out/` to Pages


### Troubleshooting

- If your GitHub Pages URL is rendering the repository README instead of the website, Pages is still set to **Deploy from a branch**.
- Go to **Settings → Pages → Build and deployment → Source** and switch to **GitHub Actions**.
- Then re-run the `Deploy static Next.js site to GitHub Pages` workflow (or push a commit).

### Custom Domain Setup (theshieldit.com)

- Keep `CNAME` in the repo root (already present).
- In your DNS provider, point the root domain to GitHub Pages with these `A` records:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- Add `www` as a CNAME to `<your-github-username>.github.io`.
## 🎨 Customization

### Updating Social Links
Edit the social links in the HTML file around line 550:
```html
<a href="https://linkedin.com/in/theshieldit" class="social-btn">
<a href="mailto:brandon@theshieldit.com" class="social-btn">
<a href="https://instagram.com/theshieldit" class="social-btn">
```

Note: Substack link is included in the "Educational Content" card, not in the top social links.

### Changing Colors
The color scheme uses CSS variables defined at the top of the `<style>` section:
```css
:root {
  --primary: #3b82f6;      /* Blue */
  --secondary: #8b5cf6;    /* Purple */
  --accent: #06b6d4;       /* Cyan */
  --bg-dark: #0f172a;      /* Dark blue */
  --bg-darker: #020617;    /* Almost black */
}
```

### Analytics
The Umami analytics script is already integrated. Your website ID is configured in the HTML head:
```html
<script defer src="https://cloud.umami.is/script.js" data-website-id="f727bfa2-17ee-4141-82d3-a9b15d813fb6"></script>
```

## 📁 Adding More Pages

To add additional pages (like `/tools`, `/about`, etc.):

1. Create new HTML files in the same directory
2. Link to them from the main page
3. Maintain consistent styling by copying the CSS section

## 🔧 Local Development

Simply open `index.html` in your browser. No build process needed!

## 📝 License

Feel free to use this as a template for your own privacy-focused website.

## 🤝 Contributing

This is a personal website, but suggestions are welcome! Open an issue if you spot any problems.

---

Built with privacy in mind 🛡️
