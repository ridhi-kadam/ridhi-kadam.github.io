import { useEffect, useLayoutEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { gsap } from 'gsap'
import type { PortfolioBook } from '../types/portfolio'
import type { ScenePhase } from '../lib/sceneMachine'
import { SceneRenderer } from '../scenes/SceneRenderer'

export type BookOrigin = {
  left: number
  top: number
  width: number
  height: number
}

type TransitionStyle = CSSProperties & {
  '--transition-cover': string
  '--transition-dark': string
  '--transition-foil': string
  '--transition-page': string
}

type BookTransitionProps = {
  book: PortfolioBook
  phase: Exclude<ScenePhase, 'library'>
  origin: BookOrigin | null
  onOpened: () => void
  onClosed: () => void
  onRequestClose: () => void
}

const pageNumbers = [1, 2, 3, 4]

export default function BookTransition({
  book,
  phase,
  origin,
  onOpened,
  onClosed,
  onRequestClose,
}: BookTransitionProps) {
  const layerRef = useRef<HTMLDivElement>(null)
  const bookRef = useRef<HTMLDivElement>(null)
  const coverRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLElement>(null)

  const style: TransitionStyle = {
    '--transition-cover': book.palette.cover,
    '--transition-dark': book.palette.coverDark,
    '--transition-foil': book.palette.foil,
    '--transition-page': book.palette.page,
  }

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [])

  useEffect(() => {
    if (phase !== 'scene') return
    previewRef.current?.querySelector<HTMLElement>('[data-scene-focus]')?.focus()

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !document.querySelector('[role="dialog"][aria-modal="true"]')) onRequestClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onRequestClose, phase])

  useLayoutEffect(() => {
    const layer = layerRef.current
    const shell = bookRef.current
    const cover = coverRef.current
    const preview = previewRef.current
    if (!layer || !shell || !cover || !preview) return

    const pages = Array.from(shell.querySelectorAll<HTMLElement>('[data-flip-page]'))
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const compact = window.matchMedia('(max-width: 720px)').matches
    const openedX = compact ? 0 : shell.offsetWidth / 2
    const startX = origin ? origin.left + origin.width / 2 - window.innerWidth / 2 : 0
    const startY = origin ? origin.top + origin.height / 2 - window.innerHeight / 2 : 90
    const startScale = origin ? Math.max(0.22, Math.min(0.55, origin.width / shell.offsetWidth)) : 0.55

    const context = gsap.context(() => {
      if (phase === 'opening') {
        gsap.set(preview, { autoAlpha: 0, pointerEvents: 'none' })
        gsap.set(cover, { rotationY: 0 })
        gsap.set(pages, { rotationY: 0 })

        if (reduceMotion) {
          gsap.set(layer, { autoAlpha: 1 })
          gsap.set(shell, { x: openedX, y: 0, scale: 1, rotationZ: 0 })
          gsap.set(cover, { rotationY: compact ? -104 : -178 })
          gsap.set(pages, { rotationY: compact ? -104 : -178 })
          gsap.set(preview, { autoAlpha: 1, pointerEvents: 'auto' })
          onOpened()
          return
        }

        const timeline = gsap.timeline({ defaults: { ease: 'power3.inOut' }, onComplete: onOpened })
        timeline
          .fromTo(layer, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.32 })
          .fromTo(
            shell,
            { x: startX, y: startY, scale: startScale, rotationZ: book.tilt },
            { x: 0, y: 0, scale: 1, rotationZ: 0, duration: 0.72 },
            0,
          )
          .to(shell, { x: openedX, duration: 0.64 }, 0.66)
          .to(cover, { rotationY: compact ? -104 : -178, duration: 0.92, ease: 'power2.inOut' }, 0.7)
          .to(pages, { rotationY: compact ? -104 : -178, duration: 0.58, stagger: 0.12, ease: 'power2.inOut' }, 1.02)
          .to(preview, { autoAlpha: 1, pointerEvents: 'auto', duration: 0.4, ease: 'power2.out' }, 1.48)
        return
      }

      if (phase === 'scene') {
        gsap.set(layer, { autoAlpha: 1 })
        gsap.set(shell, { x: openedX, y: 0, scale: 1, rotationZ: 0 })
        gsap.set(cover, { rotationY: compact ? -104 : -178 })
        gsap.set(pages, { rotationY: compact ? -104 : -178 })
        gsap.set(preview, { autoAlpha: 1, pointerEvents: 'auto' })
        return
      }

      if (phase === 'closing') {
        gsap.set(layer, { autoAlpha: 1 })
        gsap.set(shell, { x: openedX, y: 0, scale: 1, rotationZ: 0 })
        gsap.set(cover, { rotationY: compact ? -104 : -178 })
        gsap.set(pages, { rotationY: compact ? -104 : -178 })
        gsap.set(preview, { autoAlpha: 1, pointerEvents: 'none' })

        if (reduceMotion) {
          gsap.to(layer, { autoAlpha: 0, duration: 0.12, onComplete: onClosed })
          return
        }

        const timeline = gsap.timeline({ defaults: { ease: 'power3.inOut' }, onComplete: onClosed })
        timeline
          .to(preview, { autoAlpha: 0, duration: 0.22 })
          .to([...pages].reverse(), { rotationY: 0, duration: 0.42, stagger: 0.07 }, 0.08)
          .to(cover, { rotationY: 0, duration: 0.68 }, 0.23)
          .to(shell, { x: 0, duration: 0.48 }, 0.3)
          .to(
            shell,
            { x: startX, y: startY, scale: startScale, rotationZ: book.tilt, duration: 0.62 },
            0.72,
          )
          .to(layer, { autoAlpha: 0, duration: 0.26 }, 1.15)
      }
    }, layer)

    return () => context.revert()
  }, [book.id, book.tilt, onClosed, onOpened, origin, phase])

  return (
    <div
      ref={layerRef}
      className="book-transition"
      style={style}
      data-phase={phase}
      aria-busy={phase !== 'scene'}
      aria-labelledby={`transition-title-${book.id}`}
    >
      <div className="book-transition__curtain" aria-hidden="true" />
      <p className="book-transition__status" role="status">
        {phase === 'opening' ? `Opening ${book.title}` : phase === 'closing' ? 'Returning volume to the library' : `${book.title} is open`}
      </p>

      <div ref={bookRef} className="opening-book">
        <div ref={coverRef} className="opening-book__cover" aria-hidden="true">
          <div className="opening-book__cover-border">
            <span>PRIVATE ARCHIVE</span>
            <small>VOL. {book.number}</small>
            <strong>{book.title}</strong>
            <i />
            <b>RK</b>
          </div>
        </div>

        <div className="opening-book__page-base" aria-hidden="true" />
        {pageNumbers.map((page) => (
          <div
            className={`opening-book__flip-page opening-book__flip-page--${page}`}
            data-flip-page
            key={page}
            aria-hidden="true"
          >
            <span />
          </div>
        ))}

      </div>

      <article ref={previewRef} className={`section-scene section-scene--${book.id}`}>
        <SceneRenderer section={book.id} titleId={`transition-title-${book.id}`} />
      </article>
    </div>
  )
}
