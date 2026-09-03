"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { terroir } from "@/lib/content";
import { countUp, gsap, reducedMotion, revealLines, revealUp } from "@/lib/motion";

/**
 * ORIGINS — the three raw materials, and why they are not
 * interchangeable with anyone else's.
 *
 * This is the argument the live site never makes. Frankincense, Jabal
 * Akhdar rose and oud are the only things a Muscat house has that a
 * French one cannot simply buy at the same grade, and each is a story
 * about a place.
 *
 * Told as three full-bleed rooms rather than a column of cards: the
 * photograph takes the whole viewport, the text sits in one corner of
 * it, and the material's Arabic name is cut across the frame at
 * display size. A place-based argument should feel like being taken
 * somewhere, which a 50/50 image-and-paragraph split never does.
 */
export default function Origins() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      scope.querySelectorAll<HTMLElement>("[data-heading]").forEach((h) => revealLines(h));
      revealUp(scope);

      const years = scope.querySelector<HTMLElement>("[data-years]");
      if (years) countUp(years, 5000, "+");

      if (reducedMotion()) return;

      // The photograph drifts inside its own frame — oversized, so the
      // travel never exposes an edge.
      gsap.utils.toArray<HTMLElement>("[data-panel]").forEach((panel) => {
        const img = panel.querySelector<HTMLElement>("img");
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        }

        const glyph = panel.querySelector<HTMLElement>("[data-glyph]");
        if (glyph) {
          gsap.fromTo(
            glyph,
            { yPercent: 22, autoAlpha: 0 },
            {
              yPercent: -22,
              autoAlpha: 1,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        }
      });
    },
    { scope: root },
  );

  return (
    <section id="origins" ref={root} className="room-dark grain relative overflow-hidden">
      <div className="shell band pb-[clamp(3rem,6vw,5rem)]">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <span className="t-label">04 — Origins</span>
            <h2 data-heading className="t-h1 invisible mt-6">
              Three things Oman has
              <br />
              that <em className="t-italic">nowhere else</em> does.
            </h2>
          </div>
          <p data-up className="t-lead lg:self-end lg:pb-2">
            A perfume house in Paris can buy any material on the open market. What it
            cannot buy is the valley, the altitude, or four centuries of knowing which
            tree to cut and when to leave it alone.
          </p>
        </div>
      </div>

      {terroir.map((t, i) => {
        const right = t.side === "right";
        return (
          <article
            key={t.id}
            data-panel
            className="relative flex min-h-[88svh] items-end overflow-hidden"
          >
            <Image
              src={t.image}
              alt={`${t.material} — ${t.place}`}
              fill
              sizes="100vw"
              className="scale-[1.16] object-cover"
              style={{ objectPosition: t.focus }}
            />

            {/* Two washes: one that darkens the whole frame enough for
                type anywhere, one heavier under the corner the text
                actually lands in. */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, color-mix(in oklab, var(--color-oudh) 88%, transparent) 0%, color-mix(in oklab, var(--color-oudh) 30%, transparent) 52%, color-mix(in oklab, var(--color-oudh) 55%, transparent) 100%)",
              }}
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to ${right ? "left" : "right"}, color-mix(in oklab, var(--color-oudh) 72%, transparent) 0%, transparent 62%)`,
              }}
            />

            {/* The material's Arabic name, cut across the frame. */}
            <span
              data-glyph
              aria-hidden
              className={`pointer-events-none absolute top-[8%] select-none font-[family-name:var(--font-display)] leading-none ${
                right ? "left-[4%]" : "right-[4%]"
              }`}
              style={{
                fontSize: "clamp(7rem, 20vw, 20rem)",
                color: "color-mix(in oklab, var(--color-amber-100) 13%, transparent)",
              }}
            >
              {t.common.split("·")[1]?.trim()}
            </span>

            {/* The coordinate, in the opposite corner from the text. */}
            <div
              className={`absolute top-[calc(76px+clamp(1.5rem,4vw,3rem))] ${
                right ? "left-[clamp(1.25rem,5vw,4.5rem)]" : "right-[clamp(1.25rem,5vw,4.5rem)]"
              } flex items-center gap-3`}
            >
              <span className="t-num t-label">{t.coord}</span>
              <span className="h-px w-10 bg-[color:color-mix(in_oklab,var(--color-amber-200)_45%,transparent)]" />
            </div>

            <div className="shell relative w-full pb-[clamp(3rem,7vw,5.5rem)]">
              <div className={`max-w-[34rem] ${right ? "ml-auto" : ""}`}>
                <div className="flex items-center gap-4">
                  <span className="t-label">{String(i + 1).padStart(2, "0")}</span>
                  <span className="h-px w-12 shrink-0 bg-white/25" />
                  <span className="t-label-tight text-[color:var(--color-amber-200)]">
                    {t.place}
                  </span>
                </div>

                <h3 data-heading className="t-h2 invisible mt-6">
                  {t.claim}
                </h3>

                <p data-up className="t-body mt-6">
                  {t.body}
                </p>

                <div data-up className="t-label mt-7">
                  {t.material} · {t.common}
                </div>
              </div>
            </div>
          </article>
        );
      })}

      {/* The one number that frames all three. */}
      <div className="shell band">
        <div className="grid gap-10 md:grid-cols-[auto_1fr] md:gap-16">
          <div>
            <div
              data-years
              className="t-num font-[family-name:var(--font-display)] text-[clamp(4rem,12vw,9rem)] leading-none text-[color:var(--color-amber-200)]"
            >
              0
            </div>
            <div className="t-label mt-4">Years of the frankincense trade</div>
          </div>
          <p data-up className="t-lead md:self-end md:pb-3">
            The Land of Frankincense in Dhofar is a UNESCO World Heritage Site. The resin
            moved out of these wadis to Egypt, Rome and China for five millennia before
            anyone thought to put it in a spray bottle. The house is a recent chapter of
            a very old business.
          </p>
        </div>
      </div>
    </section>
  );
}
