"use client";

import Image from "next/image";
import { asset } from "@/lib/asset";
import { useCallback, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { fragrances, house } from "@/lib/content";
import { gsap, reducedMotion, revealLines } from "@/lib/motion";

/**
 * THE COMPASS — the commercial half of the pitch.
 *
 * The live store lists seventeen fragrances in a grid, which quietly
 * assumes the visitor already knows they want "Nasaj". Nobody arrives
 * knowing that. They arrive knowing they want something dark, or
 * something they can wear to work without apologising for it.
 *
 * So the seventeen get laid on a plane with the only two axes that
 * decide a purchase you cannot smell: how dark it is, and how far it
 * carries. You put a marker where you want to live and the house
 * answers with three bottles. It is a shop assistant, not a grid.
 *
 * Laid out as an instrument rather than an article — a compact head,
 * the field at full width, then the answer as a row underneath. The
 * marker is dragged, not typed into: tracked 1:1, capture set so it
 * keeps following past the edge of the plot, and responding on
 * pointer-down rather than waiting for a release.
 */

type Point = { x: number; y: number };

/**
 * Two mappings, composed.
 *
 * First the domain: no fragrance in the house is below 12 on depth or
 * below 30 on force, so plotting the raw 0–100 scale leaves the whole
 * lower-left of the field permanently empty and squeezes seventeen
 * bottles into a corner. The axes are fitted to the collection that
 * actually exists, with a little headroom either side.
 *
 * Then the inset: a dot at the domain edge would sit on the border
 * with its name hanging outside the box, so the normalised 0–100 is
 * drawn into an inset band. `unpad` is the exact inverse, so dragging
 * still lands on the value you pointed at.
 */
const HEAD = 6;
const domain = (vals: number[]) => {
  const lo = Math.min(...vals) - HEAD;
  const hi = Math.max(...vals) + HEAD;
  return (v: number) => ((v - lo) / (hi - lo)) * 100;
};

const toDepth = domain(fragrances.map((f) => f.depth));
const toForce = domain(fragrances.map((f) => f.force));

/** Every fragrance, pre-placed in display space. */
const plotted = fragrances.map((f) => ({ f, x: toDepth(f.depth), y: toForce(f.force) }));

const INSET = 7;
const SPAN = 100 - INSET * 2;
const pad = (v: number) => INSET + (v / 100) * SPAN;
const unpad = (v: number) => ((v - INSET) / SPAN) * 100;

const START: Point = { x: 58, y: 52 };

export default function Compass() {
  const root = useRef<HTMLElement>(null);
  const plot = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const frame = useRef(0);

  const [mark, setMark] = useState<Point>(START);
  const [live, setLive] = useState(false);

  /**
   * Nearest three, measured in display space rather than raw units —
   * otherwise "closest" would disagree with what the eye reads off the
   * plot, since the two axes have different spans.
   */
  const ranked = useMemo(
    () =>
      [...plotted]
        .map((p) => ({ ...p, d: Math.hypot(p.x - mark.x, p.y - mark.y) }))
        .sort((a, b) => a.d - b.d),
    [mark],
  );

  const shortlist = ranked.slice(0, 3);
  const best = shortlist[0].f;
  const shortIds = new Set(shortlist.map((s) => s.f.id));

  const pointToValue = useCallback((clientX: number, clientY: number): Point => {
    const box = plot.current?.getBoundingClientRect();
    if (!box) return START;
    // Clamped rather than rubber-banded: this is a bounded coordinate
    // space, not a scrollable surface — there is nothing past the edge
    // to hint at.
    return {
      x: gsap.utils.clamp(0, 100, unpad(((clientX - box.left) / box.width) * 100)),
      y: gsap.utils.clamp(0, 100, unpad((1 - (clientY - box.top) / box.height) * 100)),
    };
  }, []);

  const commit = useCallback(
    (clientX: number, clientY: number) => {
      // One state write per frame. Pointermove fires faster than the
      // display refreshes and React does not need to hear all of it.
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => setMark(pointToValue(clientX, clientY)));
    },
    [pointToValue],
  );

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    setLive(true);
    // Capture keeps the drag alive when the pointer leaves the plot,
    // which is exactly where people overshoot to.
    e.currentTarget.setPointerCapture(e.pointerId);
    commit(e.clientX, e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragging.current) commit(e.clientX, e.clientY);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  useGSAP(
    () => {
      const heading = root.current?.querySelector<HTMLElement>("[data-heading]");
      if (heading) revealLines(heading);

      if (reducedMotion()) {
        gsap.set("[data-dot]", { autoAlpha: 1, scale: 1 });
        return;
      }

      // The field populates as it comes into view — the plot filling
      // up rather than arriving pre-drawn.
      gsap.from("[data-dot]", {
        autoAlpha: 0,
        scale: 0.4,
        duration: 0.8,
        ease: "power3.out",
        stagger: { each: 0.03, from: "random" },
        scrollTrigger: { trigger: plot.current, start: "top 82%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section id="compass" ref={root} className="grain relative band">
      <div className="shell">
        {/* A compact head — this section is an instrument, and the
            instrument should be the biggest thing in it. */}
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-16">
          <div>
            <span className="t-label">03 — The Compass</span>
            <h2 data-heading className="t-h2 invisible mt-5">
              You don&rsquo;t know the name.
              <br />
              You know the <em className="t-italic">feeling</em>.
            </h2>
          </div>
          <p className="t-body lg:pb-1">
            Drag the marker anywhere on the field. Across is how dark the composition
            gets; up is how far it carries off the skin. The house answers with the three
            closest bottles it makes.
          </p>
        </div>

        {/* ---------------- the field ---------------- */}
        <div
          ref={plot}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="relative mt-10 aspect-[3/4] w-full cursor-crosshair touch-none select-none overflow-hidden rounded-sm border border-[color:color-mix(in_oklab,var(--color-ink)_14%,transparent)] bg-[color:color-mix(in_oklab,var(--color-parchment)_55%,transparent)] sm:aspect-[16/10] lg:aspect-[21/9]"
          role="application"
          aria-label="Fragrance finder. Drag the marker, or pick any fragrance dot."
        >
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <span className="absolute left-1/2 top-0 h-full w-px bg-[color:color-mix(in_oklab,var(--color-ink)_7%,transparent)]" />
            <span className="absolute left-0 top-1/2 h-px w-full bg-[color:color-mix(in_oklab,var(--color-ink)_7%,transparent)]" />
          </div>

          {/* The marker's reach, drawn as sillage. */}
          <div
            aria-hidden
            className="pointer-events-none absolute aspect-square -translate-x-1/2 translate-y-1/2 rounded-full"
            style={{
              left: `${pad(mark.x)}%`,
              bottom: `${pad(mark.y)}%`,
              width: "min(30%, 22rem)",
              transition: dragging.current
                ? "none"
                : "left 420ms var(--ease-out), bottom 420ms var(--ease-out)",
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--color-amber-300) 34%, transparent) 0%, transparent 68%)",
            }}
          />

          {plotted.map(({ f, x, y }) => {
            const on = shortIds.has(f.id);
            const isBest = f.id === best.id;
            return (
              <button
                key={f.id}
                data-dot
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLive(true);
                  setMark({ x, y });
                }}
                className={`key-${f.family} group absolute z-10 -translate-x-1/2 translate-y-1/2 rounded-full`}
                style={{ left: `${pad(x)}%`, bottom: `${pad(y)}%` }}
                aria-label={`${f.name} — ${f.line}`}
              >
                <span
                  className="block rounded-full transition-[width,height,opacity,box-shadow] duration-300"
                  style={{
                    width: isBest ? 20 : on ? 15 : 10,
                    height: isBest ? 20 : on ? 15 : 10,
                    background: "var(--key)",
                    opacity: on ? 1 : 0.4,
                    boxShadow: isBest
                      ? "0 0 0 6px color-mix(in oklab, var(--key) 22%, transparent)"
                      : "none",
                    transitionTimingFunction: "var(--ease-out)",
                  }}
                />
                <span
                  className={`t-label-tight pointer-events-none absolute left-1/2 top-[calc(100%+7px)] -translate-x-1/2 whitespace-nowrap text-[0.62rem] transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 ${
                    on ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {f.name}
                </span>
              </button>
            );
          })}

          <div
            aria-hidden
            className="pointer-events-none absolute z-20 -translate-x-1/2 translate-y-1/2"
            style={{
              left: `${pad(mark.x)}%`,
              bottom: `${pad(mark.y)}%`,
              transition: dragging.current
                ? "none"
                : "left 420ms var(--ease-out), bottom 420ms var(--ease-out)",
            }}
          >
            <span className="block h-7 w-7 rounded-full border-[1.5px] border-[color:var(--color-oudh)] bg-[color:var(--color-linen)] shadow-[0_2px_10px_rgba(36,27,18,0.22)]" />
            <span className="absolute left-1/2 top-1/2 block h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--color-oudh)]" />
          </div>

          {/* Only the vertical axis is captioned inside the box. The
              horizontal one sits underneath, because stacking four
              captions in two corners had "Luminous" and "Worn close"
              printing on top of each other. */}
          <span className="t-label absolute left-4 top-4">Fills the room</span>
          <span className="t-label absolute bottom-4 left-4">Worn close</span>
        </div>

        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <span className="t-label">Luminous</span>
          <span className="t-label order-last w-full text-center sm:order-none sm:w-auto">
            {live ? "Nearest three, updating live" : "Drag anywhere on the field"}
          </span>
          <span className="t-label">Resinous</span>
        </div>

        {/* ---------------- the answer ---------------- */}
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {shortlist.map(({ f }, i) => {
            const isBest = i === 0;
            return (
              <article
                key={f.id}
                className={`key-${f.family} flex gap-5 rounded-sm p-6 ${
                  isBest
                    ? "bg-[color:var(--color-oudh)] text-[color:var(--color-parchment)]"
                    : "bg-[color:var(--color-parchment)]"
                }`}
              >
                <Image
                  src={asset(f.image)}
                  alt=""
                  aria-hidden
                  width={400}
                  height={400}
                  sizes="96px"
                  className="h-auto w-20 shrink-0 self-start"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: "var(--key)" }}
                    />
                    <span
                      className="t-label"
                      style={isBest ? { color: "var(--color-amber-200)" } : undefined}
                    >
                      {isBest ? "Closest match" : `Also close · ${f.family}`}
                    </span>
                  </div>

                  <h3 className="t-h3 mt-2.5">{f.name}</h3>
                  <p
                    className="t-body mt-2 text-[0.84rem] leading-snug"
                    style={
                      isBest
                        ? {
                            color:
                              "color-mix(in oklab, var(--color-parchment) 70%, transparent)",
                          }
                        : undefined
                    }
                  >
                    {f.line}
                  </p>

                  <div className="t-num t-label-tight mt-4">
                    {f.price.toFixed(3)} OMR · 100ml
                  </div>
                  <div
                    className="t-label mt-2"
                    style={
                      isBest
                        ? {
                            color:
                              "color-mix(in oklab, var(--color-amber-200) 72%, transparent)",
                          }
                        : undefined
                    }
                  >
                    {f.perfumer}
                  </div>

                  {isBest && (
                    <a
                      href={`https://wa.me/${house.whatsapp}?text=${encodeURIComponent(
                        `Hello OMANLUXURY — I'd like to order ${f.name} 100ml (${f.price.toFixed(3)} OMR), engraved with my name.`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost mt-5 !px-5 !py-2.5"
                      style={{
                        color: "var(--color-parchment)",
                        borderColor: "color-mix(in oklab, var(--color-parchment) 32%, transparent)",
                      }}
                    >
                      Order this
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
