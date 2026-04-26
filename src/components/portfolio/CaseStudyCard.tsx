import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { CaseStudy } from "@/types/portfolio";

interface Props {
  caseStudy: CaseStudy;
  onOpen: (caseStudy: CaseStudy) => void;
}

export function CaseStudyCard({ caseStudy, onOpen }: Props) {
  return (
    <Card className="group relative flex flex-col h-full overflow-hidden bg-card border-border hover:border-[hsl(var(--accent))] transition-colors">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-28 -right-24 h-60 w-60 rounded-full bg-accent-soft opacity-20 md:opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-80"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-full w-[3px] bg-[hsl(var(--accent))] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <CardContent className="relative p-6 md:p-7 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {caseStudy.duration}
          </span>
          <span className="inline-flex items-center rounded-full bg-accent-soft px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-brand">
            {caseStudy.role}
          </span>
        </div>

        <h3 className="font-card text-2xl md:text-3xl leading-tight mt-4 text-foreground">
          {caseStudy.title}
        </h3>

        <p className="text-sm md:text-[15px] mt-3 leading-relaxed text-foreground/80">
          {caseStudy.summary}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-auto pt-6">
          {caseStudy.tech.slice(0, 6).map((t) => (
            <Badge
              key={t}
              variant="outline"
              className="font-mono text-[10px] font-normal bg-background/40"
            >
              {t}
            </Badge>
          ))}
        </div>

        <div className="mt-5 pt-5 border-t border-border/70 flex items-center justify-end">
          <button
            type="button"
            onClick={() => onOpen(caseStudy)}
            className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline underline-offset-4"
          >
            View Details
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
