"use client";

import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

/**
 * Motion layer.
 *
 * One Lenis instance drives ScrollTrigger off the GSAP ticker. Every
 * scrubbed scene on the page reads from that single clock, which is
 * what keeps the pinned Arc, the depth-field parallax and the compass
 * springs in agreement instead of each running its own loop.
 *
 * Components never touch Lenis or ScrollTrigger — they call the
 * primitives here from inside useGSAP() and let the scope revert.
 *
 * Curves are the animate skill's table, not hand-rolled:
 *   ease-out     cubic-bezier(0.23, 1, 0.32, 1)
 *   ease-in-out  cubic-bezier(0.77, 0, 0.175, 1)
 *   ease-drawer  cubic-bezier(0.32, 0.72, 0, 1)
 */

let registered = false;
let lenis: Lenis | null = null;

/** Live scroll telemetry for anything velocity-reactive. */
export const scroll = { velocity: 0, direction: 1 as 1 | -1, progress: 0 };

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(Flip, ScrollTrigger, SplitText);
  registered = true;
}

/**
 * Registered at import time rather than in an effect. useGSAP runs on
 * useLayoutEffect, so a component asking for a scrollTrigger fires
 * before any provider's useEffect — GSAP would drop those triggers
 * with "Missing plugin?". Module body means the plugins exist the
 * moment anything imports this file.
 */
registerGsap();

export function reducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Pointer effects are meaningless on touch and fire phantom hovers. */
export function finePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/* ------------------------------------------------------------------ *
 * Smooth scroll
 * ------------------------------------------------------------------ */

export function initLenis() {
  if (lenis || typeof window === "undefined") return null;
  registerGsap();

  if (reducedMotion()) {
    // Native scroll only. Telemetry stays live so the progress rail
    // and the Arc's time readout keep working.
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.progress = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return null;
  }

  lenis = new Lenis({
    duration: 1.15,
    // Long tail. A perfume house should not feel twitchy.
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5,
  });

  lenis.on("scroll", (e: Lenis) => {
    scroll.velocity = e.velocity;
    // Lenis reports 0 at rest; hold the last real direction so nothing
    // snaps to neutral every time the wheel pauses.
    if (e.direction === 1 || e.direction === -1) scroll.direction = e.direction;
    scroll.progress = e.progress;
    ScrollTrigger.update();
  });

  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function destroyLenis() {
  lenis?.destroy();
  lenis = null;
}

export function scrollTo(target: string | number) {
  if (lenis) lenis.scrollTo(target, { offset: -72, duration: 1.35 });
  else if (typeof target === "string") {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  }
}

/* ------------------------------------------------------------------ *
 * Type
 * ------------------------------------------------------------------ */

/**
 * Wrap each split part in an overflow-hidden block so it rises out of
 * a mask. Cormorant has deep descenders, so the wrapper needs padding
 * or the tails of g/y clip against the mask edge.
 */
function maskParts(parts: Element[]) {
  parts.forEach((part) => {
    const wrap = document.createElement("span");
    wrap.style.display = "block";
    wrap.style.overflow = "hidden";
    wrap.style.paddingBottom = "0.14em";
    wrap.style.marginBottom = "-0.14em";
    part.parentNode?.insertBefore(wrap, part);
    wrap.appendChild(part);
    (part as HTMLElement).style.display = "block";
  });
}

type RevealOpts = { delay?: number; stagger?: number; start?: string; immediate?: boolean };

/**
 * Lines sweep up out of a mask. The workhorse for section headings.
 * Slower than a UI transition on purpose — this is editorial motion,
 * where the animate skill's <300ms ceiling doesn't apply.
 */
export function revealLines(el: HTMLElement, opts: RevealOpts = {}) {
  if (reducedMotion()) {
    gsap.set(el, { autoAlpha: 1 });
    return null;
  }

  const split = new SplitText(el, { type: "lines", linesClass: "sp-line" });
  maskParts(split.lines);
  gsap.set(el, { autoAlpha: 1 });

  gsap.from(split.lines, {
    yPercent: 112,
    duration: 1.2,
    ease: "power4.out",
    stagger: opts.stagger ?? 0.075,
    delay: opts.delay ?? 0,
    scrollTrigger: opts.immediate
      ? undefined
      : { trigger: el, start: opts.start ?? "top 88%", once: true },
  });

  return split;
}

/**
 * Word-level, with each word settling from slightly below and behind.
 * Reserved for the hero and the Arc's fragrance name — two moments, so
 * it stays an event rather than a tic.
 */
export function revealWords(el: HTMLElement, opts: RevealOpts = {}) {
  if (reducedMotion()) {
    gsap.set(el, { autoAlpha: 1 });
    return null;
  }

  const split = new SplitText(el, {
    type: "lines,words",
    linesClass: "sp-line",
    wordsClass: "sp-word",
  });
  maskParts(split.lines);
  gsap.set(el, { autoAlpha: 1 });

  gsap.from(split.words, {
    yPercent: 116,
    // A hair of Z so the words arrive rather than slide. The parent
    // carries the perspective; see .scene-3d in globals.css.
    z: -60,
    duration: 1.3,
    ease: "power4.out",
    stagger: opts.stagger ?? 0.05,
    delay: opts.delay ?? 0,
    scrollTrigger: opts.immediate
      ? undefined
      : { trigger: el, start: opts.start ?? "top 88%", once: true },
  });

  return split;
}

/* ------------------------------------------------------------------ *
 * Scroll primitives
 * ------------------------------------------------------------------ */

/** Quiet entrance for supporting copy. Deliberately softer than headings. */
export function revealUp(scope: HTMLElement, selector = "[data-up]") {
  const targets = gsap.utils.toArray<HTMLElement>(selector, scope);
  if (!targets.length) return;

  if (reducedMotion()) {
    gsap.set(targets, { autoAlpha: 1, y: 0 });
    return;
  }

  targets.forEach((el) => {
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 24 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        delay: Number(el.dataset.upDelay ?? 0),
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      },
    );
  });
}

/** Scroll-linked drift. Positive `strength` trails the page. */
export function parallax(el: HTMLElement, strength = 8) {
  if (reducedMotion()) return;

  gsap.fromTo(
    el,
    { yPercent: -strength },
    {
      yPercent: strength,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
    },
  );
}

/** Clip-path reveal, fired once. Used on the editorial stills. */
export function unveil(el: HTMLElement, from = "inset(0% 0% 100% 0%)") {
  if (reducedMotion()) {
    gsap.set(el, { clipPath: "none" });
    return;
  }

  gsap.fromTo(
    el,
    { clipPath: from, scale: 1.08 },
    {
      clipPath: "inset(0% 0% 0% 0%)",
      scale: 1,
      ease: "power3.out",
      duration: 1.5,
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    },
  );
}

/** Number that counts as its section passes, rather than on a timer. */
export function countUp(el: HTMLElement, value: number, suffix = "") {
  const state = { n: 0 };
  const write = () => {
    el.textContent = `${Math.round(state.n).toLocaleString("en-GB")}${suffix}`;
  };

  if (reducedMotion()) {
    state.n = value;
    write();
    return;
  }

  gsap.to(state, {
    n: value,
    ease: "none",
    onUpdate: write,
    scrollTrigger: { trigger: el, start: "top 90%", end: "bottom 65%", scrub: 0.5 },
  });
}

/* ------------------------------------------------------------------ *
 * 3D
 *
 * Everything below assumes an ancestor carries `.scene-3d` (which owns
 * the perspective) and the moving elements carry `.layer-3d`.
 * Perspective on the shared parent rather than per-element is what
 * makes sibling layers resolve to one vanishing point — the difference
 * between a real space and a stack of cards pretending.
 * ------------------------------------------------------------------ */

/**
 * Whole-scene pointer parallax. Each layer declares `data-depth`; the
 * sign of that number decides whether it travels with the pointer or
 * against it, which is what actually sells near-versus-far.
 *
 * Bound to the scene element rather than the window, so the effect
 * stops at the section edge instead of tracking the whole document.
 */
export function depthField(scene: HTMLElement, selector = "[data-depth]") {
  if (reducedMotion() || !finePointer()) return () => {};

  const layers = gsap.utils.toArray<HTMLElement>(selector, scene);
  if (!layers.length) return () => {};

  const rigs = layers.map((layer) => ({
    depth: Number(layer.dataset.depth ?? 1),
    spin: Number(layer.dataset.spin ?? 0),
    // Independent springs per axis — one tween across both desyncs the
    // instant X and Y move at different rates.
    x: gsap.quickTo(layer, "x", { duration: 1.2, ease: "power3.out" }),
    y: gsap.quickTo(layer, "y", { duration: 1.2, ease: "power3.out" }),
    ry: gsap.quickTo(layer, "rotationY", { duration: 1.2, ease: "power3.out" }),
    rx: gsap.quickTo(layer, "rotationX", { duration: 1.2, ease: "power3.out" }),
  }));

  const onMove = (e: PointerEvent) => {
    const r = scene.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;

    rigs.forEach((rig) => {
      rig.x(px * rig.depth * -40);
      rig.y(py * rig.depth * -26);
      if (rig.spin) {
        rig.ry(px * rig.spin);
        rig.rx(-py * rig.spin * 0.6);
      }
    });
  };

  const onLeave = () => {
    rigs.forEach((rig) => {
      rig.x(0);
      rig.y(0);
      if (rig.spin) {
        rig.ry(0);
        rig.rx(0);
      }
    });
  };

  scene.addEventListener("pointermove", onMove);
  scene.addEventListener("pointerleave", onLeave);

  return () => {
    scene.removeEventListener("pointermove", onMove);
    scene.removeEventListener("pointerleave", onLeave);
  };
}

/**
 * Pointer-tracked tilt for a single card. Rotation derives from the
 * pointer's position inside the element, and quickTo retargets an
 * in-flight tween from its current value rather than restarting — so
 * a fast cursor never produces a jump.
 */
export function tiltCard(
  el: HTMLElement,
  opts: { max?: number; lift?: number; sheen?: HTMLElement | null } = {},
) {
  if (reducedMotion() || !finePointer()) return () => {};

  const max = opts.max ?? 8;
  const lift = opts.lift ?? 26;

  const rx = gsap.quickTo(el, "rotationX", { duration: 0.55, ease: "power3.out" });
  const ry = gsap.quickTo(el, "rotationY", { duration: 0.55, ease: "power3.out" });
  const tz = gsap.quickTo(el, "z", { duration: 0.55, ease: "power3.out" });

  const sheen = opts.sheen;
  const sx = sheen ? gsap.quickTo(sheen, "xPercent", { duration: 0.6, ease: "power3.out" }) : null;
  const sa = sheen ? gsap.quickTo(sheen, "opacity", { duration: 0.4, ease: "power2.out" }) : null;

  const onMove = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;

    ry(px * max * 2);
    // Inverted, so pushing the cursor up tips the far edge away —
    // the way a real panel hinged at the middle would behave.
    rx(-py * max * 2);
    sx?.(px * 70);
  };

  const onEnter = () => {
    tz(lift);
    sa?.(1);
  };

  const onLeave = () => {
    rx(0);
    ry(0);
    tz(0);
    sa?.(0);
  };

  el.addEventListener("pointermove", onMove);
  el.addEventListener("pointerenter", onEnter);
  el.addEventListener("pointerleave", onLeave);

  return () => {
    el.removeEventListener("pointermove", onMove);
    el.removeEventListener("pointerenter", onEnter);
    el.removeEventListener("pointerleave", onLeave);
  };
}

/**
 * Suspended motes — the resin dust in the hero's air.
 *
 * Built once into a real 3D volume: each mote gets a fixed Z so the
 * shared perspective scales it for free, and then loops on its own
 * offset timeline. Deliberately CSS-transform only, and paused when
 * the hero leaves the viewport, so an ambient decoration never costs
 * frames on the sections below it.
 */
export function suspendMotes(host: HTMLElement, count = 26) {
  if (reducedMotion()) return () => {};

  const made: HTMLElement[] = [];
  const tweens: gsap.core.Tween[] = [];

  for (let i = 0; i < count; i++) {
    const mote = document.createElement("span");
    mote.className = "mote";

    // Z spread drives apparent size through the parent's perspective,
    // so near motes read large and soft without a per-mote size rule.
    const z = gsap.utils.random(-420, 160);
    const size = gsap.utils.random(2, 5);

    gsap.set(mote, {
      x: `${gsap.utils.random(-6, 106)}vw`,
      y: `${gsap.utils.random(-4, 104)}vh`,
      z,
      width: size,
      height: size,
      opacity: gsap.utils.random(0.16, 0.5),
    });

    host.appendChild(mote);
    made.push(mote);

    // Slow vertical rise with lateral sway, each on its own phase.
    tweens.push(
      gsap.to(mote, {
        yPercent: gsap.utils.random(-260, -520),
        xPercent: gsap.utils.random(-70, 70),
        duration: gsap.utils.random(16, 30),
        ease: "none",
        repeat: -1,
        delay: -gsap.utils.random(0, 24),
      }),
    );
    tweens.push(
      gsap.to(mote, {
        opacity: gsap.utils.random(0.05, 0.2),
        duration: gsap.utils.random(4, 9),
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      }),
    );
  }

  // Ambient motion off-screen is wasted work.
  const gate = ScrollTrigger.create({
    trigger: host,
    start: "top bottom",
    end: "bottom top",
    onToggle: ({ isActive }) => tweens.forEach((t) => (isActive ? t.play() : t.pause())),
  });

  return () => {
    gate.kill();
    tweens.forEach((t) => t.kill());
    made.forEach((m) => m.remove());
  };
}

export { Flip, gsap, ScrollTrigger, SplitText };
