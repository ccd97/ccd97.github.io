# My Portfolio

- Portfolio – [ccd97.github.io](https://ccd97.github.io/)
- Résumé – [ccd97.github.io/resume.html](https://ccd97.github.io/resume.html)

Built with [Vite](https://vitejs.dev/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/), and [shadcn/ui](https://ui.shadcn.com/).

## Development

```bash
npm install
npm run dev       # start dev server (http://localhost:5173)
npm run build     # production build → dist/
npm run preview   # serve the production build locally
```

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
