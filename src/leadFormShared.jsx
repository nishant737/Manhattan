import { Country } from 'country-state-city'
import { isValidPhoneNumber } from 'libphonenumber-js'

// Shared by every "email or mobile" lead form on the site (the LeadCaptureModal
// popup and the inline ContactSection) so the validation rules, country data,
// and phone-code options never drift apart between the two.

// A stricter, practical email pattern (close to the WHATWG HTML5 spec used
// for <input type="email">, plus a mandatory 2+ letter TLD). A looser
// "no whitespace/no @" pattern lets a bare domain segment absorb dots
// freely, so nonsensical addresses like "user@example..com" or
// "user@example.com." (trailing dot) would pass.
export const EMAIL_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/

// A handful of countries (mostly Caribbean/UK-dependency territories) store
// their dial code with a leading "+" and a dash-suffixed area code, e.g.
// "+358-18" (Åland) or "+1-242" (Bahamas), unlike the plain "91"/"1" the rest
// use. Left as-is, `+${phonecode}` produces garbage like "++358-18" and
// Number(phonecode) is NaN, breaking any numeric sort. Normalize to just the
// leading digits so every country has a clean, comparable dial code.
const normalizeDialCode = (phonecode) => phonecode.replace(/^\+/, '').match(/^\d+/)?.[0] ?? ''

export const ALL_COUNTRIES = Country.getAllCountries()
  .map((c) => ({ ...c, dialCode: normalizeDialCode(c.phonecode || '') }))
  .sort((a, b) => a.name.localeCompare(b.name))

// Only used for the phone country/dial-code picker — neither form collects a
// postal Country/State/City, so the full address country list isn't needed
// anywhere else.
export const PHONE_CODE_OPTIONS = ALL_COUNTRIES.map((c) => ({
  value: c.isoCode,
  triggerLabel: <>{c.flag} +{c.dialCode}</>,
  label: <>{c.flag} +{c.dialCode} <span className="searchable-select-option-sub">{c.name}</span></>,
  searchText: `${c.name} ${c.isoCode} +${c.dialCode} ${c.dialCode}`
}))

// Validates the shared "at least one of email or phone" rule. Returns an
// errors object with `email`/`phone` keys set only where something's wrong
// (empty object = valid).
export function validateContactFields({ email, phone, phoneCountry }) {
  const errors = {}
  const trimmedEmail = email.trim()
  const trimmedPhone = phone.trim()

  if (!trimmedEmail && !trimmedPhone) {
    errors.email = 'Please provide your email or mobile number.'
    errors.phone = 'Please provide your email or mobile number.'
    return errors
  }

  if (trimmedEmail && !EMAIL_PATTERN.test(trimmedEmail)) {
    errors.email = 'Please enter a valid email address.'
  }

  // Validated against the actual numbering-plan rules for the selected dial
  // code (via libphonenumber-js), not a fixed digit range — e.g. India
  // requires exactly 10 digits, the US requires exactly 10, other countries
  // allow different lengths/prefixes.
  if (trimmedPhone) {
    const phoneDigits = trimmedPhone.replace(/[^0-9]/g, '')
    if (!isValidPhoneNumber(phoneDigits, phoneCountry)) {
      errors.phone = 'Please enter a valid phone number for the selected country code.'
    }
  }

  return errors
}

// Formats the phone field with its dial code for submission, or '' if the
// visitor didn't provide a phone number.
export function formatPhoneForSubmit(phone, phoneCountry) {
  const trimmed = phone.trim()
  if (!trimmed) return ''
  const countryObj = ALL_COUNTRIES.find((c) => c.isoCode === phoneCountry)
  return `+${countryObj?.dialCode ?? ''} ${trimmed}`
}
