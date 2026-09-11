import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { LAYOUT_CATEGORIES } from './apartmentLayouts'
import './TailoredSolutions.css'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

// Sky Villas lead, Residences follow — the opposite of LAYOUT_CATEGORIES'
// natural order (which the Layout modal still uses as-is). Any category not
// listed here keeps whatever order it fell in originally.
const CATEGORY_ORDER = ['Sky Villas', 'Residences']
const ORDERED_CATEGORIES = [...LAYOUT_CATEGORIES].sort(
  (a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)
)

const getSpecValue = (type, label) => type.specs.find((spec) => spec.label === label)?.value

// The same unit types the Layout modal offers, grouped under their category
// headings for display. A flat running index is assigned so the staggered
// entrance animation (which keys off accordionItemsRef order) still lines up
// across groups.
let runningIndex = 0
const SOLUTION_GROUPS = ORDERED_CATEGORIES.map((group) => ({
  category: group.category,
  items: group.types.map((type) => {
    const bedrooms = getSpecValue(type, 'Bedroom')
    return {
      id: type.id,
      label: type.title,
      thumbnail: type.cardImage,
      meta: bedrooms ? `${bedrooms} Bedroom${bedrooms === '1' ? '' : 's'}` : null,
      flatIndex: runningIndex++
    }
  })
}))

export default function TailoredSolutions({ onSelectLayout }) {
  const sectionRef = useRef(null)
  const pinRef = useRef(null)
  const leftColumnRef = useRef(null)
  const rightColumnRef = useRef(null)
  const accordionItemsRef = useRef([])
  const groupTitlesRef = useRef([])

  // "View Layout" triggers the brochure lead-capture flow rather than
  // opening the Layout modal directly — the modal is still reachable from
  // the navbar/footer's "Layout" link.
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
          // Short viewports (landscape phones) never get the pin, even if they
          // happen to be ≥1025px wide — the compact non-pinned reveal instead.
          isDesktop: '(min-width: 1025px) and (min-height: 601px)',
          isCompact: '(max-width: 1024px), (max-height: 600px)'
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
            <span className="tailored-solutions-eyebrow">Our Collections</span>
            <h2 className="tailored-solutions-heading">
              Luxury Residences
              <br />
              Designed for You
            </h2>
            <p className="tailored-solutions-copy">
              From sky villas above the skyline to elegant residence floors below —
              every layout is a study in space, light, and craftsmanship.
            </p>
          </div>

          {/* Right Column — unit types grouped by category */}
          <div className="tailored-solutions-right" ref={rightColumnRef}>
            <div className="solutions-accordion">
              {SOLUTION_GROUPS.map((group, gi) => (
                <div className="solutions-group" key={group.category}>
                  <div
                    className="solutions-group-title"
                    ref={(el) => {
                      if (el) groupTitlesRef.current[gi] = el
                    }}
                  >
                    <h3>{group.category}</h3>
                    <span className="solutions-group-count">
                      {String(group.items.length).padStart(2, '0')}
                    </span>
                  </div>
                  {group.items.map((solution, ii) => (
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
                        aria-label={`Download brochure for ${solution.label}`}
                      >
                        <span className="accordion-index">{String(ii + 1).padStart(2, '0')}</span>
                        <span className="accordion-thumbnail-wrap">
                          <img
                            src={solution.thumbnail}
                            alt={solution.label}
                            className="accordion-thumbnail"
                          />
                        </span>
                        <span className="accordion-text">
                          <span className="accordion-label">{solution.label}</span>
                          {solution.meta && (
                            <span className="accordion-meta">{solution.meta}</span>
                          )}
                        </span>
                        <span className="accordion-open">View Layout</span>
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
