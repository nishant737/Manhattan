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

    const containers = wrapperRef.current?.querySelectorAll('.carousel-image-container') || []

    const timeline = gsap.timeline()

    // Fade out old text quickly
    timeline.to(textRef.current, {
      opacity: 0,
      y: -8,
      duration: 0.2,
      ease: 'power2.in'
    }, 0)

    // Fade out all images smoothly
    timeline.to(containers, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut'
    }, 0)

    // Update state while images are hidden (show new images)
    timeline.add(() => {
      setActiveIndex(newIndex)
    }, 0.4)

    // Fade in new images smoothly (starting after old images fade out)
    timeline.to(containers, {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.inOut'
    }, 0.45)

    // Pop up text after images are in (starts at 0.8s)
    timeline.fromTo(textRef.current, {
      opacity: 0,
      y: 15,
      scale: 0.92
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.55,
      ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    }, 0.8)

    // Mark animation complete
    timeline.add(() => {
      setIsAnimating(false)
    }, '-=0')
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
