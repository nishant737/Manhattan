import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './LeadCaptureModal.css'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[0-9+\-\s()]{7,}$/

const EMPTY_FORM = { name: '', email: '', phone: '', location: '', requirement: '' }

export default function LeadCaptureModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const overlayRef = useRef(null)
  const cardRef = useRef(null)

  // Reset to a blank form each time the modal is (re)opened.
  useEffect(() => {
    if (isOpen) {
      setForm(EMPTY_FORM)
      setErrors({})
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !overlayRef.current || !cardRef.current) return

    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: 'sine.out' }
    )
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 24, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'back.out(1.4)' }
    )
  }, [isOpen])

  if (!isOpen) return null

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const validate = () => {
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Please enter your name.'
    if (!form.email.trim()) {
      nextErrors.email = 'Please enter your email.'
    } else if (!EMAIL_PATTERN.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email.'
    }
    if (!form.phone.trim()) {
      nextErrors.phone = 'Please enter your phone number.'
    } else if (!PHONE_PATTERN.test(form.phone.trim())) {
      nextErrors.phone = 'Please enter a valid phone number.'
    }
    if (!form.location.trim()) nextErrors.location = 'Please enter your location.'
    return nextErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    onSubmit({ ...form, name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), location: form.location.trim() })
  }

  const handleOverlayMouseDown = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  return (
    <div className="lead-modal-overlay" ref={overlayRef} onMouseDown={handleOverlayMouseDown}>
      <div className="lead-modal-card" ref={cardRef}>
        <button type="button" className="lead-modal-close" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <span className="lead-modal-eyebrow">Unlock This Layout</span>
        <h3 className="lead-modal-title">Share Your Details</h3>
        <p className="lead-modal-subtitle">
          Tell us a little about you and we'll reveal the complete layout right away.
        </p>

        <form className="lead-modal-form" onSubmit={handleSubmit} noValidate>
          <div className="lead-modal-field">
            <label htmlFor="lead-name">Full Name *</label>
            <input
              id="lead-name"
              type="text"
              value={form.name}
              onChange={handleChange('name')}
              className={errors.name ? 'has-error' : ''}
              placeholder="Your full name"
            />
            {errors.name && <span className="lead-modal-error">{errors.name}</span>}
          </div>

          <div className="lead-modal-field">
            <label htmlFor="lead-email">Email Address *</label>
            <input
              id="lead-email"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              className={errors.email ? 'has-error' : ''}
              placeholder="you@example.com"
            />
            {errors.email && <span className="lead-modal-error">{errors.email}</span>}
          </div>

          <div className="lead-modal-field">
            <label htmlFor="lead-phone">Phone Number *</label>
            <input
              id="lead-phone"
              type="tel"
              value={form.phone}
              onChange={handleChange('phone')}
              className={errors.phone ? 'has-error' : ''}
              placeholder="+91 98765 43210"
            />
            {errors.phone && <span className="lead-modal-error">{errors.phone}</span>}
          </div>

          <div className="lead-modal-field">
            <label htmlFor="lead-location">Your Location *</label>
            <input
              id="lead-location"
              type="text"
              value={form.location}
              onChange={handleChange('location')}
              className={errors.location ? 'has-error' : ''}
              placeholder="City you're writing from"
            />
            {errors.location && <span className="lead-modal-error">{errors.location}</span>}
          </div>

          <div className="lead-modal-field">
            <label htmlFor="lead-requirement">Your Requirement (optional)</label>
            <textarea
              id="lead-requirement"
              value={form.requirement}
              onChange={handleChange('requirement')}
              placeholder="e.g. Looking for a 3BHK for investment"
              rows={3}
            />
          </div>

          <button type="submit" className="lead-modal-submit">
            View Layout
          </button>
        </form>
      </div>
    </div>
  )
}
