import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import './LuxuryShowcase.css'

gsap.registerPlugin(ScrollTrigger)

const RESIDENCES = [
  {
    id: 1,
    image: '/GYM.jpg',
    title: 'GYM AND SPA'
  },
  {
    id: 2,
    image: '/SKY LOUNGE CAFE.jpg',
    title: 'INDOOR POOL'
  },
  {
    id: 3,
    image: '/Sky Lounge-Game Room.jpeg',
    title: 'GAME ROOM'
  }
]

export default function LuxuryShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const wrapperRef = useRef(null)
  const textRef = useRef(null)
  const showcaseRef = useRef(null)
  const headerRef = useRef(null)
  const carouselRef = useRef(null)

  // Entrance animations on scroll into view
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

    // Animate carousel section with staggered effect
    if (carouselRef.current) {
      gsap.fromTo(
        carouselRef.current,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
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

    // Parallax effect on images during scroll
    const images = wrapperRef.current?.querySelectorAll('.carousel-image-container')
    if (images && images.length > 0) {
      gsap.to(images, {
        y: (index) => {
          return gsap.utils.unitize(index * 10, 'px')
        },
        scrollTrigger: {
          trigger: showcase,
          start: 'top center',
          end: 'bottom center',
          scrub: 1,
          markers: false
        }
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === showcase || trigger.vars.trigger === headerRef.current || trigger.vars.trigger === carouselRef.current) {
          trigger.kill()
        }
      })
    }
  }, [])

  const getVisibleIndices = () => {
    const prev = (activeIndex - 1 + RESIDENCES.length) % RESIDENCES.length
    const next = (activeIndex + 1) % RESIDENCES.length
    return { prev, current: activeIndex, next }
  }

  const slideCarousel = (direction) => {
    if (isAnimating) return
    setIsAnimating(true)

    const newIndex = direction === 'next'
      ? (activeIndex + 1) % RESIDENCES.length
      : (activeIndex - 1 + RESIDENCES.length) % RESIDENCES.length

    // Update state first so new images load in background
    setActiveIndex(newIndex)

    // Use small setTimeout to ensure React has rendered new images
    setTimeout(() => {
      const containers = wrapperRef.current?.querySelectorAll('.carousel-image-container') || []

      if (!containers.length) {
        setIsAnimating(false)
        return
      }

      const leftContainer = containers[0]
      const centerContainer = containers[1]
      const rightContainer = containers[2]

      // Create timeline for fast, clean image swap (NO SCALING ANIMATIONS)
      const timeline = gsap.timeline({
        onComplete: () => {
          setIsAnimating(false)
        }
      })

      // Fade out text quickly
      timeline.to(textRef.current, {
        opacity: 0,
        y: -6,
        duration: 0.1,
        ease: 'power2.in'
      }, 0)

      // Clean crossfade: all images fade smoothly (NO SCALE CHANGES)
      // Fade all containers down briefly for clean image swap
      timeline.to(containers, {
        opacity: 0.7,
        duration: 0.15,
        ease: 'power2.inOut'
      }, 0)

      // Fade back to full opacity - smooth crossfade complete
      timeline.to(containers, {
        opacity: 1,
        duration: 0.15,
        ease: 'power2.inOut'
      }, 0.15)

      // Reset any transforms to ensure clean CSS defaults
      timeline.add(() => {
        gsap.set([leftContainer, centerContainer, rightContainer], {
          clearProps: "transform"
        })
      }, 0.3)

      // Text pops in after fade completes
      timeline.fromTo(textRef.current, {
        opacity: 0,
        y: 8,
        scale: 0.96
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.25,
        ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      }, 0.2)
    }, 0)
  }

  const { prev, current, next } = getVisibleIndices()
  const currentTitle = RESIDENCES[current].title

  return (
    <section className="luxury-showcase" ref={showcaseRef}>
      <div className="showcase-header" ref={headerRef}>
        <h2 className="showcase-main-title">Luxury Residences</h2>
      </div>

      <div className="carousel-section" ref={carouselRef}>
        {/* Text overlay */}
        <div className="carousel-text-overlay" ref={textRef}>
          <h3 className="carousel-title">{currentTitle}</h3>
        </div>

        {/* Image carousel with three visible slides */}
        <div className="carousel-images-wrapper" ref={wrapperRef}>
          {/* Left image */}
          <div className="carousel-image-container carousel-image-left">
            <img
              src={RESIDENCES[prev].image}
              alt={RESIDENCES[prev].title}
              className="carousel-image"
            />
          </div>

          {/* Center image */}
          <div className="carousel-image-container carousel-image-center">
            <img
              src={RESIDENCES[current].image}
              alt={RESIDENCES[current].title}
              className="carousel-image"
            />
          </div>

          {/* Right image */}
          <div className="carousel-image-container carousel-image-right">
            <img
              src={RESIDENCES[next].image}
              alt={RESIDENCES[next].title}
              className="carousel-image"
            />
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          className="carousel-nav-arrow carousel-nav-arrow-prev"
          onClick={() => slideCarousel('prev')}
          disabled={isAnimating}
          aria-label="Previous slide"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <button
          className="carousel-nav-arrow carousel-nav-arrow-next"
          onClick={() => slideCarousel('next')}
          disabled={isAnimating}
          aria-label="Next slide"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </section>
  )
}
