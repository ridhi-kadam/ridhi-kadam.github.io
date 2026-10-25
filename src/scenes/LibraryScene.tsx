import { useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react'
import { BookSpine } from '../components/BookSpine'
import { portfolioBooks, profile } from '../data/portfolio'
import type { PortfolioBook } from '../types/portfolio'

type LibrarySceneProps = {
  busy: boolean
  onOpenBook: (book: PortfolioBook, trigger: HTMLButtonElement) => void
}

type BackgroundVolumeStyle = CSSProperties & {
  '--volume-width': string
  '--volume-height': string
  '--volume-tilt': string
  '--volume-lift': string
  '--volume-color': string
  '--volume-wear': string
}

const backgroundVolumeWidths = [8, 11, 13, 7, 14, 9, 12, 8, 10, 7, 13, 9, 8, 14, 8, 11, 7, 13, 9, 14, 7, 10, 12, 8]
const backgroundVolumeHeights = [62, 79, 88, 56, 92, 71, 84, 65, 77, 58, 89, 73, 66, 94, 69, 82, 57, 87, 72, 91, 61, 76, 85, 67]
const backgroundVolumeTilts = [-1.4, .4, -.3, 1.8, -.5, .7, -1, .2, .8, -1.6, .3, -.4, 1.2, -.2, -1.1, .5, -1.8, .2, 1.1, -.4, .7, -1.3, .3, -.6]
const backgroundVolumeColors = ['#6c302c', '#28564d', '#805137', '#28475b', '#77382f', '#80613e', '#3d654f', '#563044']

const backgroundVolumes = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  binding: ['plain', 'banded', 'labelled', 'ribbed'][index % 4],
}))

function BackgroundShelf({ side }: { side: 'left' | 'right' }) {
  const sideShift = side === 'left' ? 0 : 7

  return (
    <div className={`background-shelf background-shelf--${side}`} aria-hidden="true">
      <div className="background-shelf__crown" />
      {[0, 1, 2].map((row) => (
        <div className="background-shelf__row" key={row}>
          {backgroundVolumes.slice(row * 8, row * 8 + 8).map((volume) => {
            const variation = (volume.id + sideShift) % backgroundVolumes.length
            const style: BackgroundVolumeStyle = {
              '--volume-width': `${backgroundVolumeWidths[variation]}%`,
              '--volume-height': `${backgroundVolumeHeights[variation]}%`,
              '--volume-tilt': `${side === 'left' ? backgroundVolumeTilts[variation] : -backgroundVolumeTilts[variation]}deg`,
              '--volume-lift': `${variation % 5 === 0 ? 3 : variation % 3 === 0 ? 1 : 0}px`,
              '--volume-color': backgroundVolumeColors[(variation + row) % backgroundVolumeColors.length],
              '--volume-wear': `${.08 + (variation % 4) * .035}`,
            }

            return <i key={volume.id} className={`background-volume background-volume--${volume.binding}`} style={style} />
          })}
        </div>
      ))}
    </div>
  )
}

export function LibraryScene({ busy, onOpenBook }: LibrarySceneProps) {
  const [previewedId, setPreviewedId] = useState<string | null>(null)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const bookRefs = useRef<Array<HTMLButtonElement | null>>([])
  const previewedBook = portfolioBooks.find((book) => book.id === previewedId)

  const moveLantern = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch') return
    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--cursor-x', `${event.clientX - bounds.left}px`)
    event.currentTarget.style.setProperty('--cursor-y', `${event.clientY - bounds.top}px`)
    event.currentTarget.style.setProperty('--cursor-light', '1')
  }

  const dimLantern = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--cursor-light', '.28')
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()

    let next = index
    if (event.key === 'ArrowRight') next = (index + 1) % portfolioBooks.length
    if (event.key === 'ArrowLeft') next = (index - 1 + portfolioBooks.length) % portfolioBooks.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = portfolioBooks.length - 1

    setFocusedIndex(next)
    bookRefs.current[next]?.focus()
  }

  return (
    <main
      className="library-scene"
      id="library"
      data-busy={busy ? 'true' : 'false'}
      onPointerMove={moveLantern}
      onPointerLeave={dimLantern}
    >
      <a className="skip-link" href="#main-bookshelf">Skip to the bookshelf</a>

      <div className="library-atmosphere" aria-hidden="true">
        <div className="film-grain" />
        <div className="light-pool" />
        <div className="dust-field dust-field--one" />
        <div className="dust-field dust-field--two" />
        <BackgroundShelf side="left" />
        <BackgroundShelf side="right" />
        <div className="library-arch"><i /><b /><i /></div>
        <div className="wall-frame"><span>RK</span><small>PRIVATE ARCHIVE</small></div>
        <div className="fireplace">
          <div className="fireplace__mantel"><i /><i /><i /></div>
          <div className="fireplace__opening">
            <span className="fireplace__log fireplace__log--one" />
            <span className="fireplace__log fireplace__log--two" />
            <b className="fireplace__flame fireplace__flame--one" />
            <b className="fireplace__flame fireplace__flame--two" />
            <b className="fireplace__flame fireplace__flame--three" />
            <span className="fireplace__sparks"><i /><i /><i /><i /></span>
            <em />
          </div>
          <div className="fireplace__hearth" />
        </div>
        <div className="ivy ivy--left"><i /><i /><i /><i /><i /><i /><i /><i /></div>
        <div className="ivy ivy--right"><i /><i /><i /><i /><i /><i /><i /></div>
        <div className="floor-rug" />
      </div>
      <div className="cursor-illumination" aria-hidden="true" />

      <section className="library-hero" aria-labelledby="library-title">
        <p className="library-hero__eyebrow"><span /> Private collection · Berkeley, California <span /></p>
        <h1 id="library-title">{profile.libraryTitle}</h1>
        <p className="library-hero__subtitle">{profile.librarySubtitle}</p>
        <p className="library-hero__role">{profile.roleLine}</p>
      </section>

      <section id="main-bookshelf" className="main-bookshelf" aria-label="Five portfolio volumes">
        <div className="shelf-lamp shelf-lamp--left" aria-hidden="true"><i /><span /></div>
        <div className="shelf-lamp shelf-lamp--right" aria-hidden="true"><i /><span /></div>
        <div className="main-bookshelf__alcove" aria-hidden="true" />

        <div className="book-row">
          <div className="brass-bookend brass-bookend--left" aria-hidden="true"><span /></div>
          {portfolioBooks.map((book, index) => (
            <BookSpine
              ref={(element) => { bookRefs.current[index] = element }}
              key={book.id}
              book={book}
              index={index}
              tabIndex={focusedIndex === index ? 0 : -1}
              isPreviewed={previewedId === book.id}
              disabled={busy}
              onPreview={(nextBook) => {
                setFocusedIndex(index)
                setPreviewedId(nextBook.id)
              }}
              onPreviewEnd={() => setPreviewedId(null)}
              onOpen={onOpenBook}
              onKeyDown={handleKeyDown}
            />
          ))}
          <div className="brass-bookend brass-bookend--right" aria-hidden="true"><span /></div>
        </div>

        <div className="walnut-shelf" aria-hidden="true">
          <span className="walnut-shelf__plaque">R.K. · CASE LIBRARY</span>
        </div>
      </section>

      <div className="book-inspector" aria-live="polite" aria-atomic="true">
        <span className="book-inspector__rule" aria-hidden="true" />
        {previewedBook ? (
          <div key={previewedBook.id} className="book-inspector__copy">
            <small>{previewedBook.shelfLabel}</small>
            <strong>{previewedBook.title}</strong>
            <p>{previewedBook.subtitle}</p>
          </div>
        ) : (
          <div className="book-inspector__copy book-inspector__copy--default">
            <small>Five volumes await</small>
            <strong>Choose a volume to begin</strong>
            <p>Hover, focus, or use the arrow keys to inspect the shelf.</p>
          </div>
        )}
        <span className="book-inspector__rule" aria-hidden="true" />
      </div>

      <footer className="library-footer">
        <span>Archive no. RK–2026</span>
        <span>Use ← → to inspect · Enter to open</span>
      </footer>
    </main>
  )
}
