import type { PortfolioBook, PortfolioProfile, ResumeEvidence, SectionId } from '../types/portfolio'

// All factual copy in this file is sourced from Ridhi_Kadam_Resume(PM).pdf.
// Missing public links or personal narrative are deliberately left as explicit placeholders.
export const profile: PortfolioProfile = {
  name: 'Ridhi Kadam',
  libraryTitle: 'Welcome to Ridhi Kadam’s Library',
  librarySubtitle: 'Investigate into the person behind the portfolio',
  roleLine: 'Data Science & Economics · Product · Machine Learning',
  education: {
    school: 'University of California, Berkeley',
    degree: 'B.A. Data Science & Economics — Business and Industrial Analytics',
    graduation: 'May 2028',
  },
  contact: {
    email: 'ridhi_kadam@berkeley.edu',
    linkedin: 'https://www.linkedin.com/in/ridhi-kadam',
    github: null, // Placeholder: add a confirmed profile URL before the Contact scene is published.
    resume: '/Ridhi_Kadam_Resume_PM.pdf',
  },
}

export const resumeEvidence: ResumeEvidence = {
  currentRoles: [
    'Machine Learning Engineer (Contract), National Geographic',
    'Senior Technical Consultant, Valley Consulting Group',
  ],
  projects: [
    'Marine biodiversity classification with VLMs and clustering',
    'Natural-language pricing automation through an MCP server',
    'Education RAG and serverless document pipelines',
    'SatherSense accessible indoor navigation',
    'SmartClinical predictive resource allocation',
  ],
  interests: [
    'Hiking',
    'Reading thrillers and writing book reviews',
    'Electric guitar',
    'Traveling',
    'Volunteering',
    'Chess',
  ],
  skills: [
    { label: 'Languages', items: ['Python', 'SQL', 'JavaScript', 'TypeScript', 'Java'] },
    { label: 'ML & Data', items: ['TensorFlow', 'Scikit-learn', 'OpenCV', 'Pandas', 'NumPy', 'RAG', 'MCP'] },
    { label: 'Product & Design', items: ['Figma', 'A/B Testing', 'Agile', 'Jira', 'Lean Six Sigma'] },
    { label: 'Tools', items: ['Tableau', 'Power BI', 'Microsoft Azure', 'AWS Lambda', 'Excel', 'CAD'] },
  ],
}

export const portfolioBooks: PortfolioBook[] = [
  {
    id: 'about',
    number: 'I',
    title: 'About Me',
    shortTitle: 'About',
    shelfLabel: 'The Subject',
    subtitle: 'Begin with the person behind the evidence.',
    summary: 'A UC Berkeley student studying Data Science and Economics, with a domain emphasis in Business and Industrial Analytics.',
    verifiedHighlights: [
      'University of California, Berkeley',
      'B.A. Data Science & Economics',
      'Expected graduation: May 2028',
    ],
    palette: { cover: '#5f1317', coverDark: '#270a0d', foil: '#c99a57', page: '#e9dcc0' },
    height: 326,
    width: 118,
    tilt: -1.2,
    shelfOffset: 2,
    gapAfter: 2,
    spineVariant: 'classic',
    sceneStatus: 'complete',
  },
  {
    id: 'work',
    number: 'II',
    title: 'Projects & Experience',
    shortTitle: 'Work',
    shelfLabel: 'Open Cases',
    subtitle: 'Trace the red thread across selected investigations.',
    summary: 'Verified work across marine biodiversity ML, product consulting, pricing automation, education RAG, and accessible navigation.',
    verifiedHighlights: [
      'National Geographic · Machine Learning Engineer',
      'Valley Consulting Group · Senior Technical Consultant',
      'Nue.io and WestEd · Product and data engineering',
    ],
    palette: { cover: '#274038', coverDark: '#101e1a', foil: '#d5ae6a', page: '#eadfca' },
    height: 340,
    width: 135,
    tilt: .5,
    shelfOffset: 0,
    gapAfter: 1,
    spineVariant: 'ledger',
    sceneStatus: 'complete',
  },
  {
    id: 'interests',
    number: 'III',
    title: 'Interests',
    shortTitle: 'Interests',
    shelfLabel: 'Off the Record',
    subtitle: 'Follow the quieter clues beyond the work.',
    summary: 'A scrapbook of hiking, reading, travel, dance, volunteering, escape rooms, time with family, and other off-the-record moments.',
    verifiedHighlights: ['Hiking and traveling', 'Thriller reading and book reviews', 'Electric guitar, volunteering, and chess'],
    palette: { cover: '#5b241e', coverDark: '#28100d', foil: '#cda568', page: '#e8d9ba' },
    height: 318,
    width: 116,
    tilt: -.6,
    shelfOffset: 3,
    gapAfter: 2,
    spineVariant: 'ornate',
    sceneStatus: 'complete',
  },
  {
    id: 'skills',
    number: 'IV',
    title: 'Skills',
    shortTitle: 'Skills',
    shelfLabel: 'Methods & Tools',
    subtitle: 'Inspect the instruments used to solve each case.',
    summary: 'A verified toolkit spanning Python, SQL, machine learning, RAG, product design, analytics, cloud systems, and visualization.',
    verifiedHighlights: ['Python, SQL, JavaScript, TypeScript, and Java', 'TensorFlow, Scikit-learn, OpenCV, RAG, and MCP', 'Figma, Tableau, Power BI, Azure, and AWS'],
    palette: { cover: '#243c46', coverDark: '#0d1c22', foil: '#d1ad72', page: '#eadfc8' },
    height: 336,
    width: 126,
    tilt: .9,
    shelfOffset: 1,
    gapAfter: 1,
    spineVariant: 'field',
    sceneStatus: 'complete',
  },
  {
    id: 'contact',
    number: 'V',
    title: 'Contact',
    shortTitle: 'Contact',
    shelfLabel: 'Correspondence',
    subtitle: 'Leave a note for the next investigation.',
    summary: 'Verified routes to make contact: Berkeley email, LinkedIn, and the supplied résumé. A GitHub profile URL is still awaiting confirmation.',
    verifiedHighlights: ['ridhi_kadam@berkeley.edu', 'linkedin.com/in/ridhi-kadam', 'Résumé available in the archive'],
    palette: { cover: '#633a2d', coverDark: '#2d1710', foil: '#d9b170', page: '#eadcc1' },
    height: 324,
    width: 118,
    tilt: -.8,
    shelfOffset: 2,
    gapAfter: 0,
    spineVariant: 'letter',
    sceneStatus: 'complete',
  },
]

export const isSectionId = (value: string): value is SectionId =>
  portfolioBooks.some((book) => book.id === value)

export const getBook = (id: SectionId) =>
  portfolioBooks.find((book) => book.id === id) as PortfolioBook
