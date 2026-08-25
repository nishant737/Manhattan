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
import LeadCaptureModal from './LeadCaptureModal'
import Footer from './Footer'
import './App.css'

const BROCHURE_FILE = '/Manhattan-Brochure.pdf'

// Sections that "Amenities", "3D Walkthrough" and "VR Experience" scroll to —
// none of those three had any real page destination or feature behind them
// before (every nav item, including these, incorrectly opened the apartment
// modal), so each is pointed at the closest matching existing section
// instead of continuing to open an unrelated modal.
const SCROLL_TARGETS = {
  amenities: '.amenities-section',
  '3d-walkthrough': '.luxury-showcase',
  'vr-experience': '.hero-section'
}

const LEAD_MODAL_COPY = {
  contact: {
    eyebrow: 'Get In Touch',
    title: 'Contact Us',
    subtitle: "Share your details and our team will reach out to help with anything you need.",
    submitLabel: 'Send Message'
  },
  brochure: {
    eyebrow: 'Manhattan — Luxury Residences',
    title: 'Download the Brochure',
    subtitle: 'Share your email or mobile number and the brochure will download right away.',
    submitLabel: 'Download Brochure'
  }
}

function App() {
  const [isLayoutModalOpen, setIsLayoutModalOpen] = useState(false)
  const [layoutModalTypeId, setLayoutModalTypeId] = useState(null)
  const [leadModalMode, setLeadModalMode] = useState(null) // 'contact' | 'brochure' | null

  // Opens the shared Layout modal — either to the "choose your layout" grid
  // (typeId omitted, e.g. from the navbar) or straight to one specific
  // apartment type's detail view (e.g. after a visitor picks "3 BHK" and
  // submits their details in the Luxury Residences section below).
  const openLayoutModal = (typeId = null) => {
    setLayoutModalTypeId(typeId)
    setIsLayoutModalOpen(true)
  }

  const handleNavClick = (id) => {
    if (id === 'layout') {
      openLayoutModal(null)
      return
    }

    if (id === 'contact' || id === 'brochure') {
      setLeadModalMode(id)
      return
    }

    const target = SCROLL_TARGETS[id]
    const el = target && document.querySelector(target)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleLeadModalSubmit = (formData) => {
    // TODO: wire this up to the real CRM/lead-capture endpoint once available.
    console.log(`Lead captured (${leadModalMode}):`, formData)

    if (leadModalMode === 'brochure') {
      const link = document.createElement('a')
      link.href = BROCHURE_FILE
      link.download = 'Manhattan-Brochure.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    setLeadModalMode(null)
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
      <HeroSection />
      <AboutSection />
      <LuxuryShowcase />
      <AmenitiesSection />
      <TailoredSolutions onSelectLayout={openLayoutModal} />
      <LocationConnectivity />
      <PathToOwnership />
      <Footer />

      <LeadCaptureModal
        isOpen={leadModalMode !== null}
        onClose={() => setLeadModalMode(null)}
        onSubmit={handleLeadModalSubmit}
        {...(leadModalMode ? LEAD_MODAL_COPY[leadModalMode] : {})}
      />
    </>
  )
}

export default App
