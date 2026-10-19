import type { ReactNode } from 'react'

type SceneShellProps = {
  scene: string
  eyebrow: string
  title: string
  intro: string
  titleId: string
  children: ReactNode
}

export function SceneShell({ scene, eyebrow, title, intro, titleId, children }: SceneShellProps) {
  return (
    <section className={`scene-shell scene-shell--${scene}`}>
      <div className="scene-shell__grain" aria-hidden="true" />
      <header className="scene-masthead">
        <p><span />{eyebrow}<span /></p>
        <h1 id={titleId} tabIndex={-1} data-scene-focus>{title}</h1>
        <div className="scene-masthead__rule" aria-hidden="true"><i /><b /><i /></div>
        <p className="scene-masthead__intro">{intro}</p>
      </header>
      {children}
    </section>
  )
}
