import { useRef } from 'react'
import { AR_VR } from './siteContact'
import './PathToOwnership.css'

// ── AR / VR Experience section ──
// Two cards: a YouTube walkthrough and the immersive AR/VR experience. Both
// are real hyperlinks (the AR/VR one opens AR_VR.experienceUrl — never a
// settings/placeholder route). All copy is in this object so the copywriter's
// final wording drops in without touching layout or behaviour.
const ARVR_CONTENT = {
  eyebrow: 'Immersive Preview',
  title: 'Experience Manhattan Before It’s Built',
  subtitle:
    'Take a guided video tour, or step inside at true scale with the interactive AR/VR experience.',
  youtube: {
    kicker: 'Video Tour',
    heading: 'YouTube Walkthrough',
    body: 'A narrated fly through of the tower, residences and amenity decks.',
    cta: 'Watch on YouTube'
  },
  arvr: {
    kicker: 'Interactive',
    heading: 'AR / VR Experience',
    body: 'Walk the residences in virtual reality or place a life-size model in your own space.',
    cta: 'Launch Experience'
  }
}

// Pull a thumbnail straight from YouTube when an embed id is supplied.
const youtubeThumb = (id) => (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null)

export default function PathToOwnership() {
  const sectionRef = useRef(null)
  const thumb = youtubeThumb(AR_VR.youtubeEmbedId)

  return (
    <section className="arvr-section" ref={sectionRef} id="ar-vr">
      <div className="arvr-container">
        <div className="arvr-intro">
          <span className="arvr-eyebrow">{ARVR_CONTENT.eyebrow}</span>
          <h2 className="arvr-title">{ARVR_CONTENT.title}</h2>
          <p className="arvr-subtitle">{ARVR_CONTENT.subtitle}</p>
        </div>

        <div className="arvr-cards">
          {/* Card 1 — YouTube walkthrough */}
          <a
            className="arvr-card"
            href={AR_VR.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="arvr-card-media">
              {thumb ? (
                <img src={thumb} alt="" className="arvr-card-thumb" loading="lazy" />
              ) : (
                <span className="arvr-card-media-fallback" aria-hidden="true" />
              )}
              <span className="arvr-play-badge" aria-hidden="true">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </div>
            <div className="arvr-card-body">
              <span className="arvr-card-kicker">{ARVR_CONTENT.youtube.kicker}</span>
              <h3 className="arvr-card-heading">{ARVR_CONTENT.youtube.heading}</h3>
              <p className="arvr-card-text">{ARVR_CONTENT.youtube.body}</p>
              <span className="arvr-card-cta">
                {ARVR_CONTENT.youtube.cta}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 6 15 12 9 18" />
                </svg>
              </span>
            </div>
          </a>

          {/* Card 2 — AR/VR experience (proper external hyperlink) */}
          <a
            className="arvr-card arvr-card--experience"
            href={AR_VR.experienceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="arvr-card-media">
              <span className="arvr-card-media-fallback" aria-hidden="true" />
              <span className="arvr-vr-badge" aria-hidden="true">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 12a10 10 0 0 1 20 0" />
                  <circle cx="8" cy="12" r="3" />
                  <circle cx="16" cy="12" r="3" />
                  <path d="M11 12h2" />
                </svg>
              </span>
            </div>
            <div className="arvr-card-body">
              <span className="arvr-card-kicker">{ARVR_CONTENT.arvr.kicker}</span>
              <h3 className="arvr-card-heading">{ARVR_CONTENT.arvr.heading}</h3>
              <p className="arvr-card-text">{ARVR_CONTENT.arvr.body}</p>
              <span className="arvr-card-cta">
                {ARVR_CONTENT.arvr.cta}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 6 15 12 9 18" />
                </svg>
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}
