import { useState, useRef, useEffect } from 'react'
import './Navbar.css'
import logoImg from './assets/Manhattan_Logo.png'

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

  const navItems = [
    { id: 'apartments', label: 'Apartments' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'about', label: 'About' },
    { id: 'brochure', label: 'Brochure' },
    { id: 'vr-walkthrough', label: '3D Walkthrough / VR' }
  ]

  const handleNavClick = (id) => {
    onNavClick(id)
  }

  const handleLogoClick = () => {
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

      {/* Mobile drawer */}
      <div className={`mobile-menu ${open ? 'mobile-menu--open' : ''}`}>
        <div className="mobile-menu-header">
          <img
            src={logoImg}
            alt="Manhattan Logo"
            className="mobile-menu-logo"
            onClick={() => { setOpen(false); handleLogoClick() }}
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

        <ul>
          {navItems.map(item => (
            <li key={item.id}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(item.id)
                  setOpen(false)
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
