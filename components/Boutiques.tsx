"use client";

import Image from "next/image";
import { asset } from "@/lib/asset";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { boutiques, giftSets, house } from "@/lib/content";
import { countUp, revealLines, revealUp, tiltCard, unveil, gsap } from "@/lib/motion";

/**
 * WHERE TO GET ONE.
 *
 * Two honest routes, in the order a real customer uses them. First
 * the Explorer set, because seventeen unsmelled fragrances at 67–140
 * OMR is an unreasonable ask and 48 OMR for all of them is not.
 * Then the counters, because in Oman most of this is still bought in
 * a mall on a Thursday evening.
 */
export default function Boutiques() {
  const root = useRef<HTMLElement>(null);

  const oman = boutiques.filter((b) => ["Muscat", "Salalah"].includes(b.city));
  const abroad = boutiques.filter((b) => !["Muscat", "Salalah"].includes(b.city));

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      scope.querySelectorAll<HTMLElement>("[data-heading]").forEach((h) => revealLines(h));
      revealUp(scope);

      const still = scope.querySelector<HTMLElement>("[data-still]");
      if (still) unveil(still);

      const doors = scope.querySelector<HTMLElement>("[data-doors]");
      if (doors) countUp(doors, house.doors);

      const stops = gsap.utils
        .toArray<HTMLElement>("[data-gift]", scope)
        .map((el) => tiltCard(el, { max: 5, lift: 20 }));

      return () => stops.forEach((s) => s());
    },
    { scope: root },
  );

  return (
    <section id="boutiques" ref={root} className="grain relative band">
      <div className="shell">
        <div className="max-w-[44rem]">
          <span className="t-label">08 — Ways in</span>
          <h2 data-heading className="t-h1 invisible mt-6">
            Nobody should buy
            <br />
            a perfume <em className="t-italic">unsmelled</em>.
          </h2>
        </div>

        {/* ---------------- the Explorer set ---------------- */}
        <div className="scene-near mt-14 grid items-stretch gap-px overflow-hidden rounded-sm bg-[color:color-mix(in_oklab,var(--color-ink)_12%,transparent)] lg:grid-cols-2">
          <div
            data-still
            className="relative min-h-[22rem] overflow-hidden bg-[color:var(--color-parchment)]"
          >
            <Image
              src={asset(giftSets[0].image)}
              alt="The Explorer Collection — all seventeen fragrances at 3ml"
              fill
              sizes="(max-width: 1024px) 100vw, 44vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center bg-[color:var(--color-parchment)] p-[clamp(1.75rem,4vw,3.5rem)]">
            <span className="t-label">The Explorer Collection</span>
            <h3 className="t-h2 mt-5">All seventeen, at 3ml.</h3>
            <p data-up className="t-body mt-6 max-w-[38ch]">
              The honest way to choose. Wear each one for a full day — the Arc above is
              the reason a two-minute strip test tells you almost nothing about a
              fragrance built on oud and resin. The cost of the set comes off your first
              100ml bottle.
            </p>

            <div className="mt-9 flex flex-wrap items-end gap-x-8 gap-y-4">
              <div>
                <div className="t-num font-[family-name:var(--font-display)] text-[3rem] leading-none">
                  {giftSets[0].price}
                </div>
                <div className="t-label mt-2">OMR · 17 × 3ml</div>
              </div>
              <a
                href={`https://wa.me/${house.whatsapp}?text=${encodeURIComponent(
                  "Hello OMANLUXURY — I'd like to order The Explorer Collection (48.000 OMR).",
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-solid"
              >
                Order the set
              </a>
            </div>
          </div>
        </div>

        {/* ---------------- the other two ---------------- */}
        <div className="scene-near mt-5 grid gap-5 sm:grid-cols-2">
          {giftSets.slice(1).map((g) => (
            <article
              key={g.name}
              data-gift
              className="layer-3d flex items-center gap-6 rounded-sm bg-[color:var(--color-parchment)] p-6"
            >
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-sm">
                <Image
                  src={asset(g.image)}
                  alt={g.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <h3 className="t-h3">{g.name}</h3>
                <p className="t-body mt-2 text-[0.85rem]">{g.note}</p>
                <div className="t-num t-label-tight mt-3">{g.price.toFixed(3)} OMR</div>
              </div>
            </article>
          ))}
        </div>

        {/* ---------------- the counters ---------------- */}
        <div className="mt-24 grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div>
            <h3 data-heading className="t-h2 invisible">
              And {house.doors} doors
              <br />
              in {house.countries} countries.
            </h3>
            <p data-up className="t-body mt-7 max-w-[36ch]">
              The house sells through its own boutiques in Oman and through selected
              fragrance retailers abroad. If you are anywhere near Muscat, the flagship on
              Oman Avenues has the engraving bench on site and will cut a name while you
              wait.
            </p>

            <div className="mt-10">
              <div
                data-doors
                className="t-num font-[family-name:var(--font-display)] text-[clamp(3.5rem,9vw,6rem)] leading-none text-[color:var(--color-amber-600)]"
              >
                0
              </div>
              <div className="t-label mt-3">Points of sale worldwide</div>
            </div>
          </div>

          <div>
            {[
              { title: "Oman", rows: oman },
              { title: "Selected abroad", rows: abroad },
            ].map((group) => (
              <div key={group.title} className="mb-10 last:mb-0">
                <div className="t-label mb-4">{group.title}</div>
                <ul>
                  {group.rows.map((b) => (
                    <li
                      key={`${b.city}-${b.place}`}
                      data-up
                      className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-[color:color-mix(in_oklab,var(--color-ink)_14%,transparent)] py-4 last:border-b"
                    >
                      <div className="flex items-baseline gap-4">
                        <span className="t-label w-16 shrink-0">{b.city}</span>
                        <span className="t-label-tight">{b.place}</span>
                      </div>
                      <span className="t-body text-[0.8rem]">{b.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
