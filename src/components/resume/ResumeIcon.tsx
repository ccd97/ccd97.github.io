import {
  Code2,
  Terminal,
  Github,
  Gitlab,
  Linkedin,
  Link as LinkIcon,
} from "lucide-react";

interface Props {
  name: string;
  className?: string;
}

export function ResumeIcon({ name, className = "h-4 w-4" }: Props) {
  const key = name.toLowerCase();
  if (key === "github") return <Github className={className} />;
  if (key === "gitlab") return <Gitlab className={className} />;
  if (key === "linkedin") return <Linkedin className={className} />;
  if (key === "code") return <Code2 className={className} />;
  if (key.includes("closed") || key === "codechef")
    return <Terminal className={className} />;
  return <LinkIcon className={className} />;
}
