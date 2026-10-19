import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { SceneShell } from '../components/SceneShell'
import { skillEntries, skillGroups } from '../data/sceneContent'
import type { SkillGroup } from '../types/portfolio'

type SkillFilter = 'All' | SkillGroup

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>
  const needle = query.trim().toLowerCase()
  const parts: ReactNode[] = []
  let cursor = 0
  let match = text.toLowerCase().indexOf(needle)

  while (match !== -1) {
    if (match > cursor) parts.push(text.slice(cursor, match))
    parts.push(<mark key={`${match}-${text}`}>{text.slice(match, match + needle.length)}</mark>)
    cursor = match + needle.length
    match = text.toLowerCase().indexOf(needle, cursor)
  }
  parts.push(text.slice(cursor))
  return <>{parts}</>
}

export default function SkillsTerminal({ titleId }: { titleId: string }) {
  const [filter, setFilter] = useState<SkillFilter>('All')
  const [query, setQuery] = useState('')

  const visibleSkills = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return skillEntries.filter((skill) => {
      const matchesGroup = filter === 'All' || skill.group === filter
      const searchable = `${skill.name} ${skill.group} ${skill.blurb} ${skill.evidence.join(' ')}`.toLowerCase()
      return matchesGroup && (!normalized || searchable.includes(normalized))
    })
  }, [filter, query])

  return (
    <SceneShell
      scene="skills"
      eyebrow="Investigation terminal · Methods archive"
      title="Skills"
      intro="A searchable record of the product, technical, analytical, and collaborative methods behind the cases."
      titleId={titleId}
    >
      <div className="skills-terminal">
        <div className="skills-terminal__bar">
          <span>R.K. ARCHIVAL RESEARCH SYSTEM</span>
          <span>INDEX STATUS · ONLINE</span>
        </div>
        <div className="skills-terminal__search">
          <label htmlFor="skill-search">Search the archive</label>
          <div><span aria-hidden="true" /><input id="skill-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try Python, product, AWS…" /></div>
        </div>
        <div className="skills-terminal__tabs" aria-label="Filter skills by category">
          {(['All', ...skillGroups] as SkillFilter[]).map((group) => (
            <button key={group} type="button" aria-pressed={filter === group} onClick={() => setFilter(group)}>{group}</button>
          ))}
        </div>

        <div className="skills-terminal__summary">
          <div><small>Current file</small><strong>{filter === 'All' ? 'Complete toolkit' : filter}</strong></div>
          <p>{filter === 'All' ? 'From discovery and roadmapping to the systems used to prototype, analyze, test, and ship.' : `Verified entries filed under ${filter.toLowerCase()}.`}</p>
          <span aria-live="polite">{visibleSkills.length} matching entries</span>
        </div>

        {visibleSkills.length ? (
          <ol className="skill-results">
            {visibleSkills.map((skill, index) => (
              <li key={skill.name}>
                <span className="skill-results__number">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <small><Highlight text={skill.group} query={query} /></small>
                  <h2><Highlight text={skill.name} query={query} /></h2>
                  <p><Highlight text={skill.blurb} query={query} /></p>
                  <div className="skill-results__evidence"><b>Used in</b>{skill.evidence.map((item) => <span key={item}><Highlight text={item} query={query} /></span>)}</div>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="skills-terminal__empty" role="status"><strong>No file found.</strong><span>Try another term or select “All”.</span></div>
        )}
      </div>
    </SceneShell>
  )
}
