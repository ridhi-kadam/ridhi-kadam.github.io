import { ArchiveImage } from '../components/ArchiveImage'
import { SceneShell } from '../components/SceneShell'
import { aboutBlurb } from '../data/sceneContent'

export default function AboutScene({ titleId }: { titleId: string }) {
  return (
    <SceneShell
      scene="about"
      eyebrow="Detective’s desk · Subject file 01"
      title="The Subject"
      intro="A closer look at the person behind the evidence."
      titleId={titleId}
    >
      <div className="detective-desk">
        <div className="desk-photos" aria-label="Two photographs of Ridhi">
          <figure className="desk-photo desk-photo--headshot">
            <ArchiveImage
              src="/assets/photos/headshot.jpg"
              alt="Portrait of Ridhi smiling outdoors on the UC Berkeley campus."
              eager
            />
            <figcaption>Portrait · Ridhi Kadam</figcaption>
          </figure>
          <figure className="desk-photo desk-photo--hiking">
            <ArchiveImage
              src="/assets/photos/ridhi-hiking.jpg"
              alt="Ridhi ziplining beside a waterfall and dense green foliage."
              eager
            />
            <figcaption>Field note · in her element</figcaption>
          </figure>
          <span className="desk-paperclip" aria-hidden="true" />
          <span className="desk-stamp" aria-hidden="true">VERIFIED<br />BERKELEY</span>
        </div>

        <article className="subject-dossier">
          <div className="subject-dossier__label">
            <span>Personal dossier</span>
            <span>RK / 2028</span>
          </div>
          <div className="subject-dossier__heading">
            <p>UC Berkeley · Class of 2028</p>
            <h2>Ridhi Kadam</h2>
            <span>Data Science & Economics</span>
          </div>
          <div className="subject-dossier__copy">
            {aboutBlurb.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <dl className="subject-facts">
            <div><dt>Education</dt><dd>University of California, Berkeley</dd></div>
            <div><dt>Communities</dt><dd>Data Science Society · Valley Consulting Group</dd></div>
            <div><dt>Current focus</dt><dd>Product Management · Data Analytics</dd></div>
          </dl>
          <span className="coffee-ring" aria-hidden="true" />
        </article>

        <div className="desk-magnifier" aria-hidden="true"><span /></div>
        <div className="desk-pen" aria-hidden="true" />
      </div>
    </SceneShell>
  )
}
