import LowerDuplexLayout from './assets/lower-duplex-layout.jpeg'
import UpperDuplexLayout from './assets/upper-duplex-layout.jpeg'

// Shared across the Layout selection modal (ApartmentShowcase) and the
// "Luxury Residences Designed For You" accordion (TailoredSolutions) so
// both surfaces always offer the exact same apartment types.
export const LAYOUT_TYPES = [
  {
    id: '3bhk',
    brand: 'MANHATTAN',
    title: '3 BHK',
    description: 'Elegant urban residences designed for contemporary living. Featuring premium finishes, open floor plans, and stunning city views.',
    cta: 'BOOK A VISIT',
    images: [
      '/INDOOR GAME.jpg',
      '/SKY LOUNGE CAFE.jpg',
      '/STREET VIEW_ 02.jpg'
    ],
    specs: [
      { label: 'Bedroom', value: '3' },
      { label: 'Size', value: '2,915 sq. ft. (Odd Floor) / 2,970 sq. ft. (Even Floor)' },
      { label: 'Floor Plan', value: 'Open Layout' },
      { label: 'Type', value: 'Standard' }
    ]
  },
  {
    id: '4bhk',
    brand: 'MANHATTAN',
    title: '4 BHK',
    description: 'Serene sanctuaries with premium amenities and exclusive layouts. Perfect for those seeking tranquility and luxury.',
    cta: 'BOOK A VISIT',
    images: [
      '/SKY LOUNGE CAFE.jpg',
      '/STREET VIEW_ 02.jpg',
      '/INDOOR GAME.jpg'
    ],
    specs: [
      { label: 'Bedroom', value: '4' },
      { label: 'Size', value: '3,915 sq. ft. (Even Floor) / 4,015 sq. ft. (Odd Floor)' },
      { label: 'Floor Plan', value: 'Luxury Layout' },
      { label: 'Type', value: 'Standard' }
    ]
  },
  {
    id: '4bhk-duplex-sky',
    brand: 'MANHATTAN',
    title: '4 BHK Duplex Sky Villa',
    description: 'Spacious two-level sky residences with private outdoor spaces. An exceptional living experience with premium amenities.',
    cta: 'BOOK A VISIT',
    images: [
      LowerDuplexLayout,
      '/STREET VIEW_ 02.jpg',
      '/INDOOR GAME.jpg',
      '/SKY LOUNGE CAFE.jpg'
    ],
    specs: [
      { label: 'Bedroom', value: '4' },
      { label: 'Size', value: '5,170 sq. ft.' },
      { label: 'Floor', value: '34th Floor & Above' },
      { label: 'Floor Plan', value: 'Duplex' },
      { label: 'Type', value: 'Elite Sky Residence' }
    ]
  },
  {
    id: '5bhk-duplex-sky',
    brand: 'MANHATTAN',
    title: '5 BHK Duplex Sky Villa',
    description: 'Premium sky penthouses with panoramic views and luxury finishes. The pinnacle of luxury living in Manhattan.',
    cta: 'BOOK A VISIT',
    images: [
      UpperDuplexLayout,
      '/INDOOR GAME.jpg',
      '/STREET VIEW_ 02.jpg',
      '/SKY LOUNGE CAFE.jpg'
    ],
    specs: [
      { label: 'Bedroom', value: '5' },
      { label: 'Size', value: '6,915 sq. ft.' },
      { label: 'Floor', value: '34th Floor & Above' },
      { label: 'Floor Plan', value: 'Penthouse Duplex' },
      { label: 'Type', value: 'Elite Sky Residence' }
    ]
  }
]
