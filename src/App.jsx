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
import './App.css'

function App() {
  const [activeShowcase, setActiveShowcase] = useState(null)

  const handleNavClick = (id) => {
    setActiveShowcase(activeShowcase === id ? null : id)
  }

  return (
    <>
      <CustomCursor />
      <WhatsAppButton />
      <Navbar onNavClick={handleNavClick} />
      {activeShowcase && <ApartmentShowcase id={activeShowcase} onClose={() => setActiveShowcase(null)} />}
      <HeroSection />
      <AboutSection />
      <LuxuryShowcase />
      <AmenitiesSection />
      <TailoredSolutions />
      <LocationConnectivity />
      <PathToOwnership />
    </>
  )
}

export default App
