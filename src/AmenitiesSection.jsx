import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import './AmenitiesSection.css'
import ConciergeServicesImg from './assets/ConciergeServices.jpeg'
import PremiumFinishesImg from './assets/PremiumFinishes.jpeg'
import SmartLivingImg from './assets/SmartLiving.jpeg'

gsap.registerPlugin(ScrollTrigger)

const AMENITIES = [
  {
    id: 2,
    index: '01',
    title: 'Premium Finishes',
    description: 'Every surface, fixture, and fitting has been curated with intention — imported stone, bespoke millwork, and materials selected for both beauty and longevity.',
    image: PremiumFinishesImg
  },
  {
    id: 3,
    index: '02',
    title: 'Smart Living',
    description: 'Integrated home automation, climate control, and high-speed connectivity — engineered to make every moment effortless and every space responsive to you.',
    image: SmartLivingImg
  },
  {
    id: 1,
    index: '03',
    title: 'Concierge Services',
    description: 'From restaurant reservations to private event curation, our dedicated concierge team is available around the clock to anticipate your every need.',
    image: ConciergeServicesImg
  }
]

export default function AmenitiesSection() {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const imagesRef = useRef([])
  const [isInView, setIsInView] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  // Detect when section enters viewport for content animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  // Setup GSAP ScrollTrigger animations for smooth image transitions
  useEffect(() => {
    if (!sectionRef.current || imagesRef.current.length === 0) return

    const section = sectionRef.current
    const imageSets = imagesRef.current

    // Create timeline for image crossfades
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6, // Smooth scrubbing with slight lag for visual smoothness
        markers: false,
        onUpdate: (self) => {
          // Update active index based on scroll progress
          const newIndex = Math.min(
            AMENITIES.length - 1,
            Math.floor(self.progress * AMENITIES.length)
          )
          setActiveIndex(newIndex)
        }
      }
    })

    // Animate each image set's opacity based on scroll
    imageSets.forEach((imageSet, index) => {
      if (index === 0) {
        // First image starts visible
        tl.fromTo(
          imageSet,
          { opacity: 1 },
          { opacity: 0, duration: 1 },
          0
        )
      } else if (index === imageSets.length - 1) {
        // Last image fades in at the end
        tl.fromTo(
          imageSet,
          { opacity: 0 },
          { opacity: 1, duration: 1 },
          index - 0.5
        )
      } else {
        // Middle images fade in then fade out
        tl.fromTo(
          imageSet,
          { opacity: 0 },
          { opacity: 1, duration: 1 },
          index - 0.5
        )
        tl.to(
          imageSet,
          { opacity: 0, duration: 1 },
          index + 0.5
        )
      }
    })

    return () => {
      // Cleanup ScrollTrigger
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill()
      }
      tl.kill()
    }
  }, [])

  return (
    <section className="amenities-section" ref={sectionRef}>
      <div className="amenities-sticky-wrapper">
        {/* Left Content Column */}
        <div className="amenities-content-column">
          <div className="amenities-content-inner" ref={contentRef}>
            <div className="amenity-item visible">
              <span className="amenity-index">{AMENITIES[activeIndex].index}</span>
              <h2 className="amenity-title">{AMENITIES[activeIndex].title}</h2>
              <p className="amenity-body">{AMENITIES[activeIndex].description}</p>
            </div>
          </div>
        </div>

        {/* Right Image Column */}
        <div className="amenities-image-column">
          <div className="amenities-images-container">
            {AMENITIES.map((amenity, index) => (
              <div
                key={amenity.id}
                ref={(el) => {
                  if (el) imagesRef.current[index] = el
                }}
                className={`amenity-image-set ${index === 0 ? 'active' : ''}`}
              >
                <div className="amenity-image-background">
                  <img src={amenity.image} alt={`${amenity.title} background`} />
                </div>
                <div className="amenity-image-foreground">
                  <img src={amenity.image} alt={`${amenity.title} foreground`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spacer for scroll range */}
      <div className="amenities-spacer"></div>
    </section>
  )
}
