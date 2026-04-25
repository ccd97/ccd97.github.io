import { Code2, Terminal, Link as LinkIcon } from "lucide-react";

interface Props {
  name: string;
  className?: string;
}

export function ResumeIcon({ name, className = "h-4 w-4" }: Props) {
  const key = name.toLowerCase();
  if (key === "code") return <Code2 className={className} />;
  if (key.includes("closed") || key === "codechef")
    return <Terminal className={className} />;
  return <LinkIcon className={className} />;
}
