// ── Room / floor-plan data structure ──
// Shared across the Layout selection modal (ApartmentShowcase) and the
// "Luxury Residences Designed For You" accordion (TailoredSolutions) so both
// surfaces always offer the exact same unit types.
//
// Each type separates two kinds of imagery:
//   • floorPlan — the architectural layout drawing (or null if none yet).
//     REPLACE the placeholders below with the final plan images when provided;
//     3 BHK / 4 BHK currently have no plan asset, so they're left as null and
//     the UI simply hides the "View Floor Plan" control for them.
//   • gallery   — normal property/lifestyle photos, navigable with arrows.
//
// `images` (floorPlan first, then gallery) is kept as a flat list so existing
// consumers that only need "some representative image" keep working.
const withImages = (type) => ({
  ...type,
  hasFloorPlan: Boolean(type.floorPlan),
  images: [type.floorPlan, ...type.gallery].filter(Boolean),
  // Thumbnail used by the "Designed For You" accordion. Prefer an explicit
  // `cardImage`, else the first photo — never the floor-plan drawing, which
  // reads as a schematic in a small circle (was the case for the Sky Villas).
  cardImage: type.cardImage || type.gallery[0] || type.floorPlan
})

export const LAYOUT_TYPES = [
  {
    id: '3bhk',
    brand: 'MANHATTAN',
    category: 'Residences',
    title: '3 BHK',
    description:
      'Elegant urban residences designed for contemporary living. Featuring premium finishes, open floor plans, and stunning city views.',
    cta: 'BOOK A VISIT',
    floorPlan: '/3bhk/floor-plan.png',
    gallery: [
      '/3bhk/gallery-03.jpg',
      '/3bhk/gallery-04.jpg',
      '/3bhk/gallery-05.jpg',
      '/3bhk/gallery-06.jpg',
      '/3bhk/gallery-07.jpg',
      '/3bhk/gallery-08.jpg',
      '/3bhk/gallery-09.jpg',
      '/3bhk/gallery-10.jpg'
    ],
    // Carpet area differs by floor parity — the Size spec renders Odd/Even
    // toggle buttons in the modal when this is present.
    floorSizes: { odd: '2,915 sq. ft.', even: '2,970 sq. ft.' },
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
    category: 'Residences',
    title: '4 BHK',
    description:
      'Serene sanctuaries with premium amenities and exclusive layouts. Perfect for those seeking tranquility and luxury.',
    cta: 'BOOK A VISIT',
    floorPlan: '/4bhk/floor-plan.png',
    gallery: [
      '/4bhk/gallery-03.jpg',
      '/4bhk/gallery-04.jpg',
      '/4bhk/gallery-05.jpg',
      '/4bhk/gallery-06.jpg',
      '/4bhk/gallery-07.jpg',
      '/4bhk/gallery-08.jpg',
      '/4bhk/gallery-09.jpg',
      '/4bhk/gallery-10.jpg'
    ],
    floorSizes: { odd: '4,015 sq. ft.', even: '3,915 sq. ft.' },
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
    category: 'Sky Villas',
    title: '4 BHK Duplex Sky Villa',
    description:
      'Spacious two-level sky residences with private outdoor spaces. An exceptional living experience with premium amenities.',
    cta: 'BOOK A VISIT',
    floorPlan: '/4bhk-duplex-sky/floor-plan.png',
    gallery: [
      '/4bhk-duplex-sky/gallery-03.jpg',
      '/4bhk-duplex-sky/gallery-04.jpg',
      '/4bhk-duplex-sky/gallery-05.jpg',
      '/4bhk-duplex-sky/gallery-06.jpg',
      '/4bhk-duplex-sky/gallery-07.jpg',
      '/4bhk-duplex-sky/gallery-08.jpg',
      '/4bhk-duplex-sky/gallery-09.jpg',
      '/4bhk-duplex-sky/gallery-10.jpg',
      '/4bhk-duplex-sky/gallery-11.jpg',
      '/4bhk-duplex-sky/gallery-12.jpg'
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
    category: 'Sky Villas',
    title: '5 BHK Duplex Sky Villa',
    description:
      'Premium sky penthouses with panoramic views and luxury finishes. The pinnacle of luxury living in Manhattan.',
    cta: 'BOOK A VISIT',
    floorPlan: '/5bhk-duplex-sky/floor-plan.png',
    gallery: [
      '/5bhk-duplex-sky/gallery-03.jpg',
      '/5bhk-duplex-sky/gallery-04.jpg',
      '/5bhk-duplex-sky/gallery-05.jpg',
      '/5bhk-duplex-sky/gallery-06.jpg',
      '/5bhk-duplex-sky/gallery-07.jpg',
      '/5bhk-duplex-sky/gallery-08.jpg',
      '/5bhk-duplex-sky/gallery-09.jpg',
      '/5bhk-duplex-sky/gallery-10.jpg',
      '/5bhk-duplex-sky/gallery-11.jpg',
      '/5bhk-duplex-sky/gallery-12.jpg'
    ],
    specs: [
      { label: 'Bedroom', value: '5' },
      { label: 'Size', value: '6,915 sq. ft.' },
      { label: 'Floor', value: '34th Floor & Above' },
      { label: 'Floor Plan', value: 'Penthouse Duplex' },
      { label: 'Type', value: 'Elite Sky Residence' }
    ]
  }
].map(withImages)

// Unit types grouped by category, in display order — used by both surfaces to
// render the types under clear headings ("Residences", "Sky Villas") instead
// of one flat list.
export const LAYOUT_CATEGORIES = LAYOUT_TYPES.reduce((acc, type) => {
  const bucket = acc.find((c) => c.category === type.category)
  if (bucket) bucket.types.push(type)
  else acc.push({ category: type.category, types: [type] })
  return acc
}, [])
