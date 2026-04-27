import { ArrowUpRight, Mail } from "lucide-react";
import type { Hero as HeroData } from "@/types/portfolio";
import { SignatureCanvas } from "./SignatureCanvas";

interface Props {
  hero: HeroData;
  email: string;
}

const PLACEHOLDER = "[TAGLINE PENDING USER INPUT]";

export function Hero({ hero, email }: Props) {
  const isPlaceholder = hero.tagline === PLACEHOLDER;

  return (
    <section
      id="seg_home"
      className="relative isolate min-h-[80dvh] flex items-end md:items-center px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 overflow-hidden"
    >
      <SignatureCanvas />

      <div className="relative z-10 w-full max-w-5xl mr-auto pt-20 pb-12 md:pb-24">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          01 / Portfolio
        </p>
        <h1 className="mt-6 font-hero text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-foreground break-words">
          {hero.name}
        </h1>

        <p
          className={
            isPlaceholder
              ? "mt-8 max-w-2xl text-lg md:text-xl text-muted-foreground border border-dashed border-accent/60 rounded-md px-3 py-2 inline-block"
              : "mt-8 max-w-2xl text-lg md:text-xl text-foreground/90"
          }
        >
          {hero.tagline}
        </p>

        <p className="mt-6 max-w-2xl text-sm md:text-base text-muted-foreground">
          <span className="font-mono text-xs uppercase tracking-wider text-brand mr-2">
            Currently
          </span>
          {hero.currently}
          {hero.location ? ` · ${hero.location}` : ""}
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="./resume.html"
            className="inline-flex items-center gap-2 rounded-md bg-foreground text-background px-5 py-2.5 text-sm font-medium transition-colors hover:bg-foreground/85"
          >
            View résumé <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-background/50 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            <Mail className="h-4 w-4" /> Get in touch
          </a>
        </div>
      </div>
    </section>
  );
}
