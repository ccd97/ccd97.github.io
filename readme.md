# My Portfolio

- Portfolio – [ccd97.github.io](https://ccd97.github.io/)
- Resume – [ccd97.github.io/resume.html](https://ccd97.github.io/resume.html)

Built with [Vite](https://vitejs.dev/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/), and [shadcn/ui](https://ui.shadcn.com/).

## Development

```bash
npm install
npm run dev       # start dev server (http://localhost:5173)
npm run build     # production build → dist/
npm run preview   # serve the production build locally
```

## Resume variants

Resume PDF variants are defined in [`src/data/pdfVariants.json`](src/data/pdfVariants.json).
To add a new shareable variant, place the PDF in `public/resumes/` and add an entry like:

```json
{ "slug": "ml", "label": "ML-focused", "file": "ccd97-resume-ml.pdf" }
```

`npm run dev` and `npm run build` automatically generate clean resume pages and update `public/sitemap.xml`.
Use the generated `/resume/<slug>` URL when sharing on LinkedIn, Facebook, or other social previews.

## Project structure

```
src/
├── components/
│   ├── portfolio/     # portfolio page components
│   ├── resume/        # resume page components
│   └── ui/            # shadcn/ui primitives
├── data/              # fallback JSON used when remote APIs are unreachable
├── lib/               # utilities, fetchers, formatters
├── pages/             # PortfolioPage, ResumePage
├── types/             # shared TypeScript types
├── main.tsx           # entry for index.html
├── resume.tsx         # entry for resume.html
└── index.css          # Tailwind + CSS variables
```

## Deployment

Deployed automatically to GitHub Pages via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) on every push to `master`.

One-time setup: in the repo's **Settings → Pages**, set **Source** to **GitHub Actions**.
