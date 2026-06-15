import { useEffect, useRef, useState } from 'react'
import './StatsSection.css'

export default function StatsSection() {
  const sectionRef = useRef(null)
  const [counts, setCounts] = useState({ c2: 0, c30: 0, c7035: 0, c24: 0 })

  useEffect(() => {
    function onScroll() {
      const section = sectionRef.current
      if (!section) return

      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight

      // progress: 0 when section top hits bottom of viewport, 1 when section bottom hits top
      const progress = Math.min(1, Math.max(0, (-rect.top + vh * 0.6) / (rect.height + vh * 0.4)))

      const eased = Math.min(1, progress * 3.5)

      setCounts({
        c2:     Math.floor(eased * 2),
        c30:    Math.floor(eased * 30),
        c7035:  Math.floor(eased * 7035),
        c24:    Math.floor(eased * 24),
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const { c2, c30, c7035, c24 } = counts

  return (
    <section className="stats-section" ref={sectionRef}>
      <div className="stats-box">

        {/* 2 — upper center */}
        <div className="stat stat--60">
          <div className="stat-number">
            {c2}<span className="stat-suffix-small"></span>
          </div>
          <p className="stat-label">Residences per floor</p>
          <p className="stat-sublabel">Private luxury living.</p>

        </div>

        {/* 30 — upper right */}
        <div className="stat stat--30">
          <div className="stat-number">{c30}</div>
          <p className="stat-label">exclusive residences,</p>
          <p className="stat-sublabel">each tailored for comfort<br />&amp; elegance.</p>
        </div>

        {/* 7,035k — lower left */}
        <div className="stat stat--150">
          <div className="stat-number stat-number--xl">{c7035.toLocaleString()}k</div>
          <span className="stat-sqft">sq. ft.</span>
          <p className="stat-label">Sky Villas</p>
          <p className="stat-sublabel">Largest duplex residences</p>
        </div>

        {/* 24/7 — lower center */}
        <div className="stat stat--247">
          <div className="stat-number stat-number--xl">{c24}/7</div>
          <p className="stat-label">concierge services, meeting</p>
          <p className="stat-sublabel">every need effortlessly.</p>
        </div>

      </div>
    </section>
  )
}
