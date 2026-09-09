import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import LeadCaptureModal from './LeadCaptureModal'
import { submitLead } from './leadSubmit'
import { LAYOUT_TYPES, LAYOUT_CATEGORIES } from './apartmentLayouts'
import './ApartmentShowcase.css'

export default function ApartmentShowcase({ onClose, initialTypeId = null }) {
  const [selectedTypeId, setSelectedTypeId] = useState(initialTypeId)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [viewMode, setViewMode] = useState('gallery') // 'gallery' | 'floorplan'
  const [floorParity, setFloorParity] = useState('odd') // 'odd' | 'even' — drives the Size spec
  const [isAnimating, setIsAnimating] = useState(false)
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)
  const containerRef = useRef(null)
  const mainImageRef = useRef(null)

  const data = LAYOUT_TYPES.find((t) => t.id === selectedTypeId) || null
  const gallery = data?.gallery ?? []

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

  // Whenever the view switches (selection grid ↔ a specific layout), snap every
  // scroll container back to the top. On mobile the whole modal scrolls inside
  // the fixed backdrop, so picking a layout while scrolled down would otherwise
  // leave you looking at the middle of the new view with the image/title above.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const el = containerRef.current
      if (!el) return
      el.parentElement?.scrollTo?.({ top: 0 })
      el.scrollTop = 0
      el.querySelectorAll('.apartment-selection-screen, .apartment-info-panel')
        .forEach((n) => { n.scrollTop = 0 })
    })
    return () => cancelAnimationFrame(raf)
  }, [selectedTypeId])

  const handleSelectType = (id) => {
    setSelectedTypeId(id)
    setActiveImageIndex(0)
    setViewMode('gallery')
    setFloorParity('odd')
  }

  const handleBackToSelection = () => {
    setSelectedTypeId(null)
    setActiveImageIndex(0)
    setViewMode('gallery')
  }

  // Shared cross-fade used by the thumbnail strip and the prev/next arrows.
  const swapImage = (nextIndex) => {
    if (nextIndex === activeImageIndex || isAnimating || viewMode !== 'gallery') return
    setIsAnimating(true)

    const timeline = gsap.timeline()
    timeline.to(mainImageRef.current, { opacity: 0, duration: 0.3, ease: 'power2.inOut' }, 0)
    timeline.add(() => setActiveImageIndex(nextIndex), 0.3)
    timeline.to(mainImageRef.current, { opacity: 1, duration: 0.4, ease: 'power2.inOut' }, 0.35)
    timeline.add(() => setIsAnimating(false), '-=0')
  }

  const handleImageClick = (index) => swapImage(index)
  const goToPrevImage = () =>
    swapImage((activeImageIndex - 1 + gallery.length) % gallery.length)
  const goToNextImage = () =>
    swapImage((activeImageIndex + 1) % gallery.length)

  const toggleFloorPlan = () => {
    setViewMode((prev) => (prev === 'floorplan' ? 'gallery' : 'floorplan'))
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

  const handleLeadSubmit = async (formData) => {
    // Append a "Book a Visit" row to the Google Sheet. Throwing here lets the
    // modal show its error state; on success the modal shows its own success
    // screen (closed by the visitor via "Done").
    await submitLead({
      source: data?.title ? `Book a Visit — ${data.title}` : 'Book a Visit',
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.requirement
    })
  }

  const showingFloorPlan = viewMode === 'floorplan' && data?.hasFloorPlan
  const mainImageSrc = showingFloorPlan ? data.floorPlan : gallery[activeImageIndex]
  const hasMultipleImages = gallery.length > 1

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
          /* ── Layout selection screen — types grouped by category ── */
          <div className="apartment-selection-screen">
            <div className="apartment-selection-header">
              <span className="apartment-brand">MANHATTAN</span>
              <h2 className="apartment-selection-title">Choose Your Layout</h2>
              <p className="apartment-selection-subtitle">Select an apartment layout to explore its images and specifications.</p>
            </div>

            {LAYOUT_CATEGORIES.map((group) => (
              <div className="apartment-selection-group" key={group.category}>
                <h3 className="apartment-selection-group-title">{group.category}</h3>
                <div className="apartment-selection-grid">
                  {group.types.map((type) => (
                    <button
                      key={type.id}
                      className={`apartment-selection-card ${type.hasFloorPlan ? 'apartment-selection-card--plan' : ''}`}
                      onClick={() => handleSelectType(type.id)}
                    >
                      <img src={type.images[0]} alt={type.title} className="apartment-selection-image" />
                      <span className="apartment-selection-card-label">
                        <span className="apartment-selection-card-name">{type.title}</span>
                        <span className="apartment-selection-card-open">
                          Open Layout
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="9 6 15 12 9 18"></polyline>
                          </svg>
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Left side - Large image with thumbnails */}
            <div className="apartment-image-section">
              <div className="apartment-main-image-wrapper">
                <img
                  ref={mainImageRef}
                  src={mainImageSrc}
                  alt={showingFloorPlan ? `${data.title} floor plan` : data.title}
                  className={`apartment-main-image ${showingFloorPlan ? 'is-floorplan' : ''}`}
                />

                {/* Manual prev/next arrows — only for the photo gallery */}
                {!showingFloorPlan && hasMultipleImages && (
                  <>
                    <button
                      type="button"
                      className="apartment-image-nav apartment-image-nav--prev"
                      onClick={goToPrevImage}
                      aria-label="Previous image"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="apartment-image-nav apartment-image-nav--next"
                      onClick={goToNextImage}
                      aria-label="Next image"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                  </>
                )}

                {/* Floor-plan toggle — only when a separate layout drawing exists */}
                {data.hasFloorPlan && (
                  <button
                    type="button"
                    className={`apartment-floorplan-toggle ${showingFloorPlan ? 'is-active' : ''}`}
                    onClick={toggleFloorPlan}
                  >
                    {showingFloorPlan ? 'View Photos' : 'View Floor Plan'}
                  </button>
                )}
              </div>

              {/* Thumbnail strip — photos only */}
              {!showingFloorPlan && (
                <div className="apartment-thumbnails">
                  {gallery.map((image, index) => (
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
              )}
            </div>

            {/* Right side - Info panel */}
            <div className="apartment-info-panel">
              <div className="apartment-info-content">
                <button type="button" className="apartment-back-btn" onClick={handleBackToSelection}>
                  ‹ All Layouts
                </button>

                {/* Brand */}
                <div className="apartment-brand">{data.brand}</div>

                {/* Category + Divider */}
                <div className="apartment-category">{data.category}</div>
                <div className="apartment-divider"></div>

                {/* Title */}
                <h2 className="apartment-title">{data.title}</h2>

                {/* Description */}
                <p className="apartment-description">{data.description}</p>

                {/* Specs */}
                <div className="apartment-specs">
                  {data.specs.map((spec, index) => {
                    const isSize = spec.label.trim().toLowerCase() === 'size'

                    // When this layout has floor-parity-dependent sizes, the
                    // Size row shows Odd/Even toggle buttons and the size for
                    // the selected floor instead of one combined string.
                    if (isSize && data.floorSizes) {
                      return (
                        <div key={index} className="apartment-spec">
                          <div className="spec-label">{spec.label}</div>
                          <div className="spec-value">{data.floorSizes[floorParity]}</div>
                          <div className="apartment-floor-toggle" role="group" aria-label="Floor type">
                            {['odd', 'even'].map((parity) => (
                              <button
                                key={parity}
                                type="button"
                                className={`apartment-floor-toggle-btn ${floorParity === parity ? 'is-active' : ''}`}
                                aria-pressed={floorParity === parity}
                                onClick={() => setFloorParity(parity)}
                              >
                                {parity === 'odd' ? 'Odd Floor' : 'Even Floor'}
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                    }

                    return (
                      <div key={index} className="apartment-spec">
                        <div className="spec-label">{spec.label}</div>
                        <div className="spec-value">{spec.value}</div>
                      </div>
                    )
                  })}
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
