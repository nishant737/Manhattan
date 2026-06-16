import { useState, useEffect, useRef } from 'react'
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
  const autoSlideRef = useRef(null)
  const carouselRef = useRef(null)
  const textRef = useRef(null)

  // Auto-slide carousel
  useEffect(() => {
    autoSlideRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % RESIDENCES.length)
    }, 4000)

    return () => clearInterval(autoSlideRef.current)
  }, [])

  // Smooth carousel and text animations on index change
  useEffect(() => {
    // Animate carousel images
    if (carouselRef.current) {
      gsap.fromTo(
        carouselRef.current.querySelectorAll('.carousel-image-container'),
        { opacity: 0 },
        { opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.inOut' }
      )
    }

    // Animate text with fade and slide
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      )
    }
  }, [activeIndex])

  const getVisibleIndices = () => {
    const prev = (activeIndex - 1 + RESIDENCES.length) % RESIDENCES.length
    const next = (activeIndex + 1) % RESIDENCES.length
    return { prev, current: activeIndex, next }
  }

  const { prev, current, next } = getVisibleIndices()
  const currentTitle = RESIDENCES[current].title

  return (
    <section className="luxury-showcase">
      <div className="showcase-header">
        <h2 className="showcase-main-title">Luxury Residences</h2>
      </div>

      <div className="carousel-section">
        {/* Text overlay with animation */}
        <div className="carousel-text-overlay" ref={textRef} key={activeIndex}>
          <h3 className="carousel-title">{currentTitle}</h3>
        </div>

        {/* Carousel with sliding animation */}
        <div className="carousel-images-wrapper" ref={carouselRef}>
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
      </div>
    </section>
  )
}
