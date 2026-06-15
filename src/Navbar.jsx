import { useState } from 'react'
import './Navbar.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">MANHATTAN</div>

        {/* Desktop links */}
        <ul className="navbar-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#stats">Stats</a></li>
          <li><a href="#contact">Contact</a></li>
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
          <li><a href="#home"    onClick={() => setOpen(false)}>Home</a></li>
          <li><a href="#about"   onClick={() => setOpen(false)}>About</a></li>
          <li><a href="#stats"   onClick={() => setOpen(false)}>Stats</a></li>
          <li><a href="#contact" onClick={() => setOpen(false)}>Contact</a></li>
        </ul>
      </div>
    </>
  )
}
