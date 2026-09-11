import { useState } from 'react'
import CustomCursor from './CustomCursor'
import WhatsAppButton from './WhatsAppButton'
import Navbar from './Navbar'
import HeroSection from './HeroSection'
import AboutSection from './AboutSection'
import LuxuryShowcase from './LuxuryShowcase'
import ApartmentShowcase from './ApartmentShowcase'
import AmenitiesSection from './AmenitiesSection'
import TailoredSolutions from './TailoredSolutions'
import LocationConnectivity from './LocationConnectivity'
import PathToOwnership from './PathToOwnership'
import ContactSection from './ContactSection'
import LeadCaptureModal from './LeadCaptureModal'
import Footer from './Footer'
import { submitLead } from './leadSubmit'
import { beginNavScroll } from './navScroll'
import './App.css'

const BROCHURE_FILE = '/Manhattan-Brochure.pdf'

// Nav items that resolve to an in-page scroll (via the existing
// scrollIntoView flow) rather than opening a modal. "3D Walkthrough" and
// "VR Experience" both lead to the AR/VR section, which holds the YouTube
// walkthrough card and the AR/VR experience link.
const SCROLL_TARGETS = {
  // "Amenities" in the nav points at the Luxury Showcase carousel/grid —
  // the actual amenities gallery (Community Hall, Gym, Pool, …) — not the
  // separate "Iconic Architecture / Spacious Living" pinned section.
  amenities: '.luxury-showcase',
  // Target the cards themselves, not the section's top (which includes the
  // eyebrow/title/subtitle intro above them) — that intro plus the cards
  // together are taller than one screen, so landing on the section's top
  // left the cards cut off at the bottom of the viewport.
  '3d-walkthrough': '.arvr-cards',
  'vr-experience': '.arvr-cards',
  // "Contact Us" scrolls to the inline "Get In Touch" section (not a modal).
  contact: '.contact-section'
}

// Only the brochure flow uses the lead modal now — "Contact Us" scrolls to the
// inline ContactSection (see SCROLL_TARGETS), so there's no 'contact' entry.
const LEAD_MODAL_COPY = {
  brochure: {
    eyebrow: 'Manhattan Luxury Residences',
    title: 'Download the Brochure',
    subtitle: 'Enter your email address or mobile number to unlock the brochure. No other details needed.',
    submitLabel: 'Unlock Brochure',
    loadingLabel: 'Preparing your download…',
    successTitle: 'Brochure Unlocked',
    successMessage: 'Your download has started. If it doesn’t begin automatically, check your browser’s downloads.',
    autoCloseMs: 2600
  }
}

function App() {
  const [isLayoutModalOpen, setIsLayoutModalOpen] = useState(false)
  const [layoutModalTypeId, setLayoutModalTypeId] = useState(null)
  const [leadModalMode, setLeadModalMode] = useState(null) // 'brochure' | null
  // Which unit type (if any) the brochure modal was opened from — e.g.
  // clicking "3 BHK" in Our Collections — so "Skip to View Layout" lands on
  // that exact type instead of the generic "choose your layout" grid.
  const [pendingLayoutTypeId, setPendingLayoutTypeId] = useState(null)

  // Opens the shared Layout modal — either to the "choose your layout" grid
  // (typeId omitted, e.g. from the navbar) or straight to one specific
  // apartment type's detail view (e.g. after a visitor picks "3 BHK" and
  // submits their details in the Luxury Residences section below).
  const openLayoutModal = (typeId = null) => {
    setLayoutModalTypeId(typeId)
    setIsLayoutModalOpen(true)
  }

  const openBrochureModal = (typeId = null) => {
    setPendingLayoutTypeId(typeId)
    setLeadModalMode('brochure')
  }

  const handleNavClick = (id) => {
    if (id === 'layout') {
      openLayoutModal(null)
      return
    }

    if (id === 'brochure') {
      openBrochureModal(null)
      return
    }

    const target = SCROLL_TARGETS[id]
    const el = target && document.querySelector(target)
    if (el) {
      // Let scroll-jacking sections (the mobile Amenities card lock) stand down
      // for the duration of this programmatic scroll so it can't trap the nav.
      beginNavScroll()

      // Plain scrollIntoView(block:'start') lands the target's top edge at
      // viewport y=0 — right underneath the fixed navbar, which then paints
      // over (and visually "cuts off the top of") whatever sits there, e.g.
      // a section heading. Offset by the navbar's own current height (plus a
      // little breathing room) instead of a hardcoded pixel value, since it
      // animates between ~82px and ~62px as the page scrolls.
      const scrollToTarget = (behavior) => {
        const navbarHeight = document.querySelector('.navbar')?.getBoundingClientRect().height || 0
        const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight - 16
        window.scrollTo({ top, behavior })
      }

      // A click that lands before the page's fonts/images/video have finished
      // loading computes this offset against layout that's about to shift —
      // sections above the target grow as their content settles in, so the
      // target's real position moves out from under an already-in-flight
      // scroll. Wait for both before the very first scroll, then do one more
      // corrective (instant) scroll shortly after in case anything above the
      // target still reflowed during the animation itself.
      const fontsReady = document.fonts?.ready ?? Promise.resolve()
      const pageLoaded =
        document.readyState === 'complete'
          ? Promise.resolve()
          : new Promise((resolve) => window.addEventListener('load', resolve, { once: true }))

      Promise.all([fontsReady, pageLoaded]).then(() => {
        scrollToTarget('smooth')
        setTimeout(() => scrollToTarget('auto'), 700)
      })
    }
  }

  const triggerBrochureDownload = () => {
    const link = document.createElement('a')
    link.href = BROCHURE_FILE
    link.download = 'Manhattan-Brochure.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Returns a promise so LeadCaptureModal can show its loading state while the
  // submission is in flight and a success/error state once it settles. The
  // brochure download only fires after the "unlock" resolves successfully.
  const handleLeadModalSubmit = async (formData) => {
    // Append a row to the Google Sheet. A network failure rejects here and the
    // modal surfaces its error state; the brochure download only runs on success.
    await submitLead({
      source: leadModalMode === 'brochure' ? 'Brochure download' : 'Layout enquiry',
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.requirement
    })

    if (leadModalMode === 'brochure') {
      triggerBrochureDownload()
    }
    // Modal stays open on its own success screen; for the brochure it
    // auto-closes shortly after (autoCloseMs in LEAD_MODAL_COPY.brochure).
  }

  return (
    <>
      <CustomCursor />
      <WhatsAppButton />
      <Navbar onNavClick={handleNavClick} />
      {isLayoutModalOpen && (
        <ApartmentShowcase
          initialTypeId={layoutModalTypeId}
          onClose={() => setIsLayoutModalOpen(false)}
        />
      )}
      {/* Section order: Hero → Intro → Amenities/Showcase → Layouts → AR/VR →
          Map ("Location") → Contact. Every section is an independent sibling
          with its own ScrollTrigger, so the order changes nothing about how
          each one animates. */}
      <HeroSection />
      <AboutSection />
      <LuxuryShowcase />
      <AmenitiesSection />
      <TailoredSolutions onSelectLayout={openBrochureModal} />
      <PathToOwnership />
      <LocationConnectivity />
      <ContactSection />
      <Footer onNavClick={handleNavClick} />

      <LeadCaptureModal
        isOpen={leadModalMode !== null}
        onClose={() => setLeadModalMode(null)}
        onSubmit={handleLeadModalSubmit}
        {...(leadModalMode ? LEAD_MODAL_COPY[leadModalMode] : {})}
        secondaryAction={
          leadModalMode === 'brochure'
            ? {
                label: 'Skip to View Layout',
                onClick: () => {
                  setLeadModalMode(null)
                  openLayoutModal(pendingLayoutTypeId)
                }
              }
            : null
        }
      />
    </>
  )
}

export default App
