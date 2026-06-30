import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import './ApartmentShowcase.css'
import LowerDuplexLayout from './assets/lower-duplex-layout.jpeg'
import UpperDuplexLayout from './assets/upper-duplex-layout.jpeg'

const APARTMENT_DATA = {
  standard: {
    brand: 'MANHATTAN',
    title: 'Premium Apartments',
    description: 'Elegant urban residences designed for contemporary living. Featuring premium finishes, open floor plans, and stunning city views.',
    cta: 'BOOK A VISIT',
    images: [
      '/INDOOR GAME.jpg',
      '/SKY LOUNGE CAFE.jpg',
      '/STREET VIEW_ 02.jpg'
    ],
    specs: [
      { label: 'Bedroom', value: '2-3' },
      { label: 'Size', value: '240 sq. ft.' },
      { label: 'Floor Plan', value: 'Open Layout' }
    ]
  },
  refuge: {
    brand: 'MANHATTAN',
    title: 'Refuge Floor Apartments',
    description: 'Serene sanctuaries with premium amenities and exclusive layouts. Perfect for those seeking tranquility and luxury.',
    cta: 'BOOK A VISIT',
    images: [
      '/SKY LOUNGE CAFE.jpg',
      '/STREET VIEW_ 02.jpg',
      '/INDOOR GAME.jpg'
    ],
    specs: [
      { label: 'Bedroom', value: '3-4' },
      { label: 'Size', value: '350 sq. ft.' },
      { label: 'Floor Plan', value: 'Luxury Layout' }
    ]
  },
  'lower-duplex': {
    brand: 'MANHATTAN',
    title: 'Lower Duplex Units',
    description: 'Spacious two-level residences with private outdoor spaces. An exceptional living experience with premium amenities.',
    cta: 'BOOK A VISIT',
    images: [
      '/STREET VIEW_ 02.jpg',
      '/INDOOR GAME.jpg',
      '/SKY LOUNGE CAFE.jpg',
      LowerDuplexLayout
    ],
    specs: [
      { label: 'Bedroom', value: '3-4' },
      { label: 'Size', value: '450 sq. ft.' },
      { label: 'Floor Plan', value: 'Duplex' }
    ]
  },
  'upper-duplex': {
    brand: 'MANHATTAN',
    title: 'Upper Duplex Units',
    description: 'Premium penthouses with panoramic views and luxury finishes. The pinnacle of luxury living in Manhattan.',
    cta: 'BOOK A VISIT',
    images: [
      '/INDOOR GAME.jpg',
      '/STREET VIEW_ 02.jpg',
      '/SKY LOUNGE CAFE.jpg',
      UpperDuplexLayout
    ],
    specs: [
      { label: 'Bedroom', value: '4-5' },
      { label: 'Size', value: '550 sq. ft.' },
      { label: 'Floor Plan', value: 'Penthouse' }
    ]
  }
}

export default function ApartmentShowcase({ id, onClose }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const containerRef = useRef(null)
  const mainImageRef = useRef(null)
  const infoRef = useRef(null)

  const data = APARTMENT_DATA[id] || APARTMENT_DATA.standard

  // Slide down animation on mount
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: -100 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power2.inOut' }
      )
    }
  }, [])

  const handleImageClick = (index) => {
    if (index === activeImageIndex || isAnimating) return
    setIsAnimating(true)

    const timeline = gsap.timeline()

    // Fade out current image
    timeline.to(mainImageRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.inOut'
    }, 0)

    // Update image and fade in
    timeline.add(() => {
      setActiveImageIndex(index)
    }, 0.3)

    timeline.to(mainImageRef.current, {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.inOut'
    }, 0.35)

    timeline.add(() => {
      setIsAnimating(false)
    }, '-=0')
  }

  const handleClose = () => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        y: -100,
        duration: 0.7,
        ease: 'power2.inOut',
        onComplete: onClose
      })
    }
  }

  return (
    <div className="apartment-showcase-backdrop" onClick={handleClose}>
      <div className="apartment-showcase" ref={containerRef} onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="apartment-close-btn" onClick={handleClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Left side - Large image with thumbnails */}
        <div className="apartment-image-section">
          <div className="apartment-main-image-wrapper">
            <img
              ref={mainImageRef}
              src={data.images[activeImageIndex]}
              alt="Apartment"
              className="apartment-main-image"
            />
          </div>

          {/* Thumbnail strip */}
          <div className="apartment-thumbnails">
            {data.images.map((image, index) => (
              <button
                key={index}
                className={`apartment-thumbnail ${index === activeImageIndex ? 'active' : ''}`}
                onClick={() => handleImageClick(index)}
                aria-label={`View image ${index + 1}`}
              >
                <img src={image} alt={`Thumbnail ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Right side - Info panel */}
        <div className="apartment-info-panel" ref={infoRef}>
          <div className="apartment-info-content">
            {/* Brand */}
            <div className="apartment-brand">{data.brand}</div>

            {/* Divider */}
            <div className="apartment-divider"></div>

            {/* Title */}
            <h2 className="apartment-title">{data.title}</h2>

            {/* Description */}
            <p className="apartment-description">{data.description}</p>

            {/* Specs */}
            <div className="apartment-specs">
              {data.specs.map((spec, index) => (
                <div key={index} className="apartment-spec">
                  <div className="spec-label">{spec.label}</div>
                  <div className="spec-value">{spec.value}</div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button className="apartment-cta-btn">{data.cta}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
