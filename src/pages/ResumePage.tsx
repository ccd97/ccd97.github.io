import { useState } from "react";
import { Printer, Download, IdCard, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ResumeIcon } from "@/components/resume/ResumeIcon";
import resumeData from "@/data/resume.json";
import type { ResumeData } from "@/types/resume";

const data = resumeData as ResumeData;

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-bold uppercase tracking-wide mt-6 mb-3 border-b pb-1">
      {children}
    </h2>
  );
}

export function ResumePage() {
  const [downloadOpen, setDownloadOpen] = useState(false);

  return (
    <>
      <aside className="fixed top-[5vh] right-0 z-30 no-print">
        <div className="flex flex-col gap-0 bg-background border rounded-l-md shadow-md overflow-hidden">
          <button
            onClick={() => window.open("./index.html")}
            className="flex flex-col items-center gap-1 px-3 py-2 text-xs hover:bg-accent transition-colors"
          >
            <IdCard className="h-4 w-4" />
            Portfolio
          </button>
          <button
            onClick={() => window.print()}
            className="flex flex-col items-center gap-1 px-3 py-2 text-xs hover:bg-accent transition-colors border-t"
          >
            <Printer className="h-4 w-4" />
            Print
          </button>
          <button
            onClick={() => setDownloadOpen(true)}
            className="flex flex-col items-center gap-1 px-3 py-2 text-xs hover:bg-accent transition-colors border-t"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
        </div>
      </aside>

      <div className="max-w-5xl mx-auto my-[5vh] px-6 md:px-12">
        <div className="rounded-lg border bg-card shadow-sm p-8 md:p-12" id="print-area">
          <div className="hidden">{data.seo.join(" ")}</div>

          <header className="text-center mb-8">
            <h1 className="font-bitter text-5xl md:text-6xl text-brand">
              Cyprien Dcunha
            </h1>
            <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm font-semibold">
              <a
                href="mailto:dcunha.cyprien@gmail.com"
                className="hover:underline"
              >
                dcunha.cyprien@gmail.com
              </a>
              <span className="text-muted-foreground">•</span>
              <a href="tel:+9185529XXXXX" className="hover:underline">
                +91 85529XXXXX
              </a>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-[5fr_3fr] gap-10 font-noto">
            <div>
              <SectionTitle>Experiences</SectionTitle>
              <ul className="space-y-4">
                {data.experiences.map((exp, i) => (
                  <li key={i}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-semibold">{exp.firm}</span>
                      <span className="text-sm font-light text-muted-foreground whitespace-nowrap">
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
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{p.name}</span>
                        <Badge variant="outline" className="font-normal">
                          {p.role}
                        </Badge>
                      </div>
                      <span className="text-xs font-light text-muted-foreground whitespace-nowrap">
                        {p.duration}
                      </span>
                    </div>
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

              <SectionTitle>Education</SectionTitle>
              <ul className="space-y-3">
                {data.education.map((e, i) => (
                  <li key={i}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-semibold">{e.school}</span>
                      <span className="text-sm font-light text-muted-foreground whitespace-nowrap">
                        {e.duration}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-2 text-sm">
                      <span>{e.degree}</span>
                      <span>{e.grade}</span>
                    </div>
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
                  <li key={i} className="flex gap-2 text-sm leading-snug">
                    <ChevronRight className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>

              <SectionTitle>Achievements</SectionTitle>
              <ul className="space-y-1.5">
                {data.achievements.map((a, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-snug">
                    <ChevronRight className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={downloadOpen} onOpenChange={setDownloadOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Download</DialogTitle>
            <DialogDescription>
              Download resume is WIP. For now click Print &gt; &apos;Save as
              PDF&apos;
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setDownloadOpen(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
