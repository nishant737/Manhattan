import { LAYOUT_TYPES } from './apartmentLayouts'

// ── Single source of truth for Manhattan's headline figures ──
// The Summary section (and any future "at a glance" surface) reads from here
// instead of repeating number literals inline, so updating a figure — or
// dropping in the copywriter's final phrasing — happens in exactly one place
// and can never drift between components.

// Derived straight from the shared layout catalogue (apartmentLayouts.js), so
// the "how many home types" figure always matches the units actually shown in
// the Layout modal and the Luxury Residences accordion — never a stale literal.
export const HOME_CONFIGURATION_COUNT = LAYOUT_TYPES.length

// Fixed specifics of the development. Real values, kept together rather than
// scattered across components so a data/copy update is a one-file change.
export const PROJECT_FACTS = {
  residencesPerFloor: 2,
  totalResidences: 30,
  largestResidenceSqFt: 7035,
  conciergeHours: 24,
  curatedAmenities: 10,
  landmarksNearby: 8
}

// The Summary section maps over this. `value` stays a number so the section
// can animate a count-up to it; `format` turns that running number into the
// big on-screen figure (kept short so every tile's number is the same visual
// size and stays on one line); `unit` is the optional small text under it.
// All user-facing text lives here for easy replacement.
export const SUMMARY_METRICS = [
  {
    id: 'configurations',
    value: HOME_CONFIGURATION_COUNT,
    format: (n) => String(n),
    unit: null,
    label: 'Home Configurations',
    sublabel: '3 & 4 BHK residences and duplex sky villas.'
  },
  {
    id: 'residences',
    value: PROJECT_FACTS.totalResidences,
    format: (n) => String(n),
    unit: null,
    label: 'Exclusive Residences',
    sublabel: 'Each tailored for comfort and elegance.'
  },
  {
    id: 'skyVilla',
    value: PROJECT_FACTS.largestResidenceSqFt,
    format: (n) => n.toLocaleString(),
    unit: 'sq. ft.',
    label: 'Largest Sky Villa',
    sublabel: 'The largest duplex residences at Manhattan.'
  },
  {
    id: 'concierge',
    value: PROJECT_FACTS.conciergeHours,
    format: (n) => `${n}/7`,
    unit: null,
    label: 'Concierge Services',
    sublabel: 'Meeting every need, effortlessly.'
  }
]
