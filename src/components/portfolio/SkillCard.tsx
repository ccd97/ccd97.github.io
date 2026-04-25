import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { SkillSet } from "@/types/portfolio";

interface Props {
  skillSet: SkillSet;
}

export function SkillCard({ skillSet }: Props) {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">{skillSet.title}</h3>
        {skillSet.content.map((section, i) => (
          <div key={i} className="mb-4 last:mb-0">
            <p className="text-sm text-muted-foreground">
              {section.description}
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              {section.skill_list.map((skill, j) => {
                const label = (
                  <span
                    className={cn(
                      "cursor-default",
                      skill.weak && "text-muted-foreground/60",
                    )}
                  >
                    {skill.name}
                  </span>
                );
                return (
                  <li key={j}>
                    {skill.popup ? (
                      <Tooltip>
                        <TooltipTrigger asChild>{label}</TooltipTrigger>
                        <TooltipContent>{skill.popup}</TooltipContent>
                      </Tooltip>
                    ) : (
                      label
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
