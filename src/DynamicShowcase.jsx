import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import './DynamicShowcase.css'

const SHOWCASE_DATA = {
  standard: {
    title: 'Standard Apartments',
    description: 'Elegant urban residences designed for contemporary living',
    images: [
      '/INDOOR GAME.jpg',
      '/SKY LOUNGE CAFE.jpg',
      '/STREET VIEW_ 02.jpg'
    ]
  },
  refuge: {
    title: 'Refuge Floor Apartments',
    description: 'Serene sanctuaries with premium amenities and exclusive layouts',
    images: [
      '/SKY LOUNGE CAFE.jpg',
      '/STREET VIEW_ 02.jpg',
      '/INDOOR GAME.jpg'
    ]
  },
  'lower-duplex': {
    title: 'Lower Duplex Units',
    description: 'Spacious two-level residences with private outdoor spaces',
    images: [
      '/STREET VIEW_ 02.jpg',
      '/INDOOR GAME.jpg',
      '/SKY LOUNGE CAFE.jpg'
    ]
  },
  'upper-duplex': {
    title: 'Upper Duplex Units',
    description: 'Premium penthouses with panoramic views and luxury finishes',
    images: [
      '/INDOOR GAME.jpg',
      '/STREET VIEW_ 02.jpg',
      '/SKY LOUNGE CAFE.jpg'
    ]
  }
}

export default function DynamicShowcase({ id, onClose }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const containerRef = useRef(null)
  const wrapperRef = useRef(null)
  const textRef = useRef(null)

  const data = SHOWCASE_DATA[id] || SHOWCASE_DATA.standard

  // Slide down animation on mount
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: -80 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.inOut' }
      )
    }
  }, [])

  const slideImages = (direction) => {
    if (isAnimating) return
    setIsAnimating(true)

    const newIndex = direction === 'next'
      ? (activeImageIndex + 1) % data.images.length
      : (activeImageIndex - 1 + data.images.length) % data.images.length

    const containers = wrapperRef.current?.querySelectorAll('.dynamic-image-container') || []

    const timeline = gsap.timeline()

    // Fade out text
    timeline.to(textRef.current, {
      opacity: 0,
      y: -8,
      duration: 0.2,
      ease: 'power2.in'
    }, 0)

    // Fade out images
    timeline.to(containers, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut'
    }, 0)

    // Update state while images are hidden
    timeline.add(() => {
      setActiveImageIndex(newIndex)
    }, 0.4)

    // Fade in new images
    timeline.to(containers, {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.inOut'
    }, 0.45)

    // Pop up text
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

    timeline.add(() => {
      setIsAnimating(false)
    }, '-=0')
  }

  const handleClose = () => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        y: -80,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: onClose
      })
    }
  }

  const getVisibleImages = () => {
    const prev = (activeImageIndex - 1 + data.images.length) % data.images.length
    const current = activeImageIndex
    const next = (activeImageIndex + 1) % data.images.length
    return [prev, current, next]
  }

  const [prevIdx, currentIdx, nextIdx] = getVisibleImages()

  return (
    <div className="dynamic-showcase-backdrop" onClick={handleClose}>
      <div className="dynamic-showcase" ref={containerRef} onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="dynamic-showcase-close" onClick={handleClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Header */}
        <div className="dynamic-showcase-header">
          <h2 className="dynamic-showcase-title">{data.title}</h2>
          <p className="dynamic-showcase-subtitle">{data.description}</p>
        </div>

        {/* Carousel section */}
        <div className="dynamic-carousel-section">
          {/* Text overlay */}
          <div className="dynamic-carousel-text" ref={textRef}>
            <h3 className="dynamic-carousel-image-label">{data.images[currentIdx].replace(/\//g, '').replace('.jpg', '')}</h3>
          </div>

          {/* Images wrapper */}
          <div className="dynamic-images-wrapper" ref={wrapperRef}>
            {/* Left image */}
            <div className="dynamic-image-container dynamic-image-left">
              <img src={data.images[prevIdx]} alt="Previous" className="dynamic-image" />
            </div>

            {/* Center image */}
            <div className="dynamic-image-container dynamic-image-center">
              <img src={data.images[currentIdx]} alt="Current" className="dynamic-image" />
            </div>

            {/* Right image */}
            <div className="dynamic-image-container dynamic-image-right">
              <img src={data.images[nextIdx]} alt="Next" className="dynamic-image" />
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            className="dynamic-carousel-arrow dynamic-carousel-arrow-prev"
            onClick={() => slideImages('prev')}
            disabled={isAnimating}
            aria-label="Previous image"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <button
            className="dynamic-carousel-arrow dynamic-carousel-arrow-next"
            onClick={() => slideImages('next')}
            disabled={isAnimating}
            aria-label="Next image"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
