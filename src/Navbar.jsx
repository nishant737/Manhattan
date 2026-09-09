import { useState, useRef, useEffect } from 'react'
import './Navbar.css'
import logoImg from './assets/Manhattan_Logo.png'
import { WHATSAPP_HREF } from './siteContact'
import { beginNavScroll } from './navScroll'

// TODO: replace with the real Instagram handle
const INSTAGRAM_URL = 'https://www.instagram.com/'
const WHATSAPP_URL = WHATSAPP_HREF

export default function Navbar({ onNavClick }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const logoRef = useRef(null)
  const linksRef = useRef([])

  useEffect(() => {
    const getThreshold = () => {
      const hero = document.querySelector('.hero-section')
      return hero ? hero.offsetHeight - 80 : window.innerHeight - 80
    }

    let ticking = false
    const handleScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > getThreshold())
        ticking = false
      })
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock the page behind the full-screen menu so it can't be scrolled at all
  // while it's open. `overflow: hidden` alone is unreliable on mobile, so we
  // also freeze <body> at its current scroll position with position: fixed and
  // restore it (and the scroll position) on close.
  useEffect(() => {
    if (!open) return
    const scrollY = window.scrollY
    const body = document.body
    const html = document.documentElement
    const prev = {
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
      bodyOverflow: body.style.overflow,
      htmlOverflow: html.style.overflow
    }
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
    body.style.overflow = 'hidden'
    html.style.overflow = 'hidden'
    return () => {
      body.style.position = prev.bodyPosition
      body.style.top = prev.bodyTop
      body.style.left = prev.bodyLeft
      body.style.right = prev.bodyRight
      body.style.width = prev.bodyWidth
      body.style.overflow = prev.bodyOverflow
      html.style.overflow = prev.htmlOverflow
      window.scrollTo(0, scrollY)
    }
  }, [open])

  const navItems = [
    { id: 'layout', label: 'Layout' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'brochure', label: 'Brochure' },
    { id: '3d-walkthrough', label: '3D Walkthrough' },
    { id: 'vr-experience', label: 'VR Experience' },
    { id: 'contact', label: 'Contact Us' }
  ]

  const handleNavClick = (id) => {
    onNavClick(id)
  }

  // From the full-screen menu: close it FIRST, then run the action on the next
  // tick. While the menu is open <body> is position:fixed for the scroll lock,
  // and its cleanup also restores the pre-menu scroll position — so a
  // scrollIntoView fired before the menu closes does nothing / gets undone.
  const closeMenuThen = (fn) => {
    setOpen(false)
    window.setTimeout(fn, 90)
  }

  const handleLogoClick = () => {
    // Suppress scroll-jacking sections while jumping to the top.
    beginNavScroll()
    const hero = document.querySelector('.hero-section')
    if (hero) {
      hero.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <img
          src={logoImg}
          alt="Manhattan Logo"
          className="navbar-logo navbar-logo-animate"
          ref={logoRef}
          onClick={handleLogoClick}
        />

        {/* Desktop links */}
        <ul className="navbar-links">
          {navItems.map((item, index) => (
            <li key={item.id} className="navbar-link-item">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); handleNavClick(item.id) }}
                className="navbar-link-animate"
                ref={(el) => { if (el) linksRef.current[index] = el }}
                style={{ '--link-index': index }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Hamburger — mobile only */}
        <button
          className={`hamburger ${open ? 'hamburger--open' : ''}`}
          onClick={() => setOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Full-screen nav overlay (hamburger on desktop-once-scrolled, and
          always on mobile — same overlay, same component, both breakpoints) */}
      <div className={`mobile-menu ${open ? 'mobile-menu--open' : ''}`}>
        <div className="mobile-menu-header">
          <img
            src={logoImg}
            alt="Manhattan Logo"
            className="mobile-menu-logo"
            onClick={() => closeMenuThen(handleLogoClick)}
          />

          <button
            className="mobile-menu-close"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <nav className="mobile-menu-primary">
          <ul>
            {navItems.map((item, index) => (
              <li key={item.id} style={{ '--item-index': index }}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    closeMenuThen(() => handleNavClick(item.id))
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mobile-menu-social">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow us on Instagram"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4.2" />
              <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
          >
            <svg viewBox="0 0 32 32" width="26" height="26" fill="currentColor" aria-hidden="true">
              <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.386.7 4.61 1.902 6.478L4 29l7.72-1.868A11.94 11.94 0 0 0 16.001 27C22.628 27 28 21.627 28 15S22.628 3 16.001 3zm0 21.818a9.77 9.77 0 0 1-4.98-1.363l-.357-.212-4.583 1.11 1.127-4.462-.233-.366A9.77 9.77 0 0 1 5.818 15c0-5.618 4.564-10.182 10.183-10.182S26.182 9.382 26.182 15 21.62 24.818 16.001 24.818zm5.593-7.626c-.306-.153-1.81-.893-2.09-.995-.28-.102-.484-.153-.687.153-.204.306-.79.995-.968 1.2-.178.203-.357.229-.663.076-.306-.153-1.293-.477-2.463-1.52-.911-.812-1.526-1.815-1.705-2.121-.178-.306-.019-.472.134-.624.138-.137.306-.357.459-.535.153-.178.204-.306.306-.51.102-.204.05-.382-.026-.535-.076-.153-.687-1.655-.941-2.267-.248-.596-.5-.516-.687-.525-.178-.008-.382-.01-.586-.01-.204 0-.535.076-.815.382-.28.306-1.069 1.044-1.069 2.546 0 1.502 1.094 2.953 1.247 3.157.153.204 2.153 3.287 5.216 4.61.729.314 1.298.502 1.741.643.732.233 1.398.2 1.925.121.587-.088 1.81-.74 2.065-1.454.255-.714.255-1.326.178-1.454-.076-.128-.28-.204-.586-.357z" />
            </svg>
          </a>
        </div>
      </div>
    </>
  )
}
