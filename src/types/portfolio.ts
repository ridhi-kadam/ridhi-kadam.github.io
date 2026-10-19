export type SectionId = 'about' | 'work' | 'interests' | 'skills' | 'contact'

export type SceneStatus = 'homepage-ready' | 'complete'

export type BookPalette = {
  cover: string
  coverDark: string
  foil: string
  page: string
}

export type PortfolioBook = {
  id: SectionId
  number: string
  title: string
  shortTitle: string
  shelfLabel: string
  subtitle: string
  summary: string
  verifiedHighlights: string[]
  palette: BookPalette
  height: number
  width: number
  tilt: number
  shelfOffset: number
  gapAfter: number
  spineVariant: 'classic' | 'ledger' | 'ornate' | 'field' | 'letter'
  sceneStatus: SceneStatus
}

export type PortfolioProfile = {
  name: string
  libraryTitle: string
  librarySubtitle: string
  roleLine: string
  education: {
    school: string
    degree: string
    graduation: string
  }
  contact: {
    email: string
    linkedin: string
    github: string | null
    resume: string
  }
}

export type SkillCategory = {
  label: string
  items: string[]
}

export type ResumeEvidence = {
  currentRoles: string[]
  projects: string[]
  interests: string[]
  skills: SkillCategory[]
}

export type ExperienceCase = {
  id: string
  caseNumber: string
  title: string
  role: string
  dates: string
  category: string
  image: string
  imageAlt: string
  teaser: string
  mystery: string
  investigation: string
  evidence: string[]
  findings: string[]
  artifacts?: Array<{ image: string; alt: string; label: string }>
}

export type InterestEntry = {
  id: string
  title: string
  image: string
  imageAlt: string
  caption: string
  rotation: number
}

export type SkillGroup = 'Product & Design' | 'Languages & Frameworks' | 'ML & Data' | 'Tools & Cloud' | 'Working Style'

export type SkillEntry = {
  name: string
  group: SkillGroup
  blurb: string
  evidence: string[]
}
