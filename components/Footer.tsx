"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import Wordmark from "./Wordmark";
import { house } from "@/lib/content";
import { revealLines, revealUp } from "@/lib/motion";

const columns = [
  {
    title: "The house",
    links: [
      { label: "The Arc", href: "#arc" },
      { label: "Find yours", href: "#compass" },
      { label: "Origins", href: "#origins" },
      { label: "The noses", href: "#noses" },
    ],
  },
  {
    title: "Buy",
    links: [
      { label: "The collection", href: "#collection" },
      { label: "The frames", href: "#frames" },
      { label: "Boutiques", href: "#boutiques" },
      { label: "Explorer set", href: "#boutiques" },
    ],
  },
];

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const heading = scope.querySelector<HTMLElement>("[data-heading]");
      if (heading) revealLines(heading);
      revealUp(scope);
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="room-dark grain relative overflow-hidden">
      <div className="shell band">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          <div>
            <h2 data-heading className="t-h1 invisible max-w-[16ch]">
              {house.promise}
            </h2>

            <div data-up className="mt-11 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${house.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                Message the boutique
              </a>
              <a href="#compass" className="btn btn-ghost">
                Find your fragrance
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <div className="t-label mb-5">{col.title}</div>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="t-label-tight link-draw opacity-75">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <div className="t-label mb-5">Follow</div>
              <ul className="space-y-3">
                {Object.entries(house.social).map(([k, v]) => (
                  <li key={k}>
                    <a
                      href={v}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="t-label-tight link-draw capitalize opacity-75"
                    >
                      {k}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="rule mt-16" />

        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Wordmark className="text-[0.95rem] text-[color:var(--color-parchment)]" />
            <p className="t-body mt-4 max-w-[42ch] text-[0.8rem]">
              {house.tagline}. Founded {house.founded} in {house.city},{" "}
              {house.country}. {house.shipping}. {house.engraving}.
            </p>
          </div>

          <p className="t-body max-w-[36ch] text-[0.72rem] leading-relaxed opacity-55">
            A speculative concept site built for a pitch. Not affiliated with or
            authorised by OMANLUXURY. Product photography, fragrance notes, perfumer
            credits and prices are the house&rsquo;s own, used here to demonstrate a
            proposed structure.
          </p>
        </div>
      </div>
    </footer>
  );
}
