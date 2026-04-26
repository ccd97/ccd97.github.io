import { useEffect, useState } from "react";
import { Check, Download, IdCard, Link as LinkIcon, ChevronRight } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { ResumeIcon } from "@/components/resume/ResumeIcon";
import { ResumeSelector } from "@/components/resume/ResumeSelector";
import { PdfViewer } from "@/components/resume/PdfViewer";
import resumeData from "@/data/resume.json";
import portfolioData from "@/data/portfolio.json";
import type { ResumeData } from "@/types/resume";
import type { PortfolioData } from "@/types/portfolio";

const data = resumeData as ResumeData;
const { hero } = portfolioData as PortfolioData;

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-bold uppercase tracking-wide mt-6 mb-3 border-b pb-1">
      {children}
    </h2>
  );
}

export function ResumePage() {
  const [selected, setSelected] = useState<string>("html");
  const [copied, setCopied] = useState(false);
  const [fromDirectLink, setFromDirectLink] = useState(false);
  const variant = data.pdfVariants.find((v) => v.slug === selected);

  const shareUrl = (() => {
    if (typeof window === "undefined") return "";
    const base = `${window.location.origin}${window.location.pathname}`;
    return variant ? `${base}#pdf=${variant.slug}` : base;
  })();

  const handleShare = async () => {
    const shareData = {
      title: variant ? `${hero.name} — ${variant.label} resume` : `${hero.name} — Resume`,
      url: shareUrl,
    };

    if (typeof navigator.share === "function" && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if ((err as DOMException)?.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt("Copy this link:", shareUrl);
    }
  };

  useEffect(() => {
    const match = window.location.hash.match(/pdf=([\w-]+)/);
    if (!match) return;
    if (data.pdfVariants.some((v) => v.slug === match[1])) {
      setSelected(match[1]);
      setFromDirectLink(true);
    }
  }, []);

  const handleDownload = async () => {
    if (variant) {
      const a = document.createElement("a");
      a.href = `/resumes/${variant.file}`;
      a.download = variant.file;
      a.click();
      return;
    }

    const element = document.getElementById("print-area");
    if (!element) return;

    const captureWidth = 1024;
    const prevWidth = element.style.width;
    const prevBg = element.style.backgroundColor;
    element.style.width = `${captureWidth}px`;
    element.style.backgroundColor = "#ffffff";

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        windowWidth: captureWidth,
        width: captureWidth,
        backgroundColor: "#ffffff",
      });

      const pxToIn = (px: number) => px / 96;
      const pageWidthIn = pxToIn(captureWidth);
      const pageHeightIn = pxToIn(canvas.height / 2);

      const pdf = new jsPDF({
        unit: "in",
        format: [pageWidthIn, pageHeightIn],
        orientation: "portrait",
      });
      pdf.addImage(
        canvas.toDataURL("image/jpeg", 0.98),
        "JPEG",
        0,
        0,
        pageWidthIn,
        pageHeightIn,
      );
      pdf.save(`${hero.name.replace(/\s+/g, "-")}-Resume.pdf`);
    } finally {
      element.style.width = prevWidth;
      element.style.backgroundColor = prevBg;
    }
  };

  return (
    <>
      <aside className="fixed z-30 bottom-4 left-1/2 -translate-x-1/2 md:bottom-auto md:left-auto md:translate-x-0 md:top-[5vh] md:right-0">
        <div className="flex flex-row md:flex-col gap-0 bg-background border rounded-md md:rounded-l-md md:rounded-r-none shadow-md overflow-hidden">
          <button
            onClick={() => window.open("./index.html")}
            className="flex flex-col items-center gap-1 px-3 py-2 text-xs hover:bg-muted active:bg-muted/80 transition-colors"
          >
            <IdCard className="h-4 w-4" />
            Portfolio
          </button>
          <button
            onClick={handleShare}
            title={shareUrl}
            className="flex flex-col items-center gap-1 px-3 py-2 text-xs hover:bg-muted active:bg-muted/80 transition-colors border-l md:border-l-0 md:border-t"
          >
            {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
            {copied ? "Copied" : "Share"}
          </button>
          <button
            onClick={handleDownload}
            className="flex flex-col items-center gap-1 px-3 py-2 text-xs hover:bg-muted active:bg-muted/80 transition-colors border-l md:border-l-0 md:border-t"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
        </div>
      </aside>

      <div className="max-w-5xl mx-auto mt-[5vh] mb-28 md:mb-[10vh] px-4 sm:px-6 md:px-12">
        {!fromDirectLink && (
          <div className="mb-4 flex justify-end">
            <ResumeSelector
              variants={data.pdfVariants}
              value={selected}
              onChange={setSelected}
            />
          </div>
        )}

        {variant ? (
          <div className="rounded-lg border shadow-sm overflow-hidden bg-white">
            <PdfViewer key={variant.slug} src={`/resumes/${variant.file}`} />
          </div>
        ) : (
        <div className="rounded-lg border bg-white shadow-sm p-5 pb-10 sm:p-8 sm:pb-14 md:p-12 md:pb-20" id="print-area">
          <div className="hidden">{data.seo.join(" ")}</div>

          <header className="text-center mb-8">
            <h1 className="font-hero text-5xl md:text-6xl tracking-tight text-brand">
              {hero.name}
            </h1>
            <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm font-semibold">
              <a
                href="mailto:dcunha.cyprien@gmail.com"
                className="hover:underline"
              >
                dcunha.cyprien@gmail.com
              </a>
              <span className="text-muted-foreground">•</span>
              <a href="tel:+918552955189" className="hover:underline">
                +91 8552955189
              </a>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-[5fr_3fr] gap-10 font-sans">
            <div>
              <SectionTitle>Experiences</SectionTitle>
              <ul className="space-y-4">
                {data.experiences.map((exp, i) => (
                  <li key={i}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                      <span className="font-semibold">{exp.firm}</span>
                      <span className="text-sm font-light text-muted-foreground">
                        {exp.duration}
                      </span>
                    </div>
                    <div className="text-sm">{exp.role}</div>
                  </li>
                ))}
              </ul>

              <SectionTitle>Projects</SectionTitle>
              <ul className="space-y-4">
                {data.projects.map((p, i) => (
                  <li key={i}>
                    <div className="font-semibold">{p.name}</div>
                    <ul className="mt-1 space-y-1">
                      {p.description.map((line, j) => (
                        <li
                          key={j}
                          className="flex gap-2 text-sm leading-relaxed"
                        >
                          <ChevronRight className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                          <span dangerouslySetInnerHTML={{ __html: line }} />
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionTitle>Contacts</SectionTitle>
              <ul className="space-y-2">
                {data.contacts.map((c, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <ResumeIcon name={c.icon} />
                    <a href={c.url} className="text-sm hover:underline">
                      {c.text}
                    </a>
                  </li>
                ))}
              </ul>

              <SectionTitle>Skills</SectionTitle>
              <ul className="space-y-1.5">
                {data.skills.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed">
                    <ChevronRight className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>

              <SectionTitle>Achievements</SectionTitle>
              <ul className="space-y-1.5">
                {data.achievements.map((a, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed">
                    <ChevronRight className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>

              <SectionTitle>Leadership & Contributions</SectionTitle>
              <ul className="space-y-1.5">
                {data.leadership.map((l, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed">
                    <ChevronRight className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                    <span>{l}</span>
                  </li>
                ))}
              </ul>

              <SectionTitle>Education</SectionTitle>
              <ul className="space-y-3">
                {data.education.map((e, i) => (
                  <li key={i}>
                    <div className="font-semibold leading-relaxed">{e.school}</div>
                    <div className="text-sm">{e.degree}</div>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 text-sm">
                      <span className="font-light text-muted-foreground">
                        {e.duration}
                      </span>
                      <span>{e.grade}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        )}
      </div>
    </>
  );
}
