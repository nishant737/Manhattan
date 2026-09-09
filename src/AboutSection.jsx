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
  const imageRef = useRef(null)
  const taglineContainerRef = useRef(null)
  const taglineLinesRef = useRef([])
  const taglineWeRefs = useRef([])
  const weFloatRef = useRef(null)
  const descriptionRef = useRef(null)
  const descriptionSecondaryRef = useRef(null)

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = [Entrance01, Entrance02, Entrance03]

  // Auto-advance slideshow — re-armed as a timeout keyed on the current index
  // so a manual dot tap also resets the 3s timer.
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 3000)

    return () => clearTimeout(timer)
  }, [currentImageIndex, images.length])

  useEffect(() => {
    const section = sectionRef.current
    const imageWrap = imageRef.current
    const taglineWrap = taglineContainerRef.current
    const description = descriptionRef.current
    const descSecondary = descriptionSecondaryRef.current

    if (!section) return

    gsap.registerPlugin(ScrollTrigger)
    // Mobile address-bar show/hide fires a resize mid-scroll; don't let
    // ScrollTrigger recompute positions on it.
    ScrollTrigger.config({ ignoreMobileResize: true })

    const prefersReduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const NO_GLOW = '0 0 0px rgba(251, 238, 190, 0)'

    const ctx = gsap.context(() => {
      const lines = taglineLinesRef.current.filter(Boolean)
      const weSpans = taglineWeRefs.current.filter(Boolean)
      const weFloat = weFloatRef.current
      const linesEl = lines[0] ? lines[0].parentElement : null // .about-tagline-lines
      const N = lines.length
      const revealEls = [imageWrap, taglineWrap, description, descSecondary].filter(Boolean)

      // The sentence bodies ("reimagine luxury." …) never move. A single
      // floating "We" slides down (and back up) with the scroll, and the line
      // it currently fronts is the highlighted one. In the last stretch every
      // line's own "We" fades in and all lines settle to fully lit.
      const TRAVEL_END = 0.76 // share of scroll spent moving "We"; rest = finale

      // Highlight look for one line; `a` = 0 (muted) → 1 (lit). Opacity + glow
      // only — the line itself never moves or scales, so the sentence bodies
      // stay pixel-static while just the floating "We" travels.
      const setLine = (el, a) => {
        const g1 = (0.5 * a).toFixed(3)
        const g2 = (0.2 * a).toFixed(3)
        gsap.set(el, {
          opacity: 0.24 + 0.76 * a,
          textShadow: `0 0 22px rgba(251, 238, 190, ${g1}), 0 0 46px rgba(251, 238, 190, ${g2})`
        })
      }

      // Vertical offset (within .about-tagline-lines) of line `idx`; `idx` may
      // be fractional so the floating "We" travels smoothly between lines.
      const lineTop = (idx) => {
        const lo = Math.max(0, Math.floor(idx))
        const hi = Math.min(N - 1, Math.ceil(idx))
        const f = idx - lo
        return lines[lo].offsetTop * (1 - f) + lines[hi].offsetTop * f
      }

      const renderTagline = (p) => {
        if (!linesEl || N < 2) return

        if (p < TRAVEL_END) {
          const t = p / TRAVEL_END          // 0 → 1 over the travel phase
          const focal = t * (N - 1)         // "We" position, 0 → N-1
          if (weFloat) gsap.set(weFloat, { y: lineTop(focal), opacity: 1 })
          gsap.set(weSpans, { opacity: 0 }) // per-line "We"s stay hidden while travelling
          for (let i = 0; i < N; i++) {
            setLine(lines[i], Math.max(0, 1 - Math.abs(i - focal)))
          }
        } else {
          const f = (p - TRAVEL_END) / (1 - TRAVEL_END) // 0 → 1 over the finale
          if (weFloat) gsap.set(weFloat, { y: lineTop(N - 1), opacity: 1 - f })
          gsap.set(weSpans, { opacity: f })
          for (let i = 0; i < N; i++) {
            const startA = Math.max(0, 1 - Math.abs(i - (N - 1))) // state at travel-end
            setLine(lines[i], startA + (1 - startA) * f)
          }
        }
      }

      const primeTagline = () => {
        if (!N) return
        renderTagline(0) // opening frame: floating "We reimagine luxury." lit
      }

      // Adds the scroll-scrubbed 0→1 drive onto `tl`. A single proxy tween +
      // onUpdate keeps the motion perfectly interpolated and reversible on
      // scroll-up.
      const addTaglineScrub = (tl) => {
        if (N < 2) return
        const proxy = { p: 0 }
        tl.to(proxy, {
          p: 1,
          ease: 'none',
          duration: 1,
          onUpdate: () => renderTagline(proxy.p)
        })
      }

      // ── Reduced motion: the finale state, static ──
      if (prefersReduced) {
        gsap.set(revealEls, { opacity: 1, y: 0 })
        gsap.set(lines, { opacity: 1, scale: 1, textShadow: NO_GLOW })
        gsap.set(weSpans, { opacity: 1 })
        if (weFloat) gsap.set(weFloat, { opacity: 0 })
        return
      }

      // ── Entrance reveal (all breakpoints): image + tagline + copy rise in
      //    once as the section enters view. Not scrubbed / not pinned, so
      //    normal page scrolling is never held by this. ──
      gsap.set(revealEls, { opacity: 0, y: 28 })
      primeTagline()
      ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        once: true,
        onEnter: () =>
          gsap.to(revealEls, {
            opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out'
          })
      })

      const mm = gsap.matchMedia()

      // ── Desktop (two-column): PIN the section on arrival, scrub the whole
      //    "We" travel + finale across a set distance, then release to the
      //    next section. pinSpacing keeps page flow intact afterwards. The
      //    `min-height: 601px` keeps this off landscape phones (wide but very
      //    short — CSS gives those the clean stacked layout with no tagline). ──
      mm.add('(min-width: 1025px) and (min-height: 601px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => '+=' + Math.round(window.innerHeight * 1.6),
            scrub: 1,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        })
        addTaglineScrub(tl)
        return () => tl.kill()
      })

      // ── Tablet (stacked layout, taller than a viewport): NO pin — the "We"
      //    travels as the tagline block scrolls up through the viewport. The
      //    `min-height: 601px` excludes landscape phones in the 769–1024px
      //    width band, which get the clean stacked layout instead. ──
      mm.add('(min-width: 769px) and (max-width: 1024px) and (min-height: 601px)', () => {
        if (!taglineWrap) return
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: taglineWrap,
            start: 'top 82%',
            end: 'bottom 22%',
            scrub: 1,
            invalidateOnRefresh: true
          }
        })
        addTaglineScrub(tl)
        return () => tl.kill()
      })

      // ── Mobile (≤768) and any landscape phone (≤600px tall): CSS hides the
      //    tagline block; the entrance reveal above is the whole animation. ──

      return () => mm.revert()
    }, section)

    return () => ctx.revert()
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

            {/* Manual control: subtle dot indicators (no overlay arrows). */}
            <div className="about-image-dots" role="tablist" aria-label="Image navigation">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`about-image-dot ${currentImageIndex === index ? 'is-active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                  aria-label={`Go to image ${index + 1}`}
                  aria-selected={currentImageIndex === index}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="about-right">
          {/* Tagline — all four statements are on screen together. Exactly one
              is highlighted at a time (starting with "We reimagine luxury.");
              as the visitor scrolls through the section the highlight hands
              off statement by statement, driven by the scroll-scrubbed
              timeline in the effect above. */}
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

                {/* The single "We" that travels down the lines with the scroll
                    (the per-line "We" spans above stay invisible until the
                    finale, only reserving the space so the bodies never move). */}
                <span className="tagline-we-float" ref={weFloatRef} aria-hidden="true">
                  We
                </span>
              </div>
            </div>
          </div>

          <p className="about-description" ref={descriptionRef}>
            Manhattan emerges as Mangalore's most coveted luxury residence, a beacon of refined living and architectural excellence. Born from the visionary collaboration between Mothisham and Allergo Group, this exclusive apartment project redefines urban sophistication. Each residence is meticulously designed to capture light, space, and elegance in perfect harmony, creating sanctuaries for those who appreciate the finest nuances of contemporary living.
          </p>

          <p className="about-description-secondary" ref={descriptionSecondaryRef}>
            Here, luxury is not merely a concept; it is an experience. From carefully curated finishes to bespoke design details, every element speaks to our unwavering commitment to excellence. Manhattan stands as a testament to what happens when visionary design meets unbridled ambition, transforming Mangalore's skyline and setting a new standard for premium residential architecture.
          </p>
        </div>
      </div>
    </section>
  )
}
