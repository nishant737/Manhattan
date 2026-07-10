import './WhatsAppButton.css'

// TODO: replace with your real WhatsApp Business number. Digits only,
// including the country code, with NO leading "+", "00", spaces, or dashes.
// Example: for +91 98765 43210, use '919876543210'.
const WHATSAPP_NUMBER = '910000000000'

// Pre-fills the chat's first message; the visitor can still edit it before
// sending. Set to '' if you'd rather the chat open blank.
const DEFAULT_MESSAGE = "Hi, I'm interested in Manhattan — Luxury Residences in Mangalore."

const WHATSAPP_HREF =
  `https://wa.me/${WHATSAPP_NUMBER}` +
  (DEFAULT_MESSAGE ? `?text=${encodeURIComponent(DEFAULT_MESSAGE)}` : '')

export default function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_HREF}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button"
      aria-label="Chat with us on WhatsApp"
    >
      <svg viewBox="0 0 32 32" width="30" height="30" fill="currentColor" aria-hidden="true">
        <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.386.7 4.61 1.902 6.478L4 29l7.72-1.868A11.94 11.94 0 0 0 16.001 27C22.628 27 28 21.627 28 15S22.628 3 16.001 3zm0 21.818a9.77 9.77 0 0 1-4.98-1.363l-.357-.212-4.583 1.11 1.127-4.462-.233-.366A9.77 9.77 0 0 1 5.818 15c0-5.618 4.564-10.182 10.183-10.182S26.182 9.382 26.182 15 21.62 24.818 16.001 24.818zm5.593-7.626c-.306-.153-1.81-.893-2.09-.995-.28-.102-.484-.153-.687.153-.204.306-.79.995-.968 1.2-.178.203-.357.229-.663.076-.306-.153-1.293-.477-2.463-1.52-.911-.812-1.526-1.815-1.705-2.121-.178-.306-.019-.472.134-.624.138-.137.306-.357.459-.535.153-.178.204-.306.306-.51.102-.204.05-.382-.026-.535-.076-.153-.687-1.655-.941-2.267-.248-.596-.5-.516-.687-.525-.178-.008-.382-.01-.586-.01-.204 0-.535.076-.815.382-.28.306-1.069 1.044-1.069 2.546 0 1.502 1.094 2.953 1.247 3.157.153.204 2.153 3.287 5.216 4.61.729.314 1.298.502 1.741.643.732.233 1.398.2 1.925.121.587-.088 1.81-.74 2.065-1.454.255-.714.255-1.326.178-1.454-.076-.128-.28-.204-.586-.357z" />
      </svg>
    </a>
  )
}
