import { useState } from 'react'
import type { CSSProperties } from 'react'
import { ArchiveImage } from '../components/ArchiveImage'
import { SceneShell } from '../components/SceneShell'
import { interestEntries } from '../data/sceneContent'

type InterestStyle = CSSProperties & { '--interest-rotation': string }

export default function FiresideScene({ titleId }: { titleId: string }) {
  const [selectedId, setSelectedId] = useState(interestEntries[0].id)
  const selected = interestEntries.find((entry) => entry.id === selectedId) ?? interestEntries[0]

  return (
    <SceneShell
      scene="interests"
      eyebrow="Fireside journal · Off the record"
      title="Interests"
      intro="Small adventures, familiar rituals, and the clues that live outside the résumé."
      titleId={titleId}
    >
      <div className="fireside-room">
        <div className="journal-fireplace" aria-hidden="true"><i /><i /><b /><span /></div>
        <div className="journal-chair" aria-hidden="true"><i /></div>

        <article className="interest-journal" aria-live="polite">
          <div className="interest-journal__binding" aria-hidden="true" />
          <div className="interest-journal__page interest-journal__page--feature">
            <small>Selected journal entry</small>
            <h2>{selected.title}</h2>
            <ArchiveImage src={selected.image} alt={selected.imageAlt} className="interest-journal__photo" eager />
            <p>{selected.caption}</p>
            <span>Also in the record: electric guitar · chess</span>
          </div>
          <div className="interest-journal__page interest-journal__page--index">
            <p className="interest-journal__instruction">Choose a photograph to turn the page.</p>
            <div className="interest-grid">
              {interestEntries.map((entry) => (
                <button
                  key={entry.id}
                  className="interest-card"
                  type="button"
                  style={{ '--interest-rotation': `${entry.rotation}deg` } as InterestStyle}
                  aria-pressed={entry.id === selected.id}
                  onClick={() => setSelectedId(entry.id)}
                >
                  <ArchiveImage src={entry.image} alt="" />
                  <strong>{entry.title}</strong>
                  <span>{entry.caption}</span>
                </button>
              ))}
            </div>
          </div>
        </article>
      </div>
    </SceneShell>
  )
}
