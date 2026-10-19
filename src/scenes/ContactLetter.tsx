import { useState } from 'react'
import { SceneShell } from '../components/SceneShell'
import { profile } from '../data/portfolio'

export default function ContactLetter({ titleId }: { titleId: string }) {
  const [opened, setOpened] = useState(false)
  const [copyStatus, setCopyStatus] = useState('Copy email')

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.contact.email)
      setCopyStatus('Email copied')
    } catch {
      setCopyStatus('Use the email link')
    }
  }

  return (
    <SceneShell
      scene="contact"
      eyebrow="Library hallway · Private correspondence"
      title="Contact"
      intro="One last door. One letter addressed to the next collaborator."
      titleId={titleId}
    >
      <div className="contact-hallway" data-opened={opened ? 'true' : 'false'}>
        <div className="contact-door" aria-hidden="true"><span /><i /></div>
        {!opened ? (
          <button className="sealed-letter" type="button" onClick={() => setOpened(true)} aria-label="Break the wax seal and read Ridhi’s contact letter">
            <span className="sealed-letter__paper">Private correspondence</span>
            <span className="sealed-letter__seal" aria-hidden="true">RK</span>
            <small>Break seal to open</small>
          </button>
        ) : (
          <article className="contact-letter">
            <div className="contact-letter__crest" aria-hidden="true">RK</div>
            <small>Private correspondence · Opened</small>
            <h2>Contact Options</h2>
            <p><strong>Email:</strong> <a href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a>, the fastest way to reach her.</p>
            <p><strong>LinkedIn:</strong> <a href={profile.contact.linkedin} target="_blank" rel="noreferrer">http://www.linkedin.com/in/ridhi-kadam</a></p>
            <p><strong>Status:</strong> Open to PM and Analytics internships.</p>
            <div className="contact-letter__actions">
              <a href={`mailto:${profile.contact.email}`}>Compose email</a>
              <button type="button" onClick={copyEmail}>{copyStatus}</button>
            </div>
            <button className="contact-letter__fold" type="button" onClick={() => setOpened(false)}>Fold the letter</button>
          </article>
        )}
      </div>
    </SceneShell>
  )
}
