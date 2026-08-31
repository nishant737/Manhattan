import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import './LuxuryShowcase.css'
import LuxuryAmenitiesImg from './LuxuryAmenities.jpeg'
import IndoorPoolImg from './assets/Indoor Pool.jpeg'
import CinemaLoungeImg from './assets/cinema.jpeg'

gsap.registerPlugin(ScrollTrigger)

// Each entry below now points at a distinct, real Manhattan render — the
// previous data reused just 3 images across all 7 categories (e.g. Community
// Hall and Gym shared the identical GYM.jpg), which meant several "different"
// amenities showed the exact same photo. Sourced from the project's own
// cinematic renders rather than generic stock imagery.
const AMENITIES = [
  {
    id: 1,
    title: 'Community Hall',
    image: LuxuryAmenitiesImg,
    description: 'Elegant multi-purpose space for gatherings, events, and celebrations with state-of-the-art facilities and customizable ambiance.'
  },
  {
    id: 2,
    title: 'Game Room',
    image: '/INDOOR GAME.jpg',
    description: 'Premium entertainment space featuring billiards, gaming stations, and recreational facilities for leisure and social gatherings.'
  },
  {
    id: 3,
    title: 'Gym',
    image: '/GYM.jpg',
    description: 'State-of-the-art fitness center equipped with modern equipment, personal training services, and wellness programs.'
  },
  {
    id: 4,
    title: 'Lobby',
    image: '/STREET VIEW_ 02.jpg',
    description: 'Grand entrance with sophisticated design, concierge services, and a welcoming atmosphere for residents and guests.'
  },
  {
    id: 5,
    title: 'Pool',
    image: IndoorPoolImg,
    description: 'Heated indoor swimming pool with panoramic glazing, loungers, and dedicated relaxation zones.'
  },
  {
    id: 6,
    title: 'Cinema Lounge',
    image: CinemaLoungeImg,
    description: 'Private screening room with premium audio-visual systems, comfortable seating, and curated entertainment experiences.'
  },
  {
    id: 7,
    title: 'Sky Lounge',
    image: '/SKY LOUNGE CAFE.jpg',
    description: 'Elegant rooftop lounge with panoramic city views, premium dining areas, and exclusive entertainment facilities.'
  },
  {
    id: 8,
    title: 'Squash Court',
    // No render photographed yet — shown as a clearly-marked placeholder
    // (see the isPlaceholder branch below) rather than borrowing another
    // category's image, so it never reads as a second "real" photo of
    // something else.
    isPlaceholder: true,
    description: 'A dedicated indoor squash court for residents, coming soon.'
  }
]

// Renders either the amenity's real photo or, for entries still awaiting
// final photography (see `isPlaceholder` on AMENITIES above), a clearly-
// marked "coming soon" placeholder — used by both the carousel and grid
// views so the treatment stays identical everywhere this data renders.
function AmenityMedia({ amenity, className }) {
  if (amenity.isPlaceholder) {
    return (
      <div className={`${className} amenity-media-placeholder`}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9.25" />
          <path d="M7 15.5 15.5 7" />
          <path d="M13.5 6 18 10.5" />
        </svg>
        <span>Coming Soon</span>
      </div>
    )
  }
  return <img src={amenity.image} alt={amenity.title} className={className} />
}

// The track renders the amenity list twice back-to-back so the continuous
// auto-slide below can jump from the end of the first copy back to the start
// of the second — identical content either side of the seam — without any
// visible pop.
const LOOPED_AMENITIES = [
  ...AMENITIES.map((a) => ({ ...a, key: `${a.id}-a` })),
  ...AMENITIES.map((a) => ({ ...a, key: `${a.id}-b` }))
]

export default function LuxuryShowcase() {
  const carouselRef = useRef(null)
  const trackRef = useRef(null)
  const headerRef = useRef(null)
  const showcaseRef = useRef(null)
  const pauseAutoScrollRef = useRef(() => {})
  const scheduleResumeAutoScrollRef = useRef(() => {})
  const [hoveredId, setHoveredId] = useState(null)
  const [isGridView, setIsGridView] = useState(false)

  // Entrance animations
  useEffect(() => {
    const showcase = showcaseRef.current
    if (!showcase) return

    // Animate header on entrance
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: showcase,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }

    // Fade in carousel
    if (carouselRef.current) {
      gsap.fromTo(
        carouselRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          delay: 0.2,
          scrollTrigger: {
            trigger: showcase,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === showcase || trigger.vars.trigger === headerRef.current) {
          trigger.kill()
        }
      })
    }
  }, [])

  // Continuous, gentle auto-slide — pauses the instant a visitor takes over
  // (drag, swipe, wheel, or an arrow click) and quietly resumes a couple of
  // seconds after they let go, so manual scrolling always wins in the moment
  // without permanently stopping the ambient motion.
  useEffect(() => {
    const track = trackRef.current
    if (!track || isGridView) return

    const SPEED_PX_PER_SEC = 32
    const RESUME_DELAY_MS = 2200
    let rafId
    let lastTime = null
    let paused = false
    let resumeTimer = null

    const pause = () => {
      paused = true
      if (resumeTimer) clearTimeout(resumeTimer)
    }
    const scheduleResume = (delay = RESUME_DELAY_MS) => {
      if (resumeTimer) clearTimeout(resumeTimer)
      resumeTimer = setTimeout(() => {
        paused = false
        lastTime = null
      }, delay)
    }
    pauseAutoScrollRef.current = pause
    scheduleResumeAutoScrollRef.current = scheduleResume

    const step = (time) => {
      if (lastTime == null) lastTime = time
      const dt = (time - lastTime) / 1000
      lastTime = time

      if (!paused) {
        const halfWidth = track.scrollWidth / 2
        track.scrollLeft += SPEED_PX_PER_SEC * dt
        if (track.scrollLeft >= halfWidth) {
          track.scrollLeft -= halfWidth
        }
      }
      rafId = requestAnimationFrame(step)
    }
    rafId = requestAnimationFrame(step)

    const handleInteractionStart = () => pause()
    const handleInteractionEnd = () => scheduleResume()

    track.addEventListener('pointerdown', handleInteractionStart)
    track.addEventListener('pointerup', handleInteractionEnd)
    track.addEventListener('pointercancel', handleInteractionEnd)
    track.addEventListener('touchstart', handleInteractionStart, { passive: true })
    track.addEventListener('touchend', handleInteractionEnd, { passive: true })
    track.addEventListener('wheel', () => { pause(); scheduleResume() }, { passive: true })

    return () => {
      cancelAnimationFrame(rafId)
      if (resumeTimer) clearTimeout(resumeTimer)
      track.removeEventListener('pointerdown', handleInteractionStart)
      track.removeEventListener('pointerup', handleInteractionEnd)
      track.removeEventListener('pointercancel', handleInteractionEnd)
      track.removeEventListener('touchstart', handleInteractionStart)
      track.removeEventListener('touchend', handleInteractionEnd)
    }
  }, [isGridView])

  // The carousel track is a natively scrollable element (drag/swipe/trackpad/
  // scrollbar all work out of the box) on top of the continuous auto-slide —
  // these buttons are just a discoverable shortcut that nudges it by roughly
  // one card at a time, pausing the auto-slide the same way manual input does.
  const scrollCarousel = (direction) => {
    const track = trackRef.current
    if (!track) return
    pauseAutoScrollRef.current()
    const amount = track.clientWidth * 0.8 * (direction === 'next' ? 1 : -1)
    track.scrollBy({ left: amount, behavior: 'smooth' })
    scheduleResumeAutoScrollRef.current()
  }

  return (
    <section className="luxury-showcase" ref={showcaseRef}>
      <div className="showcase-header" ref={headerRef}>
        <h2 className="showcase-main-title">Luxury Showcase</h2>
        <div className="toggle-button-wrapper">
          <button
            className={`view-toggle-btn ${isGridView ? 'grid-mode' : 'carousel-mode'}`}
            onClick={() => setIsGridView(!isGridView)}
            title={isGridView ? 'Switch to carousel view' : 'Switch to portrait grid view'}
          >
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {!isGridView ? (
                // Landscape view (carousel active) - show transition to portrait
                <>
                  <rect x="10" y="25" width="50" height="30" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                  <text x="35" y="48" fontSize="10" fill="currentColor" textAnchor="middle">SCROLL</text>
                  <path d="M70 30 L80 40 M80 40 L70 50" stroke="currentColor" strokeWidth="2" fill="none" />
                  <rect x="65" y="50" width="25" height="40" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                </>
              ) : (
                // Portrait view (grid active) - show transition to landscape
                <>
                  <rect x="10" y="15" width="30" height="50" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M50 35 L60 35 M60 35 L50 45" stroke="currentColor" strokeWidth="2" fill="none" />
                  <rect x="65" y="25" width="25" height="20" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                  <text x="77" y="37" fontSize="8" fill="currentColor" textAnchor="middle">VIEW</text>
                </>
              )}
            </svg>
          </button>
          <p className="toggle-label">Change View</p>
        </div>
      </div>

      <div className={`carousel-section ${isGridView ? 'hidden' : 'visible'}`} ref={carouselRef}>
        <div className="carousel-wrapper">
          <button
            type="button"
            className="carousel-nav-btn carousel-nav-prev"
            onClick={() => scrollCarousel('prev')}
            aria-label="Scroll to previous"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div className="carousel-track" ref={trackRef}>
            {LOOPED_AMENITIES.map((amenity) => (
              <div
                key={amenity.key}
                className="carousel-item"
                onMouseEnter={() => setHoveredId(amenity.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="amenity-card">
                  <div className="amenity-image-wrapper">
                    <AmenityMedia amenity={amenity} className="amenity-image" />
                  </div>
                  <div className="amenity-label">
                    <h3>{amenity.title}</h3>
                    <p className="amenity-description">{amenity.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="carousel-nav-btn carousel-nav-next"
            onClick={() => scrollCarousel('next')}
            aria-label="Scroll to next"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <div className={`grid-view-section ${!isGridView ? 'hidden' : 'visible'}`}>
        {/* Top row: 4 items */}
        <div className="amenities-grid-top">
          {AMENITIES.slice(0, 4).map((amenity) => (
            <div
              key={amenity.id}
              className="grid-item"
              onMouseEnter={() => setHoveredId(amenity.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="grid-card">
                <div className="grid-image-wrapper">
                  <AmenityMedia amenity={amenity} className="grid-image" />
                </div>
                <div className={`grid-label ${hoveredId === amenity.id ? 'expanded' : ''}`}>
                  <h3>{amenity.title}</h3>
                  <p className="grid-description">{amenity.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom row: 4 items */}
        <div className="amenities-grid-bottom">
          {AMENITIES.slice(4, 8).map((amenity) => (
            <div
              key={amenity.id}
              className="grid-item"
              onMouseEnter={() => setHoveredId(amenity.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="grid-card">
                <div className="grid-image-wrapper">
                  <AmenityMedia amenity={amenity} className="grid-image" />
                </div>
                <div className={`grid-label ${hoveredId === amenity.id ? 'expanded' : ''}`}>
                  <h3>{amenity.title}</h3>
                  <p className="grid-description">{amenity.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
