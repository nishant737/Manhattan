import { useState } from 'react'
import './Navbar.css'

export default function Navbar({ onNavClick }) {
  const [open, setOpen] = useState(false)

  const navItems = [
    { id: 'standard', label: 'Standard Apartments' },
    { id: 'refuge', label: 'Refuge Floor Apartments' },
    { id: 'lower-duplex', label: 'Lower Duplex Units' },
    { id: 'upper-duplex', label: 'Upper Duplex Units' }
  ]

  const handleNavClick = (id) => {
    onNavClick(id)
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">MANHATTAN</div>

        {/* Desktop links */}
        <ul className="navbar-links">
          {navItems.map(item => (
            <li key={item.id}>
              <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick(item.id) }}>
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
