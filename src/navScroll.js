// Cross-component flag: true while a programmatic navigation scroll (a
// scrollIntoView fired from the navbar or footer) is in flight. Scroll-jacking
// sections — the AmenitiesSection card lock on mobile — check this and stand
// down, so a nav click that passes through them doesn't trap the page there.

export const navScroll = { active: false }

let timer = null

/** Mark a nav scroll as running; auto-clears after `ms` (a smooth scroll's
 *  worst-case duration). Call right before scrollIntoView. */
export function beginNavScroll(ms = 1400) {
  navScroll.active = true
  clearTimeout(timer)
  timer = setTimeout(() => {
    navScroll.active = false
  }, ms)
}
