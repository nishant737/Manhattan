import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import './AboutSection.css'
import Entrance01 from './assets/ENTRANCE/ENTRANCE01.jpeg'
import Entrance02 from './assets/ENTRANCE/ENTRANCE_02.jpeg'
import Entrance03 from './assets/ENTRANCE/ENTRANCE_03.jpeg'

gsap.registerPlugin(ScrollTrigger)

const TAGLINE_LINES = [
  'reimagine luxury.',
  'craft exclusivity.',
  'elevate Mangalore.',
  'define legacy.'
]


export default function AboutSection() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const imageRef = useRef(null)
  const taglineContainerRef = useRef(null)
  const taglineLinesRef = useRef([])
  const taglineWeRefs = useRef([])
  const descriptionRef = useRef(null)
  const descriptionSecondaryRef = useRef(null)

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = [Entrance01, Entrance02, Entrance03]

  // Slideshow effect - changes image every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [images.length])

  useEffect(() => {
    const section = sectionRef.current
    const image = imageRef.current
    const description = descriptionRef.current
    const descSecondary = descriptionSecondaryRef.current

    if (!section) return

    gsap.registerPlugin(ScrollTrigger)

    // Create single master timeline that pins the section and reveals all content
    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=2000px',
        scrub: 2.5,
        pin: true,
        markers: false
      }
    })

    // Image fade in at start - synced with first line
    if (image) {
      masterTl.fromTo(
        image,
        { opacity: 0 },
        { opacity: 1, duration: 0.35 },
        0
      )
    }

    const FINAL_EMPHASIS_TIME = 1.6
    const TRANSITION_DURATION = 0.4

    // Per-line states the timeline below moves each line through — real
    // position + scale changes, not just an opacity fade, so the block
    // reads as physically travelling rather than four static lines quietly
    // lighting up in place:
    //   BELOW   — not reached yet: small, dim, sitting slightly lower.
    //   ACTIVE  — the current line: full size, full brightness, centered.
    //   PASSED  — already moved through: small, dim, sitting slightly
    //             higher (drifted up and out, mirroring BELOW).
    //   FINAL   — the closing convergence: every line (arriving from
    //             whichever of the above states it was last in) settles
    //             back to center together, at full brightness, with a
    //             glow and a slight scale-pop.
    const RECEDED = { opacity: 0.35, scale: 0.9 }
    const ACTIVE = { opacity: 1, scale: 1.06 }
    const NO_GLOW = '0 0 18px rgba(251, 238, 190, 0), 0 0 36px rgba(251, 238, 190, 0)'
    const FULL_GLOW = '0 0 18px rgba(251, 238, 190, 0.55), 0 0 36px rgba(251, 238, 190, 0.25)'

    const weSpans = taglineWeRefs.current
    const lines = taglineLinesRef.current

    if (lines.length > 0) {
      gsap.set(lines.filter(Boolean), { ...RECEDED, y: 18, transformOrigin: 'left center', textShadow: NO_GLOW })
      gsap.set(weSpans.filter(Boolean), { opacity: 0, scale: 0.8, transformOrigin: 'left center' })

      // Frame 1: the first line starts already active — front and center,
      // full size and brightness — while the rest wait below it.
      if (lines[0]) gsap.set(lines[0], { ...ACTIVE, y: 0 })
      if (weSpans[0]) gsap.set(weSpans[0], { opacity: 1, scale: 1 })

      // Frames 2–3: as scroll reaches each line in turn, it rises into the
      // active position (grows, brightens, moves up to center) while the
      // line before it recedes past center (shrinks, dims, drifts further
      // up) — an actual handoff in position, not a crossfade.
      const lineActiveTimes = [0, 0.4, 0.8, 1.2]
      for (let i = 1; i < lines.length; i++) {
        const time = lineActiveTimes[i]
        const incoming = lines[i]
        const outgoing = lines[i - 1]

        if (outgoing) {
          masterTl.to(outgoing, { ...RECEDED, y: -18, duration: TRANSITION_DURATION, ease: 'power2.inOut' }, time)
        }
        if (incoming) {
          masterTl.to(incoming, { ...ACTIVE, y: 0, duration: TRANSITION_DURATION, ease: 'power2.inOut' }, time)
        }
        if (weSpans[i]) {
          masterTl.fromTo(
            weSpans[i],
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: TRANSITION_DURATION + 0.05, ease: 'back.out(1.6)' },
            time
          )
        }
      }

      // Last frame: "We define legacy." has just arrived — now every line,
      // wherever it currently sits (active, or receded above/below),
      // travels back to the shared center position together, brightens to
      // full opacity, and picks up the gold glow, with a springy scale-pop
      // on the landing. All four finish this beat identically, so nothing
      // is left dimmed or singled out.
      const allLines = lines.filter(Boolean)
      const allWe = weSpans.filter(Boolean)
      masterTl.to(
        [...allLines, ...allWe],
        {
          opacity: 1,
          scale: 1,
          y: 0,
          textShadow: FULL_GLOW,
          duration: 0.55,
          ease: 'back.out(1.5)'
        },
        FINAL_EMPHASIS_TIME
      )
    }

    // Description 1 fades in - synced with animation
    if (description) {
      masterTl.fromTo(
        description,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        0.85
      )
    }

    // Description 2 fades in - synced with animation
    if (descSecondary) {
      masterTl.fromTo(
        descSecondary,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        1.35
      )
    }

    return () => {
      if (masterTl.scrollTrigger) {
        masterTl.scrollTrigger.kill()
      }
      masterTl.kill()
    }
  }, [])

  return (
    <section className="about-section" ref={sectionRef}>
      <div className="about-container">
        {/* Left Column */}
        <div className="about-left">
          <div className="about-image-wrapper" ref={imageRef}>
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Design vision ${index + 1}`}
                className="about-image"
                style={{
                  opacity: currentImageIndex === index ? 1 : 0,
                  pointerEvents: currentImageIndex === index ? 'auto' : 'none'
                }}
              />
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="about-right">
          {/* Tagline — every sentence is on screen from the start; only each
              line's own "We" animates, appearing on the first line
              immediately and popping in on each line below it in turn as
              the scroll reaches it. */}
          <div className="about-tagline-wrapper" ref={taglineContainerRef}>
            <div className="about-tagline-text">
              <div className="about-tagline-lines">
                {TAGLINE_LINES.map((line, index) => (
                  <div
                    key={index}
                    className="tagline-line"
                    ref={(el) => {
                      if (el) taglineLinesRef.current[index] = el
                    }}
                  >
                    <span
                      className="tagline-we"
                      ref={(el) => {
                        if (el) taglineWeRefs.current[index] = el
                      }}
                    >
                      We
                    </span>{' '}
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="about-description" ref={descriptionRef}>
            Manhattan emerges as Mangalore's most coveted luxury residence—a beacon of refined living and architectural excellence. Born from the visionary collaboration between Mothisham and Allergo Group, this exclusive apartment project redefines urban sophistication. Each residence is meticulously designed to capture light, space, and elegance in perfect harmony, creating sanctuaries for those who appreciate the finest nuances of contemporary living.
          </p>

          <p className="about-description-secondary" ref={descriptionSecondaryRef}>
            Here, luxury is not merely a concept—it is an experience. From carefully curated finishes to bespoke design details, every element speaks to our unwavering commitment to excellence. Manhattan stands as a testament to what happens when visionary design meets unbridled ambition, transforming Mangalore's skyline and setting a new standard for premium residential architecture.
          </p>
        </div>
      </div>
    </section>
  )
}
