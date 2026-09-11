import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import SearchableSelect from './SearchableSelect'
import { PHONE_CODE_OPTIONS, validateContactFields, formatPhoneForSubmit } from './leadFormShared'
import { submitLead } from './leadSubmit'
import { CONTACT_DETAILS, SOCIAL_LINKS, OFFICE_MAPS_URL } from './siteContact'
import './ContactSection.css'

// Static copy for the contact-details block — real values come from
// siteContact.js so they can be updated in one place.
const CONTACT_COPY = {
  emailLabel: 'Enquiries',
  phoneLabel: 'Call Us',
  addressLabel: 'Visit Us',
  socialSubheading: 'Connect With Us'
}

const telHref = (phone) => `tel:${phone.replace(/[^\d+]/g, '')}`

gsap.registerPlugin(ScrollTrigger)

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  phoneCountry: 'IN',
  message: ''
}

// A standing, inline contact section (as opposed to the LeadCaptureModal
// popup used elsewhere) — for visitors who've scrolled this far and want to
// reach out directly rather than through a nav-triggered overlay. Shares the
// same "email or mobile" validation rules and phone-country picker as that
// modal via leadFormShared, so the two never drift out of sync.
export default function ContactSection() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const sectionRef = useRef(null)
  const contentRef = useRef(null)

  // One-time entrance reveal as the section scrolls into view, matching the
  // fade/rise pattern used by the other sections on this page.
  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return

    const tl = gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill()
      tl.kill()
    }
  }, [])

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  // When a field is focused the on-screen keyboard can cover it (very visible
  // in landscape, where the space above the keyboard is tiny). ONLY act when
  // the keyboard has actually shrunk the visible area AND the field's bottom
  // is hidden under it — then pull the page up just enough to reveal it. Never
  // scroll the other way, so tapping an already-visible field doesn't move it.
  const keepFocusedFieldVisible = (e) => {
    const el = e.target
    if (!el || (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA')) return
    window.setTimeout(() => {
      const vv = window.visualViewport
      const vh = vv ? vv.height : window.innerHeight
      // No meaningful keyboard resize → leave the scroll position alone.
      if (vh >= window.innerHeight - 40) return
      const overshoot = el.getBoundingClientRect().bottom - (vh - 16)
      if (overshoot > 0) {
        window.scrollBy({ top: overshoot + 24, behavior: 'smooth' })
      }
    }, 350)
  }

  const handlePhoneCountryChange = (nextCountry) => {
    setForm((prev) => ({ ...prev, phoneCountry: nextCountry }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSending) return

    const nextErrors = validateContactFields(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSending(true)
    setSubmitError('')

    try {
      // Appends a row to the Google Sheet via the Apps Script web app.
      await submitLead({
        source: 'Contact section',
        name: form.name.trim(),
        email: form.email.trim(),
        phone: formatPhoneForSubmit(form.phone, form.phoneCountry),
        message: form.message.trim()
      })
      setIsSubmitted(true)
      setForm(EMPTY_FORM)
      setErrors({})
    } catch {
      setSubmitError('Something went wrong sending your message. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section className="contact-section" ref={sectionRef} id="contact">
      <div className="contact-container" ref={contentRef}>
        <div className="contact-intro">
          <span className="contact-eyebrow">Get In Touch</span>
          <h2 className="contact-title">Contact Us</h2>
          <p className="contact-subtitle">
            Share your details and our team will reach out to help with anything you need,
            from booking a private viewing to answering questions about Manhattan.
          </p>

          <ul className="contact-details">
            <li className="contact-detail">
              <span className="contact-detail-label">{CONTACT_COPY.emailLabel}</span>
              {CONTACT_DETAILS.emails.map((email) => (
                <a key={email} className="contact-detail-value" href={`mailto:${email}`}>
                  {email}
                </a>
              ))}
            </li>

            <li className="contact-detail">
              <span className="contact-detail-label">{CONTACT_COPY.phoneLabel}</span>
              {CONTACT_DETAILS.phones.map((phone) => (
                <a key={phone} className="contact-detail-value" href={telHref(phone)}>
                  {phone}
                </a>
              ))}
            </li>

            <li className="contact-detail">
              <span className="contact-detail-label">{CONTACT_COPY.addressLabel}</span>
              <a
                className="contact-detail-value contact-detail-address"
                href={OFFICE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {CONTACT_DETAILS.address.map((line, i) => (
                  <span key={i}>{line}</span>
                ))}
              </a>
            </li>
          </ul>

          <div className="contact-social">
            <h3 className="contact-social-subheading">{CONTACT_COPY.socialSubheading}</h3>
            <div className="contact-social-icons">
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with us on WhatsApp"
              >
                <svg viewBox="0 0 32 32" width="20" height="20" fill="currentColor" aria-hidden="true">
                  <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.386.7 4.61 1.902 6.478L4 29l7.72-1.868A11.94 11.94 0 0 0 16.001 27C22.628 27 28 21.627 28 15S22.628 3 16.001 3zm0 21.818a9.77 9.77 0 0 1-4.98-1.363l-.357-.212-4.583 1.11 1.127-4.462-.233-.366A9.77 9.77 0 0 1 5.818 15c0-5.618 4.564-10.182 10.183-10.182S26.182 9.382 26.182 15 21.62 24.818 16.001 24.818zm5.593-7.626c-.306-.153-1.81-.893-2.09-.995-.28-.102-.484-.153-.687.153-.204.306-.79.995-.968 1.2-.178.203-.357.229-.663.076-.306-.153-1.293-.477-2.463-1.52-.911-.812-1.526-1.815-1.705-2.121-.178-.306-.019-.472.134-.624.138-.137.306-.357.459-.535.153-.178.204-.306.306-.51.102-.204.05-.382-.026-.535-.076-.153-.687-1.655-.941-2.267-.248-.596-.5-.516-.687-.525-.178-.008-.382-.01-.586-.01-.204 0-.535.076-.815.382-.28.306-1.069 1.044-1.069 2.546 0 1.502 1.094 2.953 1.247 3.157.153.204 2.153 3.287 5.216 4.61.729.314 1.298.502 1.741.643.732.233 1.398.2 1.925.121.587-.088 1.81-.74 2.065-1.454.255-.714.255-1.326.178-1.454-.076-.128-.28-.204-.586-.357z" />
                </svg>
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4.2" />
                  <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Find us on Facebook"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                  <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.9 3.77-3.9 1.09 0 2.24.19 2.24.19v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="contact-form-card">
          {isSubmitted ? (
            <div className="contact-success">
              <div className="contact-success-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3>Thank You</h3>
              <p>We've received your message and our team will get back to you shortly.</p>
              <button
                type="button"
                className="contact-submit"
                onClick={() => setIsSubmitted(false)}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form
              className="contact-form"
              onSubmit={handleSubmit}
              onFocusCapture={keepFocusedFieldVisible}
              noValidate
            >
              <div className="contact-field">
                <label htmlFor="contact-name">
                  Full Name <span className="required-mark">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={form.name}
                  onChange={handleChange('name')}
                  className={errors.name ? 'has-error' : ''}
                  placeholder="Your full name"
                  aria-required="true"
                />
                {errors.name && <span className="contact-error">{errors.name}</span>}
              </div>

              <div className="contact-field">
                <label htmlFor="contact-email">Email Address</label>
                <input
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  className={errors.email ? 'has-error' : ''}
                  placeholder="you@example.com"
                />
                {errors.email && <span className="contact-error">{errors.email}</span>}
              </div>

              <div className="contact-field">
                <label htmlFor="contact-phone">
                  Mobile Number <span className="required-mark">*</span>
                </label>
                <div className="contact-phone-row">
                  <SearchableSelect
                    id="contact-phone-country"
                    value={form.phoneCountry}
                    options={PHONE_CODE_OPTIONS}
                    onChange={handlePhoneCountryChange}
                    triggerClassName="contact-phone-code"
                    panelWidth={260}
                    ariaLabel="Phone country code"
                    searchPlaceholder="Search country or code…"
                  />
                  <input
                    id="contact-phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange('phone')}
                    className={errors.phone ? 'has-error' : ''}
                    placeholder="98765 43210"
                    aria-required="true"
                  />
                </div>
                {errors.phone && <span className="contact-error">{errors.phone}</span>}
                <span className="contact-hint">
                  <span className="required-mark">*</span> Required. Email is optional.
                </span>
              </div>

              <div className="contact-field">
                <label htmlFor="contact-message">Message (optional)</label>
                <textarea
                  id="contact-message"
                  value={form.message}
                  onChange={handleChange('message')}
                  placeholder="How can we help you?"
                  rows={4}
                />
              </div>

              <button type="submit" className="contact-submit" disabled={isSending}>
                {isSending ? 'Sending…' : 'Send Message'}
              </button>
              {submitError && (
                <p className="contact-error" role="alert">{submitError}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
