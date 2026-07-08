import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './LocationConnectivity.css'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

// Custom luxury marker icon for nearby locations
const createLuxuryMarker = (isActive) => {
  return L.divIcon({
    className: `custom-marker ${isActive ? 'active' : ''}`,
    html: `
      <div class="marker-pin">
        <div class="marker-dot"></div>
        <div class="marker-pulse"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  })
}

// Custom Manhattan checkpoint marker (same style as other locations but slightly larger)
const createManhattanMarker = (isActive) => {
  return L.divIcon({
    className: `custom-marker manhattan-checkpoint ${isActive ? 'active' : ''}`,
    html: `
      <div class="marker-pin">
        <div class="marker-dot"></div>
        <div class="marker-pulse"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  })
}

// Main Manhattan Location
const MANHATTAN_LOCATION = {
  id: 0,
  name: 'Manhattan - Luxury Residences',
  time: 'Your Location',
  category: 'Residential',
  description: 'Premium luxury residential development in Mangalore',
  coordinates: { lat: 12.8700, lng: 74.8450 },
  images: ['/STREET VIEW_ 02.jpg'],
  highlights: ['Luxury Living', 'Prime Location', 'World-class Amenities']
}

const LOCATIONS = [
  {
    id: 2,
    name: 'Mangalore International Airport',
    time: '30 Minutes',
    category: 'Transportation',
    description: 'International airport with direct flights worldwide',
    coordinates: { lat: 12.953666, lng: 74.885411 },
    images: ['/location/MangaloreInternationalAirport.jpeg'],
    highlights: ['International Flights', 'Premium Services', 'Fast-track'],
    // ~4x farther from Manhattan than any other point on this list. Including
    // it in the default fitted view forces the whole map to zoom out so far
    // that the immediate neighborhood (and its markers) becomes illegible.
    // Its marker still renders and its list entry still works — it's just
    // excluded from the bounds the map fits to by default.
    includeInMapBounds: false
  },
  {
    id: 3,
    name: 'City Centre Mall',
    time: '04 Minutes',
    category: 'Shopping',
    description: 'Premier shopping destination with luxury brands',
    coordinates: { lat: 12.871256, lng: 74.842768 },
    images: ['/location/CityCentreMall.jpg'],
    highlights: ['200+ Stores', 'Fine Dining', 'Entertainment']
  },
  {
    id: 4,
    name: 'St. Aloysius College',
    time: '03 Minutes',
    category: 'Education',
    description: 'Premier educational institution with excellent reputation',
    coordinates: { lat: 12.873119, lng: 74.845923 },
    images: ['/location/St.AloysiusCollege.png'],
    highlights: ['Top Rankings', 'Modern Campus', 'World-class Faculty']
  },
  {
    id: 5,
    name: 'Father Muller Hospital',
    time: '08 Minutes',
    category: 'Healthcare',
    description: 'State-of-the-art healthcare facility',
    coordinates: { lat: 12.866668, lng: 74.858700 },
    images: ['/location/FatherMullerHospital.jpeg'],
    highlights: ['24/7 Emergency', 'Advanced Equipment', 'Expert Doctors']
  },
  {
    id: 6,
    name: 'Mangala Stadium',
    time: '14 Minutes',
    category: 'Recreation',
    description: 'World-class sports and entertainment venue',
    coordinates: { lat: 12.886125, lng: 74.835349 },
    images: ['/location/MangalaStadium.avif'],
    highlights: ['Stadium Events', 'Concerts', 'Sports']
  },
  {
    id: 7,
    name: 'Milagres Church',
    time: '01 Minutes',
    category: 'Religious',
    description: 'Historic and architecturally stunning church',
    coordinates: { lat: 12.867448, lng: 74.844455 },
    images: ['/location/MilagresChurch.jpeg'],
    highlights: ['Heritage Site', 'Spiritual Center', 'Beautiful Architecture']
  },
  {
    id: 8,
    name: 'Tannirbhavi Beach',
    time: '26 Minutes',
    category: 'Recreation',
    description: 'Pristine coastal destination with scenic beauty',
    coordinates: { lat: 12.891302, lng: 74.813874 },
    images: ['/location/TannirbhaviBeach.jpeg'],
    highlights: ['Scenic Views', 'Water Sports', 'Restaurants']
  }
]

// Computed once at module scope and passed straight to MapContainer's
// `bounds` prop so the map fits from its very first frame — fitting bounds
// via a post-mount effect instead causes a visible flash of the wrong
// default zoom/center before it snaps to the correct view. Locations flagged
// `includeInMapBounds: false` (currently just the airport) are left out of
// this calculation so the default view stays tightly zoomed on the walkable
// neighborhood instead of zooming out to fit a single distant outlier.
const MAP_BOUNDS = L.latLngBounds([
  [MANHATTAN_LOCATION.coordinates.lat, MANHATTAN_LOCATION.coordinates.lng],
  ...LOCATIONS
    .filter((loc) => loc.includeInMapBounds !== false)
    .map((loc) => [loc.coordinates.lat, loc.coordinates.lng])
])

export default function LocationConnectivity() {
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 })
  const sectionRef = useRef(null)
  const contentWrapperRef = useRef(null)
  const leftColumnRef = useRef(null)
  const mapRef = useRef(null)
  const cardRef = useRef(null)
  const mapInstanceRef = useRef(null)

  // Entrance animation: the section can only ever start entering the
  // viewport once TailoredSolutions' pin has released (they are adjacent
  // siblings, so this is structurally guaranteed, not just timed). Starting
  // the reveal at "top bottom" — the exact instant it first appears — and
  // driving it off the whole content wrapper produces a single, cohesive
  // rise-and-settle motion instead of a delayed pop-in.
  useEffect(() => {
    if (!sectionRef.current || !contentWrapperRef.current) return

    const section = sectionRef.current

    gsap.set(contentWrapperRef.current, { opacity: 0, y: 90 })
    if (leftColumnRef.current) gsap.set(leftColumnRef.current, { x: -30 })
    if (mapRef.current) gsap.set(mapRef.current, { x: 30 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'top 40%',
        scrub: 1.2,
        markers: false
      }
    })

    tl.to(
      contentWrapperRef.current,
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
      0
    )

    if (leftColumnRef.current) {
      tl.to(leftColumnRef.current, { x: 0, duration: 1, ease: 'power2.out' }, 0)
    }

    if (mapRef.current) {
      tl.to(mapRef.current, { x: 0, duration: 1, ease: 'power2.out' }, 0.08)
    }

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill()
      tl.kill()
    }
  }, [])

  // Card pop animation
  useEffect(() => {
    if (!cardRef.current) return

    if (selectedLocation) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.2)' }
      )
    }
  }, [selectedLocation])

  // Close the card on any click outside it. Marker and list-item clicks are
  // excluded so opening a (new) card in the same click doesn't immediately
  // close it — those are handled by handleLocationClick itself instead.
  useEffect(() => {
    if (!selectedLocation) return

    const handleOutsideClick = (event) => {
      const clickedInsideCard = cardRef.current && cardRef.current.contains(event.target)
      const clickedTrigger = event.target.closest('.custom-marker') || event.target.closest('.location-list-item')

      if (!clickedInsideCard && !clickedTrigger) {
        setSelectedLocation(null)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [selectedLocation])

  const handleLocationClick = (location, event) => {
    setSelectedLocation(location)

    // Calculate card position relative to marker on map
    if (mapInstanceRef.current && event) {
      const map = mapInstanceRef.current
      const markerLatLng = L.latLng(location.coordinates.lat, location.coordinates.lng)

      // Locations excluded from the default fitted bounds (currently just
      // the airport) can sit outside the current view — pan it into view
      // first (instantly) so the card doesn't get positioned off-screen.
      if (!map.getBounds().contains(markerLatLng)) {
        map.panTo(markerLatLng, { animate: false })
      }

      const mapContainer = map.getContainer()
      const mapRect = mapContainer.getBoundingClientRect()
      const mapWidth = mapRect.width
      const mapHeight = mapRect.height

      // Get marker position in pixels
      const markerPoint = map.latLngToContainerPoint(markerLatLng)

      // Card dimensions (kept in sync with the reduced .location-card CSS size)
      const cardWidth = 240
      const cardHeight = 220

      // Calculate initial card position (centered above marker)
      let cardX = markerPoint.x - cardWidth / 2
      let cardY = markerPoint.y - cardHeight - 20

      // Check boundaries and adjust
      if (cardX < 10) cardX = 10 // Left boundary
      if (cardX + cardWidth > mapWidth - 10) cardX = mapWidth - cardWidth - 10 // Right boundary
      if (cardY < 10) cardY = markerPoint.y + 40 // If too high, position below marker instead

      setCardPosition({ x: cardX, y: cardY })
    }
  }

  return (
    <section className="location-connectivity-section" ref={sectionRef}>
      <div className="location-container">
        <div className="location-content-wrapper" ref={contentWrapperRef}>
          {/* Left Column: Text List */}
          <div className="location-left-column" ref={leftColumnRef}>
            <div className="location-title">
              <span className="title-line">Peacefully Secluded &</span>
              <span className="title-line">Ideally Connected</span>
            </div>

            <div className="location-list">
              {LOCATIONS.map((location) => (
                <button
                  key={location.id}
                  className={`location-list-item ${selectedLocation?.id === location.id ? 'active' : ''}`}
                  onClick={() => handleLocationClick(location)}
                >
                  <span className="time">{location.time}</span>
                  <span className="name">To {location.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Map */}
          <div className="location-right-column" ref={mapRef}>
            <div className="location-map-wrapper">
              <MapContainer
                ref={mapInstanceRef}
                bounds={MAP_BOUNDS}
                boundsOptions={{ padding: [24, 24], maxZoom: 16 }}
                scrollWheelZoom={false}
                className="leaflet-map-container"
              >
                <TileLayer
                  attribution={false}
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
                  maxZoom={19}
                  minZoom={1}
                  crossOrigin="anonymous"
                />

                {/* Main Manhattan Location Marker (checkpoint) */}
                <Marker
                  position={[MANHATTAN_LOCATION.coordinates.lat, MANHATTAN_LOCATION.coordinates.lng]}
                  icon={createManhattanMarker(selectedLocation?.id === MANHATTAN_LOCATION.id)}
                  eventHandlers={{
                    click: (e) => handleLocationClick(MANHATTAN_LOCATION, e)
                  }}
                />

                {/* Markers for all nearby locations */}
                {LOCATIONS.map((location) => (
                  <Marker
                    key={location.id}
                    position={[location.coordinates.lat, location.coordinates.lng]}
                    icon={createLuxuryMarker(selectedLocation?.id === location.id)}
                    eventHandlers={{
                      click: (e) => handleLocationClick(location, e)
                    }}
                  />
                ))}
              </MapContainer>

              {/* Inline Card on Map */}
              {selectedLocation && (
                <div
                  className="location-card"
                  ref={cardRef}
                  style={{
                    left: `${cardPosition.x}px`,
                    top: `${cardPosition.y}px`
                  }}
                >
                  <button className="card-close" onClick={() => setSelectedLocation(null)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>

                  <div className="card-image">
                    <img src={selectedLocation.images[0]} alt={selectedLocation.name} />
                  </div>

                  <div className="card-content">
                    <h3 className="card-title">{selectedLocation.name}</h3>

                    <div className="card-meta">
                      <span className="card-time">{selectedLocation.time}</span>
                      <span className="card-category">{selectedLocation.category}</span>
                    </div>

                    <p className="card-description">{selectedLocation.description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
