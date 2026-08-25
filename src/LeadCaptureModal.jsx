import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Country } from 'country-state-city'
import { isValidPhoneNumber } from 'libphonenumber-js'
import SearchableSelect from './SearchableSelect'
import './LeadCaptureModal.css'

// A stricter, practical email pattern (close to the WHATWG HTML5 spec used
// for <input type="email">, plus a mandatory 2+ letter TLD). The previous
// pattern (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) let a bare "no whitespace/no @"
// domain segment absorb dots freely, so nonsensical addresses like
// "user@example..com" or "user@example.com." (trailing dot) passed.
const EMAIL_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/

// A handful of countries (mostly Caribbean/UK-dependency territories) store
// their dial code with a leading "+" and a dash-suffixed area code, e.g.
// "+358-18" (Åland) or "+1-242" (Bahamas), unlike the plain "91"/"1" the rest
// use. Left as-is, `+${phonecode}` produces garbage like "++358-18" and
// Number(phonecode) is NaN, breaking any numeric sort. Normalize to just the
// leading digits so every country has a clean, comparable dial code.
const normalizeDialCode = (phonecode) => phonecode.replace(/^\+/, '').match(/^\d+/)?.[0] ?? ''

const ALL_COUNTRIES = Country.getAllCountries()
  .map((c) => ({ ...c, dialCode: normalizeDialCode(c.phonecode || '') }))
  .sort((a, b) => a.name.localeCompare(b.name))

// Only used for the phone country/dial-code picker — this form no longer
// collects a postal Country/State/City, so the full address country list
// isn't needed anywhere else.
const PHONE_CODE_OPTIONS = ALL_COUNTRIES.map((c) => ({
  value: c.isoCode,
  triggerLabel: <>{c.flag} +{c.dialCode}</>,
  label: <>{c.flag} +{c.dialCode} <span className="searchable-select-option-sub">{c.name}</span></>,
  searchText: `${c.name} ${c.isoCode} +${c.dialCode} ${c.dialCode}`
}))

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

  const validate = () => {
    const nextErrors = {}
    const email = form.email.trim()
    const phone = form.phone.trim()

    if (!email && !phone) {
      nextErrors.email = 'Please provide your email or mobile number.'
      nextErrors.phone = 'Please provide your email or mobile number.'
    } else {
      if (email && !EMAIL_PATTERN.test(email)) {
        nextErrors.email = 'Please enter a valid email address.'
      }

      // Validated against the actual numbering-plan rules for the selected
      // dial code (via libphonenumber-js), not a fixed digit range — e.g.
      // India requires exactly 10 digits, the US requires exactly 10, other
      // countries allow different lengths/prefixes.
      if (phone) {
        const phoneDigits = phone.replace(/[^0-9]/g, '')
        if (!isValidPhoneNumber(phoneDigits, form.phoneCountry)) {
          nextErrors.phone = 'Please enter a valid phone number for the selected country code.'
        }
      }
    }

    return nextErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const countryObj = ALL_COUNTRIES.find((c) => c.isoCode === form.phoneCountry)
    const phone = form.phone.trim()

    onSubmit({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: phone ? `+${countryObj?.dialCode ?? ''} ${phone}` : '',
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
