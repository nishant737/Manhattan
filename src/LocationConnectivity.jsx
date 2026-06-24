import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './LocationConnectivity.css'

gsap.registerPlugin(ScrollTrigger)

// Custom luxury marker icon
const createLuxuryMarker = (isActive) => {
  return L.divIcon({
    className: `custom-marker ${isActive ? 'active' : ''}`,
    html: `
      <div class="marker-pin">
        <div class="marker-dot"></div>
        <div class="marker-pulse"></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  })
}

// Main Manhattan Location
const MANHATTAN_LOCATION = {
  id: 0,
  name: 'Manhattan - Luxury Residences',
  time: 'Your Location',
  category: 'Residential',
  description: 'Premium luxury residential development in Mangalore',
  coordinates: { lat: 12.9352, lng: 74.8597 },
  images: ['/STREET VIEW_ 02.jpg'],
  highlights: ['Luxury Living', 'Prime Location', 'World-class Amenities']
}

const LOCATIONS = [
  {
    id: 1,
    name: 'Central Railway Station',
    time: '03 Minutes',
    category: 'Transportation',
    description: 'Major railway hub connecting to all major cities',
    coordinates: { lat: 12.9320, lng: 74.8555 },
    images: ['/STREET VIEW_ 02.jpg'],
    highlights: ['Express trains', '24/7 Operations', 'Premium Lounge']
  },
  {
    id: 2,
    name: 'Mangalore International Airport',
    time: '30 Minutes',
    category: 'Transportation',
    description: 'International airport with direct flights worldwide',
    coordinates: { lat: 12.7673, lng: 74.9219 },
    images: ['/STREET VIEW_ 02.jpg'],
    highlights: ['International Flights', 'Premium Services', 'Fast-track']
  },
  {
    id: 3,
    name: 'City Centre Mall',
    time: '04 Minutes',
    category: 'Shopping',
    description: 'Premier shopping destination with luxury brands',
    coordinates: { lat: 12.9356, lng: 74.8485 },
    images: ['/INDOOR GAME.jpg'],
    highlights: ['200+ Stores', 'Fine Dining', 'Entertainment']
  },
  {
    id: 4,
    name: 'St. Aloysius College',
    time: '03 Minutes',
    category: 'Education',
    description: 'Premier educational institution with excellent reputation',
    coordinates: { lat: 12.9408, lng: 74.8464 },
    images: ['/SKY LOUNGE CAFE.jpg'],
    highlights: ['Top Rankings', 'Modern Campus', 'World-class Faculty']
  },
  {
    id: 5,
    name: 'Father Muller Hospital',
    time: '08 Minutes',
    category: 'Healthcare',
    description: 'State-of-the-art healthcare facility',
    coordinates: { lat: 12.9348, lng: 74.8510 },
    images: ['/STREET VIEW_ 02.jpg'],
    highlights: ['24/7 Emergency', 'Advanced Equipment', 'Expert Doctors']
  },
  {
    id: 6,
    name: 'Mangala Stadium',
    time: '14 Minutes',
    category: 'Recreation',
    description: 'World-class sports and entertainment venue',
    coordinates: { lat: 12.9280, lng: 74.8590 },
    images: ['/INDOOR GAME.jpg'],
    highlights: ['Stadium Events', 'Concerts', 'Sports']
  },
  {
    id: 7,
    name: 'Milagres Church',
    time: '01 Minutes',
    category: 'Religious',
    description: 'Historic and architecturally stunning church',
    coordinates: { lat: 12.9380, lng: 74.8540 },
    images: ['/SKY LOUNGE CAFE.jpg'],
    highlights: ['Heritage Site', 'Spiritual Center', 'Beautiful Architecture']
  },
  {
    id: 8,
    name: 'Tanur Bavi Beach',
    time: '26 Minutes',
    category: 'Recreation',
    description: 'Pristine coastal destination with scenic beauty',
    coordinates: { lat: 13.0169, lng: 74.5630 },
    images: ['/STREET VIEW_ 02.jpg'],
    highlights: ['Scenic Views', 'Water Sports', 'Restaurants']
  }
]

export default function LocationConnectivity() {
  const [selectedLocation, setSelectedLocation] = useState(null)
  const sectionRef = useRef(null)
  const leftColumnRef = useRef(null)
  const mapRef = useRef(null)
  const cardRef = useRef(null)

  // Entrance animation
  useEffect(() => {
    if (!sectionRef.current) return

    const section = sectionRef.current
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        end: 'center center',
        scrub: 1,
        markers: false
      }
    })

    if (leftColumnRef.current) {
      tl.fromTo(
        leftColumnRef.current,
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, duration: 1, ease: 'power2.out' },
        0
      )
    }

    if (mapRef.current) {
      tl.fromTo(
        mapRef.current,
        { opacity: 0, x: 60 },
        { opacity: 1, x: 0, duration: 1.2, ease: 'power2.out' },
        0.2
      )
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

  const handleLocationClick = (location) => {
    setSelectedLocation(location)
  }

  const mapCenter = [12.9352, 74.8597]

  return (
    <section className="location-connectivity-section" ref={sectionRef}>
      <div className="location-container">
        <div className="location-content-wrapper">
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
                center={mapCenter}
                zoom={11}
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

                {/* Main Manhattan Location - Central Marker */}
                <Marker
                  position={[MANHATTAN_LOCATION.coordinates.lat, MANHATTAN_LOCATION.coordinates.lng]}
                  icon={L.divIcon({
                    className: 'main-location-marker',
                    html: `
                      <div class="main-marker-pin">
                        <div class="main-marker-outer"></div>
                        <div class="main-marker-dot"></div>
                        <div class="main-marker-pulse"></div>
                      </div>
                    `,
                    iconSize: [50, 50],
                    iconAnchor: [25, 50],
                    popupAnchor: [0, -50]
                  })}
                  eventHandlers={{
                    click: () => handleLocationClick(MANHATTAN_LOCATION)
                  }}
                >
                  <Popup className="location-popup">
                    <div className="popup-content">
                      <h4>{MANHATTAN_LOCATION.name}</h4>
                      <p>{MANHATTAN_LOCATION.category}</p>
                    </div>
                  </Popup>
                </Marker>

                {/* Markers for all nearby locations */}
                {LOCATIONS.map((location) => (
                  <Marker
                    key={location.id}
                    position={[location.coordinates.lat, location.coordinates.lng]}
                    icon={createLuxuryMarker(selectedLocation?.id === location.id)}
                    eventHandlers={{
                      click: () => handleLocationClick(location)
                    }}
                  >
                    <Popup className="location-popup">
                      <div className="popup-content">
                        <h4>{location.name}</h4>
                        <p>{location.time}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>

              {/* Inline Card on Map */}
              {selectedLocation && (
                <div className="location-card" ref={cardRef}>
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

                    <button className="card-cta">Get Directions →</button>
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
