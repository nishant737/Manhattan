import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import './AmenitiesSection.css'
import IconicArchitectureImg from './assets/potrait.jpeg'
import SpaciousLivingImg from './assets/Spaiousliving.jpeg'
import ElevatedLivingImg from './assets/ElevatedExperinces.jpeg'

gsap.registerPlugin(ScrollTrigger)

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
    description: 'Soaring double height ceilings and sweeping open-plan interiors, finished in imported stone and bespoke detailing, designed for those who live without compromise on space.',
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
    // Desktop only. Portrait phones run their own pinned card-stack below;
    // landscape phones get a plain scrolling list (CSS) with no GSAP at all.
    if (window.matchMedia('(max-width: 768px), (orientation: landscape) and (max-height: 600px)').matches) return

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

      // `min-height: 601px` keeps the pinned two-column crossfade off landscape
      // phones (wide enough to hit 1025px on a few large devices, but far too
      // short) — those get the plain scrolling list (CSS) instead.
      mm.add('(min-width: 1025px) and (min-height: 601px)', () => {
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

      // ── Mobile: pinned, scroll-scrubbed card stack ──
      //    A plain ScrollTrigger pin + scrub — NO wheel/touch hijacking, no
      //    scrollTo "snap-back", no Observer. The page keeps scrolling with the
      //    browser's own momentum, which is what makes it smooth on iOS/Android.
      //    The section is exactly 100dvh, so the instant its top meets the
      //    viewport top it pins dead-centre; from there scroll progress drives
      //    one handoff at a time — the front card recedes to the back of the
      //    fan as the next rises to the front, the heading crossfading with it.
      //    After the last card forms, the pin releases and the page carries on.
      //    Portrait phones only — `min-height: 601px` excludes landscape phones,
      //    which get the plain CSS scrolling list (no pin, native-smooth).
      mm.add('(max-width: 768px) and (min-height: 601px)', () => {
        const section = sectionRef.current
        const imageSets = imagesRef.current.filter(Boolean)
        const textItems = itemsRef.current.filter(Boolean)
        const num = Math.min(imageSets.length, textItems.length)
        if (num < 2) return

        ScrollTrigger.config({ ignoreMobileResize: true })

        const mod = (n, m) => ((n % m) + m) % m
        // depth 0 = front (opaque, covers the rest); deeper = smaller, lifted,
        // tilted, dimmer so the stack reads as a fanned deck of cards.
        const DEPTH = [
          { opacity: 1, scale: 1, y: 0, rotationX: 0 },
          { opacity: 0.5, scale: 0.9, y: -26, rotationX: 4 },
          { opacity: 0.24, scale: 0.8, y: -48, rotationX: 8 }
        ]
        const ZI = [3, 2, 1]
        const dLast = DEPTH.length - 1
        const dState = (d) => DEPTH[Math.min(d, dLast)]
        const dZ = (d) => ZI[Math.min(d, dLast)]

        // Resting fan with `front` as the front card.
        const placeAt = (front) => {
          imageSets.forEach((el, i) => {
            const d = mod(i - front, num)
            gsap.set(el, { ...dState(d), zIndex: dZ(d), transformOrigin: '50% 0%' })
          })
          textItems.forEach((el, i) => {
            gsap.set(el, { opacity: i === front ? 1 : 0, y: i === front ? 0 : 18 })
          })
        }
        placeAt(0)

        const HANDOFF = 1     // scroll-time units for one card swap
        const HOLD = 0.34     // dwell before / between / after the swaps

        // One snap stop per "card fully formed" state (plus the two ends). The
        // custom snapTo below only ever moves ONE stop per settle, so however
        // hard the visitor flicks in from the hero they can't blow past — the
        // section catches them and they step through every card before the pin
        // finally releases on the next scroll.
        const stops = num === 3
          ? [0, 0.45, 0.9, 1]
          : Array.from({ length: num }, (_, i) => i / (num - 1))
        const nearestIdx = (p) => {
          let ni = 0, best = Infinity
          stops.forEach((s, i) => {
            const d = Math.abs(s - p)
            if (d < best) { best = d; ni = i }
          })
          return ni
        }
        let settledIdx = 0

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            id: 'amenitiesMobile',
            trigger: section,
            start: 'top top',
            // A long pin so a single hard flick can't clear it, and the snap
            // below always has range to catch the visitor. invalidateOnRefresh
            // re-measures cleanly on URL-bar resize.
            end: () => '+=' + Math.round(window.innerHeight * (num - 1) * 1.9),
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 0.8, // eased catch-up — the crossfade glides toward the
            // scroll position instead of snapping 1:1, so flicks read smooth.
            invalidateOnRefresh: true,
            fastScrollEnd: false,
            onEnter: () => { settledIdx = 0 },
            onEnterBack: () => { settledIdx = stops.length - 1 },
            snap: {
              // Snap toward the card nearest where momentum would land, but
              // never more than one stop from the last settled card — that's
              // what makes the section "sticky": one gesture = one card.
              snapTo: (value) => {
                let ni = nearestIdx(value)
                ni = Math.max(settledIdx - 1, Math.min(settledIdx + 1, ni))
                return stops[ni]
              },
              duration: { min: 0.18, max: 0.5 },
              delay: 0.05,
              ease: 'power2.inOut',
              directional: false,
              onComplete: () => {
                const st = ScrollTrigger.getById('amenitiesMobile')
                if (st) settledIdx = nearestIdx(st.progress)
              }
            }
          }
        })

        let t = HOLD // lead-in: the first card holds a beat before anything moves
        for (let k = 0; k < num - 1; k++) {
          const from = k
          const to = k + 1

          imageSets.forEach((el, i) => {
            const dFrom = mod(i - from, num)
            const dTo = mod(i - to, num)
            if (dFrom === dTo) return
            const s = dState(dTo)
            const incoming = dTo === 0
            const leaving = dFrom === 0
            // The card travelling to the front rides on top (zIndex 4) for the
            // whole move; the one leaving the front sits just under it. The
            // outgoing card recedes noticeably faster (shorter duration, ease
            // that starts quick) so the back of the deck clears briskly while
            // the new front glides in.
            const dur = leaving ? HANDOFF * 0.6 : incoming ? HANDOFF : HANDOFF * 0.8
            const ease = leaving ? 'power2.out' : incoming ? 'power3.out' : 'power1.inOut'
            tl.set(el, { zIndex: incoming ? 4 : leaving ? 3 : 1 }, t)
            tl.to(el, {
              opacity: s.opacity, scale: s.scale, y: s.y, rotationX: s.rotationX,
              duration: dur, ease
            }, t)
            tl.set(el, { zIndex: dZ(dTo) }, t + HANDOFF)
          })

          tl.to(textItems[from],
            { opacity: 0, y: -16, duration: HANDOFF * 0.34, ease: 'power1.in' }, t)
          tl.fromTo(textItems[to],
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: HANDOFF * 0.55, ease: 'power2.out' },
            t + HANDOFF * 0.3)

          t += HANDOFF + HOLD
        }
        // trailing dwell so the final card is fully settled before the release
        tl.to({}, { duration: HOLD }, t)

        return () => {
          if (tl.scrollTrigger) tl.scrollTrigger.kill()
          tl.kill()
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
                  <img src={amenity.backgroundImage} alt={amenity.title} decoding="async" />
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
