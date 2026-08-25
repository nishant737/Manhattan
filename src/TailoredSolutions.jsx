import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import LeadCaptureModal from './LeadCaptureModal'
import { LAYOUT_TYPES } from './apartmentLayouts'
import './TailoredSolutions.css'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

// Same 4 apartment types offered in the Layout modal, reused here so this
// row and that modal never drift out of sync with each other — picking a
// type here and submitting the lead form opens straight into that same
// modal, already showing this exact type's detail view. Each type's
// images[0] is its distinct hero image there (floor-plan drawings for the
// two duplex types, a distinct lifestyle photo for the other two — see
// apartmentLayouts.js), so reusing it here guarantees every thumbnail in
// this row is visually distinct too, with no accidental image reuse.
const SOLUTIONS = LAYOUT_TYPES.map((type) => ({
  id: type.id,
  label: type.title,
  thumbnail: type.images[0]
}))

const LEAD_SUBMITTED_KEY = 'manhattan_lead_submitted'

export default function TailoredSolutions({ onSelectLayout }) {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)
  const [pendingSolutionId, setPendingSolutionId] = useState(null)
  const [hasSubmittedLead, setHasSubmittedLead] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem(LEAD_SUBMITTED_KEY) === 'true'
  })
  const sectionRef = useRef(null)
  const pinRef = useRef(null)
  const leftColumnRef = useRef(null)
  const rightColumnRef = useRef(null)
  const accordionItemsRef = useRef([])

  // First attempt to view any layout is gated behind a short lead-capture
  // form; once the visitor has submitted it once, picking a type opens the
  // shared Layout modal straight away for the rest of the session.
  const handleSelectSolution = (id) => {
    if (!hasSubmittedLead) {
      setPendingSolutionId(id)
      setIsLeadModalOpen(true)
      return
    }
    onSelectLayout?.(id)
  }

  const handleLeadModalClose = () => {
    setIsLeadModalOpen(false)
    setPendingSolutionId(null)
  }

  const handleLeadSubmit = (formData) => {
    // TODO: wire this up to the real CRM/lead-capture endpoint once available.
    const pendingSolution = SOLUTIONS.find((s) => s.id === pendingSolutionId)
    console.log('Lead captured from TailoredSolutions:', { ...formData, apartmentType: pendingSolution?.label })

    window.localStorage.setItem(LEAD_SUBMITTED_KEY, 'true')
    setHasSubmittedLead(true)
    setIsLeadModalOpen(false)
    onSelectLayout?.(pendingSolutionId)
    setPendingSolutionId(null)
  }

  // Setup scroll-triggered entrance animations with unified timeline.
  // Desktop gets the full pin + cinematic reveal; mobile/tablet (where the
  // layout stacks vertically) gets a lighter, non-pinned reveal so tall
  // stacked content never gets clipped by a fixed-height pinned viewport.
  useEffect(() => {
    if (!sectionRef.current || !pinRef.current || !leftColumnRef.current) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add(
        {
          isDesktop: '(min-width: 1025px)',
          isCompact: '(max-width: 1024px)'
        },
        (context) => {
          const { isDesktop } = context.conditions
          const tl = gsap.timeline({
            defaults: { ease: 'sine.out' },
            scrollTrigger: isDesktop
              ? {
                  trigger: sectionRef.current,
                  start: 'top top',
                  end: '+=2000',
                  scrub: 1,
                  pin: pinRef.current,
                  pinSpacing: true,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                  markers: false
                }
              : {
                  trigger: sectionRef.current,
                  start: 'top 75%',
                  end: 'top 15%',
                  scrub: 1,
                  markers: false
                }
          })

          // Left column reveal
          tl.fromTo(
            leftColumnRef.current,
            { opacity: 0, y: 50, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: isDesktop ? 0.35 : 0.5 },
            0
          )

          // Accordion items staggered in from the right
          accordionItemsRef.current.forEach((item, index) => {
            if (!item) return
            tl.fromTo(
              item,
              { opacity: 0, x: 110 },
              { opacity: 1, x: 0, duration: isDesktop ? 0.3 : 0.4, ease: 'sine.inOut' },
              (isDesktop ? 0.05 : 0.1) + index * (isDesktop ? 0.1 : 0.12)
            )
          })

          // Hold the fully-revealed section on screen for a beat before
          // releasing the pin, so the reveal never rushes straight into
          // the next section's transition.
          if (isDesktop) {
            tl.to({}, { duration: 0.9 })
          }

          return () => {
            if (tl.scrollTrigger) tl.scrollTrigger.kill()
            tl.kill()
          }
        }
      )

      return () => mm.revert()
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="tailored-solutions-section" ref={sectionRef}>
      {/* Pinned viewport: heading + accordion only, sized to always fit
          within one screen so nothing clips while the section is pinned. */}
      <div className="tailored-solutions-pin" ref={pinRef}>
        <div className="tailored-solutions-container">
          {/* Left Column */}
          <div className="tailored-solutions-left" ref={leftColumnRef}>
            <h2 className="tailored-solutions-heading">
              Luxury Residences
              <br />
              Designed for You
            </h2>
          </div>

          {/* Right Column */}
          <div className="tailored-solutions-right" ref={rightColumnRef}>
            <div className="solutions-accordion">
              {SOLUTIONS.map((solution, index) => (
                <div
                  key={solution.id}
                  ref={(el) => {
                    if (el) accordionItemsRef.current[index] = el
                  }}
                  className="accordion-row"
                >
                  <button
                    className="accordion-trigger"
                    onClick={() => handleSelectSolution(solution.id)}
                    aria-label={`View ${solution.label} layout`}
                  >
                    <img
                      src={solution.thumbnail}
                      alt={solution.label}
                      className="accordion-thumbnail"
                    />
                    <span className="accordion-label">{solution.label}</span>
                    <svg
                      className="accordion-arrow"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="9 6 15 12 9 18"></polyline>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scrolling Marquee Ticker */}
      <div className="solutions-ticker">
        <div className="ticker-content">
          <span>LUXURY RESIDENCES · MANGALORE'S FINEST · ARCHITECTURAL EXCELLENCE · SMART LIVING · PREMIUM FINISHES · CONCIERGE SERVICES · LUXURY RESIDENCES · MANGALORE'S FINEST · ARCHITECTURAL EXCELLENCE · SMART LIVING · PREMIUM FINISHES · CONCIERGE SERVICES ·</span>
        </div>
      </div>

      <LeadCaptureModal
        isOpen={isLeadModalOpen}
        onClose={handleLeadModalClose}
        onSubmit={handleLeadSubmit}
      />
    </section>
  )
}
