import './Footer.css'

// Placeholder copy — swap for the client-provided copyright/reserved-rights
// text once available. Kept as a single constant so the real text can drop
// in without touching the component's structure or styling.
const COPYRIGHT_TEXT = `© ${new Date().getFullYear()} Manhattan — Luxury Residences. All rights reserved.`

export default function Footer() {
  return (
    <footer className="site-footer">
      <p className="site-footer-copyright">{COPYRIGHT_TEXT}</p>
    </footer>
  )
}
