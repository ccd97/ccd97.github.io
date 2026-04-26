import { cn } from "@/lib/utils";
import type { Role } from "@/types/portfolio";

interface Props {
  roles: Role[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ExperienceTimeline({ roles, selectedId, onSelect }: Props) {
  return (
    <ol className="relative border-l border-border pl-8 space-y-3">
      {roles.map((role) => {
        const isSelected = selectedId === role.id;
        return (
          <li key={role.id} className="relative">
            <span
              aria-hidden
              className={cn(
                "absolute -left-[37px] top-4 h-3 w-3 rounded-full transition-all",
                isSelected
                  ? "bg-[hsl(var(--accent))] ring-4 ring-accent-soft"
                  : "bg-muted-foreground/50",
              )}
            />
            <button
              type="button"
              onClick={() => onSelect(role.id)}
              aria-pressed={isSelected}
              className={cn(
                "w-full text-left rounded-md px-3 py-2.5 -ml-3 transition-colors",
                isSelected ? "bg-accent-soft" : "hover:bg-muted/60",
              )}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <div>
                  <div
                    className={cn(
                      "font-medium",
                      isSelected ? "text-brand" : "text-foreground",
                    )}
                  >
                    {role.company}
                    {role.org ? (
                      <span className="text-muted-foreground font-normal">
                        {" "}
                        · {role.org}
                      </span>
                    ) : null}
                  </div>
                  <div className="text-sm text-foreground/80">{role.role}</div>
                </div>
                <div className="font-mono text-xs text-muted-foreground">
                  {role.start} – {role.end ?? "Present"} · {role.location}
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
