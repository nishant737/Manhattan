import { useEffect, useRef, useState } from 'react'
import { SUMMARY_METRICS } from './projectData'
import './StatsSection.css'

// ── Summary ("Manhattan, At a Glance") ──
// A concise, scannable recap of the project's key figures. Every number and
// every line of copy comes from projectData.js (SUMMARY_METRICS) — nothing is
// hardcoded here — so the count of home types stays tied to the real layout
// catalogue and the rest can be updated in one place. Headings/labels are
// data too, ready for the copywriter's final wording without touching layout.
const SUMMARY_COPY = {
  heading: 'Manhattan, At a Glance',
  ctaLabel: 'Download Brochure'
}

export default function StatsSection({ onCtaClick }) {
  const sectionRef = useRef(null)
  const [progress, setProgress] = useState(0)

  // Drive a scroll-linked 0 → 1 progress value; each metric's displayed number
  // is that progress eased and scaled to its own target, so they all count up
  // together as the section arrives, whatever the individual target sizes are.
  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current
      if (!section) return

      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      const raw = (-rect.top + vh * 0.6) / (rect.height + vh * 0.4)
      setProgress(Math.min(1, Math.max(0, raw)))
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const eased = Math.min(1, progress * 3.5)

  return (
    <section className="stats-section" ref={sectionRef} id="summary">
      <div className="stats-heading">
        <h2>{SUMMARY_COPY.heading}</h2>
      </div>

      <div className="stats-grid">
        {SUMMARY_METRICS.map((metric) => {
          const current = Math.round(eased * metric.value)
          return (
            <div className="stat" key={metric.id}>
              <div className="stat-figure">
                <span className="stat-number">{metric.format(current)}</span>
                {metric.unit && <span className="stat-unit">{metric.unit}</span>}
              </div>
              <p className="stat-label">{metric.label}</p>
              <p className="stat-sublabel">{metric.sublabel}</p>
            </div>
          )
        })}
      </div>

      {onCtaClick && (
        <div className="stats-cta-wrapper">
          <button type="button" className="stats-cta-btn" onClick={onCtaClick}>
            {SUMMARY_COPY.ctaLabel}
          </button>
        </div>
      )}
    </section>
  )
}
