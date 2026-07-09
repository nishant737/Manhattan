import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import './AmenitiesSection.css'
import ConciergeServicesImg from './assets/ConciergeServices.jpeg'
import PremiumFinishesImg from './assets/PremiumFinishes.jpeg'
import SmartLivingImg from './assets/SmartLiving.jpeg'

gsap.registerPlugin(ScrollTrigger)

const AMENITIES = [
  {
    id: 2,
    index: '01',
    title: 'Premium Finishes',
    description: 'Every surface, fixture, and fitting has been curated with intention — imported stone, bespoke millwork, and materials selected for both beauty and longevity.',
    backgroundImage: PremiumFinishesImg
  },
  {
    id: 3,
    index: '02',
    title: 'Smart Living',
    description: 'Integrated home automation, climate control, and high-speed connectivity — engineered to make every moment effortless and every space responsive to you.',
    backgroundImage: SmartLivingImg
  },
  {
    id: 1,
    index: '03',
    title: 'Concierge Services',
    description: 'From restaurant reservations to private event curation, our dedicated concierge team is available around the clock to anticipate your every need.',
    backgroundImage: ConciergeServicesImg
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
            // Premium Finishes: visible from start, fade out as Smart Living comes in
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
            // Concierge Services: fade in and stay visible until end
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
            // Smart Living: fade in, stay visible, fade out
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
                <div className="amenity-image-background">
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
