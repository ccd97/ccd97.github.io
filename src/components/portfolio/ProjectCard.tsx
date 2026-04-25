import { useEffect, useState } from "react";
import { Star, GitFork, ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { fetchGithubRepo, type GithubRepoMeta } from "@/lib/github";
import { formatDate, languageClass } from "@/lib/format";
import type { Project } from "@/types/portfolio";

interface Props {
  project: Project;
}

export function ProjectCard({ project }: Props) {
  const [meta, setMeta] = useState<GithubRepoMeta | null>(null);

  useEffect(() => {
    if (project.type === "github" && project.repo) {
      fetchGithubRepo(project.repo).then(setMeta);
    }
  }, [project.type, project.repo]);

  const name = project.name ?? project.repo ?? "Untitled";

  const updatedText = meta
    ? `Updated on ${formatDate(meta.pushed_at)}`
    : project.updated_at
      ? `Updated on ${project.updated_at}`
      : "";

  const visitHref =
    meta?.html_url ??
    (project.type === "gitlab" && project.repo
      ? `https://gitlab.com/ccd97/${project.repo}`
      : (project.link ?? "#"));

  return (
    <Card className="flex flex-col h-full">
      <CardContent className="p-6 pb-4 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-tight">{name}</h3>
          <span
            className={`text-xs font-light flex items-center gap-1 whitespace-nowrap ${languageClass(project.language)}`}
          >
            <span className="text-base leading-none">●</span>
            {project.language}
          </span>
        </div>
        <div className="text-xs text-muted-foreground mt-2 min-h-[1rem]">
          {updatedText}
        </div>
        <p className="text-sm mt-3 leading-relaxed">{project.description}</p>
      </CardContent>

      <CardContent className="px-6 pt-0 pb-4">
        <div className="text-sm font-medium mb-1">Tools/Technologies used:</div>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-0.5">
          {project.tools.map((tool, i) => (
            <li key={i}>{tool}</li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="border-t px-6 py-3 flex items-center justify-between text-sm">
        <div className="flex items-center gap-3 text-muted-foreground">
          {meta && meta.stargazers_count > 0 && (
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              {meta.stargazers_count}
            </span>
          )}
          {meta && meta.forks_count > 0 && (
            <span className="flex items-center gap-1">
              <GitFork className="h-4 w-4" />
              {meta.forks_count}
            </span>
          )}
        </div>
        <a
          href={visitHref}
          target="_blank"
          rel="noreferrer noopener"
          className="ml-auto inline-flex items-center gap-1 text-brand hover:underline"
        >
          Visit <ExternalLink className="h-4 w-4" />
        </a>
      </CardFooter>
    </Card>
  );
}
