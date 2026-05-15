import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";
import path from "node:path";

interface PdfVariant {
  slug: string;
}

const pdfVariants = JSON.parse(
  readFileSync(path.resolve(__dirname, "src/data/pdfVariants.json"), "utf8"),
) as PdfVariant[];

const resumeVariantInputs = Object.fromEntries(
  pdfVariants.flatMap((variant) => [
    [`resume-${variant.slug}`, path.resolve(__dirname, `resume/${variant.slug}.html`)],
    [
      `resume-${variant.slug}-index`,
      path.resolve(__dirname, `resume/${variant.slug}/index.html`),
    ],
  ]),
);

export default defineConfig({
  plugins: [react()],
  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        resume: path.resolve(__dirname, "resume.html"),
        ...resumeVariantInputs,
      },
    },
  },
});
