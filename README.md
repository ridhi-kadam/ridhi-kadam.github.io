# Ridhi Kadam — The Curious Casebook

An interactive mystery-themed portfolio presented as a warm detective's library. The site is built with React, TypeScript, Vite, Tailwind CSS, and GSAP. Five tactile volumes open through a reversible 3D page-turn sequence into complete, résumé-backed scenes.

## Run locally

Install the dependencies once:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Open the local address Vite prints in the terminal (normally `http://localhost:5173`). Changes refresh automatically.

To check the production version before publishing:

```bash
npm run build
npm run preview
```

## Edit portfolio content

Verified profile content and book styling live in `src/data/portfolio.ts`. About copy, experience case files, interest captions, and skill entries live in `src/data/sceneContent.ts`. Shared types are in `src/types/portfolio.ts`. The library and section interactions are organized across `src/scenes/` and `src/components/`.

The supplied résumé is available at `public/Ridhi_Kadam_Resume_PM.pdf`. Optimized copies of the supplied photography and work artifacts are stored under `public/assets/`. A GitHub profile is intentionally omitted until a confirmed URL is provided.

## Current implementation stage

- [x] Five-volume cinematic library homepage
- [x] Hover, focus, arrow-key, touch, and direct-index navigation
- [x] Reversible GSAP book pull, cover opening, and sequential page flips
- [x] URL history, browser back/forward, Escape-to-close, and focus restoration
- [x] Responsive shelf and reduced-motion fallback
- [x] Detective's desk, two-photo layout, and full About dossier
- [x] Corkboard, connected case files, and six project/experience dossiers
- [x] Fireside interest journal with supplied personal media
- [x] Searchable and filterable skills terminal
- [x] Door, wax-sealed contact letter, and copy-email interaction

## Publish with GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and deploys the site whenever `main` is pushed. In the GitHub repository, open **Settings → Pages** and set **Source** to **GitHub Actions**. The user-site repository name means Vite can safely build with a root (`/`) base path. Nothing is pushed or deployed automatically from local development.
