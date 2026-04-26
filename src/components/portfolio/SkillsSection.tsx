import type { SkillGroup } from "@/types/portfolio";

interface Props {
  groups: SkillGroup[];
}

export function SkillsSection({ groups }: Props) {
  return (
    <div className="divide-y divide-border border-y border-border">
      {groups.map((group) => (
        <div
          key={group.title}
          className="grid grid-cols-1 md:grid-cols-[minmax(0,180px)_1fr] gap-x-10 gap-y-3 py-6 md:py-7"
        >
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="hidden md:block h-2.5 w-2.5 shrink-0 rounded-full bg-[hsl(var(--accent))]"
            />
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
              {group.title}
            </h3>
          </div>

          <ul className="flex flex-wrap gap-2">
            {group.items.map((item) => (
              <li
                key={item}
                className="inline-flex items-center rounded-md border border-border bg-card/50 px-3 py-1.5 text-sm text-foreground/90"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
