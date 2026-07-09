import { useEffect, useRef, useState } from 'react'
import './CustomCursor.css'

// Elements that trigger the magnetic grow-on-hover effect. Scoped to the
// navbar and the hamburger/full-screen menu overlay per spec, rather than
// every link/button on the site.
const HOVER_TARGET_SELECTOR = [
  '.navbar-links a',
  '.navbar-logo',
  '.hamburger',
  '.mobile-menu-primary a',
  '.mobile-menu-close',
  '.mobile-menu-logo'
].join(', ')

const LERP_FACTOR = 0.18

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const [enabled, setEnabled] = useState(false)

  // Fine-pointer, hover-capable devices only — real mice/trackpads, not
  // touch. Re-checked on change in case of a hybrid device (e.g. a laptop
  // that's also touch-enabled) switching input mode.
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    setEnabled(mq.matches)
    const handleChange = (e) => setEnabled(e.matches)
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [])

  // Hide the native cursor everywhere (including over elements with their
  // own explicit `cursor: pointer`) only while the custom cursor is active.
  useEffect(() => {
    document.body.classList.toggle('custom-cursor-active', enabled)
    return () => document.body.classList.remove('custom-cursor-active')
  }, [enabled])

  // Position: mousemove only ever updates a target ref (no React state, no
  // per-move DOM writes); a single rAF loop lerps the rendered position
  // toward that target each frame, which is what produces the smooth
  // trailing motion instead of a 1:1 snap, and keeps this off the React
  // render path entirely for performance.
  useEffect(() => {
    if (!enabled || !cursorRef.current) return

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const current = { ...target }
    let rafId

    const handleMouseMove = (e) => {
      target.x = e.clientX
      target.y = e.clientY
    }

    const tick = () => {
      current.x += (target.x - current.x) * LERP_FACTOR
      current.y += (target.y - current.y) * LERP_FACTOR
      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`
      }
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', handleMouseMove)
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [enabled])

  // Hover growth: delegated on document rather than attached per-link, so
  // it works for the hamburger menu's links without caring whether they're
  // currently mounted/visible or when the menu opens.
  useEffect(() => {
    if (!enabled) return

    const handleOver = (e) => {
      if (e.target.closest(HOVER_TARGET_SELECTOR)) {
        cursorRef.current?.classList.add('cursor-hover')
      }
    }
    const handleOut = (e) => {
      if (e.target.closest(HOVER_TARGET_SELECTOR)) {
        cursorRef.current?.classList.remove('cursor-hover')
      }
    }

    document.addEventListener('mouseover', handleOver)
    document.addEventListener('mouseout', handleOut)
    return () => {
      document.removeEventListener('mouseover', handleOver)
      document.removeEventListener('mouseout', handleOut)
    }
  }, [enabled])

  if (!enabled) return null

  return <div className="custom-cursor" ref={cursorRef} aria-hidden="true" />
}
