import { forwardRef, useRef } from 'react'
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react'
import type { PortfolioBook } from '../types/portfolio'

type BookSpineStyle = CSSProperties & {
  '--book-cover': string
  '--book-dark': string
  '--book-foil': string
  '--book-page': string
  '--book-height': string
  '--book-width': string
  '--book-tilt': string
  '--spot-x': string
  '--spot-y': string
}

type BookPositionStyle = CSSProperties & {
  '--book-width': string
  '--shelf-offset': string
  '--book-gap': string
}

type BookSpineProps = {
  book: PortfolioBook
  index: number
  tabIndex: number
  isPreviewed: boolean
  disabled: boolean
  onPreview: (book: PortfolioBook) => void
  onPreviewEnd: () => void
  onOpen: (book: PortfolioBook, trigger: HTMLButtonElement) => void
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>, index: number) => void
}

export const BookSpine = forwardRef<HTMLButtonElement, BookSpineProps>(function BookSpine(
  { book, index, tabIndex, isPreviewed, disabled, onPreview, onPreviewEnd, onOpen, onKeyDown },
  forwardedRef,
) {
  const localRef = useRef<HTMLButtonElement | null>(null)
  const tooltipId = `book-${book.id}-tooltip`

  const setRefs = (element: HTMLButtonElement | null) => {
    localRef.current = element
    if (typeof forwardedRef === 'function') forwardedRef(element)
    else if (forwardedRef) forwardedRef.current = element
  }

  const style: BookSpineStyle = {
    '--book-cover': book.palette.cover,
    '--book-dark': book.palette.coverDark,
    '--book-foil': book.palette.foil,
    '--book-page': book.palette.page,
    '--book-height': `${book.height}px`,
    '--book-width': `${book.width}px`,
    '--book-tilt': `${book.tilt}deg`,
    '--spot-x': '50%',
    '--spot-y': '30%',
  }

  const positionStyle: BookPositionStyle = {
    '--book-width': `${book.width}px`,
    '--shelf-offset': `${book.shelfOffset}px`,
    '--book-gap': `${book.gapAfter}px`,
  }

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`)
    event.currentTarget.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`)
  }

  return (
    <div className="book-position" style={positionStyle}>
      <button
        ref={setRefs}
        className="book-spine"
        data-active={isPreviewed ? 'true' : 'false'}
        data-variant={book.spineVariant}
        style={style}
        type="button"
        tabIndex={tabIndex}
        disabled={disabled}
        aria-describedby={isPreviewed ? tooltipId : undefined}
        aria-label={`Open ${book.title}: ${book.subtitle}`}
        onPointerEnter={() => onPreview(book)}
        onPointerMove={handlePointerMove}
        onPointerLeave={onPreviewEnd}
        onFocus={() => onPreview(book)}
        onBlur={onPreviewEnd}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onOpen(book, event.currentTarget)
            return
          }
          onKeyDown(event, index)
        }}
        onClick={(event) => onOpen(book, event.currentTarget)}
      >
        <span className="book-spine__spotlight" aria-hidden="true" />
        <span className="book-spine__top" aria-hidden="true" />
        <span className="book-spine__ridge book-spine__ridge--top" aria-hidden="true" />
        <span className="book-spine__ridge book-spine__ridge--bottom" aria-hidden="true" />
        <span className="book-spine__number">VOL. {book.number}</span>
        <span className="book-spine__ornament" aria-hidden="true"><i /><b /><i /></span>
        <span className="book-spine__title">{book.title}</span>
        <span className="book-spine__label">{book.shelfLabel}</span>
        <span className="book-spine__monogram" aria-hidden="true">RK</span>
        <span className="book-spine__pages" aria-hidden="true" />
      </button>

      {isPreviewed && (
        <span id={tooltipId} className="book-tooltip" role="tooltip">
          <small>Volume {book.number}</small>
          <strong>{book.title}</strong>
          <span>{book.subtitle}</span>
        </span>
      )}
    </div>
  )
})
