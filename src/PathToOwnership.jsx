import { useRef, useEffect } from 'react'
import './PathToOwnership.css'

export default function PathToOwnership() {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleEnded = () => {
      video.currentTime = 0
      video.play()
    }

    video.addEventListener('ended', handleEnded)
    return () => video.removeEventListener('ended', handleEnded)
  }, [])

  return (
    <section className="path-to-ownership-section" ref={sectionRef}>
      <div className="path-to-ownership-container">
        <div className="path-to-ownership-content">
          <h2 className="path-to-ownership-title">Your Journey Into AR & VR</h2>

          <div className="path-to-ownership-video-wrapper">
            <video
              ref={videoRef}
              className="path-to-ownership-video"
              autoPlay
              muted
              playsInline
              preload="auto"
              controls={false}
            >
              <source src="/path-to-ownership.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  )
}
