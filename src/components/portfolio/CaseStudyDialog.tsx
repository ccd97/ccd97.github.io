import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MetricStat } from "@/components/portfolio/MetricStat";
import type { CaseStudy } from "@/types/portfolio";

interface Props {
  caseStudy: CaseStudy | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CaseStudyDialog({ caseStudy, open, onOpenChange }: Props) {
  if (!caseStudy) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90dvh] overflow-y-auto gap-0 p-0">
        <DialogHeader className="px-6 pt-8 pb-6 pr-14 md:px-10 md:pt-10 md:pb-7 md:pr-16 border-b border-border/60 space-y-0 gap-0">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            <span className="text-brand">{caseStudy.org}</span>
            <span className="mx-2 text-muted-foreground/50">/</span>
            <span>{caseStudy.role}</span>
            <span className="mx-2 text-muted-foreground/50">/</span>
            <span>{caseStudy.duration}</span>
          </div>
          <DialogTitle className="!mt-4 font-card text-2xl md:text-3xl leading-tight">
            {caseStudy.title}
          </DialogTitle>
          <DialogDescription className="!mt-3 text-sm md:text-[15px] text-foreground/80 leading-relaxed max-w-2xl">
            {caseStudy.summary}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-6 md:px-10 md:py-8 space-y-7">
          {caseStudy.metrics.length > 0 && (
            <section>
              <h3 className="font-mono text-xs uppercase tracking-wider text-brand mb-3">
                Highlights
              </h3>
              <div
                className={
                  "grid gap-4 md:gap-6 " +
                  (caseStudy.metrics.length >= 3
                    ? "grid-cols-2 md:grid-cols-3"
                    : caseStudy.metrics.length === 2
                      ? "grid-cols-2"
                      : "grid-cols-1")
                }
              >
                {caseStudy.metrics.map((m, i) => (
                  <MetricStat key={i} metric={m} size="sm" />
                ))}
              </div>
            </section>
          )}

          <section>
            <h3 className="font-mono text-xs uppercase tracking-wider text-brand mb-3">
              Problem
            </h3>
            <p className="text-[13px] md:text-sm leading-relaxed text-foreground/90">
              {caseStudy.problem}
            </p>
          </section>

          <section>
            <h3 className="font-mono text-xs uppercase tracking-wider text-brand mb-3">
              Approach
            </h3>
            <ul className="space-y-2.5">
              {caseStudy.approach.map((line, i) => (
                <li
                  key={i}
                  className="text-[13px] md:text-sm leading-relaxed text-foreground/90 pl-4 border-l-2 border-border"
                >
                  {line}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="font-mono text-xs uppercase tracking-wider text-brand mb-3">
              Outcome
            </h3>
            <ul className="space-y-2.5">
              {caseStudy.outcome.map((line, i) => (
                <li
                  key={i}
                  className="text-[13px] md:text-sm leading-relaxed text-foreground/90 pl-4 border-l-2 border-[hsl(var(--accent))]"
                >
                  {line}
                </li>
              ))}
            </ul>
          </section>

          {caseStudy.tech.length > 0 && (
            <section>
              <h3 className="font-mono text-xs uppercase tracking-wider text-brand mb-3">
                Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {caseStudy.tech.map((t) => (
                  <Badge key={t} variant="outline" className="font-mono text-[10px]">
                    {t}
                  </Badge>
                ))}
              </div>
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
