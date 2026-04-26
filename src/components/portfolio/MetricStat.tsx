import type { Metric } from "@/types/portfolio";

interface Props {
  metric: Metric;
  size?: "sm" | "md" | "lg";
}

export function MetricStat({ metric, size = "md" }: Props) {
  const valueClass =
    size === "lg"
      ? "text-3xl md:text-4xl"
      : size === "sm"
        ? "text-xl"
        : "text-2xl md:text-3xl";

  return (
    <div className="flex flex-col">
      <span
        className={`font-mono font-medium text-brand leading-none ${valueClass}`}
      >
        {metric.value}
      </span>
      <span className="mt-1.5 text-[11px] uppercase tracking-wider text-muted-foreground font-sans">
        {metric.label}
      </span>
    </div>
  );
}
