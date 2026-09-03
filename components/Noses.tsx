"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { fragrances, noses } from "@/lib/content";
import { gsap, reducedMotion, revealLines, revealUp } from "@/lib/motion";

/**
 * THE NOSES — the most under-used asset the brand owns.
 *
 * Dominique Ropion composed Portrait of a Lady and Carnal Flower.
 * Jean-Louis Sieuzac composed Opium and Fahrenheit. Maurice Roucel
 * composed Musc Ravageur. All three have worked for this house, and
 * on the live site their names appear once, in small text, near the
 * bottom of an individual product page.
 *
 * That is the single strongest trust signal a niche house can have and
 * it is being thrown away. Here it is a section: a list you read down,
 * with the bottles each one made assembling alongside.
 */
export default function Noses() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const current = noses[active];
  const madeBottles = current.made
    .map((name) => fragrances.find((f) => f.name === name))
    .filter(Boolean) as typeof fragrances;

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const heading = scope.querySelector<HTMLElement>("[data-heading]");
      if (heading) revealLines(heading);
      revealUp(scope);

      if (!reducedMotion()) {
        gsap.from("[data-row]", {
          autoAlpha: 0,
          y: 20,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.05,
          scrollTrigger: { trigger: "[data-list]", start: "top 84%", once: true },
        });
      }
    },
    { scope: root },
  );

  // The preview re-animates whenever the selection changes, so the
  // bottles read as being fetched for you rather than cross-fading.
  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.fromTo(
        "[data-preview-item]",
        { autoAlpha: 0, y: 22, rotate: -1.5 },
        {
          autoAlpha: 1,
          y: 0,
          rotate: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.07,
        },
      );
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <section
      id="noses"
      ref={root}
      className="grain relative band"
      style={{ backgroundColor: "var(--color-parchment)" }}
    >
      <div className="shell">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[44rem]">
            <span className="t-label">05 — The Noses</span>
            <h2 data-heading className="t-h1 invisible mt-6">
              The people who
              <br />
              actually <em className="t-italic">wrote</em> these.
            </h2>
          </div>
          <p className="t-lead max-w-[26rem] lg:pb-2">
            A house in Muscat does not get Dominique Ropion to answer the phone by
            accident. Eight perfumers, and what else they have signed.
          </p>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
          {/* ---------------- the list ---------------- */}
          <div data-list>
            {noses.map((n, i) => {
              const on = i === active;
              return (
                <button
                  key={n.name}
                  data-row
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={on}
                  className="group block w-full border-t border-[color:color-mix(in_oklab,var(--color-ink)_14%,transparent)] py-6 text-left last:border-b"
                >
                  <div className="flex items-baseline gap-5">
                    <span className="t-label w-6 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <h3
                          className="t-h3 transition-[color,transform] duration-300"
                          style={{
                            transitionTimingFunction: "var(--ease-out)",
                            color: on ? "var(--color-amber-600)" : undefined,
                          }}
                        >
                          {n.name}
                        </h3>
                        <span className="t-label">{n.house}</span>
                      </div>
                      <p className="t-body mt-2 text-[0.9rem]">{n.known}</p>

                      {/* Inline on small screens, where there is no
                          room for a preview column. */}
                      <div className="mt-3 flex flex-wrap gap-2 lg:hidden">
                        {n.made.map((m) => (
                          <span
                            key={m}
                            className="t-label-tight rounded-full border border-[color:color-mix(in_oklab,var(--color-ink)_18%,transparent)] px-3 py-1"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>

                    <span
                      aria-hidden
                      className="t-label-tight hidden shrink-0 transition-opacity duration-300 lg:block"
                      style={{ opacity: on ? 1 : 0 }}
                    >
                      {n.made.length} {n.made.length === 1 ? "bottle" : "bottles"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ---------------- the preview ---------------- */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="t-label mb-5">For this house</div>
              <div className="space-y-4">
                {madeBottles.map((f) => (
                  <div
                    key={f.id}
                    data-preview-item
                    className="flex items-center gap-4 rounded-sm bg-[color:var(--color-linen)] p-4"
                  >
                    <Image
                      src={f.image}
                      alt=""
                      aria-hidden
                      width={300}
                      height={300}
                      sizes="72px"
                      className="h-auto w-16 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="t-label-tight truncate">{f.name}</div>
                      <div className="t-num t-label mt-1.5">{f.price} OMR</div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="t-body mt-6 text-[0.85rem]">
                {current.name} works out of {current.house}.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
