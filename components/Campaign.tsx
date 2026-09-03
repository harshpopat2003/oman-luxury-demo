"use client";

import Image from "next/image";
import { asset } from "@/lib/asset";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reducedMotion, revealLines } from "@/lib/motion";

/**
 * THE FRAMES — the house's campaign photography, given a room.
 *
 * OMANLUXURY has shot a great deal of genuinely good work: a woman in
 * Nasaj among the khareef grass, the burners smoking on a warm sweep,
 * eight citruses on Portuguese tile. On the live store almost all of
 * it is compressed into a slider nobody reaches, or cropped into a
 * square product thumbnail.
 *
 * So this is deliberately NOT another heading-plus-grid. It is a
 * magazine spread: an irregular mosaic on a twelve-column field where
 * frames sit at different widths, start on different rows, and drift
 * at different rates as you pass them. Two frames break the container
 * entirely and run edge to edge. Type is reduced to marginalia,
 * because on this page the photographs are the argument.
 */

type Frame = {
  src: string;
  alt: string;
  caption: string;
  note: string;
  /** Twelve-column placement. */
  col: string;
  ratio: string;
  /** How hard it trails the page. Variation is what stops a grid reading as a grid. */
  drift: number;
  /** Vertical offset, in rem, applied only from lg up. */
  lift?: number;
};

const frames: Frame[] = [
  {
    src: "/scenes/for-her.webp",
    alt: "A woman in Omani dress among khareef grass",
    caption: "Nasaj",
    note: "Omani embroidery, worn as white flowers on leather",
    col: "lg:col-start-1 lg:col-span-5",
    ratio: "aspect-[4/5]",
    drift: 7,
  },
  {
    src: "/scenes/for-him.webp",
    alt: "A man holding a bottle of Wanderlust in tall grass",
    caption: "Wanderlust",
    note: "Green, aromatic, and cool — Oman after the rain",
    col: "lg:col-start-7 lg:col-span-6",
    ratio: "aspect-[4/5]",
    drift: -5,
    lift: 9,
  },
  {
    src: "/scenes/agarwood-scene.webp",
    alt: "Three scented agarwood burners, smoking",
    caption: "Luban · Oud · Anbar",
    note: "The three burners, lit",
    col: "full",
    ratio: "aspect-[16/9] md:aspect-[21/9]",
    drift: 5,
  },
  {
    src: "/scenes/main-collection.webp",
    alt: "Bottles from the Main Collection with brushed brass vessels",
    caption: "The Main Collection",
    note: "Serenity, Oud Aquilaria, Royal Incense",
    col: "lg:col-start-2 lg:col-span-5",
    ratio: "aspect-square",
    drift: 6,
  },
  {
    src: "/scenes/scene-overdose.webp",
    alt: "Lemons and citrus on painted tile",
    caption: "Overdose",
    note: "Eight citruses at once, exactly as reckless as it sounds",
    col: "lg:col-start-8 lg:col-span-4",
    ratio: "aspect-[4/5]",
    drift: -7,
    lift: 6,
  },
  {
    src: "/scenes/scene-hommage.webp",
    alt: "Hommage 1744 on agarwood, lit from behind",
    caption: "Hommage 1744",
    note: "Two years of development, and a date in November",
    col: "full",
    ratio: "aspect-[16/9] md:aspect-[21/9]",
    drift: 4,
  },
];

export default function Campaign() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const heading = scope.querySelector<HTMLElement>("[data-heading]");
      if (heading) revealLines(heading);

      if (reducedMotion()) return;

      // Each frame is unveiled from its own bottom edge, then drifts.
      // Different rates are the whole point — matched speeds would
      // collapse the mosaic back into a flat grid.
      gsap.utils.toArray<HTMLElement>("[data-frame]", scope).forEach((frame) => {
        const media = frame.querySelector<HTMLElement>("[data-media]");
        const inner = frame.querySelector<HTMLElement>("img");

        if (media) {
          gsap.fromTo(
            media,
            { clipPath: "inset(0% 0% 100% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.35,
              ease: "power3.out",
              scrollTrigger: { trigger: frame, start: "top 88%", once: true },
            },
          );
        }

        // The photograph moves inside its own window rather than the
        // window moving on the page, so nothing ever shows a gap.
        if (inner) {
          gsap.fromTo(
            inner,
            { yPercent: -Number(frame.dataset.drift) },
            {
              yPercent: Number(frame.dataset.drift),
              ease: "none",
              scrollTrigger: {
                trigger: frame,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        }
      });

      gsap.utils.toArray<HTMLElement>("[data-cap]", scope).forEach((cap) => {
        gsap.from(cap, {
          autoAlpha: 0,
          y: 14,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: cap, start: "top 94%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="frames" ref={root} className="room-dark grain relative overflow-hidden">
      {/* Head and standfirst share one baseline instead of stacking,
          so the mosaic starts high on the screen. */}
      <div className="shell relative pt-[clamp(5rem,11vw,9rem)]">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="t-label">06 — The Frames</span>
            <h2 data-heading className="t-h1 invisible mt-6 max-w-[16ch]">
              Six rooms the house has already <em className="t-italic">built</em>.
            </h2>
          </div>
          <p className="t-body max-w-[26rem] md:pb-2">
            All of this photography exists. Most of it is currently a 400-pixel
            thumbnail in a carousel. Shown at the size it was shot for, it does more
            selling than any description of a note pyramid.
          </p>
        </div>
      </div>

      <div className="mt-[clamp(3rem,7vw,6rem)] space-y-[clamp(3rem,7vw,6rem)] pb-[clamp(5rem,11vw,9rem)]">
        {/* Contained frames run on a twelve-column field; the two
            marked `full` break out and run edge to edge. */}
        <div className="shell grid grid-cols-1 gap-[clamp(1.5rem,3vw,2.5rem)] sm:grid-cols-2 lg:grid-cols-12">
          {frames.slice(0, 2).map((f) => (
            <FrameBlock key={f.src} frame={f} />
          ))}
        </div>

        <FullFrame frame={frames[2]} />

        <div className="shell grid grid-cols-1 gap-[clamp(1.5rem,3vw,2.5rem)] sm:grid-cols-2 lg:grid-cols-12">
          {frames.slice(3, 5).map((f) => (
            <FrameBlock key={f.src} frame={f} />
          ))}
        </div>

        <FullFrame frame={frames[5]} />
      </div>
    </section>
  );
}

function FrameBlock({ frame }: { frame: Frame }) {
  return (
    <figure
      data-frame
      data-drift={frame.drift}
      className={`${frame.col} relative`}
      style={frame.lift ? ({ "--lift": `${frame.lift}rem` } as React.CSSProperties) : undefined}
    >
      <div className={frame.lift ? "lg:translate-y-[var(--lift)]" : ""}>
        <div data-media className={`relative w-full overflow-hidden rounded-sm ${frame.ratio}`}>
          <Image
            src={asset(frame.src)}
            alt={frame.alt}
            fill
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 42vw"
            className="scale-[1.14] object-cover"
          />
        </div>
        <figcaption data-cap className="mt-4 flex items-baseline gap-4">
          <span className="t-label-tight shrink-0 text-[color:var(--color-amber-200)]">
            {frame.caption}
          </span>
          <span className="t-body text-[0.82rem] leading-snug">{frame.note}</span>
        </figcaption>
      </div>
    </figure>
  );
}

function FullFrame({ frame }: { frame: Frame }) {
  return (
    <figure data-frame data-drift={frame.drift} className="relative">
      <div data-media className={`relative w-full overflow-hidden ${frame.ratio}`}>
        <Image
          src={asset(frame.src)}
          alt={frame.alt}
          fill
          sizes="100vw"
          className="scale-[1.12] object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, color-mix(in oklab, var(--color-oudh) 72%, transparent) 0%, transparent 42%)",
          }}
        />
        <figcaption
          data-cap
          className="shell absolute inset-x-0 bottom-0 flex flex-wrap items-baseline gap-x-5 gap-y-1 pb-7"
        >
          <span className="t-h3 text-[color:var(--color-amber-200)]">{frame.caption}</span>
          <span className="t-body text-[0.85rem]">{frame.note}</span>
        </figcaption>
      </div>
    </figure>
  );
}
