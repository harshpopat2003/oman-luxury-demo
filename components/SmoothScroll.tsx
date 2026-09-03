"use client";

import { useEffect } from "react";
import { destroyLenis, initLenis, registerGsap, ScrollTrigger, scrollTo } from "@/lib/motion";

/**
 * Owns the single Lenis instance and hands in-page anchors to it, so
 * jumping to a section eases with the same physics as the wheel
 * instead of teleporting past the pinned Arc.
 */
export default function SmoothScroll() {
  useEffect(() => {
    registerGsap();
    initLenis();

    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest?.<HTMLAnchorElement>('a[href^="#"]');
      const href = link?.getAttribute("href");
      if (!href || href === "#" || !document.querySelector(href)) return;
      e.preventDefault();
      scrollTo(href);
    };

    document.addEventListener("click", onClick);

    // Seventeen product images decode late, and every one of them
    // moves the end point of the pinned sections below it.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = window.setTimeout(refresh, 1400);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
      destroyLenis();
    };
  }, []);

  return null;
}
