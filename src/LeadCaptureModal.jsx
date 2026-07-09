import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { Country, State, City } from 'country-state-city'
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

// Shared by both the Country select and the Phone Country Code select (they
// read/write the exact same form.country value, see handleCountryChange).
const COUNTRY_OPTIONS = ALL_COUNTRIES.map((c) => ({
  value: c.isoCode,
  label: <>{c.flag} {c.name}</>,
  searchText: `${c.name} ${c.isoCode} +${c.dialCode}`
}))

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
  country: 'IN',
  state: '',
  city: '',
  requirement: ''
}

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

  // States for the selected country; cities for the selected state (or,
  // for countries with no state subdivisions in the dataset, straight off
  // the country). Both recompute whenever their parent selection changes.
  const states = useMemo(() => State.getStatesOfCountry(form.country) || [], [form.country])

  const cities = useMemo(() => {
    if (states.length > 0) {
      if (!form.state) return []
      return City.getCitiesOfState(form.country, form.state) || []
    }
    return City.getCitiesOfCountry(form.country) || []
  }, [form.country, form.state, states])

  const stateOptions = useMemo(
    () => states.map((s) => ({ value: s.isoCode, label: s.name, searchText: s.name })),
    [states]
  )

  const cityOptions = useMemo(
    () => cities.map((c) => ({
      value: c.name,
      label: c.name,
      searchText: c.name
    })),
    [cities]
  )

  if (!isOpen) return null

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  // The Country select and the Phone Country Code select both call this SAME
  // handler and read/write the SAME form.country value — there's no separate
  // "phone country" field to fall out of sync, so selecting either one always
  // updates the other by construction. State/City only get cleared when the
  // country actually changes (not on a redundant re-select), so an existing
  // valid State/City selection is never wiped out unnecessarily.
  const handleCountryChange = (nextCountry) => {
    setForm((prev) => {
      if (prev.country === nextCountry) return prev
      return { ...prev, country: nextCountry, state: '', city: '' }
    })
  }

  const handleStateChange = (nextState) => {
    setForm((prev) => {
      if (prev.state === nextState) return prev
      return { ...prev, state: nextState, city: '' }
    })
  }

  const handleCityChange = (nextCity) => {
    setForm((prev) => ({ ...prev, city: nextCity }))
  }

  const validate = () => {
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Please enter your name.'

    if (!form.email.trim()) {
      nextErrors.email = 'Please enter your email.'
    } else if (!EMAIL_PATTERN.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    // Validated against the actual numbering-plan rules for the selected
    // country (via libphonenumber-js), not a fixed digit range — e.g. India
    // requires exactly 10 digits, the US requires exactly 10, other
    // countries allow different lengths/prefixes. This is what makes the
    // check "dynamic based on the selected country code" rather than a
    // one-size-fits-all min/max.
    const phoneDigits = form.phone.replace(/[^0-9]/g, '')
    if (!form.phone.trim()) {
      nextErrors.phone = 'Please enter your phone number.'
    } else if (!isValidPhoneNumber(phoneDigits, form.country)) {
      nextErrors.phone = 'Please enter a valid phone number with the required number of digits for the selected country.'
    }

    if (!form.country) nextErrors.country = 'Please select your country.'
    if (states.length > 0 && !form.state) nextErrors.state = 'Please select your state.'
    if (cities.length > 0 && !form.city) nextErrors.city = 'Please select your city.'

    return nextErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const countryObj = ALL_COUNTRIES.find((c) => c.isoCode === form.country)
    const stateObj = states.find((s) => s.isoCode === form.state)

    onSubmit({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: `+${countryObj?.dialCode ?? ''} ${form.phone.trim()}`,
      country: countryObj?.name ?? form.country,
      state: stateObj?.name ?? '',
      city: form.city,
      requirement: form.requirement.trim()
    })
  }

  const handleOverlayMouseDown = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  const cityPlaceholder = cities.length > 0
    ? 'Select city'
    : (states.length > 0 && !form.state ? 'Select a state first' : 'No cities available')

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
            <div className="lead-modal-phone-row">
              <SearchableSelect
                id="lead-phone-country"
                value={form.country}
                options={PHONE_CODE_OPTIONS}
                onChange={handleCountryChange}
                triggerClassName="lead-modal-phone-code"
                panelWidth={260}
                ariaLabel="Phone country code (synced with Country below)"
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
          </div>

          <div className="lead-modal-field">
            <label htmlFor="lead-country">Country *</label>
            <SearchableSelect
              id="lead-country"
              value={form.country}
              options={COUNTRY_OPTIONS}
              onChange={handleCountryChange}
              hasError={!!errors.country}
              placeholder="Select country"
              searchPlaceholder="Search country…"
            />
            {errors.country && <span className="lead-modal-error">{errors.country}</span>}
          </div>

          <div className="lead-modal-field-row">
            {states.length > 0 && (
              <div className="lead-modal-field">
                <label htmlFor="lead-state">State *</label>
                <SearchableSelect
                  id="lead-state"
                  value={form.state}
                  options={stateOptions}
                  onChange={handleStateChange}
                  hasError={!!errors.state}
                  placeholder="Select state"
                  panelWidth={260}
                  searchPlaceholder="Search state…"
                />
                {errors.state && <span className="lead-modal-error">{errors.state}</span>}
              </div>
            )}

            <div className="lead-modal-field">
              <label htmlFor="lead-city">City {cities.length > 0 ? '*' : ''}</label>
              <SearchableSelect
                id="lead-city"
                value={form.city}
                options={cityOptions}
                onChange={handleCityChange}
                hasError={!!errors.city}
                placeholder={cityPlaceholder}
                panelWidth={260}
                disabled={cities.length === 0}
                searchPlaceholder="Search city…"
                emptyMessage="No matching cities"
              />
              {errors.city && <span className="lead-modal-error">{errors.city}</span>}
            </div>
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
