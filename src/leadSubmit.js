// Sends a lead / contact submission to a Google Apps Script web app, which
// appends one row per submission to the connected Google Sheet.
//
// The endpoint URL is read from the VITE_LEADS_ENDPOINT env var (see .env).
// Google Apps Script web apps cannot send CORS response headers, so the request
// is made as a "simple" cross-origin POST (text/plain body) in `no-cors` mode:
// the row still gets written, but the response is opaque. We therefore treat a
// resolved fetch as success and a rejected one (offline, DNS failure, bad URL)
// as an error the calling form can surface.

const ENDPOINT = import.meta.env.VITE_LEADS_ENDPOINT

/**
 * @param {Object} payload
 * @param {string} payload.source  Which form it came from, e.g. "Contact section".
 * @param {string} [payload.name]
 * @param {string} [payload.email]
 * @param {string} [payload.phone]
 * @param {string} [payload.message]  Free-text (the contact message or the
 *                                    "your requirement" field).
 */
export async function submitLead(payload) {
  const body = JSON.stringify({
    source: '',
    name: '',
    email: '',
    phone: '',
    message: '',
    ...payload,
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    submittedAt: new Date().toISOString()
  })

  if (!ENDPOINT) {
    // No endpoint configured (e.g. local dev before the sheet is wired up).
    // Don't hard-fail the form UX; note it in dev only.
    if (import.meta.env.DEV) {
      console.warn('[submitLead] VITE_LEADS_ENDPOINT is not set; submission not sent.', JSON.parse(body))
    }
    return
  }

  await fetch(ENDPOINT, {
    method: 'POST',
    mode: 'no-cors',
    // A plain-text content type keeps this a "simple request" (no CORS
    // preflight, which Apps Script can't answer). The Apps Script still
    // JSON.parse()s the body on its side.
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body
  })
}
