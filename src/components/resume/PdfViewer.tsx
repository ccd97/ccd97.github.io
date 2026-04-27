import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

interface Props {
  src: string;
}

export function PdfViewer({ src }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";
    setError(null);
    setLoading(true);

    const render = async () => {
      try {
        const [pdfjsLib, workerUrlMod] = await Promise.all([
          import("pdfjs-dist"),
          import("pdfjs-dist/build/pdf.worker.mjs?url"),
        ]);
        if (cancelled) return;

        pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrlMod.default;

        const pdf = await pdfjsLib.getDocument(src).promise;
        if (cancelled) return;

        const width = container.clientWidth;
        const dpr = window.devicePixelRatio || 1;

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          if (cancelled) return;

          const baseViewport = page.getViewport({ scale: 1 });
          const scale = width / baseViewport.width;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(viewport.width * dpr);
          canvas.height = Math.floor(viewport.height * dpr);
          canvas.style.width = "100%";
          canvas.style.height = "auto";
          canvas.style.display = "block";

          const ctx = canvas.getContext("2d");
          if (!ctx) continue;

          container.appendChild(canvas);
          await page.render({
            canvas,
            canvasContext: ctx,
            viewport,
            transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined,
          }).promise;
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    render();
    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <div>
      {error && (
        <p className="text-sm text-destructive mb-3">
          Failed to load PDF: {error}
        </p>
      )}
      {loading && !error && (
        <div
          className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground"
          role="status"
          aria-live="polite"
        >
          <Loader2 className="h-8 w-8 animate-spin" aria-hidden="true" />
          <p className="text-sm">Loading resume…</p>
        </div>
      )}
      <div ref={containerRef} className="w-full" />
    </div>
  );
}
