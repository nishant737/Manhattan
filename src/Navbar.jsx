import { useState, useRef } from 'react'
import './Navbar.css'

export default function Navbar({ onNavClick }) {
  const [open, setOpen] = useState(false)
  const logoRef = useRef(null)
  const linksRef = useRef([])

  const navItems = [
    { id: 'standard', label: 'Standard Apartments' },
    { id: 'refuge', label: 'Refuge Floor Apartments' },
    { id: 'duplex', label: 'Duplex Unit' },
    { id: 'sky-lounge', label: 'Sky Lounge' }
  ]

  const handleNavClick = (id) => {
    onNavClick(id)
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo navbar-logo-animate" ref={logoRef}>MANHATTAN</div>

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
          <div className="mobile-menu-logo">MANHATTAN</div>
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
