import { useState, useEffect, useRef } from 'react'
import './AmenitiesSection.css'

const AMENITIES = [
  {
    id: 1,
    title: 'Luxury Amenities',
    icon: '✨'
  },
  {
    id: 2,
    title: 'Premium Finishes',
    icon: '🏆'
  },
  {
    id: 3,
    title: 'Smart Living',
    icon: '🔧'
  },
  {
    id: 4,
    title: 'Concierge Services',
    icon: '🎩'
  }
]

export default function AmenitiesSection() {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [isVisible])

  return (
    <section className="amenities-section" ref={sectionRef}>
      <div className="amenities-header">
        <h1 className="amenities-main-title">Premium Amenities</h1>
      </div>
      <div className="amenities-container">
        {/* Left Section */}
        <div className={`amenities-left ${isVisible ? 'animate-fade-up' : ''}`}>
          <h2 className="amenities-heading">Tailored Solutions for Your Manhattan Living</h2>
          <a href="#" className="amenities-explore">
            <span className="explore-dot"></span>
            Explore More
            <span className="explore-arrow">→</span>
          </a>
        </div>

        {/* Right Section - Pills */}
        <div className="amenities-right">
          <div className="amenities-pills">
            {AMENITIES.map((amenity, index) => (
              <div 
                key={amenity.id} 
                className={`amenity-pill ${isVisible ? 'animate-slide-in-right' : ''}`}
                style={{
                  animationDelay: isVisible ? `${index * 120}ms` : '0ms'
                }}
              >
                <div className="pill-icon">{amenity.icon}</div>
                <span className="pill-text">{amenity.title}</span>
                <div className="pill-arrow">⌄</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
