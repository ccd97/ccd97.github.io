import { useEffect, useRef, useState } from "react";

const DRAW_DURATION_MS = 1800;
const DRAW_STAGGER_MS = 900;
const PARALLAX_TRANSLATE_PX = 30;
const PARALLAX_SCALE_AMOUNT = 0.04;
const TWINKLE_PERIOD_MS = 2000;
const TWINKLE_PERIOD_JITTER_MS = 1000;
const TWINKLE_DIP_OPACITY = 0.05;

const OVERLAY_OPACITY = {
  light: { predraw: 0.2, postdraw: 0.1 },
  dark: { predraw: 0.1, postdraw: 0.05 },
};

const SQUARE_ASPECT_MIN = 0.9;
const SQUARE_ASPECT_MAX = 1.1;
const SQUARE_MAX_BBOX_FRAC = 0.01;

function isLowEndDevice(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number };
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4) return true;
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4) return true;
  return false;
}

export function SignatureCanvas() {
  const hostRef = useRef<HTMLDivElement>(null);
  const innerGroupRef = useRef<SVGGElement | null>(null);
  const drawAnimationsRef = useRef<Animation[]>([]);
  const burstAnimationsRef = useRef<Animation[]>([]);
  const rafRef = useRef<number | null>(null);
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

    fetch("/signature.svg")
      .then((r) => r.text())
      .then((text) => {
        if (cancelled || !hostRef.current) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "image/svg+xml");
        const sourceSvg = doc.querySelector("svg");
        if (!sourceSvg) return;

        const viewBox = sourceSvg.getAttribute("viewBox") ?? "0 0 2048 2048";

        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("viewBox", viewBox);
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.style.overflow = "visible";

        const parallaxGroup = document.createElementNS(svgNS, "g");
        parallaxGroup.setAttribute("fill", "none");
        parallaxGroup.setAttribute("stroke", "currentColor");
        parallaxGroup.setAttribute("stroke-linecap", "round");
        parallaxGroup.setAttribute("stroke-linejoin", "round");
        innerGroupRef.current = parallaxGroup;

        const sourceGroup = sourceSvg.querySelector("g");
        const paths = Array.from(
          (sourceGroup ?? sourceSvg).querySelectorAll("path"),
        );

        const frag = document.createDocumentFragment();
        const clones: SVGPathElement[] = [];
        for (const p of paths) {
          const clone = p.cloneNode(true) as SVGPathElement;
          clone.removeAttribute("fill");
          clone.setAttribute("stroke", "currentColor");
          clones.push(clone);
          frag.appendChild(clone);
        }
        parallaxGroup.appendChild(frag);
        svg.appendChild(parallaxGroup);
        host.appendChild(svg);

        const lengths = new Float32Array(clones.length);
        for (let i = 0; i < clones.length; i++) {
          lengths[i] = clones[i].getTotalLength();
        }
        for (let i = 0; i < clones.length; i++) {
          const len = lengths[i];
          clones[i].style.strokeDasharray = `${len}`;
          clones[i].style.strokeDashoffset = prefersReducedMotion
            ? "0"
            : `${len}`;
        }

        if (prefersReducedMotion) {
          setDrawComplete(true);
          return;
        }

        const n = clones.length;
        const perPathDuration = Math.max(
          60,
          DRAW_DURATION_MS - DRAW_STAGGER_MS,
        );
        const drawAnims: Animation[] = [];
        for (let i = 0; i < n; i++) {
          const len = lengths[i];
          const delay = (i / n) * DRAW_STAGGER_MS;
          const anim = clones[i].animate(
            [{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
            {
              duration: perPathDuration,
              delay,
              easing: "ease-out",
              fill: "forwards",
            },
          );
          drawAnims.push(anim);
        }
        drawAnimationsRef.current = drawAnims;

        Promise.all(drawAnims.map((a) => a.finished))
          .then(() => {
            if (cancelled) return;
            setDrawComplete(true);

            if (!window.matchMedia("(min-width: 768px)").matches) return;
            if (isLowEndDevice()) return;

            const overall = parallaxGroup.getBBox();
            const maxW = overall.width * SQUARE_MAX_BBOX_FRAC;
            const maxH = overall.height * SQUARE_MAX_BBOX_FRAC;
            const squareIndices: number[] = [];
            for (let i = 0; i < clones.length; i++) {
              const b = clones[i].getBBox();
              if (b.width === 0 || b.height === 0) continue;
              const aspect = b.width / b.height;
              const isSquareish =
                aspect >= SQUARE_ASPECT_MIN && aspect <= SQUARE_ASPECT_MAX;
              const isSmall = b.width <= maxW && b.height <= maxH;
              if (isSquareish && isSmall) squareIndices.push(i);
            }

            if (squareIndices.length === 0) return;

            const burstAnims: Animation[] = [];
            for (const idx of squareIndices) {
              const path = clones[idx];
              path.style.willChange = "opacity";
              const period =
                TWINKLE_PERIOD_MS +
                (Math.random() - 0.5) * 2 * TWINKLE_PERIOD_JITTER_MS;
              const startDelay = Math.random() * period;
              const anim = path.animate(
                [
                  { opacity: 1 },
                  { opacity: TWINKLE_DIP_OPACITY, offset: 0.5 },
                  { opacity: 1 },
                ],
                {
                  duration: period,
                  delay: startDelay,
                  iterations: Infinity,
                  easing: "ease-in-out",
                },
              );
              burstAnims.push(anim);
            }
            burstAnimationsRef.current = burstAnims;
          })
          .catch(() => {});
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      for (const a of drawAnimationsRef.current) a.cancel();
      drawAnimationsRef.current = [];
      for (const a of burstAnimationsRef.current) a.cancel();
      burstAnimationsRef.current = [];
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
        for (const a of burstAnimationsRef.current) {
          if (visible) a.play();
          else a.pause();
        }
      },
      { rootMargin: "100px" },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!drawComplete) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const g = innerGroupRef.current;
    const host = hostRef.current;
    if (!g || !host) return;

    g.style.willChange = "transform";

    let ticking = false;
    const update = () => {
      ticking = false;
      const section = host.closest("section");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const h = rect.height || 1;
      const progress = Math.max(0, Math.min(1, -rect.top / h));
      const ty = progress * -PARALLAX_TRANSLATE_PX;
      const scale = 1 + progress * PARALLAX_SCALE_AMOUNT;
      g.style.transform = `translate3d(0, ${ty}px, 0) scale(${scale})`;
      g.style.transformOrigin = "center center";
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      if (g) g.style.willChange = "";
    };
  }, [drawComplete]);

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
