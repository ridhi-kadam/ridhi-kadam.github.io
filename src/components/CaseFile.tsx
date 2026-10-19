import { forwardRef } from 'react'
import type { CSSProperties } from 'react'
import type { ExperienceCase } from '../types/portfolio'
import { ArchiveImage } from './ArchiveImage'

type CaseFileStyle = CSSProperties & { '--case-tilt': string }

type CaseFileProps = {
  item: ExperienceCase
  index: number
  active: boolean
  onOpen: () => void
  onEnter: () => void
  onLeave: () => void
}

export const CaseFile = forwardRef<HTMLButtonElement, CaseFileProps>(function CaseFile(
  { item, index, active, onOpen, onEnter, onLeave },
  ref,
) {
  const tilts = [-1.8, 1.3, -1, 1.5, -.7, 1.1]
  const style: CaseFileStyle = { '--case-tilt': `${tilts[index] ?? 0}deg` }

  return (
    <button
      ref={ref}
      className="case-file"
      style={style}
      type="button"
      data-case-id={item.id}
      data-active={active ? 'true' : 'false'}
      aria-label={`Open case ${item.caseNumber}: ${item.title}`}
      onClick={onOpen}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
    >
      <span className="case-file__pin" aria-hidden="true" />
      <ArchiveImage src={item.image} alt={item.imageAlt} className="case-file__image" />
      <span className="case-file__meta">
        <small>{item.caseNumber} · {item.category}</small>
        <strong>{item.title}</strong>
        <em>{item.role}</em>
        <span>{item.teaser}</span>
      </span>
      <span className="case-file__inspect">Inspect evidence →</span>
    </button>
  )
})
