// ── Single source of truth for the project's external contact points ──
// Everything the client/copywriter still has to supply lives here, so those
// values drop in once without hunting through components. Replace the
// PLACEHOLDER values below with the real details.

// WhatsApp — digits only, including country code, NO leading "+", "00",
// spaces or dashes. e.g. +91 98765 43210 → '919876543210'.
export const WHATSAPP_NUMBER = '919880022211'

// Pre-fills the chat's first message; the visitor can still edit it. '' opens
// the chat blank.
export const WHATSAPP_DEFAULT_MESSAGE =
  "Hi, I'm interested in Manhattan Luxury Residences in Mangalore."

export const WHATSAPP_HREF =
  `https://wa.me/${WHATSAPP_NUMBER}` +
  (WHATSAPP_DEFAULT_MESSAGE ? `?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE)}` : '')

// Social links shown in the Contact section's "Connect With Us" row. Swap the
// Instagram / Facebook URLs for the real handles.
export const SOCIAL_LINKS = {
  whatsapp: WHATSAPP_HREF,
  instagram: 'https://www.instagram.com/', // PLACEHOLDER — real handle
  facebook: 'https://www.facebook.com/' // PLACEHOLDER — real page
}

// Shown in the Contact section. `emails` / `phones` each hold one or more
// entries; `address` is an array of lines so the office address renders with
// its own breaks.
export const CONTACT_DETAILS = {
  emails: ['sales@mohtisham.com', 'info@mohtisham.com'],
  phones: ['+91 98800 22211', '+91 98801 317913', '+91 99022 44411'],
  address: [
    'Mohtisham Complexes Pvt. Ltd.',
    '7th Floor, Empire Mall, MG Road',
    'Mangaluru 575003'
  ]
}

// Google Maps destination for the development itself. Built from the exact
// coordinates so the link drops a pin on Manhattan, never the Maps homepage
// or a generic search. Works on desktop (maps.google.com) and mobile (deep-
// links into the Google Maps app when installed). TODO: swap `query` for the
// official Google Maps place URL / Plus Code once it's provided.
export const MANHATTAN_GEO = { lat: 12.87, lng: 74.845 }
export const MANHATTAN_MAPS_LABEL = 'Manhattan Luxury Residences, Mangalore'
export const GOOGLE_MAPS_URL =
  `https://www.google.com/maps/search/?api=1&query=${MANHATTAN_GEO.lat},${MANHATTAN_GEO.lng}`

// AR / VR section. `youtubeUrl` is the walkthrough video (watch page);
// `youtubeEmbedId` is optional — set it to the 11-char video id to render an
// inline player instead of a click-through thumbnail. `experienceUrl` is the
// real AR/VR destination the second card links to.
export const AR_VR = {
  youtubeUrl: 'https://www.youtube.com/', // PLACEHOLDER
  youtubeEmbedId: '', // PLACEHOLDER (optional) e.g. 'dQw4w9WgXcQ'
  experienceUrl: 'https://example.com/manhattan-ar-vr' // PLACEHOLDER
}
