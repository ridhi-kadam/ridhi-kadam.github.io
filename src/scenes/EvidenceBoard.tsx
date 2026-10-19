import { useCallback, useEffect, useRef, useState } from 'react'
import { ArchiveImage } from '../components/ArchiveImage'
import { CaseFile } from '../components/CaseFile'
import { SceneShell } from '../components/SceneShell'
import { experienceCases } from '../data/sceneContent'

const threads = [
  { className: 'one', cases: ['national-geographic', 'valley-consulting'] },
  { className: 'two', cases: ['valley-consulting', 'nue-io'] },
  { className: 'three', cases: ['nue-io', 'sathersense'] },
  { className: 'four', cases: ['sathersense', 'smartclinical'] },
  { className: 'five', cases: ['smartclinical', 'wested'] },
  { className: 'six', cases: ['wested', 'national-geographic'] },
  { className: 'seven', cases: ['valley-consulting', 'smartclinical'] },
]

export default function EvidenceBoard({ titleId }: { titleId: string }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([])
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLElement>(null)
  const selectedCase = selectedIndex === null ? null : experienceCases[selectedIndex]

  const closeCase = useCallback(() => {
    const returnIndex = selectedIndex
    setSelectedIndex(null)
    if (returnIndex !== null) window.requestAnimationFrame(() => triggerRefs.current[returnIndex]?.focus())
  }, [selectedIndex])

  useEffect(() => {
    if (selectedIndex === null) return
    closeRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopImmediatePropagation()
        closeCase()
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return

      const controls = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not(:disabled), a[href]'))
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closeCase, selectedIndex])

  const moveCase = (direction: -1 | 1) => {
    if (selectedIndex === null) return
    setSelectedIndex((selectedIndex + direction + experienceCases.length) % experienceCases.length)
  }

  return (
    <SceneShell
      scene="work"
      eyebrow="Investigation board · Six active files"
      title="Projects & Experience"
      intro="Follow the red thread, then open any clipping for the full report."
      titleId={titleId}
    >
      <div className="evidence-board" aria-label="Interactive board of project and experience cases">
        <div className="evidence-board__legend" aria-hidden="true">
          <span>PINNED EVIDENCE</span><i /> <span>SELECT A FILE</span>
        </div>
        <div className="evidence-threads" aria-hidden="true">
          {threads.map((thread) => (
            <span
              key={thread.className}
              className={`evidence-thread evidence-thread--${thread.className}`}
              data-active={hoveredId && thread.cases.includes(hoveredId) ? 'true' : 'false'}
            />
          ))}
        </div>
        <div className="evidence-board__cases">
          {experienceCases.map((item, index) => (
            <CaseFile
              ref={(element) => { triggerRefs.current[index] = element }}
              key={item.id}
              item={item}
              index={index}
              active={hoveredId === item.id}
              onOpen={() => setSelectedIndex(index)}
              onEnter={() => setHoveredId(item.id)}
              onLeave={() => setHoveredId(null)}
            />
          ))}
        </div>
      </div>

      {selectedCase && selectedIndex !== null && (
        <div className="case-dossier-backdrop" onPointerDown={(event) => {
          if (event.target === event.currentTarget) closeCase()
        }}>
          <section
            ref={dialogRef}
            className="case-dossier"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`case-title-${selectedCase.id}`}
          >
            <button ref={closeRef} className="case-dossier__close" type="button" onClick={closeCase}>
              Close case <span aria-hidden="true">×</span>
            </button>
            <header className="case-dossier__header">
              <div>
                <small>{selectedCase.caseNumber} · {selectedCase.category}</small>
                <h2 id={`case-title-${selectedCase.id}`}>{selectedCase.title}</h2>
                <p>{selectedCase.role} · {selectedCase.dates}</p>
              </div>
              <span>CONFIDENTIAL<br />CASE REPORT</span>
            </header>

            <div className="case-dossier__body">
              <ArchiveImage src={selectedCase.image} alt={selectedCase.imageAlt} className="case-dossier__hero" />
              <div className="case-dossier__report">
                <section><small>01 / Mystery</small><h3>The problem</h3><p>{selectedCase.mystery}</p></section>
                <section><small>02 / Investigation</small><h3>Ridhi’s role</h3><p>{selectedCase.investigation}</p></section>
                <section><small>03 / Evidence</small><h3>Technical approach</h3><ul>{selectedCase.evidence.map((item) => <li key={item}>{item}</li>)}</ul></section>
                <section><small>04 / Findings</small><h3>Impact</h3><ul>{selectedCase.findings.map((item) => <li key={item}>{item}</li>)}</ul></section>
              </div>
            </div>

            {selectedCase.artifacts?.map((artifact) => (
              <figure className="case-dossier__artifact" key={artifact.image}>
                <ArchiveImage src={artifact.image} alt={artifact.alt} />
                <figcaption>{artifact.label}</figcaption>
              </figure>
            ))}

            <footer className="case-dossier__footer">
              <button type="button" onClick={() => moveCase(-1)}>← Previous case</button>
              <span>{selectedIndex + 1} / {experienceCases.length}</span>
              <button type="button" onClick={() => moveCase(1)}>Next case →</button>
            </footer>
          </section>
        </div>
      )}
    </SceneShell>
  )
}
