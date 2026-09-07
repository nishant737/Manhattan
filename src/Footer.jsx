import './Footer.css'
import logoImg from './assets/Manhattan_Logo.png'
import AllegroLogo from './assets/Allegro-Logo-2-cream.png'
import MohtishamLogo from './assets/mohtisham-logo-cream.png'
import { CONTACT_DETAILS, SOCIAL_LINKS, GOOGLE_MAPS_URL } from './siteContact'

// Copy lives here so the client's final wording can drop in without touching
// the layout.
const FOOTER_COPY = {
  tagline: 'Luxury Elevated in the Heart of Mangalore.',
  exploreLabel: 'Explore',
  contactLabel: 'Contact',
  projectBy: 'A project by Allegro & Mohtisham',
  copyright: `© ${new Date().getFullYear()} Manhattan Luxury Residences. All rights reserved.`
}

// Same targets the navbar uses — App.handleNavClick resolves each id to a
// scroll or a modal.
const FOOTER_NAV = [
  { id: 'layout', label: 'Layout' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'brochure', label: 'Brochure' },
  { id: '3d-walkthrough', label: '3D Walkthrough' },
  { id: 'vr-experience', label: 'VR Experience' },
  { id: 'contact', label: 'Contact Us' }
]

const telHref = (phone) => `tel:${phone.replace(/[^\d+]/g, '')}`

export default function Footer({ onNavClick }) {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        {/* Brand */}
        <div className="site-footer-brand">
          <img src={logoImg} alt="Manhattan" className="site-footer-logo" />
          <p className="site-footer-tagline">{FOOTER_COPY.tagline}</p>

          <div className="site-footer-project-by">
            <span>{FOOTER_COPY.projectBy}</span>
            <div className="site-footer-partner-logos">
              <a href="https://allegrobuildersindia.com/" target="_blank" rel="noopener noreferrer" aria-label="Allegro Builders">
                <img src={AllegroLogo} alt="Allegro" />
              </a>
              <span className="site-footer-partner-divider" />
              <a href="https://www.mohtisham.com/" target="_blank" rel="noopener noreferrer" aria-label="Mohtisham">
                <img src={MohtishamLogo} alt="Mohtisham" />
              </a>
            </div>
          </div>

          <div className="site-footer-social">
            <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <svg viewBox="0 0 32 32" width="17" height="17" fill="currentColor" aria-hidden="true">
                <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.386.7 4.61 1.902 6.478L4 29l7.72-1.868A11.94 11.94 0 0 0 16.001 27C22.628 27 28 21.627 28 15S22.628 3 16.001 3zm0 21.818a9.77 9.77 0 0 1-4.98-1.363l-.357-.212-4.583 1.11 1.127-4.462-.233-.366A9.77 9.77 0 0 1 5.818 15c0-5.618 4.564-10.182 10.183-10.182S26.182 9.382 26.182 15 21.62 24.818 16.001 24.818z" />
              </svg>
            </a>
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4.2" />
                <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
                <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.9 3.77-3.9 1.09 0 2.24.19 2.24.19v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Explore */}
        <nav className="site-footer-col site-footer-col--nav">
          <h4 className="site-footer-col-title">{FOOTER_COPY.exploreLabel}</h4>
          <ul>
            {FOOTER_NAV.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="site-footer-link"
                  onClick={() => onNavClick?.(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div className="site-footer-col">
          <h4 className="site-footer-col-title">{FOOTER_COPY.contactLabel}</h4>

          <a
            className="site-footer-address"
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {CONTACT_DETAILS.address.map((line, i) => (
              <span key={i}>{line}</span>
            ))}
          </a>

          <ul>
            {CONTACT_DETAILS.phones.map((phone) => (
              <li key={phone}>
                <a className="site-footer-link" href={telHref(phone)}>{phone}</a>
              </li>
            ))}
          </ul>

          <ul>
            {CONTACT_DETAILS.emails.map((email) => (
              <li key={email}>
                <a className="site-footer-link" href={`mailto:${email}`}>{email}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="site-footer-bottom">
        <p className="site-footer-copyright">{FOOTER_COPY.copyright}</p>
      </div>
    </footer>
  )
}
