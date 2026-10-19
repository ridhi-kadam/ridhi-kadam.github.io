import { lazy, Suspense } from 'react'
import type { SectionId } from '../types/portfolio'

const AboutScene = lazy(() => import('./AboutScene'))
const EvidenceBoard = lazy(() => import('./EvidenceBoard'))
const FiresideScene = lazy(() => import('./FiresideScene'))
const SkillsTerminal = lazy(() => import('./SkillsTerminal'))
const ContactLetter = lazy(() => import('./ContactLetter'))

export function SceneRenderer({ section, titleId }: { section: SectionId; titleId: string }) {
  const scene = (() => {
    switch (section) {
      case 'about': return <AboutScene titleId={titleId} />
      case 'work': return <EvidenceBoard titleId={titleId} />
      case 'interests': return <FiresideScene titleId={titleId} />
      case 'skills': return <SkillsTerminal titleId={titleId} />
      case 'contact': return <ContactLetter titleId={titleId} />
    }
  })()

  return <Suspense fallback={<div className="scene-content-loading" role="status">Opening case file…</div>}>{scene}</Suspense>
}
