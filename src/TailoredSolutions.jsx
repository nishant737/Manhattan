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
  const leftColumnRef = useRef(null)
  const rightColumnRef = useRef(null)
  const accordionItemsRef = useRef([])

  const toggleAccordion = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  // Setup scroll-triggered entrance animations with unified timeline
  useEffect(() => {
    if (!sectionRef.current || !leftColumnRef.current || !rightColumnRef.current) return

    const section = sectionRef.current

    // Create a unified timeline for all animations with pinning
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=1300px',
        scrub: 1.8,
        pin: true,
        markers: false,
        fastScrollEnd: true
      }
    })

    // Add left column animation
    tl.fromTo(
      leftColumnRef.current,
      {
        opacity: 0,
        y: 60,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: 'sine.out'
      },
      0
    )

    // Add accordion items with smooth staggered animation from right to left
    accordionItemsRef.current.forEach((item, index) => {
      if (item) {
        tl.fromTo(
          item,
          {
            opacity: 0,
            x: 120
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.45,
            ease: 'sine.inOut'
          },
          index * 0.15
        )
      }
    })

    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill()
      }
      tl.kill()
    }
  }, [])

  return (
    <section className="tailored-solutions-section" ref={sectionRef}>
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

      {/* Scrolling Marquee Ticker */}
      <div className="solutions-ticker">
        <div className="ticker-content">
          <span>LUXURY RESIDENCES · MANGALORE'S FINEST · ARCHITECTURAL EXCELLENCE · SMART LIVING · PREMIUM FINISHES · CONCIERGE SERVICES · LUXURY RESIDENCES · MANGALORE'S FINEST · ARCHITECTURAL EXCELLENCE · SMART LIVING · PREMIUM FINISHES · CONCIERGE SERVICES ·</span>
        </div>
      </div>
    </section>
  )
}
