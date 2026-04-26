import { useEffect, useState } from "react";
import { Star, GitFork, ArrowUpRight, Github, Gitlab, Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { fetchGithubRepo, type GithubRepoMeta } from "@/lib/github";
import type { SideProject } from "@/types/portfolio";

interface Props {
  project: SideProject;
}

export function SideProjectCard({ project }: Props) {
  const [meta, setMeta] = useState<GithubRepoMeta | null>(null);

  useEffect(() => {
    if (project.type === "github" && project.repo) {
      fetchGithubRepo(project.repo).then(setMeta);
    }
  }, [project.type, project.repo]);

  const href =
    meta?.html_url ??
    (project.type === "github" && project.repo
      ? `https://github.com/ccd97/${project.repo}`
      : project.type === "gitlab" && project.repo
        ? `https://gitlab.com/ccd97/${project.repo}`
        : (project.link ?? "#"));

  const SourceIcon =
    project.type === "github"
      ? Github
      : project.type === "gitlab"
        ? Gitlab
        : Code2;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="group relative flex flex-col h-full overflow-hidden rounded-lg border border-border bg-card/50 px-5 py-5 transition-colors hover:border-[hsl(var(--accent))] hover:bg-card"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-accent-soft opacity-20 md:opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-80"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-full w-[3px] bg-[hsl(var(--accent))] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <SourceIcon className="h-4 w-4 text-brand shrink-0 mt-1.5" />
          <h3 className="font-card text-xl leading-tight text-foreground break-words">
            {project.name}
          </h3>
        </div>
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background/50 text-brand transition-all duration-300 group-hover:border-[hsl(var(--accent))] group-hover:bg-[hsl(var(--accent))] group-hover:text-accent-foreground">
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>

      <p className="relative mt-2 text-sm leading-relaxed text-foreground/80">
        {project.description}
      </p>

      {project.tools.length > 0 && (
        <div className="relative flex flex-wrap gap-1.5 mt-4">
          {project.tools.map((tool) => (
            <Badge
              key={tool}
              variant="outline"
              className="font-mono text-[10px] font-normal bg-accent-soft/50 border-[hsl(var(--accent))]/25 text-brand"
            >
              {tool}
            </Badge>
          ))}
        </div>
      )}

      {project.type === "github" && (
        <div className="relative mt-auto pt-5 flex items-center justify-end gap-3 font-mono text-xs text-muted-foreground">
          <span
            className="flex items-center gap-1 transition-colors group-hover:text-brand"
            title="Stars"
          >
            <Star className="h-3.5 w-3.5" />
            {meta ? meta.stargazers_count : "—"}
          </span>
          <span
            className="flex items-center gap-1 transition-colors group-hover:text-brand"
            title="Forks"
          >
            <GitFork className="h-3.5 w-3.5" />
            {meta ? meta.forks_count : "—"}
          </span>
        </div>
      )}
    </a>
  );
}
