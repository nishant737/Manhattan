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
  instagram: 'https://www.instagram.com/mohtisham_complexes/',
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

// Google Maps destination for the development itself — the exact coordinates
// and place URL for "Mohtisham Manhattan" as listed on Google Maps. Works on
// desktop (maps.google.com) and mobile (deep-links into the Google Maps app
// when installed).
export const MANHATTAN_GEO = { lat: 12.8688368, lng: 74.8446712 }
export const MANHATTAN_MAPS_LABEL = 'Manhattan Luxury Residences, Mangalore'
export const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/place/Mohtisham+Manhattan/@12.8688052,74.8397598,1938m/data=!3m1!1e3!4m6!3m5!1s0x3ba35b001586083b:0x4fe37e854e6a30a6!8m2!3d12.8688368!4d74.8446712!16s%2Fg%2F11x8c348r_'

// Google Maps destination for the corporate OFFICE address above (CONTACT_DETAILS.address)
// — a different place than Manhattan itself, so it gets its own place URL.
export const OFFICE_MAPS_URL =
  'https://www.google.com/maps/place/Mohtisham+Complexes+Pvt.+Ltd./@12.8777097,74.8280459,15500m/data=!3m2!1e3!5s0x3ba35a6815bea9a7:0x7e7400e5b3719866!4m6!3m5!1s0x3ba35a44c2a84ed1:0xc705342626d39fc1!8m2!3d12.8797129!4d74.8403348!16s%2Fg%2F1hjg_g1dw'

// AR / VR section. `youtubeUrl` is the walkthrough video (watch page);
// `youtubeEmbedId` is optional — set it to the 11-char video id to render an
// inline player instead of a click-through thumbnail. `experienceUrl` is the
// real AR/VR destination the second card links to.
export const AR_VR = {
  youtubeUrl: 'https://www.youtube.com/', // PLACEHOLDER
  youtubeEmbedId: '', // PLACEHOLDER (optional) e.g. 'dQw4w9WgXcQ'
  experienceUrl: 'https://example.com/manhattan-ar-vr' // PLACEHOLDER
}
