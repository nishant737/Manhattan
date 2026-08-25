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

// Opacity each tagline line (and "We") sits at once individually revealed —
// full opacity is reserved for the closing emphasis once "We" reaches the
// final line, so freshly-revealed text reads as "light" rather than final.
const LIGHT_OPACITY = 0.45

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

    // Each line's sentence text is on screen from the very start ("We
    // reimagine luxury. / craft exclusivity. / elevate Mangalore. / define
    // legacy.") — only the "We" is what animates: already showing on the
    // first line, then fading in on each line in turn as the scroll reaches
    // it, so it reads as "We" itself moving down through the sentences one
    // at a time rather than the sentences appearing from nothing.
    const weSpans = taglineWeRefs.current
    gsap.set(weSpans.filter(Boolean), { opacity: 0, scale: 0.8, transformOrigin: 'left center' })
    if (weSpans[0]) {
      gsap.set(weSpans[0], { opacity: LIGHT_OPACITY, scale: 1 })
    }

    // Animate line visibility - each line stays visible once revealed
    const lines = taglineLinesRef.current
    if (lines.length > 0) {
      gsap.set(lines.filter(Boolean), { opacity: LIGHT_OPACITY, y: 0, scale: 1, transformOrigin: 'left center' })
      gsap.set(lines.filter(Boolean), {
        textShadow: '0 0 18px rgba(251, 238, 190, 0), 0 0 36px rgba(251, 238, 190, 0)'
      })

      // Each line's own "We" pops in as the scroll reaches it (the first
      // line's is already visible from the start, so it has nothing to
      // animate here). Full emphasis (brighter + glow) is still reserved for
      // the closing moment below, so nothing reads as "final" until the
      // sequence actually reaches the last line.
      const lineRevealTimes = [0, 0.4, 0.8, 1.2]
      weSpans.forEach((weSpan, index) => {
        if (!weSpan || index === 0) return
        masterTl.fromTo(
          weSpan,
          { opacity: 0, scale: 0.8 },
          { opacity: LIGHT_OPACITY, scale: 1, duration: 0.45, ease: 'back.out(1.6)' },
          lineRevealTimes[index]
        )
      })

      // Closing emphasis: once the sequence reaches the final line, every
      // line and every "We" brighten to full opacity AND pick up a soft gold
      // glow together in one beat — a cohesive "arrival" moment instead of
      // the last line just being one more fade-in among equals.
      const emphasisTargets = [...lines.filter(Boolean), ...weSpans.filter(Boolean)]
      masterTl.to(
        emphasisTargets,
        {
          opacity: 1,
          textShadow: '0 0 18px rgba(251, 238, 190, 0.55), 0 0 36px rgba(251, 238, 190, 0.25)',
          duration: 0.4,
          ease: 'power1.out'
        },
        FINAL_EMPHASIS_TIME
      )

      // At this same closing beat the lines themselves get a small pop (a
      // gentle lift-and-settle) so the arrival visibly lifts the whole group
      // together, on top of the brightening above. Only the lines are
      // bounced here, not the nested "We" spans — they're carried along by
      // their parent line's own transform, so bouncing both would double
      // the motion and throw "We" out of alignment with the rest of its
      // own line.
      masterTl.fromTo(
        lines.filter(Boolean),
        { y: 6, scale: 0.975 },
        { y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.6)' },
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
