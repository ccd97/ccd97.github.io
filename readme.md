# My Portfolio

- Portfolio – [cyprien.in](https://cyprien.in/)
- Resume – [cyprien.in/resume.html](https://cyprien.in/resume.html)

Built with [Vite](https://vitejs.dev/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/), and [shadcn/ui](https://ui.shadcn.com/).

## Development

```bash
npm install
npm run dev       # start dev server (http://localhost:5173)
npm run build     # production build → dist/
npm run preview   # serve the production build locally
```

## Resume PDF generation

Resume PDFs are built from LaTeX sources in `src/resume-sources/`. Install a TeX distribution with `latexmk` before running the PDF generator locally:

```bash
# macOS
brew install --cask mactex

# Ubuntu / Debian
sudo apt-get update
sudo apt-get install -y latexmk texlive-fonts-extra texlive-latex-extra

# Windows
winget install MiKTeX.MiKTeX
```

Then generate the PDFs:

```bash
npm run generate:resume-pdfs
```

Generated PDFs are written to `public/resumes/`. `npm run build` runs this automatically before building the site; GitHub Pages CI installs the Linux TeX packages in `.github/workflows/deploy.yml`.

## Resume variants

Resume PDF variants are defined in [`src/data/pdfVariants.json`](src/data/pdfVariants.json).
To add a new shareable variant, add a LaTeX project under `src/resume-sources/<slug>/` and add an entry like:

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

One-time setup: in the repo's **Settings → Pages**, set **Source** to **GitHub Actions** and configure the custom domain as `cyprien.in`.
