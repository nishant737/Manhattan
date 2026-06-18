import { useState, useRef } from 'react'
import gsap from 'gsap'
import './LuxuryShowcase.css'

const RESIDENCES = [
  {
    id: 1,
    image: '/INDOOR GAME.jpg',
    title: 'INDOOR GAME'
  },
  {
    id: 2,
    image: '/SKY LOUNGE CAFE.jpg',
    title: 'SKY LOUNGE CAFE'
  },
  {
    id: 3,
    image: '/STREET VIEW_ 02.jpg',
    title: 'STREET VIEW'
  }
]

export default function LuxuryShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const wrapperRef = useRef(null)
  const textRef = useRef(null)

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
    <section className="luxury-showcase">
      <div className="showcase-header">
        <h2 className="showcase-main-title">Luxury Residences</h2>
      </div>

      <div className="carousel-section">
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
