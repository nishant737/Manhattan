import { useRef, useEffect } from 'react'
import './HeroSection.css'
import AllegroLogo from './assets/Allegro-Logo-2-cream.png'
import MohtishamLogo from './assets/mohtisham-logo-cream.png'

function HeroSection() {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    setTimeout(() => {
      video.play().catch(() => {})
    }, 400)

    const handleTimeUpdate = () => {
      if (video.currentTime >= 10) {
        video.pause()
        video.currentTime = 10
      }
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => video.removeEventListener('timeupdate', handleTimeUpdate)
  }, [])

  return (
    <section className="hero-section">
      <video
        ref={videoRef}
        className="hero-video"
        autoPlay
        muted
        playsInline
        preload="auto"
      >
        <source src="/heroseection.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay" />

      {/* Center content */}
      <div className="hero-content">
        <p className="hero-subheading">A PROJECT BY ALLEGRO &amp; MOHTISHAM</p>
        <h1 className="hero-heading">MANHATTAN</h1>
        <p className="hero-tagline">Luxury Elevated in the Heart of Mangalore.</p>

        <div className="hero-logos">
          <img src={AllegroLogo} alt="Allegro" className="hero-logo" />
          <span className="hero-logo-divider" />
          <img src={MohtishamLogo} alt="Mohtisham" className="hero-logo" />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
