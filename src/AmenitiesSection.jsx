import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import './AmenitiesSection.css'
import IconicArchitectureImg from './assets/potrait .jpeg'
import SpaciousLivingImg from './assets/Spaiousliving.jpeg'
import ElevatedLivingImg from './assets/ElevatedExperinces.jpeg'

gsap.registerPlugin(ScrollTrigger)

const AMENITIES = [
  {
    id: 2,
    index: '01',
    title: 'Iconic Architecture',
    description: 'A striking silhouette that redefines Mangalore’s skyline, with sculpted balconies and a facade designed to be as unforgettable by night as it is by day.',
    backgroundImage: IconicArchitectureImg,
    // This render is portrait (1280×1600). Its box is set to the exact 4:5
    // ratio so object-fit: cover shows the whole tower with no cropping, and
    // it's kept narrow so it never crowds the heading on the left.
    imageBoxClassName: 'amenity-image-background--portrait'
  },
  {
    id: 3,
    index: '02',
    title: 'Spacious Living',
    description: 'Soaring double-height ceilings and sweeping open-plan interiors, finished in imported stone and bespoke detailing, designed for those who live without compromise on space.',
    backgroundImage: SpaciousLivingImg
    // Uses the default landscape box — same size and position as the
    // "Elevated Experience" panel.
  },
  {
    id: 1,
    index: '03',
    title: 'Elevated Experience',
    description: 'Rooftop lounges and sky terraces that place panoramic city views, curated greenery, and refined leisure just an elevator ride from home.',
    backgroundImage: ElevatedLivingImg
  }
]

export default function AmenitiesSection() {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const imagesContainerRef = useRef(null)
  const itemsRef = useRef([])
  const imagesRef = useRef([])

  // One-time entrance reveal: the left content block and right image
  // cluster converge in from opposite edges as the section first scrolls
  // into view. This fires before the section reaches the pin point below
  // and plays once (real-time tween, not scroll-scrubbed) so it never
  // replays or fights with the pinned crossfade storytelling timeline.
  useEffect(() => {
    if (!sectionRef.current || !contentRef.current || !imagesContainerRef.current) return
    // Desktop only — mobile runs its own pinned stacked-crossfade below.
    if (window.matchMedia('(max-width: 768px)').matches) return

    const section = sectionRef.current

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: {
        trigger: section,
        start: 'top 78%',
        once: true,
        markers: false
      }
    })

    tl.fromTo(
      contentRef.current,
      { x: -80, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.1 },
      0
    )

    tl.fromTo(
      imagesContainerRef.current,
      { x: 80, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.1 },
      0.12
    )

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill()
      tl.kill()
    }
  }, [])

  // Setup comprehensive GSAP ScrollTrigger pinned scroll animations.
  // Restricted to desktop widths: below 1025px the CSS switches the layout to
  // a vertically stacked column (all panels rendered in normal flow with
  // opacity:1 !important), which is often taller than one screen. Pinning
  // that stacked layout would fix it at a height greater than the viewport,
  // permanently clipping the lower panels — so on narrower screens we skip
  // the pin/crossfade entirely and let the stacked layout scroll naturally.
  useEffect(() => {
    if (!sectionRef.current || imagesRef.current.length === 0 || itemsRef.current.length === 0) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 1025px)', () => {
        const section = sectionRef.current
        const imageSets = imagesRef.current
        const textItems = itemsRef.current
        const numSlides = imageSets.length

        // Give each slide a full viewport-height of scroll (e.g. 3 slides = "+=300%"
        // of the viewport) so the reveal feels slow and deliberate rather than rushed.
        // Computed via a function so ScrollTrigger re-measures correctly on resize.
        const getEnd = () => `+=${window.innerHeight * numSlides}`

        // Create master timeline for comprehensive pinned scroll storytelling
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: getEnd,
            pin: true,
            pinSpacing: true, // Reserve real scroll room for the pin duration so the
            // crossfade storytelling fully plays out before the next section begins —
            // without this, the following section starts consuming scroll space
            // before this one's sequence finishes, producing a blank transition frame.
            scrub: true, // True 1:1 scrub — the timeline tracks the scrollbar position
            // directly with zero smoothing lag. A numeric scrub (e.g. 1) introduces up
            // to a full second of "catch up" easing, which is exactly what reads as
            // laggy/disconnected motion on fast flicks; scrub:true removes that entirely.
            anticipatePin: 1, // Pre-compensates the pin engagement so there's no
            // one-frame jump/flash the instant the section reaches the pin point.
            invalidateOnRefresh: true, // Recompute the (viewport-height-based) end
            // value and all tween positions cleanly on resize instead of reusing stale
            // cached numbers, so the pin boundary never feels like it jumps.
            markers: false,
            fastScrollEnd: false // Allow smooth momentum scrolling
          }
        })

        // Initialize all slides as invisible except first
        imageSets.forEach((imageSet, index) => {
          gsap.set(imageSet, {
            opacity: index === 0 ? 1 : 0,
            pointerEvents: index === 0 ? 'auto' : 'none',
            x: 0,
            y: 0
          })
        })

        textItems.forEach((textItem, index) => {
          gsap.set(textItem, {
            opacity: index === 0 ? 1 : 0,
            pointerEvents: index === 0 ? 'auto' : 'none'
          })
        })

        // Simple, predictable animation timing
        // Each slide segment in the 0-1 timeline
        const segmentDuration = 1 / numSlides // Each slide gets 1/3 of timeline
        // At the previous 0.15/0.85 split, each crossfade only spanned ~5% of the
        // total scroll distance (roughly 135px at a 900px viewport) — with true
        // 1:1 scrub that's covered in an instant, reading as an abrupt snap rather
        // than a dissolve. Widening the transition to 40% of each slide's own
        // scroll budget (~360px) gives the fade real distance to play out
        // gradually, while still summing to 1 with displayTime so the handoff
        // stays perfectly sequential (no two headings visible at once).
        const transitionTime = 0.4 // 40% of each segment for the crossfade
        const displayTime = 0.6 // 60% for reading

        // Create synchronized animations for each amenity
        imageSets.forEach((imageSet, index) => {
          const textItem = textItems[index]
          const backgroundImg = imageSet.querySelector('.amenity-image-background')

          // Absolute timeline position for this slide
          const slideStart = index * segmentDuration
          const transitionStart = slideStart + (displayTime * segmentDuration) // Fade out near end of display

          if (index === 0) {
            // Iconic Architecture: visible from start, fade out as Spacious Living comes in
            tl.to([imageSet, textItem],
              {
                opacity: 0,
                pointerEvents: 'none',
                duration: transitionTime * segmentDuration,
                ease: 'sine.inOut'
              },
              transitionStart
            )
            if (backgroundImg) {
              tl.to(backgroundImg,
                { x: -60, duration: transitionTime * segmentDuration, ease: 'sine.inOut' },
                transitionStart
              )
            }
          } else if (index === numSlides - 1) {
            // Elevated Experience: fade in and stay visible until end
            tl.fromTo([imageSet, textItem],
              { opacity: 0, pointerEvents: 'none' },
              {
                opacity: 1,
                pointerEvents: 'auto',
                duration: transitionTime * segmentDuration,
                ease: 'sine.inOut'
              },
              slideStart
            )
            if (backgroundImg) {
              tl.fromTo(backgroundImg,
                { x: 60 },
                { x: 0, duration: transitionTime * segmentDuration, ease: 'sine.inOut' },
                slideStart
              )
            }
          } else {
            // Spacious Living: fade in, stay visible, fade out
            tl.fromTo([imageSet, textItem],
              { opacity: 0, pointerEvents: 'none' },
              {
                opacity: 1,
                pointerEvents: 'auto',
                duration: transitionTime * segmentDuration,
                ease: 'sine.inOut'
              },
              slideStart
            )
            if (backgroundImg) {
              tl.fromTo(backgroundImg,
                { x: 60 },
                { x: 0, duration: transitionTime * segmentDuration, ease: 'sine.inOut' },
                slideStart
              )
            }
            // Fade out
            tl.to([imageSet, textItem],
              {
                opacity: 0,
                pointerEvents: 'none',
                duration: transitionTime * segmentDuration,
                ease: 'sine.inOut'
              },
              transitionStart
            )
            if (backgroundImg) {
              tl.to(backgroundImg,
                { x: -60, duration: transitionTime * segmentDuration, ease: 'sine.inOut' },
                transitionStart
              )
            }
          }
        })

        // The last tween above ends well before timeline time 1 (it only needs to
        // reach ~0.72 of the way through). Since ScrollTrigger's scrub maps the FULL
        // scroll range onto the timeline's OWN duration, leaving it unpadded squeezes
        // every transition — especially the final one — into a rushed sliver at the
        // very end of the scroll, instead of each slide getting its equal third. Pad
        // the timeline out to exactly 1 so scroll progress maps 1:1 to timeline time.
        const finalDuration = tl.duration()
        if (finalDuration < 1) {
          tl.to({}, { duration: 1 - finalDuration })
        }

        return () => {
          if (tl.scrollTrigger) {
            tl.scrollTrigger.kill()
          }
          tl.kill()
        }
      })

      // ── Mobile: a 3D card deck driven by NATIVE scroll ──
      //    No Observer, no preventDefault, no scroll snap-back — that
      //    scroll-jacking is what made the section fight the visitor's finger.
      //    The wrapper is CSS `position: sticky`, so the section simply locks
      //    to the viewport while the deck plays, then releases. Progress is
      //    read from the section's own scroll position every animation frame
      //    and rAF-lerped, so scroll up == scroll down reversed and fast
      //    flicks stay in sync.
      mm.add('(max-width: 768px)', () => {
        const section = sectionRef.current
        const imageSets = imagesRef.current.filter(Boolean)
        const textItems = itemsRef.current.filter(Boolean)
        const N = imageSets.length
        if (N < 2) return

        const smooth = (x) => x * x * (3 - 2 * x)

        const render = (p) => {
          const pos = p * (N - 1) // 0 → N-1, index of the card in front
          for (let i = 0; i < N; i++) {
            const d = i - pos // 0 = front, >0 = stacked behind, <0 = peeled off
            const ad = Math.abs(d)
            const k = Math.min(ad, 2)

            if (d >= 0) {
              // Front card + the ones waiting behind it: pushed back in real Z,
              // risen so the top edge peeks over the card in front, leaned back.
              gsap.set(imageSets[i], {
                z: -160 * k,
                y: -24 * k,
                rotationX: 7 * k,
                opacity: Math.max(0, 1 - 0.34 * d),
                zIndex: Math.round(50 - d * 10)
              })
            } else {
              // The front card leaving: pulls back and down into the depth,
              // tilts away and fades, revealing the next card stepping forward.
              const f = smooth(Math.min(ad, 1))
              gsap.set(imageSets[i], {
                z: -160 * ad - 280 * f,
                y: 26 * ad,
                rotationX: -13 * f,
                opacity: 1 - f,
                zIndex: 0
              })
            }

            const te = smooth(Math.max(0, 1 - ad))
            gsap.set(textItems[i], { opacity: te, y: 18 * d })
          }
        }

        // True scroll progress across the sticky range (section height minus
        // one viewport). Read fresh each frame so momentum scrolling and the
        // mobile address bar can't desync it.
        const progress = () => {
          const r = section.getBoundingClientRect()
          const total = r.height - window.innerHeight
          if (total <= 0) return 0
          return Math.max(0, Math.min(1, -r.top / total))
        }

        let currentP = progress()
        let rafId = null
        const tick = () => {
          const targetP = progress()
          currentP += (targetP - currentP) * 0.17
          if (Math.abs(targetP - currentP) < 0.0005) currentP = targetP
          render(currentP)
          rafId = currentP === targetP ? null : requestAnimationFrame(tick)
        }
        const kick = () => {
          if (rafId === null) rafId = requestAnimationFrame(tick)
        }

        render(currentP)
        window.addEventListener('scroll', kick, { passive: true })
        window.addEventListener('resize', kick)

        return () => {
          if (rafId !== null) cancelAnimationFrame(rafId)
          window.removeEventListener('scroll', kick)
          window.removeEventListener('resize', kick)
          gsap.set([...imageSets, ...textItems], {
            clearProps: 'opacity,transform,zIndex'
          })
        }
      })

      return () => mm.revert()
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="amenities-section" ref={sectionRef}>
      <div className="amenities-sticky-wrapper">
        {/* Left Content Column */}
        <div className="amenities-content-column">
          <div className="amenities-content-inner" ref={contentRef}>
            {AMENITIES.map((amenity, index) => (
              <div
                key={amenity.id}
                ref={(el) => {
                  if (el) itemsRef.current[index] = el
                }}
                className="amenity-item"
                style={{ position: 'absolute', opacity: index === 0 ? 1 : 0 }}
              >
                <span className="amenity-index">{amenity.index}</span>
                <h2 className="amenity-title">{amenity.title}</h2>
                <p className="amenity-body">{amenity.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Image Column */}
        <div className="amenities-image-column">
          <div className="amenities-images-container" ref={imagesContainerRef}>
            {AMENITIES.map((amenity, index) => (
              <div
                key={amenity.id}
                ref={(el) => {
                  if (el) imagesRef.current[index] = el
                }}
                className={`amenity-image-set ${index === 0 ? 'active' : ''}`}
              >
                <div className={`amenity-image-background ${amenity.imageBoxClassName || ''}`}>
                  <img src={amenity.backgroundImage} alt={amenity.title} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spacer for scroll range */}
      <div className="amenities-spacer"></div>
    </section>
  )
}
