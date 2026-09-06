import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, Parisienne } from "next/font/google";
import { house, fragrances } from "@/lib/content";
import "./globals.css";
import DemoNotice from "@/components/DemoNotice";

/* Cormorant Garamond is a high-contrast Garamond revival — the thin
   strokes go very thin at display size, which is exactly the quality
   a fine-fragrance house wants and exactly what breaks below ~20px.
   So it is display-only, and Jost (a Futura-lineage geometric, the
   lineage of most perfume packaging) carries everything small. */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

/* The engraving script, and nothing else. The house cuts names into
   the glass in a connected script — this is that typeface's only job
   on the page, which is why a third family earns its place. */
const parisienne = Parisienne({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-parisienne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OMANLUXURY — Omani Fine Fragrance | Oud, Frankincense & Jabal Akhdar Rose",
  description:
    "An Omani fragrance house since 2012. Seventeen fragrances built on Dhofar frankincense, Jabal Akhdar rose and natural oud, composed by Dominique Ropion, Jean-Louis Sieuzac and Maurice Roucel. Muscat, and 550 doors across 25 countries.",
  keywords: [
    "Omani perfume",
    "oud perfume Oman",
    "frankincense perfume",
    "OMANLUXURY",
    "niche fragrance Muscat",
    "Hojari frankincense",
    "Jabal Akhdar rose perfume",
    "Dominique Ropion oud",
  ],
  openGraph: {
    title: "OMANLUXURY — The essence of elegance",
    description:
      "Born in Oman. Crafted for the world. Seventeen fragrances built on frankincense, rose and oud.",
    type: "website",
    locale: "en_OM",
    siteName: house.name,
  },
  other: {
    "format-detection": "telephone=no",
  },
};

/* A fragrance house lives on brand and product search, so the graph
   names the brand once and then every fragrance as an offer under it. */
const schema = {
  "@context": "https://schema.org",
  "@type": "Brand",
  name: house.name,
  slogan: house.tagline,
  foundingDate: String(house.founded),
  foundingLocation: { "@type": "Place", name: `${house.city}, ${house.country}` },
  sameAs: Object.values(house.social),
  makesOffer: fragrances.map((f) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Product",
      name: f.name,
      category: "Eau de Parfum",
      description: f.line,
      brand: { "@type": "Brand", name: house.name },
    },
    price: f.price.toFixed(3),
    priceCurrency: "OMR",
  })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jost.variable} ${parisienne.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <DemoNotice brand="OMANLUXURY" />
        {children}
      </body>
    </html>
  );
}
