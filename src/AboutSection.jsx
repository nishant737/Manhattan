import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import './AboutSection.css'
import AboutUsImg from './assets/aboutus.jpeg'

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
  const weElementRef = useRef(null)
  const taglineContainerRef = useRef(null)
  const taglineLinesRef = useRef([])
  const descriptionRef = useRef(null)
  const descriptionSecondaryRef = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const weElement = weElementRef.current
    const image = imageRef.current
    const description = descriptionRef.current
    const descSecondary = descriptionSecondaryRef.current
    const cta = ctaRef.current

    if (!section || !weElement) return

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

    // Get line height for "We" animation
    const computedStyle = window.getComputedStyle(weElement)
    const lineHeightValue = computedStyle.lineHeight
    const lineHeight = parseFloat(lineHeightValue)
    const totalDistance = lineHeight * 3

    // Animate "We" smoothly over first 40% of scroll (0% - 40%)
    masterTl.fromTo(
      weElement,
      { y: 0 },
      { y: totalDistance, ease: 'power1.inOut', duration: 1.6 },
      0
    )

    // Animate line visibility - each line stays visible once revealed
    const lines = taglineLinesRef.current
    if (lines.length > 0) {
      // All lines start hidden
      lines.forEach(line => {
        if (line) line.style.opacity = '0'
      })

      // Line 1: becomes visible at start and stays visible
      if (lines[0]) {
        masterTl.fromTo(
          lines[0],
          { opacity: 0 },
          { opacity: 1, duration: 0.35 },
          0
        )
      }

      // Line 2: becomes visible when "We" reaches it and stays
      if (lines[1]) {
        masterTl.fromTo(
          lines[1],
          { opacity: 0 },
          { opacity: 1, duration: 0.35 },
          0.4
        )
      }

      // Line 3: becomes visible when "We" reaches it and stays
      if (lines[2]) {
        masterTl.fromTo(
          lines[2],
          { opacity: 0 },
          { opacity: 1, duration: 0.35 },
          0.8
        )
      }

      // Line 4: becomes visible when "We" reaches it and stays
      if (lines[3]) {
        masterTl.fromTo(
          lines[3],
          { opacity: 0 },
          { opacity: 1, duration: 0.35 },
          1.2
        )
      }
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

    // CTA button fades in - synced with animation
    if (cta) {
      masterTl.fromTo(
        cta,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        1.75
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
            <img
              src={AboutUsImg}
              alt="Design vision"
              className="about-image"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="about-right">
          {/* Tagline with animated "We" */}
          <div className="about-tagline-wrapper" ref={taglineContainerRef}>
            <div className="about-tagline-text">
              <span className="about-we-animated" ref={weElementRef}>We</span>
              <div className="about-tagline-lines">
                {TAGLINE_LINES.map((line, index) => (
                  <div
                    key={index}
                    className="tagline-line"
                    ref={(el) => {
                      if (el) taglineLinesRef.current[index] = el
                    }}
                  >
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

          <button className="about-cta" ref={ctaRef}>
            <span>DISCOVER MANHATTAN</span>
          </button>
        </div>
      </div>
    </section>
  )
}
