import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import './AmenitiesSection.css'
import ConciergeServicesImg from './assets/ConciergeServices.jpeg'
import ConciergeServicesSmallImg from './assets/ConciergeServicessmall.jpeg'
import PremiumFinishesImg from './assets/PremiumFinishes.jpeg'
import PremiumFinishesSmallImg from './assets/PremiumFinishessmall.jpeg'
import SmartLivingImg from './assets/SmartLiving.jpeg'
import SmartLivingSmallImg from './assets/SmartLivingsmall.jpeg'

gsap.registerPlugin(ScrollTrigger)

const AMENITIES = [
  {
    id: 2,
    index: '01',
    title: 'Premium Finishes',
    description: 'Every surface, fixture, and fitting has been curated with intention — imported stone, bespoke millwork, and materials selected for both beauty and longevity.',
    backgroundImage: PremiumFinishesImg,
    foregroundImage: PremiumFinishesSmallImg
  },
  {
    id: 3,
    index: '02',
    title: 'Smart Living',
    description: 'Integrated home automation, climate control, and high-speed connectivity — engineered to make every moment effortless and every space responsive to you.',
    backgroundImage: SmartLivingImg,
    foregroundImage: SmartLivingSmallImg
  },
  {
    id: 1,
    index: '03',
    title: 'Concierge Services',
    description: 'From restaurant reservations to private event curation, our dedicated concierge team is available around the clock to anticipate your every need.',
    backgroundImage: ConciergeServicesImg,
    foregroundImage: ConciergeServicesSmallImg
  }
]

export default function AmenitiesSection() {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const itemsRef = useRef([])
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

  // Setup GSAP ScrollTrigger animations for image transitions
  useEffect(() => {
    if (!sectionRef.current || imagesRef.current.length === 0) return

    const section = sectionRef.current
    const imageSets = imagesRef.current

    // Create timeline for fast image crossfades
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1, // Immediate scrubbing for snappy response
        markers: false,
        onUpdate: (self) => {
          const newIndex = Math.min(
            AMENITIES.length - 1,
            Math.floor(self.progress * AMENITIES.length)
          )
          setActiveIndex(newIndex)
        }
      }
    })

    // Animate images and text together in perfect sync
    imageSets.forEach((imageSet, index) => {
      const textItem = itemsRef.current[index]

      if (index === 0) {
        // First slide: images and text start visible
        tl.fromTo(
          [imageSet, textItem],
          { opacity: 1 },
          { opacity: 0, duration: 0.6 },
          0
        )
      } else if (index === imageSets.length - 1) {
        // Last slide: images and text fade in
        tl.fromTo(
          [imageSet, textItem],
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          index - 0.4
        )
      } else {
        // Middle slides: fade in then out
        tl.fromTo(
          [imageSet, textItem],
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          index - 0.4
        )
        tl.to(
          [imageSet, textItem],
          { opacity: 0, duration: 0.6 },
          index + 0.4
        )
      }
    })

    return () => {
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
            {AMENITIES.map((amenity, index) => (
              <div
                key={amenity.id}
                ref={(el) => {
                  if (el) itemsRef.current[index] = el
                }}
                className="amenity-item"
                style={{ position: 'absolute', opacity: index === 0 ? 1 : 0 }}
              >
                <span className="amenity-index">{amenity.index}</span>
                <h2 className="amenity-title">{amenity.title}</h2>
                <p className="amenity-body">{amenity.description}</p>
              </div>
            ))}
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
                  <img src={amenity.backgroundImage} alt={`${amenity.title} background`} />
                </div>
                <div className="amenity-image-foreground">
                  <img src={amenity.foregroundImage} alt={`${amenity.title} foreground`} />
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
