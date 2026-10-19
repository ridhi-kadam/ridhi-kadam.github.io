import { useEffect, useRef, useState } from 'react'
import { portfolioBooks, profile } from '../data/portfolio'
import type { SectionId } from '../types/portfolio'

type NavigationControlsProps = {
  activeId: SectionId | null
  busy: boolean
  onNavigate: (id: SectionId) => void
  onReturn: () => void
}

export function NavigationControls({ activeId, busy, onNavigate, onReturn }: NavigationControlsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const firstItem = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return
    firstItem.current?.focus()

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isOpen])

  const navigate = (id: SectionId) => {
    setIsOpen(false)
    onNavigate(id)
  }

  return (
    <header className="navigation-controls" aria-label="Primary navigation">
      <div className="navigation-controls__left">
        {activeId ? (
          <button
            className="library-mark"
            type="button"
            onClick={onReturn}
            aria-label="Return to the library"
            disabled={busy}
          >
            <span>R</span><i aria-hidden="true" /><span>K</span>
          </button>
        ) : (
          <a className="library-mark" href="#library" aria-label={`${profile.name} home`}>
            <span>R</span><i aria-hidden="true" /><span>K</span>
          </a>
        )}

        {activeId && (
          <button className="return-control" type="button" onClick={onReturn} disabled={busy}>
            <span aria-hidden="true">←</span>
            Return to library
          </button>
        )}
      </div>

      <nav className="navigation-controls__right" aria-label="Portfolio links">
        <a href={profile.contact.resume} target="_blank" rel="noreferrer">Resume</a>
        <a href={profile.contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        <button
          className="index-toggle"
          type="button"
          aria-expanded={isOpen}
          aria-controls="portfolio-index"
          onClick={() => setIsOpen((open) => !open)}
        >
          <span>Index</span>
          <i aria-hidden="true" />
        </button>
      </nav>

      {isOpen && (
        <div id="portfolio-index" className="portfolio-index" data-open="true">
          <div className="portfolio-index__heading">
            <span>Library index</span>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close library index">×</button>
          </div>
          <ol>
            {portfolioBooks.map((book, index) => (
              <li key={book.id}>
                <button
                  ref={index === 0 ? firstItem : undefined}
                  type="button"
                  aria-current={activeId === book.id ? 'page' : undefined}
                  disabled={busy || activeId === book.id}
                  onClick={() => navigate(book.id)}
                >
                  <span>0{index + 1}</span>
                  <strong>{book.title}</strong>
                  <small>{book.shelfLabel}</small>
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}
    </header>
  )
}
