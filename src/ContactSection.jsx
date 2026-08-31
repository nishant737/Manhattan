import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import SearchableSelect from './SearchableSelect'
import { PHONE_CODE_OPTIONS, validateContactFields, formatPhoneForSubmit } from './leadFormShared'
import './ContactSection.css'

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

  const handlePhoneCountryChange = (nextCountry) => {
    setForm((prev) => ({ ...prev, phoneCountry: nextCountry }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = validateContactFields(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    // TODO: wire this up to the real CRM/lead-capture endpoint once available.
    console.log('Contact form submitted:', {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: formatPhoneForSubmit(form.phone, form.phoneCountry),
      message: form.message.trim()
    })

    setIsSubmitted(true)
    setForm(EMPTY_FORM)
    setErrors({})
  }

  return (
    <section className="contact-section" ref={sectionRef} id="contact">
      <div className="contact-container" ref={contentRef}>
        <div className="contact-intro">
          <span className="contact-eyebrow">Get In Touch</span>
          <h2 className="contact-title">Contact Us</h2>
          <p className="contact-subtitle">
            Share your details and our team will reach out to help with anything you need —
            from booking a private viewing to answering questions about Manhattan.
          </p>
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
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="contact-field">
                <label htmlFor="contact-name">Full Name</label>
                <input
                  id="contact-name"
                  type="text"
                  value={form.name}
                  onChange={handleChange('name')}
                  placeholder="Your full name"
                />
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
                <label htmlFor="contact-phone">Mobile Number</label>
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
                  />
                </div>
                {errors.phone && <span className="contact-error">{errors.phone}</span>}
                <span className="contact-hint">Please provide either your email or mobile number.</span>
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

              <button type="submit" className="contact-submit">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
