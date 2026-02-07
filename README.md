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

1. **Create a new repository** on GitHub (e.g., `theshieldit-website`)

2. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/theshieldit-website.git
   cd theshieldit-website
   ```

3. **Add the index.html file** to the repository

4. **Commit and push**:
   ```bash
   git add .
   git commit -m "Initial commit: Modern privacy-focused website"
   git push origin main
   ```

5. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" in the left sidebar
   - Under "Source", select "main" branch and "/ (root)" folder
   - Click "Save"
   - Your site will be available at `https://yourusername.github.io/theshieldit-website/`

6. **Custom Domain Setup** (for theshieldit.com):
   - In repository settings → Pages, add `theshieldit.com` under "Custom domain"
   - In your domain registrar (Carrd, GoDaddy, etc.), add these DNS records:
     ```
     Type: A
     Name: @
     Value: 185.199.108.153
     
     Type: A
     Name: @
     Value: 185.199.109.153
     
     Type: A
     Name: @
     Value: 185.199.110.153
     
     Type: A
     Name: @
     Value: 185.199.111.153
     
     Type: CNAME
     Name: www
     Value: yourusername.github.io
     ```

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
