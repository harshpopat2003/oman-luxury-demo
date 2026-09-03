"use client";

import Image from "next/image";
import { asset } from "@/lib/asset";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import Wordmark from "./Wordmark";
import { house } from "@/lib/content";
import { gsap, reducedMotion, ScrollTrigger } from "@/lib/motion";

const links = [
  { href: "#arc", label: "The Arc" },
  { href: "#compass", label: "Find Yours" },
  { href: "#origins", label: "Origins" },
  { href: "#frames", label: "Frames" },
  { href: "#collection", label: "Collection" },
  { href: "#boutiques", label: "Boutiques" },
];

/** Height of the utility strip, in px. The collapse distance. */
const STRIP = 40;

/**
 * The house mark, given room.
 *
 * Two rows. A utility strip carrying the two facts that actually move
 * a fragrance purchase — free delivery over 67 OMR, free engraving on
 * every 100ml — then a tall nav row with the brass seal at a size you
 * can actually read.
 *
 * On scroll the whole block slides up by exactly the strip's height,
 * which parks the strip off-screen and leaves the nav row sitting at
 * the top edge. That is one transform rather than an animated height,
 * so the collapse never triggers layout on the page underneath.
 *
 * The bar is a material the page runs beneath, and it takes its
 * palette from whatever room is currently under it — measured live,
 * because the Arc pins for several viewports and any cached trigger
 * position is wrong the moment that pin is created.
 */
export default function Header() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [onDark, setOnDark] = useState(true);

  useGSAP(
    () => {
      ScrollTrigger.create({
        start: 64,
        end: "max",
        onToggle: ({ isActive }) => setSolid(isActive),
      });

      const rooms = Array.from(
        document.querySelectorAll<HTMLElement>("main .room-dark, footer.room-dark"),
      );
      // Sample the middle of the nav row, not the top of the header.
      const probe = STRIP + 30;
      let was = true;

      const sample = () => {
        const hit = rooms.some((r) => {
          const b = r.getBoundingClientRect();
          return b.top <= probe && b.bottom >= probe;
        });
        if (hit !== was) {
          was = hit;
          setOnDark(hit);
        }
      };

      sample();
      ScrollTrigger.create({ start: 0, end: "max", onUpdate: sample, onRefresh: sample });
    },
    { scope: root },
  );

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const ink = onDark ? "var(--color-parchment)" : "var(--color-ink)";

  return (
    <header ref={root} className="fixed inset-x-0 top-0 z-50">
      <div
        className="transition-transform duration-500"
        style={{
          transform: `translateY(${solid ? -STRIP : 0}px)`,
          transitionTimingFunction: "var(--ease-out)",
          color: ink,
        }}
      >
        {/* ---------------- utility strip ---------------- */}
        <div
          className="border-b transition-colors duration-500"
          style={{
            height: STRIP,
            borderColor: onDark
              ? "color-mix(in oklab, var(--color-parchment) 14%, transparent)"
              : "color-mix(in oklab, var(--color-ink) 10%, transparent)",
            transitionTimingFunction: "var(--ease-out)",
          }}
        >
          <div className="shell flex h-full items-center justify-between gap-6">
            <p className="t-label truncate">
              {house.shipping}
              <span className="mx-3 hidden opacity-40 sm:inline">·</span>
              <span className="hidden sm:inline">{house.engraving}</span>
            </p>
            <p className="t-label hidden shrink-0 md:block">{house.tagline}</p>
          </div>
        </div>

        {/* ---------------- nav row ---------------- */}
        <div
          className="relative transition-[background-color,backdrop-filter] duration-500"
          style={{
            transitionTimingFunction: "var(--ease-out)",
            backgroundColor: solid
              ? onDark
                ? "color-mix(in oklab, var(--color-oudh) 72%, transparent)"
                : "color-mix(in oklab, var(--color-linen) 78%, transparent)"
              : "transparent",
            backdropFilter: solid ? "blur(26px) saturate(170%)" : "blur(0px)",
            WebkitBackdropFilter: solid ? "blur(26px) saturate(170%)" : "blur(0px)",
          }}
        >
          <nav className="shell flex h-[84px] items-center gap-8">
            <a
              href="#top"
              className="group flex shrink-0 items-center gap-3.5"
              aria-label="OMANLUXURY — back to top"
            >
              <Image
                src={asset("/brand/logo.png")}
                alt=""
                aria-hidden
                width={160}
                height={160}
                preload
                className="h-11 w-11 transition-transform duration-500 group-hover:rotate-[18deg]"
                style={{ transitionTimingFunction: "var(--ease-out)" }}
              />
              <Wordmark className="hidden text-[0.82rem] sm:inline-flex" />
            </a>

            <ul className="mx-auto hidden items-center gap-7 lg:flex xl:gap-10">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="t-label-tight link-draw">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="ml-auto flex items-center gap-3 lg:ml-0">
              <a
                href="#boutiques"
                className={`btn hidden !px-6 !py-3 sm:inline-flex ${
                  onDark ? "btn-invert" : "btn-solid"
                }`}
              >
                Discovery set
              </a>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="t-label-tight lg:hidden"
                aria-label="Open menu"
              >
                Menu
              </button>
            </div>
          </nav>

          {/* Scroll edge, not a divider. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-full h-6 transition-opacity duration-500"
            style={{
              opacity: solid ? 1 : 0,
              background: onDark
                ? "linear-gradient(to bottom, color-mix(in oklab, var(--color-oudh) 42%, transparent), transparent)"
                : "linear-gradient(to bottom, color-mix(in oklab, var(--color-linen) 42%, transparent), transparent)",
            }}
          />
        </div>
      </div>

      <MobileSheet open={open} onClose={() => setOpen(false)} />
    </header>
  );
}

/**
 * Enters and leaves along the same path — down from the edge it was
 * summoned from, back up the way it came. Symmetry is what makes the
 * dismissal read as the reverse of the opening.
 */
function MobileSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = panel.current;
      if (!el) return;

      if (reducedMotion()) {
        gsap.set(el, { autoAlpha: open ? 1 : 0, yPercent: 0 });
        return;
      }

      // A tween, not a keyframe set: the menu button can be pressed
      // twice in a second, and a retarget from the current value is
      // the only thing that survives that without a restart flash.
      gsap.to(el, {
        yPercent: open ? 0 : -100,
        autoAlpha: open ? 1 : 0,
        duration: open ? 0.48 : 0.36,
        ease: "power3.out",
      });

      if (open) {
        gsap.from(el.querySelectorAll("[data-item]"), {
          y: 24,
          autoAlpha: 0,
          duration: 0.65,
          ease: "power3.out",
          stagger: 0.045,
          delay: 0.08,
        });
      }
    },
    { dependencies: [open] },
  );

  return (
    <div
      ref={panel}
      className="room-dark grain fixed inset-0 z-[60] flex flex-col justify-between opacity-0"
      style={{ transform: "translateY(-100%)" }}
      aria-hidden={!open}
      inert={!open}
    >
      <div className="shell flex h-[84px] items-center justify-between">
        <span className="flex items-center gap-3.5">
          <Image
            src={asset("/brand/logo.png")}
            alt=""
            aria-hidden
            width={160}
            height={160}
            className="h-11 w-11"
          />
          <Wordmark className="text-[0.82rem] text-[color:var(--color-parchment)]" />
        </span>
        <button type="button" onClick={onClose} className="t-label-tight" aria-label="Close menu">
          Close
        </button>
      </div>

      <nav className="shell pb-6">
        <ul>
          {links.map((l, i) => (
            <li key={l.href} data-item className="border-t border-white/10">
              <a href={l.href} onClick={onClose} className="flex items-baseline gap-5 py-4">
                <span className="t-label w-6">{String(i + 1).padStart(2, "0")}</span>
                <span className="t-h3">{l.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="shell pb-10">
        <p data-item className="t-label mb-5">
          {house.shipping} · {house.engraving}
        </p>
        <a
          href="#boutiques"
          onClick={onClose}
          data-item
          className="btn btn-ghost w-full justify-center"
        >
          Order a discovery set
        </a>
      </div>
    </div>
  );
}
