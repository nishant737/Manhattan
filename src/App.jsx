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
import StatsSection from './StatsSection'
import ContactSection from './ContactSection'
import LeadCaptureModal from './LeadCaptureModal'
import Footer from './Footer'
import { submitLead } from './leadSubmit'
import './App.css'

const BROCHURE_FILE = '/Manhattan-Brochure.pdf'

// Nav items that resolve to an in-page scroll (via the existing
// scrollIntoView flow) rather than opening a modal. "3D Walkthrough" and
// "VR Experience" both lead to the AR/VR section, which holds the YouTube
// walkthrough card and the AR/VR experience link.
const SCROLL_TARGETS = {
  amenities: '.amenities-section',
  '3d-walkthrough': '.arvr-section',
  'vr-experience': '.arvr-section',
  // "Contact Us" scrolls to the inline "Get In Touch" section (not a modal).
  contact: '.contact-section'
}

const LEAD_MODAL_COPY = {
  contact: {
    eyebrow: 'Get In Touch',
    title: 'Contact Us',
    subtitle: "Share your details and our team will reach out to help with anything you need.",
    submitLabel: 'Send Message',
    loadingLabel: 'Sending…',
    successTitle: 'Message Sent',
    successMessage: "Thank you. We've received your details and will be in touch shortly."
  },
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

    if (id === 'brochure') {
      setLeadModalMode('brochure')
      return
    }

    const target = SCROLL_TARGETS[id]
    const el = target && document.querySelector(target)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
          Summary ("Manhattan, At a Glance") → Map ("Location") → Contact.
          Every section is an independent sibling with its own ScrollTrigger,
          so the order changes nothing about how each one animates. */}
      <HeroSection />
      <AboutSection />
      <LuxuryShowcase />
      <AmenitiesSection />
      <TailoredSolutions onSelectLayout={openLayoutModal} />
      <PathToOwnership />
      <StatsSection onCtaClick={() => handleNavClick('brochure')} />
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
                  openLayoutModal(null)
                }
              }
            : null
        }
      />
    </>
  )
}

export default App
