import { spawn } from "node:child_process";
import { constants, existsSync } from "node:fs";
import { access, copyFile, mkdir, readFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(rootDir, "src/resume-sources");
const buildRoot = path.join(rootDir, ".resume-build");
const outputDir = path.join(rootDir, "public/resumes");
const latexCommand = process.env.RESUME_LATEX_COMMAND ?? "latexmk";

const variants = JSON.parse(
  await readFile(path.join(rootDir, "src/data/pdfVariants.json"), "utf8"),
);

function validateVariant(variant) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(variant.slug)) {
    throw new Error(`Invalid resume variant slug: ${variant.slug}`);
  }
  if (!variant.file?.endsWith(".pdf")) {
    throw new Error(`Resume variant "${variant.slug}" must include a PDF file name`);
  }
}

async function assertFileExists(filePath, description) {
  try {
    await access(filePath, constants.R_OK);
  } catch (err) {
    if (err.code === "ENOENT") {
      throw new Error(`${description} does not exist: ${path.relative(rootDir, filePath)}`);
    }
    throw err;
  }
}

function latexEnv() {
  const pathEntries = (process.env.PATH ?? "").split(path.delimiter).filter(Boolean);
  const macTexBin = "/Library/TeX/texbin";

  if (process.platform === "darwin" && existsSync(macTexBin) && !pathEntries.includes(macTexBin)) {
    pathEntries.unshift(macTexBin);
  }

  return {
    ...process.env,
    PATH: pathEntries.join(path.delimiter),
  };
}

function runLatex(sourceDir, buildDir, jobName) {
  const args = [
    "-pdf",
    "-interaction=nonstopmode",
    "-halt-on-error",
    "-file-line-error",
    `-jobname=${jobName}`,
    `-outdir=${buildDir}`,
    "resume.tex",
  ];

  return new Promise((resolve, reject) => {
    const child = spawn(latexCommand, args, {
      cwd: sourceDir,
      env: latexEnv(),
      stdio: "inherit",
    });

    child.on("error", (err) => {
      if (err.code === "ENOENT") {
        reject(
          new Error(
            `Could not find "${latexCommand}". Install TeX Live/latexmk or set RESUME_LATEX_COMMAND.`,
          ),
        );
        return;
      }
      reject(err);
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${latexCommand} failed with exit code ${code}`));
      }
    });
  });
}

try {
  await mkdir(outputDir, { recursive: true });
  await rm(buildRoot, { recursive: true, force: true });
  await mkdir(buildRoot, { recursive: true });

  for (const variant of variants) {
    validateVariant(variant);

    const sourceDir = path.join(sourceRoot, variant.slug);
    const entrypoint = path.join(sourceDir, "resume.tex");
    const buildDir = path.join(buildRoot, variant.slug);
    const jobName = path.basename(variant.file, ".pdf");
    const builtPdf = path.join(buildDir, `${jobName}.pdf`);
    const outputPdf = path.join(outputDir, variant.file);

    await assertFileExists(entrypoint, `LaTeX entrypoint for "${variant.slug}"`);
    await mkdir(buildDir, { recursive: true });

    console.log(
      `Generating ${path.relative(rootDir, outputPdf)} from ${path.relative(rootDir, entrypoint)}`,
    );
    await runLatex(sourceDir, buildDir, jobName);
    await assertFileExists(builtPdf, `Generated PDF for "${variant.slug}"`);
    await copyFile(builtPdf, outputPdf);
  }

  await rm(buildRoot, { recursive: true, force: true });

  console.log(`Generated ${variants.length} resume PDF(s) in ${path.relative(rootDir, outputDir)}`);
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err));
  process.exitCode = 1;
}
