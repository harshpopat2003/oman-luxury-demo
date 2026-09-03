"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { house } from "@/lib/content";
import { depthField, gsap, reducedMotion, revealWords, suspendMotes } from "@/lib/motion";

/**
 * The opening room.
 *
 * Built on the house's own Hommage 1744 campaign still — the bottle on
 * agarwood driftwood, backlit by a hard golden disc, jasmine and
 * raspberry at its feet, smoke across the back. It is the best single
 * image the brand owns, and on the live store it is a banner you
 * scroll past in a second.
 *
 * The composition is taken from the photograph rather than imposed on
 * it: the halo sits just right of centre and the left third is empty
 * darkness, so the type takes that third and the crop is nudged right
 * to keep the bottle clear of it. The scrim runs left-to-right only as
 * far as the words need — the photograph is never flattened under a
 * grey wash.
 *
 * Three planes under one perspective: the still furthest back, the
 * smoke in the middle, the words nearest the camera. The pointer moves
 * the camera through them, so the halo drifts behind the headline
 * instead of the whole frame sliding as one flat picture.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scene = root.current?.querySelector<HTMLElement>("[data-scene]");
      const air = root.current?.querySelector<HTMLElement>("[data-air]");
      const title = root.current?.querySelector<HTMLElement>("[data-title]");

      gsap.utils.toArray<HTMLElement>("[data-z]", root.current!).forEach((el) => {
        gsap.set(el, { z: Number(el.dataset.z) });
      });

      if (title) revealWords(title, { immediate: true, delay: 0.25, stagger: 0.055 });

      /* Set the end state outright under reduced motion rather than
         relying on a `from` tween to land on it. A `from` hides its
         targets on the first frame, so anything that stops the tween
         completing leaves the copy permanently invisible. */
      if (reducedMotion()) {
        gsap.set("[data-fade]", { autoAlpha: 1, y: 0 });
        gsap.set("[data-still]", { autoAlpha: 1, scale: 1 });
      } else {
        // The photograph settles out of a slow push-in, so the frame
        // arrives a beat before the words rather than with them.
        gsap.from("[data-still]", {
          autoAlpha: 0,
          scale: 1.1,
          duration: 2.2,
          ease: "power3.out",
        });

        gsap.from("[data-fade]", {
          autoAlpha: 0,
          y: 18,
          duration: 0.95,
          ease: "power3.out",
          stagger: 0.09,
          delay: 0.85,
        });

        // The disc behind the bottle breathes. Held under a few percent
        // of scale so it registers as light, not as a pulse.
        gsap.to("[data-halo]", {
          scale: 1.06,
          opacity: 0.78,
          duration: 7,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      const stopField = scene ? depthField(scene) : undefined;
      const stopMotes = air ? suspendMotes(air, 20) : undefined;

      return () => {
        stopField?.();
        stopMotes?.();
      };
    },
    { scope: root },
  );

  return (
    <section
      id="top"
      ref={root}
      className="room-dark relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      <div data-scene className="scene-3d absolute inset-0">
        {/* --- the photograph --- */}
        <div data-still className="layer-3d absolute inset-0" data-depth="0.22" data-z="-160">
          <Image
            src="/scenes/hero.webp"
            alt="Hommage 1744 standing on agarwood, backlit by a golden disc"
            fill
            preload
            sizes="100vw"
            className="scale-[1.06] object-cover"
            style={{ objectPosition: "62% 48%" }}
          />
        </div>

        {/* A second disc of light laid over the one in the photograph,
            so the backlight can breathe without the frame moving. */}
        <div
          data-halo
          aria-hidden
          className="layer-3d pointer-events-none absolute inset-0 opacity-60"
          data-depth="0.3"
          style={{
            background:
              "radial-gradient(26% 34% at 62% 42%, color-mix(in oklab, var(--color-amber-200) 32%, transparent) 0%, transparent 70%)",
          }}
        />

        {/* --- scrims: one for the type, one floor for the plinth --- */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, color-mix(in oklab, var(--color-oudh) 93%, transparent) 0%, color-mix(in oklab, var(--color-oudh) 64%, transparent) 34%, transparent 64%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%]"
          style={{
            background:
              "linear-gradient(to top, color-mix(in oklab, var(--color-oudh) 86%, transparent) 0%, transparent 100%)",
          }}
        />

        <div
          data-air
          aria-hidden
          className="layer-3d pointer-events-none absolute inset-0"
          data-depth="-0.5"
        />
      </div>

      {/* --- the words --- */}
      <div className="scene-3d shell relative flex flex-1 items-center pb-20 pt-[9.5rem]">
        <div className="layer-3d max-w-[40rem]" data-depth="0.5" data-z="90">
          <div data-fade className="mb-8 flex items-center gap-4">
            <span className="h-px w-10 shrink-0 bg-[color:color-mix(in_oklab,var(--color-amber-200)_60%,transparent)]" />
            <span className="t-label whitespace-nowrap">
              {house.city} · Since {house.founded}
            </span>
          </div>

          <h1 data-title className="t-h1 invisible">
            The scent of
            <br />a <em className="t-italic">country</em>.
          </h1>

          <p data-fade className="t-lead mt-8 max-w-[30rem]">
            Frankincense from Dhofar. Rose from Jabal Akhdar. Oud that Omani dhows
            carried here for four hundred years — composed in Muscat by the noses behind{" "}
            <em className="t-italic">Portrait of a Lady</em> and{" "}
            <em className="t-italic">Opium</em>.
          </p>

          <div data-fade className="mt-10 flex flex-wrap items-center gap-3">
            <a href="#compass" className="btn btn-invert">
              Find your fragrance
            </a>
            <a href="#arc" className="btn btn-ghost">
              How a scent unfolds
            </a>
          </div>
        </div>
      </div>

      {/* --- the plinth --- */}
      <div
        data-fade
        className="glass-dark relative z-10 !border-x-0 !border-b-0"
      >
        <div className="shell flex flex-wrap items-center justify-between gap-x-10 gap-y-5 py-5">
          {[
            ["17", "Fragrances"],
            [String(house.doors), "Points of sale"],
            [String(house.countries), "Countries"],
            ["1744", "The year it starts"],
          ].map(([n, l]) => (
            <div key={l} className="flex items-baseline gap-3">
              <span className="t-num font-[family-name:var(--font-display)] text-[1.6rem] leading-none text-[color:var(--color-amber-200)]">
                {n}
              </span>
              <span className="t-label">{l}</span>
            </div>
          ))}

          <a
            href="#arc"
            className="t-label-tight group ml-auto hidden items-center gap-3 sm:flex"
            aria-label="Scroll to The Arc"
          >
            Scroll
            <span className="relative block h-px w-12 overflow-hidden bg-white/25">
              <span className="absolute inset-y-0 left-0 w-1/3 bg-[color:var(--color-amber-300)] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-[200%]" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
