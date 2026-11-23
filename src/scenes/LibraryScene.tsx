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
  const globeRotation = useRef(0)
  const globePointerX = useRef<number | null>(null)
  const previewedBook = portfolioBooks.find((book) => book.id === previewedId)

  const moveLantern = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch') return
    const bounds = event.currentTarget.getBoundingClientRect()
    const normalizedX = (event.clientX - bounds.left) / bounds.width - .5
    const normalizedY = (event.clientY - bounds.top) / bounds.height - .5
    event.currentTarget.style.setProperty('--cursor-x', `${event.clientX - bounds.left}px`)
    event.currentTarget.style.setProperty('--cursor-y', `${event.clientY - bounds.top}px`)
    event.currentTarget.style.setProperty('--cursor-light', '1')
    event.currentTarget.style.setProperty('--hero-shift-x', `${(normalizedX * 5).toFixed(2)}px`)
    event.currentTarget.style.setProperty('--hero-shift-y', `${(normalizedY * 3).toFixed(2)}px`)
    event.currentTarget.style.setProperty('--shelf-shift-x', `${(normalizedX * -5).toFixed(2)}px`)
    event.currentTarget.style.setProperty('--shelf-shift-y', `${(normalizedY * -3).toFixed(2)}px`)

    const fire = event.currentTarget.querySelector<HTMLElement>('.background-fire')
    if (fire) {
      const fireBounds = fire.getBoundingClientRect()
      const fireX = (event.clientX - (fireBounds.left + fireBounds.width / 2)) / (fireBounds.width * 1.25)
      const fireY = (event.clientY - (fireBounds.top + fireBounds.height / 2)) / (fireBounds.height * 1.25)
      const withinHearth = Math.abs(fireX) <= 1 && Math.abs(fireY) <= 1
      const clampedX = Math.max(-1, Math.min(1, fireX))
      const clampedY = Math.max(-1, Math.min(1, fireY))
      fire.style.setProperty('--fire-shift-x', `${(withinHearth ? clampedX * 10 : 0).toFixed(2)}px`)
      fire.style.setProperty('--fire-shift-y', `${(withinHearth ? clampedY * -6 : 0).toFixed(2)}px`)
      fire.style.setProperty('--fire-lean', `${(withinHearth ? clampedX * 4.5 : 0).toFixed(2)}deg`)
    }

    const globe = event.currentTarget.querySelector<HTMLElement>('.background-globe')
    if (globe) {
      const globeBounds = globe.getBoundingClientRect()
      const globeX = (event.clientX - (globeBounds.left + globeBounds.width / 2)) / (globeBounds.width * .62)
      const globeY = (event.clientY - (globeBounds.top + globeBounds.height * .42)) / (globeBounds.height * .48)
      const withinGlobe = globeX * globeX + globeY * globeY <= 1

      if (withinGlobe) {
        if (globePointerX.current !== null) {
          globeRotation.current = (globeRotation.current + (event.clientX - globePointerX.current) * 1.7) % 360
        }
        globePointerX.current = event.clientX
        globe.dataset.active = 'true'
        globe.style.setProperty('--globe-spin', `${globeRotation.current.toFixed(2)}deg`)
        const normalizedSpin = ((globeRotation.current % 360) + 360) % 360
        globe.style.setProperty('--globe-map-x', `${(-(normalizedSpin / 360) * 50).toFixed(3)}%`)
        globe.style.setProperty('--globe-tilt', `${(Math.max(-1, Math.min(1, globeY)) * 3).toFixed(2)}deg`)
      } else {
        globePointerX.current = null
        globe.dataset.active = 'false'
        globe.style.setProperty('--globe-tilt', '0deg')
      }
    }
  }

  const dimLantern = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--cursor-light', '.28')
    const fire = event.currentTarget.querySelector<HTMLElement>('.background-fire')
    fire?.style.setProperty('--fire-shift-x', '0px')
    fire?.style.setProperty('--fire-shift-y', '0px')
    fire?.style.setProperty('--fire-lean', '0deg')
    const globe = event.currentTarget.querySelector<HTMLElement>('.background-globe')
    globePointerX.current = null
    if (globe) {
      globe.dataset.active = 'false'
      globe.style.setProperty('--globe-tilt', '0deg')
    }
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
        <div className="window-breeze"><i /><i /><i /></div>
        <div className="background-globe" data-active="false">
          <span className="background-globe__sphere">
            <svg className="background-globe__map" viewBox="0 0 400 100" preserveAspectRatio="none">
              <defs>
                <g id="antique-world-map">
                  <path d="M10 27 18 17 36 13 54 20 63 31 55 39 46 36 39 45 28 41 22 34 13 33Z" />
                  <path d="m38 10 8-7 10 3-3 10-9 4Z" />
                  <path d="m45 49 14 3 8 12-6 22-8 10-7-15-1-16-7-9Z" />
                  <path d="m84 29 10-8 17 1 8 8-7 8-17-1Z" />
                  <path d="m96 39 17 1 10 13-5 26-12 16-9-13-7-25Z" />
                  <path d="m113 25 20-12 31 4 25 13-7 13-21 4-13 11-17-4-8-14Z" />
                  <path d="m150 61 13-8 15 7-4 11-15 4Z" />
                  <path d="m169 74 14-5 11 8-5 12-17-1-7-8Z" />
                </g>
              </defs>
              <g className="background-globe__grid">
                <path d="M0 25h400M0 50h400M0 75h400" />
                <path d="M25 0v100M75 0v100M125 0v100M175 0v100M225 0v100M275 0v100M325 0v100M375 0v100" />
              </g>
              <g className="background-globe__continents">
                <use href="#antique-world-map" />
                <use href="#antique-world-map" transform="translate(200 0)" />
              </g>
            </svg>
            <i /><i /><i />
          </span>
          <small>Drag light across the globe</small>
        </div>
        <div className="background-fire">
          <i /><i /><i /><i /><i />
        </div>
        <div className="dust-field dust-field--one" />
        <div className="dust-field dust-field--two" />
        <BackgroundShelf side="left" />
        <BackgroundShelf side="right" />
        <div className="library-arch"><i /><b /><i /></div>
        <div className="wall-frame"><span>RK</span><small>PRIVATE ARCHIVE</small></div>
        <div className="floor-rug" />
      </div>
      <div className="library-secrets" aria-label="Hidden library clues">
        <button
          className="secret-object secret-object--vase"
          type="button"
          disabled={busy}
          aria-describedby="vase-clue"
          aria-label="Reveal the clue beneath the flower vase and open Projects and Experience"
          onClick={(event) => {
            const book = portfolioBooks.find(({ id }) => id === 'work')
            if (book) onOpenBook(book, event.currentTarget)
          }}
        >
          <svg className="secret-object__trace" viewBox="0 0 102 144" aria-hidden="true">
            <path d="M51 6C60 1 67 8 70 16c9-7 19-1 19 9 9 2 11 13 4 19 5 8-1 18-10 19-2 9-12 13-20 8l-2 9h11l-5 48c-1 7-7 11-16 11s-15-4-16-11l-5-48h11l-2-9c-9 5-19 1-20-8-10-1-15-11-10-19-8-6-5-18 4-20-1-10 10-16 19-9 3-8 10-15 19-9Z" />
          </svg>
          <span className="secret-object__clue" id="vase-clue">
            <small>Clue 01 · Open Cases</small>
            <strong>Every arrangement hides a pattern.</strong>
            <em>Follow the green volume to the investigations where ideas became evidence.</em>
          </span>
        </button>

        <button
          className="secret-object secret-object--leaf"
          type="button"
          disabled={busy}
          aria-describedby="leaf-clue"
          aria-label="Reveal the clue beneath the leaf frame and open Skills"
          onClick={(event) => {
            const book = portfolioBooks.find(({ id }) => id === 'skills')
            if (book) onOpenBook(book, event.currentTarget)
          }}
        >
          <svg className="secret-object__trace" viewBox="0 0 82 130" aria-hidden="true">
            <rect x="4" y="4" width="74" height="122" rx="2" />
            <rect x="9" y="9" width="64" height="112" rx="1" opacity=".56" />
          </svg>
          <span className="secret-object__clue" id="leaf-clue">
            <small>Clue 02 · Methods &amp; Tools</small>
            <strong>Tools always leave fingerprints.</strong>
            <em>The blue volume catalogs the methods behind every solved case.</em>
          </span>
        </button>

        <button
          className="secret-object secret-object--armillary"
          type="button"
          disabled={busy}
          aria-describedby="armillary-clue"
          aria-label="Reveal the clue beneath the armillary sphere and open About Me"
          onClick={(event) => {
            const book = portfolioBooks.find(({ id }) => id === 'about')
            if (book) onOpenBook(book, event.currentTarget)
          }}
        >
          <svg className="secret-object__trace" viewBox="0 0 104 142" aria-hidden="true">
            <circle cx="52" cy="51" r="39" />
            <ellipse cx="52" cy="51" rx="39" ry="15" transform="rotate(-18 52 51)" />
            <ellipse cx="52" cy="51" rx="15" ry="39" transform="rotate(21 52 51)" />
            <path d="M52 90v22M37 116h30M31 125h42" />
          </svg>
          <span className="secret-object__clue" id="armillary-clue">
            <small>Clue 03 · The Subject</small>
            <strong>The strongest signal is the subject herself.</strong>
            <em>Data-minded, product-curious, and community-led—the crimson volume reveals what makes Ridhi stand out.</em>
          </span>
        </button>
      </div>
      <div className="cursor-illumination" aria-hidden="true" />

      <section className="library-hero" aria-labelledby="library-title">
        <p className="library-hero__eyebrow"><span /> Open to data analytics and product management internships <span /></p>
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
