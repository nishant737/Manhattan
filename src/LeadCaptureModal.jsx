import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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

// idle → submitting → (success | error). `error` falls back to `idle` as soon
// as the visitor edits a field again, so a failed attempt can just be retried.
const STATUS = {
  IDLE: 'idle',
  SUBMITTING: 'submitting',
  SUCCESS: 'success',
  ERROR: 'error'
}

export default function LeadCaptureModal({
  isOpen,
  onClose,
  onSubmit,
  eyebrow = 'Unlock This Layout',
  title = 'Share Your Details',
  subtitle = "Tell us a little about you and we'll reveal the complete layout right away.",
  submitLabel = 'View Layout',
  loadingLabel = 'Please wait…',
  successTitle = 'You’re All Set',
  successMessage = 'Thank you. Your details have been received.',
  // When set, the modal auto-closes this many ms after a successful submit
  // (used by the brochure flow, where the download starts on its own).
  autoCloseMs = null,
  // Optional link shown under the form, e.g. "Skip to View Layout" on the
  // brochure flow. Shape: { label: string, onClick: () => void }.
  secondaryAction = null
}) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(STATUS.IDLE)
  const [submitError, setSubmitError] = useState('')
  const overlayRef = useRef(null)
  const cardRef = useRef(null)

  // Reset to a blank, idle form each time the modal is (re)opened.
  useEffect(() => {
    if (isOpen) {
      setForm(EMPTY_FORM)
      setErrors({})
      setStatus(STATUS.IDLE)
      setSubmitError('')
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

  // Auto-close after a successful submit, when the caller asked for it.
  useEffect(() => {
    if (status !== STATUS.SUCCESS || !autoCloseMs) return
    const t = setTimeout(() => onClose(), autoCloseMs)
    return () => clearTimeout(t)
  }, [status, autoCloseMs, onClose])

  if (!isOpen) return null

  const isSubmitting = status === STATUS.SUBMITTING

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (status === STATUS.ERROR) {
      setStatus(STATUS.IDLE)
      setSubmitError('')
    }
  }

  const handlePhoneCountryChange = (nextCountry) => {
    setForm((prev) => ({ ...prev, phoneCountry: nextCountry }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    const nextErrors = validateContactFields(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: formatPhoneForSubmit(form.phone, form.phoneCountry),
      requirement: form.requirement.trim()
    }

    setStatus(STATUS.SUBMITTING)
    setSubmitError('')

    try {
      // onSubmit may be sync (returns undefined) or async (returns a Promise);
      // Promise.resolve normalises both. A throw/rejection lands in catch.
      await Promise.resolve(onSubmit(payload))
      setStatus(STATUS.SUCCESS)
    } catch (err) {
      setStatus(STATUS.ERROR)
      setSubmitError(
        (err && err.message) ||
          'Something went wrong. Please check your details and try again.'
      )
    }
  }

  const handleOverlayMouseDown = (e) => {
    if (e.target === overlayRef.current && !isSubmitting) onClose()
  }

  // Portal to <body> so the fixed overlay is positioned against the viewport,
  // not against an ancestor that establishes a containing block for fixed
  // elements (e.g. the layout showcase uses `contain: paint` + a GSAP
  // transform, which was making the modal open at that panel's top rather than
  // centred on screen — forcing the visitor to scroll up to reach it).
  return createPortal(
    <div className="lead-modal-overlay" ref={overlayRef} onMouseDown={handleOverlayMouseDown}>
      <div className="lead-modal-card" ref={cardRef}>
        <button
          type="button"
          className="lead-modal-close"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {status === STATUS.SUCCESS ? (
          <div className="lead-modal-success">
            <div className="lead-modal-success-icon">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3 className="lead-modal-title">{successTitle}</h3>
            <p className="lead-modal-subtitle">{successMessage}</p>
            <button type="button" className="lead-modal-submit" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <span className="lead-modal-eyebrow">{eyebrow}</span>
            <h3 className="lead-modal-title">{title}</h3>
            <p className="lead-modal-subtitle">{subtitle}</p>

            <form className="lead-modal-form" onSubmit={handleSubmit} noValidate>
              <div className="lead-modal-field">
                <label htmlFor="lead-name">
                  Full Name <span className="required-mark">*</span>
                </label>
                <input
                  id="lead-name"
                  type="text"
                  value={form.name}
                  onChange={handleChange('name')}
                  className={errors.name ? 'has-error' : ''}
                  placeholder="Your full name"
                  disabled={isSubmitting}
                  aria-required="true"
                />
                {errors.name && <span className="lead-modal-error">{errors.name}</span>}
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
                  disabled={isSubmitting}
                />
                {errors.email && <span className="lead-modal-error">{errors.email}</span>}
              </div>

              <div className="lead-modal-field">
                <label htmlFor="lead-phone">
                  Mobile Number <span className="required-mark">*</span>
                </label>
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
                    disabled={isSubmitting}
                  />
                  <input
                    id="lead-phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange('phone')}
                    className={errors.phone ? 'has-error' : ''}
                    placeholder="98765 43210"
                    disabled={isSubmitting}
                    aria-required="true"
                  />
                </div>
                {errors.phone && <span className="lead-modal-error">{errors.phone}</span>}
                <span className="lead-modal-hint">
                  <span className="required-mark">*</span> Required. Email is optional.
                </span>
              </div>

              <div className="lead-modal-field">
                <label htmlFor="lead-requirement">Your Requirement (optional)</label>
                <textarea
                  id="lead-requirement"
                  value={form.requirement}
                  onChange={handleChange('requirement')}
                  placeholder="e.g. Looking for a 3 BHK for investment"
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              {submitError && (
                <p className="lead-modal-submit-error" role="alert">{submitError}</p>
              )}

              <button
                type="submit"
                className="lead-modal-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="lead-modal-submit-loading">
                    <span className="lead-modal-spinner" aria-hidden="true" />
                    {loadingLabel}
                  </span>
                ) : (
                  submitLabel
                )}
              </button>

              {secondaryAction && (
                <button
                  type="button"
                  className="lead-modal-secondary"
                  onClick={secondaryAction.onClick}
                  disabled={isSubmitting}
                >
                  {secondaryAction.label}
                </button>
              )}
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  )
}
