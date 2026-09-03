"use client";

import Image from "next/image";
import { asset } from "@/lib/asset";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { fragrances, type Tier } from "@/lib/content";
import { Flip, gsap, reducedMotion, revealLines, tiltCard } from "@/lib/motion";

/**
 * THE COLLECTION — all seventeen, priced, credited, and filterable.
 *
 * The Compass is for people who don't know what they want. This is for
 * people who do, and it carries the two facts the live grid leaves
 * out: who composed it, and which tier it belongs to. A card that
 * says "Dominique Ropion" is doing more selling than any adjective.
 *
 * Filtering re-lays the grid with Flip rather than swapping the
 * contents underneath you — the purpose is "preventing a jarring
 * change": you can see a bottle leave rather than discovering it gone.
 */

const tiers: Array<{ key: Tier | "All"; label: string; note: string }> = [
  { key: "All", label: "Everything", note: "17 fragrances" },
  { key: "Main", label: "Main", note: "67 – 75 OMR" },
  { key: "Private", label: "Private", note: "97 OMR" },
  { key: "Limited", label: "Limited", note: "140 OMR" },
];

export default function Collection() {
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const [tier, setTier] = useState<Tier | "All">("All");

  const shown = fragrances.filter((f) => tier === "All" || f.tier === tier);

  /** Capture before React re-orders the DOM, play after. */
  const changeTier = (next: Tier | "All") => {
    if (next === tier) return;

    if (reducedMotion() || !grid.current) {
      setTier(next);
      return;
    }

    const state = Flip.getState(grid.current.querySelectorAll("[data-card]"));
    setTier(next);

    // One frame for React to commit the new list, then Flip reads the
    // new boxes and animates from the captured ones.
    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.5,
        ease: "power3.inOut",
        stagger: 0.02,
        absolute: true,
        // Cards that left or arrived get their own treatment, so the
        // set change reads as departure and arrival rather than a
        // scramble.
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { autoAlpha: 0, scale: 0.92 },
            { autoAlpha: 1, scale: 1, duration: 0.45, ease: "power3.out" },
          ),
        onLeave: (els) =>
          gsap.to(els, { autoAlpha: 0, scale: 0.94, duration: 0.28, ease: "power3.out" }),
      });
    });
  };

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const heading = scope.querySelector<HTMLElement>("[data-heading]");
      if (heading) revealLines(heading);

      if (!reducedMotion()) {
        gsap.from("[data-card]", {
          autoAlpha: 0,
          y: 40,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.05,
          scrollTrigger: { trigger: grid.current, start: "top 82%", once: true },
        });
      }

      const stops = gsap.utils
        .toArray<HTMLElement>("[data-card]", scope)
        .map((card) =>
          tiltCard(card, {
            max: 6,
            lift: 30,
            sheen: card.querySelector<HTMLElement>("[data-sheen]"),
          }),
        );

      return () => stops.forEach((s) => s());
    },
    { scope: root, dependencies: [tier] },
  );

  return (
    <section id="collection" ref={root} className="grain relative band">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-14">
          <div>
            <span className="t-label">07 — The Collection</span>
            <h2 data-heading className="t-h2 invisible mt-5">
              Seventeen, and who <em className="t-italic">made</em> them.
            </h2>
          </div>

          <div
            className="flex flex-wrap gap-2 lg:justify-end"
            role="group"
            aria-label="Filter by collection"
          >
            {tiers.map((t) => {
              const on = t.key === tier;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => changeTier(t.key)}
                  aria-pressed={on}
                  className={`t-label-tight rounded-full border px-4 py-2.5 transition-colors duration-200 ${
                    on
                      ? "border-[color:var(--color-oudh)] bg-[color:var(--color-oudh)] text-[color:var(--color-linen)]"
                      : "border-[color:color-mix(in_oklab,var(--color-ink)_22%,transparent)] hover:border-[color:var(--color-ink)]"
                  }`}
                  style={{ transitionTimingFunction: "var(--ease-out)" }}
                >
                  {t.label}
                  <span className="ml-2 opacity-50">{t.note}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          ref={grid}
          className="scene-near mt-14 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4"
        >
          {shown.map((f) => (
            <article
              key={f.id}
              data-card
              data-flip-id={f.id}
              className={`key-${f.family} layer-3d group relative`}
            >
              <div className="relative overflow-hidden rounded-sm bg-[color:var(--color-parchment)]">
                <Image
                  src={asset(f.image)}
                  alt={`${f.name} eau de parfum, 100ml`}
                  width={1100}
                  height={1100}
                  sizes="(max-width: 768px) 46vw, (max-width: 1024px) 30vw, 22vw"
                  className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.04]"
                  style={{ transitionTimingFunction: "var(--ease-out)" }}
                />

                {/* Light travelling across glass as the card tips. */}
                <span
                  data-sheen
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 w-[55%] opacity-0"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 0%, color-mix(in oklab, #fff 55%, transparent) 50%, transparent 100%)",
                  }}
                />

                {f.accolade && (
                  <span className="t-label-tight absolute left-3 top-3 rounded-full bg-[color:var(--color-oudh)] px-2.5 py-1 text-[0.6rem] text-[color:var(--color-amber-200)]">
                    Award 2025
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="t-h3 truncate">{f.name}</h3>
                  <div className="t-label mt-2 flex items-center gap-2">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: "var(--key)" }}
                    />
                    {f.family}
                  </div>
                </div>
                <div className="t-num t-label-tight shrink-0 pt-1">{f.price}</div>
              </div>

              <p className="t-body mt-3 text-[0.86rem] leading-relaxed">{f.line}</p>

              <div className="t-label mt-3 truncate" title={f.perfumer}>
                {f.perfumer}
              </div>
            </article>
          ))}
        </div>

        <p className="t-body mt-12 max-w-[42rem]">
          Every bottle is 100ml eau de parfum and carries free engraving. Prices in Omani
          rial, the same as in the boutique — the house does not run a separate online
          price.
        </p>
      </div>
    </section>
  );
}
