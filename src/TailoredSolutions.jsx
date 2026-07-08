import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import './TailoredSolutions.css'

// Import placeholder images for floor plans
import FloorPlan1 from './assets/lower-duplex-layout.jpeg'
import FloorPlan2 from './assets/upper-duplex-layout.jpeg'
import InteriorPhoto1 from './assets/premiumone.jpeg'
import InteriorPhoto2 from './assets/premiumtwo.jpeg'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

const SOLUTIONS = [
  {
    id: 1,
    label: 'Floor Plan',
    image: FloorPlan1,
    thumbnail: InteriorPhoto1
  },
  {
    id: 2,
    label: 'Unit Layout',
    image: FloorPlan2,
    thumbnail: InteriorPhoto2
  },
  {
    id: 3,
    label: 'Master Bedroom',
    image: FloorPlan1,
    thumbnail: InteriorPhoto1
  },
  {
    id: 4,
    label: 'Living Area',
    image: FloorPlan2,
    thumbnail: InteriorPhoto2
  }
]

export default function TailoredSolutions() {
  const [expandedId, setExpandedId] = useState(null)
  const sectionRef = useRef(null)
  const pinRef = useRef(null)
  const leftColumnRef = useRef(null)
  const rightColumnRef = useRef(null)
  const accordionItemsRef = useRef([])

  const toggleAccordion = (id) => {
    setExpandedId(expandedId === id ? null : id)
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
              Tailored Solutions
              <br />
              for Your Real Estate
              <br />
              Needs
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
                  className={`accordion-row ${expandedId === solution.id ? 'expanded' : ''}`}
                >
                  <button
                    className="accordion-trigger"
                    onClick={() => toggleAccordion(solution.id)}
                    aria-expanded={expandedId === solution.id}
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
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>

                  {expandedId === solution.id && (
                    <div className="accordion-content">
                      <img
                        src={solution.image}
                        alt={`${solution.label} detail`}
                        className="accordion-detail-image"
                      />
                    </div>
                  )}
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
    </section>
  )
}
