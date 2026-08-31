import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import SearchableSelect from './SearchableSelect'
import { PHONE_CODE_OPTIONS, validateContactFields, formatPhoneForSubmit } from './leadFormShared'
import './LeadCaptureModal.css'

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  phoneCountry: 'IN',
  requirement: ''
}

export default function LeadCaptureModal({
  isOpen,
  onClose,
  onSubmit,
  eyebrow = 'Unlock This Layout',
  title = 'Share Your Details',
  subtitle = "Tell us a little about you and we'll reveal the complete layout right away.",
  submitLabel = 'View Layout'
}) {
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

  const handlePhoneCountryChange = (nextCountry) => {
    setForm((prev) => ({ ...prev, phoneCountry: nextCountry }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = validateContactFields(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSubmit({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: formatPhoneForSubmit(form.phone, form.phoneCountry),
      requirement: form.requirement.trim()
    })
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

        <span className="lead-modal-eyebrow">{eyebrow}</span>
        <h3 className="lead-modal-title">{title}</h3>
        <p className="lead-modal-subtitle">{subtitle}</p>

        <form className="lead-modal-form" onSubmit={handleSubmit} noValidate>
          <div className="lead-modal-field">
            <label htmlFor="lead-name">Full Name</label>
            <input
              id="lead-name"
              type="text"
              value={form.name}
              onChange={handleChange('name')}
              placeholder="Your full name"
            />
          </div>

          <div className="lead-modal-field">
            <label htmlFor="lead-email">Email Address</label>
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
            <label htmlFor="lead-phone">Mobile Number</label>
            <div className="lead-modal-phone-row">
              <SearchableSelect
                id="lead-phone-country"
                value={form.phoneCountry}
                options={PHONE_CODE_OPTIONS}
                onChange={handlePhoneCountryChange}
                triggerClassName="lead-modal-phone-code"
                panelWidth={260}
                ariaLabel="Phone country code"
                searchPlaceholder="Search country or code…"
              />
              <input
                id="lead-phone"
                type="tel"
                value={form.phone}
                onChange={handleChange('phone')}
                className={errors.phone ? 'has-error' : ''}
                placeholder="98765 43210"
              />
            </div>
            {errors.phone && <span className="lead-modal-error">{errors.phone}</span>}
            <span className="lead-modal-hint">Please provide either your email or mobile number.</span>
          </div>

          <div className="lead-modal-field">
            <label htmlFor="lead-requirement">Your Requirement (optional)</label>
            <textarea
              id="lead-requirement"
              value={form.requirement}
              onChange={handleChange('requirement')}
              placeholder="e.g. Looking for a 3 BHK for investment"
              rows={3}
            />
          </div>

          <button type="submit" className="lead-modal-submit">
            {submitLabel}
          </button>
        </form>
      </div>
    </div>
  )
}
