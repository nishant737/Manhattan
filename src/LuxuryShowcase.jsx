import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import './LuxuryShowcase.css'

gsap.registerPlugin(ScrollTrigger)

const AMENITIES = [
  {
    id: 1,
    title: 'Community Hall',
    image: '/GYM.jpg',
    description: 'Elegant multi-purpose space for gatherings, events, and celebrations with state-of-the-art facilities and customizable ambiance.'
  },
  {
    id: 2,
    title: 'Game Room',
    image: '/Sky Lounge-Game Room.jpeg',
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
    image: '/SKY LOUNGE CAFE.jpg',
    description: 'Grand entrance with sophisticated design, concierge services, and a welcoming atmosphere for residents and guests.'
  },
  {
    id: 5,
    title: 'Pool',
    image: '/SKY LOUNGE CAFE.jpg',
    description: 'Olympic-size heated swimming pool with underwater lighting, jacuzzi facilities, and dedicated lap swimming zones.'
  },
  {
    id: 6,
    title: 'Cinema Lounge',
    image: '/Sky Lounge-Game Room.jpeg',
    description: 'Private screening room with premium audio-visual systems, comfortable seating, and curated entertainment experiences.'
  },
  {
    id: 7,
    title: 'Sky Lounge',
    image: '/Sky Lounge-Game Room.jpeg',
    description: 'Elegant rooftop lounge with panoramic city views, premium dining areas, and exclusive entertainment facilities.'
  }
]

export default function LuxuryShowcase() {
  const carouselRef = useRef(null)
  const headerRef = useRef(null)
  const showcaseRef = useRef(null)
  const carouselAnimationRef = useRef(null)
  const [hoveredId, setHoveredId] = useState(null)
  const [isGridView, setIsGridView] = useState(false)

  // Entrance animations and continuous carousel scroll
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

    // Setup continuous carousel scroll animation
    if (carouselRef.current) {
      const carousel = carouselRef.current.querySelector('.carousel-track')
      if (carousel) {
        // Clone items for seamless loop
        const items = carousel.querySelectorAll('.carousel-item')
        items.forEach(item => {
          const clone = item.cloneNode(true)
          carousel.appendChild(clone)
        })

        // Animate continuous scroll - ALWAYS RUNNING
        const totalWidth = carousel.scrollWidth / 2
        const scrollAnimation = gsap.to(carousel, {
          x: -totalWidth,
          duration: 40,
          ease: 'none',
          repeat: -1,
          onRepeat: () => {
            gsap.set(carousel, { x: 0 })
          }
        })
        carouselAnimationRef.current = scrollAnimation

        // Add hover listeners to pause/resume only
        const carouselItems = carousel.querySelectorAll('.carousel-item')
        carouselItems.forEach((item) => {
          item.addEventListener('mouseenter', () => {
            scrollAnimation.pause()
          })
          item.addEventListener('mouseleave', () => {
            scrollAnimation.play()
          })
        })
      }

      // Fade in carousel
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
          <div className="carousel-track">
            {AMENITIES.map((amenity) => (
              <div
                key={amenity.id}
                className="carousel-item"
                onMouseEnter={() => setHoveredId(amenity.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="amenity-card">
                  <div className="amenity-image-wrapper">
                    <img src={amenity.image} alt={amenity.title} className="amenity-image" />
                  </div>
                  <div className="amenity-label">
                    <h3>{amenity.title}</h3>
                    <p className="amenity-description">{amenity.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                  <img src={amenity.image} alt={amenity.title} className="grid-image" />
                </div>
                <div className={`grid-label ${hoveredId === amenity.id ? 'expanded' : ''}`}>
                  <h3>{amenity.title}</h3>
                  <p className="grid-description">{amenity.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom row: 3 items centered */}
        <div className="amenities-grid-bottom">
          {AMENITIES.slice(4, 7).map((amenity) => (
            <div
              key={amenity.id}
              className="grid-item"
              onMouseEnter={() => setHoveredId(amenity.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="grid-card">
                <div className="grid-image-wrapper">
                  <img src={amenity.image} alt={amenity.title} className="grid-image" />
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
