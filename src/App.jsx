import { useState } from 'react'
import Navbar from './Navbar'
import HeroSection from './HeroSection'
import AboutSection from './AboutSection'
import StatsSection from './StatsSection'
import LuxuryShowcase from './LuxuryShowcase'
import ApartmentShowcase from './ApartmentShowcase'
import AmenitiesSection from './AmenitiesSection'
import TailoredSolutions from './TailoredSolutions'
import LocationConnectivity from './LocationConnectivity'
import './App.css'

function App() {
  const [activeShowcase, setActiveShowcase] = useState(null)

  const handleNavClick = (id) => {
    setActiveShowcase(activeShowcase === id ? null : id)
  }

  return (
    <>
      <Navbar onNavClick={handleNavClick} />
      {activeShowcase && <ApartmentShowcase id={activeShowcase} onClose={() => setActiveShowcase(null)} />}
      <HeroSection />
      <AboutSection />
      <StatsSection />
      <LuxuryShowcase />
      <AmenitiesSection />
      <TailoredSolutions />
      <LocationConnectivity />
    </>
  )
}

export default App
