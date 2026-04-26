import { ChevronDown } from "lucide-react";
import type { PdfVariant } from "@/types/resume";

interface Props {
  variants: PdfVariant[];
  value: string;
  onChange: (value: string) => void;
}

export function ResumeSelector({ variants, value, onChange }: Props) {
  return (
    <label className="inline-flex items-center gap-2 text-sm font-medium">
      <span className="text-muted-foreground">View:</span>
      <span className="relative inline-block">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-background border rounded-md pl-3 pr-8 py-1.5 text-sm shadow-sm hover:bg-muted transition-colors focus:outline-none focus:border-foreground/40"
        >
          <option value="html">HTML (Live)</option>
          {variants.map((v) => (
            <option key={v.slug} value={v.slug}>
              {v.label}
            </option>
          ))}
        </select>
        <ChevronDown className="h-4 w-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
      </span>
    </label>
  );
}
