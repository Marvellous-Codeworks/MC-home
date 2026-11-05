import { useEffect } from "react";

const DURATION_MS = 700;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * Animates in-page anchor links. CSS `scroll-behavior` isn't enough: browsers with
 * smooth scrolling turned off ignore it and jump. Reduced motion keeps the plain jump.
 */
export function useSmoothAnchorScroll() {
  useEffect(() => {
    let cancelScroll: (() => void) | undefined;

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = (event.target as Element).closest?.<HTMLAnchorElement>('a[href^="#"]');
      const href = link?.getAttribute("href");
      const target = href ? document.getElementById(href.slice(1)) : null;
      if (!href || !target) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      event.preventDefault();
      cancelScroll?.();

      const from = window.scrollY;
      const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      const to = target.getBoundingClientRect().top + from - margin;
      const start = performance.now();
      let frame = 0;

      // Scrolling by hand takes over from the animation
      const cancel = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("wheel", cancel);
        window.removeEventListener("touchstart", cancel);
        cancelScroll = undefined;
      };

      const step = (now: number) => {
        const progress = Math.min((now - start) / DURATION_MS, 1);
        window.scrollTo({
          top: from + (to - from) * easeInOutCubic(progress),
          behavior: "instant",
        });
        if (progress < 1) {
          frame = requestAnimationFrame(step);
          return;
        }
        cancel();
        // Last, because the router scrolls to the hash when the URL changes
        window.history.replaceState(window.history.state, "", href);
      };

      window.addEventListener("wheel", cancel, { passive: true });
      window.addEventListener("touchstart", cancel, { passive: true });
      cancelScroll = cancel;
      frame = requestAnimationFrame(step);
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      cancelScroll?.();
    };
  }, []);
}
