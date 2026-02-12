export function SiteFooter() {
  return (
    <footer className="border-t border-border py-8 text-center">
      <p className="text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} The Shield IT &middot; No tracking
        except{" "}
        <a
          href="https://umami.is"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary transition-colors hover:text-accent"
        >
          privacy-friendly analytics
        </a>
      </p>
    </footer>
  )
}
