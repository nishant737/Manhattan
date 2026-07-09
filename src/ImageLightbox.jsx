import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import './ImageLightbox.css'

// Rendered via a portal so it always sits above the page regardless of any
// ancestor's stacking context (e.g. a GSAP-pinned section using
// position: fixed), and closes on outside click or Escape.
export default function ImageLightbox({ src, alt, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!src) return null

  const handleOverlayMouseDown = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return createPortal(
    <div className="image-lightbox-overlay" onMouseDown={handleOverlayMouseDown}>
      <button type="button" className="image-lightbox-close" onClick={onClose} aria-label="Close">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <img src={src} alt={alt} className="image-lightbox-image" />
    </div>,
    document.body
  )
}
