import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { LAYOUT_CATEGORIES } from './apartmentLayouts'
import './TailoredSolutions.css'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

// The same unit types the Layout modal offers, grouped under their category
// headings for display. A flat running index is assigned so the staggered
// entrance animation (which keys off accordionItemsRef order) still lines up
// across groups.
let runningIndex = 0
const SOLUTION_GROUPS = LAYOUT_CATEGORIES.map((group) => ({
  category: group.category,
  items: group.types.map((type) => ({
    id: type.id,
    label: type.title,
    thumbnail: type.images[0],
    flatIndex: runningIndex++
  }))
}))

export default function TailoredSolutions({ onSelectLayout }) {
  const sectionRef = useRef(null)
  const pinRef = useRef(null)
  const leftColumnRef = useRef(null)
  const rightColumnRef = useRef(null)
  const accordionItemsRef = useRef([])
  const groupTitlesRef = useRef([])

  // Clicking a unit type opens the shared Layout modal straight to that
  // type's detail view — no interstitial. Lead capture now lives on the
  // "Book a Visit" CTA inside that modal instead of gating the whole view.
  const handleSelectSolution = (id) => {
    onSelectLayout?.(id)
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
                  // Non-scrubbed on mobile — plays once when it enters view and
                  // settles. A scrubbed x-offset left the rows shifted right
                  // (and clipped) whenever the scroll rested mid-animation.
                  trigger: sectionRef.current,
                  start: 'top 80%',
                  toggleActions: 'play none none none',
                  markers: false
                }
          })

          // Left column reveal
          tl.fromTo(
            leftColumnRef.current,
            { opacity: 0, y: 50, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: isDesktop ? 0.35 : 0.6 },
            0
          )

          const base = isDesktop ? 0.05 : 0.12
          const step = 0.1

          // Category titles (RESIDENCES / SKY VILLAS) start hidden and reveal
          // together with their group's first row — never shown on their own
          // at the start of the section.
          SOLUTION_GROUPS.forEach((group, gi) => {
            const title = groupTitlesRef.current[gi]
            if (!title) return
            const firstFlatIndex = group.items[0]?.flatIndex ?? 0
            tl.fromTo(
              title,
              { opacity: 0, x: isDesktop ? 110 : 32 },
              { opacity: 1, x: 0, duration: isDesktop ? 0.3 : 0.45, ease: 'sine.inOut' },
              Math.max(0, base + firstFlatIndex * step - 0.02)
            )
          })

          // Accordion items staggered in
          accordionItemsRef.current.forEach((item, index) => {
            if (!item) return
            tl.fromTo(
              item,
              { opacity: 0, x: isDesktop ? 110 : 32 },
              { opacity: 1, x: 0, duration: isDesktop ? 0.3 : 0.45, ease: 'sine.inOut' },
              base + index * step
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

          {/* Right Column — unit types grouped by category */}
          <div className="tailored-solutions-right" ref={rightColumnRef}>
            <div className="solutions-accordion">
              {SOLUTION_GROUPS.map((group, gi) => (
                <div className="solutions-group" key={group.category}>
                  <h3
                    className="solutions-group-title"
                    ref={(el) => {
                      if (el) groupTitlesRef.current[gi] = el
                    }}
                  >
                    {group.category}
                  </h3>
                  {group.items.map((solution) => (
                    <div
                      key={solution.id}
                      ref={(el) => {
                        if (el) accordionItemsRef.current[solution.flatIndex] = el
                      }}
                      className="accordion-row"
                    >
                      <button
                        className="accordion-trigger"
                        onClick={() => handleSelectSolution(solution.id)}
                        aria-label={`Open ${solution.label} layout`}
                      >
                        <img
                          src={solution.thumbnail}
                          alt={solution.label}
                          className="accordion-thumbnail"
                        />
                        <span className="accordion-label">{solution.label}</span>
                        <span className="accordion-open">
                          Open Layout
                          <svg
                            className="accordion-arrow"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="9 6 15 12 9 18"></polyline>
                          </svg>
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scrolling Marquee Ticker */}
      <div className="solutions-ticker">
        <div className="ticker-content">
          <span>LUXURY RESIDENCES · MANGALORE'S FINEST · ARCHITECTURAL EXCELLENCE · ICONIC ARCHITECTURE · SPACIOUS LIVING · ELEVATED EXPERIENCE · LUXURY RESIDENCES · MANGALORE'S FINEST · ARCHITECTURAL EXCELLENCE · ICONIC ARCHITECTURE · SPACIOUS LIVING · ELEVATED EXPERIENCE ·</span>
        </div>
      </div>
    </section>
  )
}
