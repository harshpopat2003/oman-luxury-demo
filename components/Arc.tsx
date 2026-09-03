"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { arcStages, fragrances, byId, type Fragrance } from "@/lib/content";
import { gsap, reducedMotion, revealLines, ScrollTrigger } from "@/lib/motion";

/**
 * THE ARC — the section this whole pitch exists for.
 *
 * A website cannot transmit smell, so the live site does what every
 * fragrance site does: prints "Top / Heart / Base" as three static
 * lists and hopes. But a note pyramid isn't a list. It's a structure
 * that moves through time — top notes are gone in twenty minutes, the
 * base is what's still on your shirt tomorrow. That's a timeline with
 * a depth axis, and it is the one thing a screen can actually show.
 *
 * So: scroll is time. The three note clouds sit at real depths in one
 * perspective and pass the camera as their moment arrives. The light
 * warms from citrus yellow through rose to oud as the composition
 * settles. You leave knowing what wearing it is like for a day, which
 * is the closest a browser gets to a sample on a card.
 *
 * Four fragrances with deliberately unlike arcs, so the comparison is
 * the point rather than the decoration.
 */

const featured = ["hommage-1744", "overdose", "dejan", "khanjar"];

/** Deterministic scatter — a cloud, not a grid, and stable across renders. */
function place(i: number, count: number) {
  // Golden angle spreads points evenly without clumping at any spoke.
  const angle = i * 2.399963;
  // Ring index keeps notes off the bottle at the centre.
  const ring = i % 3;
  const radius = 24 + ring * 9 + ((i * 7) % 4);
  // Clamped inside the frame: the words are set at display size and
  // never wrap, so an unclamped ring puts "Saffiano leather" half off
  // the right edge and the stage's overflow slices it in two.
  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
  return {
    left: `${clamp(50 + Math.cos(angle) * radius * 1.2, 15, 85)}%`,
    top: `${clamp(50 + Math.sin(angle) * radius * 0.95, 14, 86)}%`,
    z: -i * 26 - (i % 2) * 40,
    delay: (i / Math.max(count, 1)) * 0.4,
  };
}

const phases = [
  {
    key: "top" as const,
    name: "Top",
    window: "First 20 minutes",
    gloss:
      "The volatile fraction. Citrus and pepper evaporate fastest, which is why the opening is the least honest part of a fragrance — it is gone before you reach the car.",
  },
  {
    key: "heart" as const,
    name: "Heart",
    window: "20 minutes — 5 hours",
    gloss:
      "The composition proper. Florals, spice and resin hold the middle for most of a working day. If you only ever smell one part of a perfume, this is the one you are buying.",
  },
  {
    key: "base" as const,
    name: "Base",
    window: "5 hours — the next morning",
    gloss:
      "Oud, amber, musk and leather. The heaviest molecules, the last to leave, and the reason a scarf still smells of it a week later.",
  },
];

export default function Arc() {
  const root = useRef<HTMLElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const stageRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState<Fragrance>(() => byId(featured[0]));

  useGSAP(
    () => {
      const heading = root.current?.querySelector<HTMLElement>("[data-heading]");
      if (heading) revealLines(heading);

      const stage = root.current?.querySelector<HTMLElement>("[data-stage]");
      if (!stage) return;

      const groups = gsap.utils.toArray<HTMLElement>("[data-cloud]", stage);
      const bottle = stage.querySelector<HTMLElement>("[data-bottle]");

      if (reducedMotion()) {
        // No pin, no scrub, no flight. The three clouds simply stack
        // and everything stays readable.
        gsap.set(groups, { autoAlpha: 1, z: 0 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "+=340%",
          pin: true,
          scrub: 0.7,
          onUpdate: ({ progress }) => {
            // Written straight to the DOM. Routing a value that
            // changes every frame through setState would re-render
            // the whole section on each tick of the wheel.
            const i = Math.min(
              arcStages.length - 1,
              Math.floor(progress * arcStages.length),
            );
            if (timeRef.current) timeRef.current.textContent = arcStages[i].at;
            if (stageRef.current) stageRef.current.textContent = arcStages[i].label;

            stage
              .querySelectorAll<HTMLElement>("[data-tick]")
              .forEach((el, n) => el.classList.toggle("is-on", n <= i));
          },
        },
      });

      // Each cloud flies from far behind the camera to just past it,
      // brightening on approach and blowing out as it passes — the
      // molecules arriving, holding, and leaving.
      groups.forEach((group, i) => {
        tl.fromTo(
          group,
          { z: -900, autoAlpha: 0 },
          { z: 260, autoAlpha: 1, ease: "none", duration: 1 },
          i * 0.78,
        ).to(
          group,
          { z: 620, autoAlpha: 0, ease: "none", duration: 0.42 },
          i * 0.78 + 1,
        );
      });

      /* The light in the room warms as the composition settles: the
         yellow of citrus, then rose, then the red-brown of oud.

         Done as a cross-fade between three pre-painted gradient layers
         rather than by tweening a colour. Scrubbing background-color
         (or a custom property a gradient reads) repaints the full
         viewport on every frame of a pinned, full-screen section;
         opacity is composited and costs nothing. Same picture, without
         asking the main thread to re-rasterise a gradient 60 times a
         second. */
      const glows = gsap.utils.toArray<HTMLElement>("[data-glow]", stage);
      tl.to(glows[0], { autoAlpha: 0, ease: "none", duration: 1.2 }, 0)
        .fromTo(glows[1], { autoAlpha: 0 }, { autoAlpha: 1, ease: "none", duration: 1.2 }, 0)
        .to(glows[1], { autoAlpha: 0, ease: "none", duration: 1.2 }, 1.2)
        .fromTo(glows[2], { autoAlpha: 0 }, { autoAlpha: 1, ease: "none", duration: 1.2 }, 1.2)
        .fromTo(
          "[data-veil]",
          { autoAlpha: 0 },
          { autoAlpha: 1, ease: "none", duration: 2.4 },
          0,
        );

      if (bottle) {
        // The bottle recedes very slightly as the clouds pass it, so
        // the depth reads as travel rather than as things scaling.
        tl.fromTo(
          bottle,
          { z: 0, scale: 1 },
          { z: -140, scale: 0.94, ease: "none", duration: 2.4 },
          0,
        );
      }
    },
    // Built once, deliberately. See the note above the fragrance
    // switcher for why this must not depend on `active`.
    { scope: root },
  );

  /**
   * Switching fragrance changes the note text, and note counts differ
   * wildly (Overdose opens on eight, Dejan on one) — so the phase
   * table below the scene changes height, which moves the pinned
   * scene's end point. A refresh re-measures it in place.
   *
   * What this must NOT do is re-run the useGSAP above. Passing
   * `active.id` as a dependency there reverts the context and rebuilds
   * the pin while the user is standing inside it: the pin-spacer is
   * torn out from under the current scroll position, the document
   * collapses by several viewports, and you land in dead space with
   * the note clouds still parked at their `from` state — a blank
   * screen. The animation structure never varies between fragrances,
   * only the words inside the clouds, and React swaps those on its
   * own without GSAP needing to know.
   */
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [active.id]);

  return (
    <section id="arc" ref={root} className="room-dark relative">
      {/* --- the argument, before the demonstration ---------------- */}
      <div className="shell band pb-0">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[46rem]">
            <span className="t-label">02 — The Arc</span>
            <h2 data-heading className="t-h1 invisible mt-6">
              A perfume is not a list of notes.
              <br />
              It is a <em className="t-italic">day</em>.
            </h2>
          </div>
          <p className="t-lead max-w-[24rem] lg:pb-3">
            Scroll to move through twelve hours of wear. The notes arrive when they
            actually arrive, and leave when they actually leave.
          </p>
        </div>
      </div>

      {/* --- the pinned scene -------------------------------------- */}
      <div
        data-stage
        className="scene-3d relative mt-16 flex h-[100svh] flex-col overflow-hidden"
        style={{ backgroundColor: "#241a10" }}
      >
        {/* Three light sources, cross-faded by the timeline: citrus,
            then rose, then oud. */}
        {["#f0cf8d", "#b56b70", "#8a5f16"].map((c, i) => (
          <div
            key={c}
            data-glow
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: i === 0 ? 1 : 0,
              background: `radial-gradient(58% 48% at 50% 50%, color-mix(in oklab, ${c} 42%, transparent) 0%, transparent 70%)`,
            }}
          />
        ))}

        {/* The room darkening as the base takes over. */}
        <div
          data-veil
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0"
          style={{ backgroundColor: "#100b06" }}
        />

        {/* --- the three clouds ------------------------------------ */}
        {phases.map((phase, pi) => {
          const notes = active[phase.key];
          return (
            <div
              key={phase.key}
              data-cloud
              className="layer-3d pointer-events-none absolute inset-0 opacity-0"
            >
              {notes.map((note, i) => {
                const p = place(i, notes.length);
                return (
                  <span
                    key={`${note}-${i}`}
                    className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
                    style={{
                      left: p.left,
                      top: p.top,
                      transform: `translate3d(-50%, -50%, ${p.z}px)`,
                      color:
                        pi === 0
                          ? "var(--color-amber-100)"
                          : pi === 1
                            ? "var(--color-rose-soft)"
                            : "var(--color-amber-300)",
                    }}
                  >
                    <span
                      className="t-h2 font-[family-name:var(--font-display)]"
                      style={{
                        // The notes are light in a dark room, so they
                        // carry their own bloom rather than sitting on
                        // the background as flat grey type.
                        textShadow: "0 0 26px color-mix(in oklab, currentColor 45%, transparent)",
                      }}
                    >
                      {note}
                    </span>
                  </span>
                );
              })}
            </div>
          );
        })}

        {/* --- the bottle, held at the centre ---------------------- */}
        <div
          data-bottle
          className="layer-3d pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <Image
            src={active.image}
            alt=""
            aria-hidden
            width={1100}
            height={1100}
            sizes="(max-width: 768px) 55vw, 26vw"
            className="h-auto w-[min(55vw,20rem)]"
          />
        </div>

        {/* --- the readout ----------------------------------------- */}
        <div className="shell relative z-10 mt-auto flex flex-col gap-8 pb-10 pt-24 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="t-label mb-3">Elapsed</div>
            <div className="flex items-baseline gap-4">
              <span
                ref={timeRef}
                className="t-num font-[family-name:var(--font-display)] text-[clamp(2.6rem,7vw,4.6rem)] leading-none text-[color:var(--color-amber-200)]"
              >
                0 min
              </span>
              <span ref={stageRef} className="t-label-tight opacity-70">
                The spray
              </span>
            </div>

            <ol className="mt-6 flex items-center gap-1.5" aria-hidden>
              {arcStages.map((s) => (
                <li
                  key={s.at}
                  data-tick
                  className="h-[2px] w-9 bg-white/15 transition-colors duration-300 [&.is-on]:bg-[color:var(--color-amber-300)]"
                />
              ))}
            </ol>
          </div>

          {/* Switching the fragrance re-runs the scene with a new
              composition, so the arcs can be compared rather than
              just admired. */}
          <div className="lg:text-right">
            <div className="t-label mb-4">Wearing</div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {featured.map((id) => {
                const f = byId(id);
                const on = f.id === active.id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActive(f)}
                    aria-pressed={on}
                    className={`t-label-tight rounded-full border px-4 py-2.5 transition-colors duration-200 ${
                      on
                        ? "border-[color:var(--color-amber-300)] bg-[color:var(--color-amber-300)] text-[color:var(--color-oudh)]"
                        : "border-white/20 text-[color:var(--color-parchment)] hover:border-white/50"
                    }`}
                    style={{ transitionTimingFunction: "var(--ease-out)" }}
                  >
                    {f.name}
                  </button>
                );
              })}
            </div>
            <p className="t-body mt-4 max-w-[22rem] lg:ml-auto">
              {active.line} <span className="opacity-60">— {active.perfumer}</span>
            </p>
          </div>
        </div>
      </div>

      {/* --- what the three phases actually mean ------------------- */}
      <div className="shell band">
        <div className="grid gap-px overflow-hidden rounded-sm bg-white/10 md:grid-cols-3">
          {phases.map((p, i) => (
            <div key={p.key} className="bg-[color:var(--color-oudh)] p-8">
              <div className="flex items-baseline justify-between">
                <span className="t-h3 text-[color:var(--color-amber-200)]">{p.name}</span>
                <span className="t-label">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="t-label-tight mt-3 opacity-60">{p.window}</div>
              <p className="t-body mt-5">{p.gloss}</p>
              <div className="mt-6 flex flex-wrap gap-x-3 gap-y-1.5">
                {active[p.key].map((n) => (
                  <span key={n} className="t-label-tight opacity-45">
                    {n}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="t-body mt-8 max-w-[38rem]">
          Note pyramids are published by the house on every product page. The timings
          above are how these families behave on skin — the reason a{" "}
          {fragrances.length}-bottle collection is worth smelling twice, an hour apart.
        </p>
      </div>
    </section>
  );
}
