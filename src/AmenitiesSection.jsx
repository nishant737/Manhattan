import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Observer from 'gsap/Observer'
import { navScroll } from './navScroll'
import './AmenitiesSection.css'
import IconicArchitectureImg from './assets/potrait.jpeg'
import SpaciousLivingImg from './assets/Spaiousliving.jpeg'
import ElevatedLivingImg from './assets/ElevatedExperinces.jpeg'

gsap.registerPlugin(ScrollTrigger, Observer)

const AMENITIES = [
  {
    id: 2,
    index: '01',
    title: 'Iconic Architecture',
    description: 'A striking silhouette that redefines Mangalore’s skyline, with sculpted balconies and a facade designed to be as unforgettable by night as it is by day.',
    backgroundImage: IconicArchitectureImg
    // Landscape render — uses the default 16:10 box, same as the other panels.
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
            scrub: 1, // Numeric scrub adds ~1s of eased "catch up" so the crossfade
            // glides toward the scroll position instead of snapping 1:1 to it — the
            // motion reads smooth on both slow scrolls and fast flicks, and it still
            // reverses cleanly when scrolling back up.
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

      // ── Mobile: gesture-stepped 3-card stack ──
      //    The wrapper is CSS-sticky so it's visually fixed the moment the
      //    section reaches the top; while "locked" an Observer swallows every
      //    wheel/touch gesture (preventDefault) and a scroll listener snaps any
      //    slippage back — zero page movement. ONE swipe = exactly ONE card,
      //    whatever the flick speed. The three images are always stacked one
      //    behind the other (front fully opaque, two dimmer/smaller peeking
      //    above). At the first / last card a swipe past the end does nothing
      //    the first time (dwell — time to read it); a SECOND swipe releases
      //    the section to the previous / next one.
      mm.add('(max-width: 768px)', () => {
        const section = sectionRef.current
        const imageSets = imagesRef.current.filter(Boolean)
        const textItems = itemsRef.current.filter(Boolean)
        const num = imageSets.length
        if (num < 2) return

        ScrollTrigger.config({ ignoreMobileResize: true })

        const mod = (n, m) => ((n % m) + m) % m
        // depth 0 = front (ALWAYS opaque, covers the rest); deeper = smaller,
        // lifted, tilted, dimmer: clear → less → even less.
        const DEPTH = [
          { opacity: 1, scale: 1, y: 0, rotationX: 0 },
          { opacity: 0.5, scale: 0.9, y: -26, rotationX: 4 },
          { opacity: 0.24, scale: 0.8, y: -48, rotationX: 8 }
        ]
        const ZI = [3, 2, 1]
        const dLast = DEPTH.length - 1
        const dState = (d) => DEPTH[Math.min(d, dLast)]
        const dZ = (d) => ZI[Math.min(d, dLast)]

        let index = 0
        let animating = false
        let locked = false
        let lockedY = 0
        let edgePush = 0 // consecutive "push past the end card" gestures
        let queued = 0 // a swipe that arrived mid-animation, run when it finishes

        const place = (front) => {
          imageSets.forEach((el, i) => {
            const d = mod(i - front, num)
            gsap.set(el, { ...dState(d), zIndex: dZ(d), transformOrigin: '50% 0%' })
          })
          textItems.forEach((el, i) => {
            gsap.set(el, { opacity: i === front ? 1 : 0, y: i === front ? 0 : 18 })
          })
        }
        place(0)

        // One fixed-duration eased step (dir +1 next, -1 prev). false at the end.
        // Works identically both ways: the card COMING to the front rides on
        // top (zIndex 4) for the whole move so it's always visible travelling
        // in; the card LEAVING the front sits just under it (zIndex 3) and
        // recedes; everyone else stays at the back. zIndex settles to its
        // resting value at the end for the next step.
        const step = (dir) => {
          const next = index + dir
          if (animating || next < 0 || next >= num) return false
          animating = true
          const prev = index
          index = next

          const tl = gsap.timeline({
            defaults: { ease: 'power2.inOut' },
            onComplete: () => {
              animating = false
              // Flush a swipe that came in while this step was playing, so
              // fast repeated swipes flow card-to-card instead of being dropped.
              if (queued !== 0) {
                const d = queued
                queued = 0
                if (!step(d)) tryEdge(d)
              }
            }
          })
          imageSets.forEach((el, i) => {
            const dFrom = mod(i - prev, num)
            const dTo = mod(i - next, num)
            if (dFrom === dTo) return
            const to = dState(dTo)
            const incoming = dTo === 0
            const leaving = dFrom === 0

            gsap.set(el, { zIndex: incoming ? 4 : leaving ? 3 : 1 })

            tl.to(el, {
              scale: to.scale, y: to.y, rotationX: to.rotationX, duration: 0.62
            }, 0)

            if (incoming) {
              tl.to(el, { opacity: 1, duration: 0.32 }, 0)          // brighten in fast, stays on top
            } else if (leaving) {
              tl.to(el, { opacity: to.opacity, duration: 0.32 }, 0.3) // hold opaque, then dim as it clears
            } else {
              tl.to(el, { opacity: to.opacity, duration: 0.62 }, 0)
            }

            tl.set(el, { zIndex: dZ(dTo) }, 0.62)
          })

          tl.to(textItems[prev], { opacity: 0, y: dir > 0 ? -16 : 16, duration: 0.28, ease: 'power1.in' }, 0)
            .fromTo(
              textItems[next],
              { opacity: 0, y: dir > 0 ? 16 : -16 },
              { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
              0.22
            )
          return true
        }

        // Fully unlock WITHOUT any corrective scroll — used when a navbar/footer
        // "jump to section" scroll is in flight, so this section never fights or
        // traps it.
        const standDown = () => {
          if (!locked) return
          locked = false
          edgePush = 0
          queued = 0
          window.removeEventListener('scroll', hold)
          observer.disable()
        }

        // rAF-throttled snap-back so a stray scroll during the lock is corrected
        // on the next frame instead of every scroll event (which read as a fight).
        let holdRaf = null
        const hold = () => {
          if (navScroll.active) { standDown(); return }
          if (holdRaf !== null) return
          holdRaf = requestAnimationFrame(() => {
            holdRaf = null
            if (locked && Math.abs(window.pageYOffset - lockedY) > 1) {
              window.scrollTo(0, lockedY)
            }
          })
        }

        const lock = (fromDir) => {
          if (locked) return
          locked = true
          lockedY = Math.round(window.pageYOffset + section.getBoundingClientRect().top)
          window.scrollTo(0, lockedY)
          index = fromDir > 0 ? 0 : num - 1
          animating = false
          edgePush = 0
          queued = 0
          place(index)
          window.addEventListener('scroll', hold, { passive: true })
          observer.enable()
        }

        const release = (dir) => {
          if (!locked) return
          locked = false
          edgePush = 0
          queued = 0
          window.removeEventListener('scroll', hold)
          observer.disable()
          const maxPast = section.offsetHeight - window.innerHeight
          window.scrollTo(0, dir > 0 ? lockedY + maxPast + 4 : Math.max(0, lockedY - 4))
        }

        // At an end card, one more scroll past the edge frees the section —
        // no "swipe twice" dwell, so it never feels stuck.
        const tryEdge = (dir) => {
          edgePush += 1
          if (edgePush >= 1) release(dir)
        }

        const observer = Observer.create({
          target: window,
          type: 'wheel,touch',
          wheelSpeed: -1,
          tolerance: 8,
          dragMinimum: 4,
          preventDefault: true,
          onUp: () => { // swipe up = forward / next
            if (animating) { queued = 1; return }
            if (step(1)) edgePush = 0
            else tryEdge(1)
          },
          onDown: () => { // swipe down = back / prev
            if (animating) { queued = -1; return }
            if (step(-1)) edgePush = 0
            else tryEdge(-1)
          }
        })
        observer.disable()

        const gate = ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          // Don't engage the card lock while a navbar/footer scroll is passing
          // through — that's what was trapping the page in this section.
          onEnter: () => { if (!navScroll.active) lock(1) },
          onEnterBack: () => { if (!navScroll.active) lock(-1) },
          onLeave: () => release(1),
          onLeaveBack: () => release(-1)
        })

        requestAnimationFrame(() => ScrollTrigger.refresh())

        return () => {
          observer.kill()
          gate.kill()
          if (holdRaf !== null) cancelAnimationFrame(holdRaf)
          window.removeEventListener('scroll', hold)
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
