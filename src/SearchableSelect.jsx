import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './SearchableSelect.css'

const normalize = (s) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

// A searchable dropdown built to replace native <select> for long option
// lists (countries, dial codes, states, cities). Native selects render as a
// full-viewport OS list with no way to bound their size or add search; this
// renders its own panel (via a portal, sized/positioned from the trigger's
// own rect) with a fixed max-height and an always-visible search input.
export default function SearchableSelect({
  id,
  value,
  options, // [{ value, label, triggerLabel?, searchText }]
  onChange,
  placeholder = 'Select…',
  searchPlaceholder = 'Search…',
  disabled = false,
  hasError = false,
  ariaLabel,
  triggerClassName = '',
  panelWidth,
  emptyMessage = 'No results found'
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [panelStyle, setPanelStyle] = useState(null)
  const triggerRef = useRef(null)
  const panelRef = useRef(null)
  const searchInputRef = useRef(null)

  const selected = options.find((o) => o.value === value) || null

  // Position the panel from the trigger's live rect each time it opens, and
  // flip it upward if there isn't enough room below (e.g. fields near the
  // bottom of the scrollable modal card).
  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const width = panelWidth ?? rect.width
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let left = rect.left
    if (left + width > viewportWidth - 12) left = Math.max(12, viewportWidth - width - 12)

    const spaceBelow = viewportHeight - rect.bottom
    const spaceAbove = rect.top
    const openUpward = spaceBelow < 220 && spaceAbove > spaceBelow

    setPanelStyle({
      position: 'fixed',
      left,
      width,
      ...(openUpward
        ? { bottom: viewportHeight - rect.top + 6, maxHeight: Math.max(140, Math.min(260, spaceAbove - 20)) }
        : { top: rect.bottom + 6, maxHeight: Math.max(140, Math.min(260, spaceBelow - 20)) })
    })
  }, [isOpen, panelWidth])

  useEffect(() => {
    if (!isOpen) return
    setQuery('')
    const focusTimer = setTimeout(() => searchInputRef.current?.focus(), 0)

    const handleOutside = (e) => {
      const clickedTrigger = triggerRef.current && triggerRef.current.contains(e.target)
      const clickedPanel = panelRef.current && panelRef.current.contains(e.target)
      if (!clickedTrigger && !clickedPanel) setIsOpen(false)
    }
    const closeOnScrollOrResize = () => setIsOpen(false)

    document.addEventListener('mousedown', handleOutside)
    window.addEventListener('resize', closeOnScrollOrResize)
    // capture:true so this also catches scroll on the modal card's own
    // internal scroll container, not just the window.
    document.addEventListener('scroll', closeOnScrollOrResize, true)

    return () => {
      clearTimeout(focusTimer)
      document.removeEventListener('mousedown', handleOutside)
      window.removeEventListener('resize', closeOnScrollOrResize)
      document.removeEventListener('scroll', closeOnScrollOrResize, true)
    }
  }, [isOpen])

  const filtered = query.trim()
    ? options.filter((o) => normalize(o.searchText).includes(normalize(query.trim())))
    : options

  const handleSelect = (opt) => {
    onChange(opt.value)
    setIsOpen(false)
  }

  const handleTriggerClick = () => {
    if (disabled) return
    setIsOpen((prev) => !prev)
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered.length > 0) handleSelect(filtered[0])
    }
  }

  return (
    <>
      <button
        type="button"
        id={id}
        ref={triggerRef}
        className={`searchable-select-trigger ${triggerClassName} ${hasError ? 'has-error' : ''}`}
        onClick={handleTriggerClick}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
      >
        <span className="searchable-select-value">
          {selected
            ? (selected.triggerLabel ?? selected.label)
            : <span className="searchable-select-placeholder">{placeholder}</span>}
        </span>
        <svg className="searchable-select-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && panelStyle && createPortal(
        <div className="searchable-select-panel" style={panelStyle} ref={panelRef} role="listbox">
          <input
            ref={searchInputRef}
            type="text"
            className="searchable-select-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder={searchPlaceholder}
          />
          <div className="searchable-select-options">
            {filtered.length === 0 && (
              <div className="searchable-select-empty">{emptyMessage}</div>
            )}
            {filtered.map((opt) => (
              <button
                type="button"
                key={opt.value}
                className={`searchable-select-option ${opt.value === value ? 'is-selected' : ''}`}
                onClick={() => handleSelect(opt)}
                role="option"
                aria-selected={opt.value === value}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
