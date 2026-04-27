import { useEffect, useRef, useState } from "react";

const DRAW_DURATION_MS = 1800;
const DRAW_STAGGER_MS = 900;

const OVERLAY_OPACITY = {
  light: { predraw: 0.2, postdraw: 0.1 },
  dark: { predraw: 0.1, postdraw: 0.05 },
};

const MEASURE_CHUNK = 200;
const ANIM_CHUNK = 300;

type IdleWindow = Window & {
  requestIdleCallback?: (
    cb: (deadline: { timeRemaining: () => number }) => void,
    opts?: { timeout?: number },
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

function scheduleIdle(cb: () => void, timeout = 2000): () => void {
  const w = window as IdleWindow;
  if (typeof w.requestIdleCallback === "function") {
    const handle = w.requestIdleCallback(() => cb(), { timeout });
    return () => w.cancelIdleCallback?.(handle);
  }
  const handle = window.setTimeout(cb, 200);
  return () => clearTimeout(handle);
}

function yieldToMain(): Promise<void> {
  return new Promise((resolve) => {
    const w = window as IdleWindow;
    if (typeof w.requestIdleCallback === "function") {
      w.requestIdleCallback(() => resolve(), { timeout: 100 });
    } else {
      setTimeout(resolve, 0);
    }
  });
}

type SignatureGeometry = {
  viewBox: string;
  pathDs: string[];
  strokeWidths: string[];
  lengths: Float32Array;
};

let geometryPromise: Promise<SignatureGeometry> | null = null;

function loadSignatureGeometry(): Promise<SignatureGeometry> {
  if (geometryPromise) return geometryPromise;
  geometryPromise = (async () => {
    const res = await fetch("/signature.svg");
    const text = await res.text();

    await yieldToMain();

    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "image/svg+xml");
    const sourceSvg = doc.querySelector("svg");
    if (!sourceSvg) throw new Error("signature.svg missing <svg>");

    const viewBox = sourceSvg.getAttribute("viewBox") ?? "0 0 2048 2048";
    const sourceGroup = sourceSvg.querySelector("g");
    const paths = Array.from(
      (sourceGroup ?? sourceSvg).querySelectorAll("path"),
    );
    const pathDs = paths.map((p) => p.getAttribute("d") ?? "");
    const groupStrokeWidth =
      sourceGroup?.getAttribute("stroke-width") ??
      sourceSvg.getAttribute("stroke-width");
    const strokeWidths = paths.map(
      (p) => p.getAttribute("stroke-width") ?? groupStrokeWidth ?? "1",
    );

    const svgNS = "http://www.w3.org/2000/svg";
    const measureSvg = document.createElementNS(svgNS, "svg");
    measureSvg.setAttribute("viewBox", viewBox);
    measureSvg.style.position = "absolute";
    measureSvg.style.width = "0";
    measureSvg.style.height = "0";
    measureSvg.style.visibility = "hidden";
    measureSvg.setAttribute("aria-hidden", "true");
    const measureGroup = document.createElementNS(svgNS, "g");
    const measurePaths: SVGPathElement[] = new Array(pathDs.length);
    for (let i = 0; i < pathDs.length; i++) {
      const p = document.createElementNS(svgNS, "path");
      p.setAttribute("d", pathDs[i]);
      measureGroup.appendChild(p);
      measurePaths[i] = p;
    }
    measureSvg.appendChild(measureGroup);
    document.body.appendChild(measureSvg);

    const lengths = new Float32Array(measurePaths.length);
    for (let i = 0; i < measurePaths.length; i++) {
      lengths[i] = measurePaths[i].getTotalLength();
      if ((i + 1) % MEASURE_CHUNK === 0) await yieldToMain();
    }

    document.body.removeChild(measureSvg);

    return { viewBox, pathDs, strokeWidths, lengths };
  })();
  return geometryPromise;
}

export function SignatureCanvas() {
  const hostRef = useRef<HTMLDivElement>(null);
  const drawAnimationsRef = useRef<Animation[]>([]);
  const [drawComplete, setDrawComplete] = useState(false);
  const [isDark, setIsDark] = useState(() =>
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark"),
  );
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 768px)").matches,
  );

  useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains("dark"));
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const onChange = () => setIsDesktop(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let cancelled = false;

    const run = async () => {
      let geometry: SignatureGeometry;
      try {
        geometry = await loadSignatureGeometry();
      } catch {
        return;
      }
      if (cancelled || !hostRef.current) return;

      await yieldToMain();
      if (cancelled || !hostRef.current) return;

      const { viewBox, pathDs, strokeWidths, lengths } = geometry;
      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("viewBox", viewBox);
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      svg.style.overflow = "visible";

      const group = document.createElementNS(svgNS, "g");
      group.setAttribute("fill", "none");
      group.setAttribute("stroke", "currentColor");
      group.setAttribute("stroke-linecap", "round");
      group.setAttribute("stroke-linejoin", "round");

      const frag = document.createDocumentFragment();
      const clones: SVGPathElement[] = new Array(pathDs.length);
      for (let i = 0; i < pathDs.length; i++) {
        const p = document.createElementNS(svgNS, "path");
        p.setAttribute("d", pathDs[i]);
        p.setAttribute("stroke-width", strokeWidths[i]);
        const len = lengths[i];
        p.style.strokeDasharray = `${len}`;
        p.style.strokeDashoffset = prefersReducedMotion ? "0" : `${len}`;
        clones[i] = p;
        frag.appendChild(p);
      }
      group.appendChild(frag);
      svg.appendChild(group);
      host.appendChild(svg);

      if (prefersReducedMotion) {
        setDrawComplete(true);
        return;
      }

      const n = clones.length;
      const perPathDuration = Math.max(
        60,
        DRAW_DURATION_MS - DRAW_STAGGER_MS,
      );
      const drawAnims: Animation[] = new Array(n);
      for (let i = 0; i < n; i++) {
        const len = lengths[i];
        const delay = (i / n) * DRAW_STAGGER_MS;
        drawAnims[i] = clones[i].animate(
          [{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
          {
            duration: perPathDuration,
            delay,
            easing: "ease-out",
            fill: "forwards",
          },
        );
        if ((i + 1) % ANIM_CHUNK === 0) {
          await yieldToMain();
          if (cancelled) {
            for (const a of drawAnims) if (a) a.cancel();
            return;
          }
        }
      }
      drawAnimationsRef.current = drawAnims;

      try {
        await Promise.all(drawAnims.map((a) => a.finished));
      } catch {
        return;
      }
      if (cancelled) return;
      setDrawComplete(true);
    };

    const cancelIdle = scheduleIdle(() => {
      void run();
    });

    return () => {
      cancelled = true;
      cancelIdle();
      for (const a of drawAnimationsRef.current) a.cancel();
      drawAnimationsRef.current = [];
      if (hostRef.current) hostRef.current.innerHTML = "";
    };
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        for (const a of drawAnimationsRef.current) {
          if (a.playState === "finished") continue;
          if (visible) a.play();
          else a.pause();
        }
      },
      { rootMargin: "100px" },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  const mobileFadeMask =
    "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)";
  const desktopFadeMask =
    "linear-gradient(to right, transparent 0%, transparent 20%, black 55%, black 100%)";
  const fadeMask = isDesktop ? desktopFadeMask : mobileFadeMask;

  const themeOpacity = isDark ? OVERLAY_OPACITY.dark : OVERLAY_OPACITY.light;
  const opacity = drawComplete ? themeOpacity.postdraw : themeOpacity.predraw;

  return (
    <div
      aria-hidden
      style={{
        transitionProperty: "opacity",
        transitionDuration: "600ms",
        maskImage: fadeMask,
        WebkitMaskImage: fadeMask,
        opacity,
      }}
      className="pointer-events-none absolute top-7 left-0 right-0 h-[45%] w-full md:inset-y-0 md:top-0 md:left-auto md:h-auto md:w-[55%] text-brand dark:text-foreground flex items-center justify-center md:justify-end"
    >
      <div ref={hostRef} className="w-full h-full" />
    </div>
  );
}
