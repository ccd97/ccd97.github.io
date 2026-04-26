import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CarouselApi } from "@/components/ui/carousel";

interface Props {
  api: CarouselApi | undefined;
  label?: string;
}

export function CarouselControls({ api, label }: Props) {
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    if (!api) return;
    const update = () => {
      setSelected(api.selectedScrollSnap());
      setSnaps(api.scrollSnapList());
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
    };
    update();
    api.on("select", update);
    api.on("reInit", update);
    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  if (snaps.length <= 1) return null;

  return (
    <div className="mt-5 flex items-center justify-between gap-3">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-full shrink-0"
        disabled={!canPrev}
        onClick={() => api?.scrollPrev()}
        aria-label="Previous"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <div
        className="flex items-center gap-1.5"
        role="tablist"
        aria-label={label ?? "Carousel pagination"}
      >
        {snaps.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === selected}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => api?.scrollTo(i)}
            className={cn(
              "h-2 rounded-full transition-all",
              i === selected
                ? "w-6 bg-[hsl(var(--accent))]"
                : "w-2 bg-muted-foreground/40 hover:bg-muted-foreground/70",
            )}
          />
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-full shrink-0"
        disabled={!canNext}
        onClick={() => api?.scrollNext()}
        aria-label="Next"
      >
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
