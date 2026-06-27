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

  // Entrance animations when section comes into view
  useEffect(() => {
    if (!sectionRef.current || imagesRef.current.length === 0) return

    const section = sectionRef.current
    const firstImageSet = imagesRef.current[0]

    if (!firstImageSet) return

    const backgroundImg = firstImageSet.querySelector('.amenity-image-background')
    const foregroundImg = firstImageSet.querySelector('.amenity-image-foreground')

    if (backgroundImg && foregroundImg) {
      // Animate large image from right to left
      gsap.fromTo(
        backgroundImg,
        {
          opacity: 0,
          x: 280
        },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none none'
          }
        }
      )

      // Animate small image from bottom to top
      gsap.fromTo(
        foregroundImg,
        {
          opacity: 0,
          y: 200
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none none'
          }
        }
      )
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === section) {
          trigger.kill()
        }
      })
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
        scrub: 1,
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

    // Animate images and text with consistent, evenly-spaced transitions
    const numSlides = imageSets.length
    const segmentDuration = 1 / numSlides // Equal time per slide
    const fadeDuration = segmentDuration * 0.25 // Fade duration relative to segment

    imageSets.forEach((imageSet, index) => {
      const textItem = itemsRef.current[index]
      const segmentStart = index * segmentDuration
      const segmentEnd = (index + 1) * segmentDuration
      const fadeInStart = segmentStart
      const fadeOutStart = segmentEnd - fadeDuration

      if (index === 0) {
        // First slide: start visible, fade out at end of segment
        tl.fromTo(
          [imageSet, textItem],
          { opacity: 1 },
          { opacity: 0, duration: fadeDuration },
          fadeOutStart
        )
      } else if (index === numSlides - 1) {
        // Last slide: fade in at start of segment, stay visible
        tl.fromTo(
          [imageSet, textItem],
          { opacity: 0 },
          { opacity: 1, duration: fadeDuration },
          fadeInStart
        )
      } else {
        // Middle slides: fade in, stay visible, fade out
        tl.fromTo(
          [imageSet, textItem],
          { opacity: 0 },
          { opacity: 1, duration: fadeDuration },
          fadeInStart
        )
        tl.to(
          [imageSet, textItem],
          { opacity: 0, duration: fadeDuration },
          fadeOutStart
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
