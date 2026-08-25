import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import LeadCaptureModal from './LeadCaptureModal'
import { LAYOUT_TYPES } from './apartmentLayouts'
import './ApartmentShowcase.css'

export default function ApartmentShowcase({ onClose, initialTypeId = null }) {
  const [selectedTypeId, setSelectedTypeId] = useState(initialTypeId)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)
  const containerRef = useRef(null)
  const mainImageRef = useRef(null)

  const data = LAYOUT_TYPES.find((t) => t.id === selectedTypeId) || null

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

  const handleSelectType = (id) => {
    setSelectedTypeId(id)
    setActiveImageIndex(0)
  }

  const handleBackToSelection = () => {
    setSelectedTypeId(null)
    setActiveImageIndex(0)
  }

  const handleImageClick = (index) => {
    if (index === activeImageIndex || isAnimating) return
    setIsAnimating(true)

    const timeline = gsap.timeline()

    timeline.to(mainImageRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.inOut'
    }, 0)

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

  const handleLeadSubmit = (formData) => {
    // TODO: wire this up to the real CRM/lead-capture endpoint once available.
    console.log('Lead captured from Layout selection:', { ...formData, apartmentType: data?.title })
    setIsLeadModalOpen(false)
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

        {!data ? (
          /* ── Layout selection screen ── */
          <div className="apartment-selection-screen">
            <div className="apartment-selection-header">
              <span className="apartment-brand">MANHATTAN</span>
              <h2 className="apartment-selection-title">Choose Your Layout</h2>
              <p className="apartment-selection-subtitle">Select an apartment layout to explore its images and specifications.</p>
            </div>
            <div className="apartment-selection-grid">
              {LAYOUT_TYPES.map((type) => (
                <button
                  key={type.id}
                  className="apartment-selection-card"
                  onClick={() => handleSelectType(type.id)}
                >
                  <img src={type.images[0]} alt={type.title} className="apartment-selection-image" />
                  <span className="apartment-selection-card-label">{type.title}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Left side - Large image with thumbnails */}
            <div className="apartment-image-section">
              <div className="apartment-main-image-wrapper">
                <img
                  ref={mainImageRef}
                  src={data.images[activeImageIndex]}
                  alt={data.title}
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
            <div className="apartment-info-panel">
              <div className="apartment-info-content">
                <button type="button" className="apartment-back-btn" onClick={handleBackToSelection}>
                  ‹ All Layouts
                </button>

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
                <button className="apartment-cta-btn" onClick={() => setIsLeadModalOpen(true)}>
                  {data.cta}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {isLeadModalOpen && (
        <div onClick={(e) => e.stopPropagation()}>
          <LeadCaptureModal
            isOpen={isLeadModalOpen}
            onClose={() => setIsLeadModalOpen(false)}
            onSubmit={handleLeadSubmit}
            eyebrow={data?.title || 'Manhattan'}
            title="Book a Visit"
            subtitle="Share your email or mobile number and our team will get in touch to schedule your visit."
            submitLabel="Book a Visit"
          />
        </div>
      )}
    </div>
  )
}
