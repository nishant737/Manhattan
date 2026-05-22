import { useRef, useEffect } from 'react'
import './HeroSection.css'

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
        <p className="hero-tagline">Luxury Redefined. Coastal Living Elevated.</p>
      </div>
    </section>
  )
}

export default HeroSection
