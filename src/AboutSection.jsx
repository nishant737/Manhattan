import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import './AboutSection.css'

gsap.registerPlugin(ScrollTrigger)

const TAGLINE_LINES = [
  'keep exploring.',
  'work together.',
  'grow brilliance.',
  'shape tomorrow.'
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
    const heading = headingRef.current
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

    // Heading and image fade in at start - synced with first line
    masterTl.fromTo(
      [heading, image],
      { opacity: 0 },
      { opacity: 1, duration: 0.35 },
      0
    )

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
          <h2 className="about-heading" ref={headingRef}>
            DESIGN YOU<br />
            CAN FEEL
          </h2>
          <div className="about-image-wrapper" ref={imageRef}>
            <img
              src="/STREET VIEW_ 02.jpg"
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
            We partner with clients from day one, ensuring clear communication and expert guidance at every stage. Collaborating seamlessly with builders, consultants, and other specialists, we work to keep each project on track and deliver results that exceed our shared ambitions.
          </p>

          <p className="about-description-secondary" ref={descriptionSecondaryRef}>
            While our aesthetic remains distinct, every project is shaped by its own unique character—born from our clients' aspirations, the site's potential, and the creative vision of our architectural team.
          </p>

          <button className="about-cta" ref={ctaRef}>
            <span>EXPLORE MORE ABOUT US</span>
          </button>
        </div>
      </div>
    </section>
  )
}
