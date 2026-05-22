import { useEffect, useRef } from 'react'
import './AboutSection.css'

const TEXT =
  "Manhattan Tower is a landmark collaboration between Allegro and Mohtisham Builders — two names woven from decades of craft, trust, and an unwavering pursuit of the extraordinary. Rising above the Mangaluru skyline, it is not merely a building. It is a statement — of ambition, of artistry, and of what coastal living can truly become."

const WORDS = TEXT.split(' ')

export default function AboutSection() {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const spansRef   = useRef([])

  // Build flat list of character refs across all words
  let charIndex = 0
  const wordData = WORDS.map(word => {
    const chars = word.split('').map(char => ({ char, index: charIndex++ }))
    return chars
  })
  const totalChars = charIndex


  // Scroll: light each character sequentially
  useEffect(() => {
    const section = sectionRef.current
    const spans   = spansRef.current
    if (!section || !spans.length) return

    let rafId = null
    let lastLit = -1

    function update() {
      const rect     = section.getBoundingClientRect()
      const vh       = window.innerHeight
      const isMobile = window.innerWidth <= 768

      // Mobile: spread animation as section travels from bottom to top of viewport
      // Desktop: spread animation across the full sticky scroll distance
      const progress = isMobile
        ? Math.min(1, Math.max(0, (vh - rect.top) / (vh * 0.8)))
        : Math.min(1, Math.max(0, -rect.top / (rect.height - vh)))

      const lit = Math.floor(progress * totalChars)

      if (lit === lastLit) return
      lastLit = lit

      spans.forEach((span, i) => {
        if (!span) return
        span.style.color = i < lit
          ? 'rgba(249, 238, 228, 1)'
          : 'rgba(249, 238, 228, 0.15)'
      })
    }

    function onScroll() {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section className="about-section" ref={sectionRef}>
      <div className="about-sticky">
      <div className="about-inner">
        <p className="about-eyebrow">The Vision Behind Manhattan</p>
        <div className="about-divider" />
        <p className="about-content" ref={contentRef}>
          {wordData.map((chars, wi) => (
            <span key={wi} className="about-word">
              {chars.map(({ char, index }) => (
                <span
                  key={index}
                  ref={el => (spansRef.current[index] = el)}
                  className="about-letter"
                >
                  {char}
                </span>
              ))}
            </span>
          ))}
        </p>
      </div>
      </div>
    </section>
  )
}
