import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Arc from "@/components/Arc";
import Compass from "@/components/Compass";
import Origins from "@/components/Origins";
import Noses from "@/components/Noses";
import Campaign from "@/components/Campaign";
import Collection from "@/components/Collection";
import Boutiques from "@/components/Boutiques";
import Footer from "@/components/Footer";

/**
 * Two things govern the running order.
 *
 * The ground alternates, because a change of room does the work of a
 * chapter break and keeps a long single-page site from reading as one
 * undifferentiated scroll. The hero and the Arc are the one adjacent
 * dark pair, and they earn it: one is a photograph, the other is an
 * empty black room, and they read nothing like each other.
 *
 *   Hero        dark       the campaign still, full-bleed
 *   Arc         dark       you descend into the scent
 *   Compass     linen      back out, to choose
 *   Origins     dark       the raw materials, shot dark by the house
 *   Noses       parchment  the people who wrote them
 *   Campaign    dark       the house's own photography, full-bleed
 *   Collection  linen      the shop
 *   Boutiques   linen      the counter
 *   Footer      dark
 *
 * So does the layout. No two adjacent sections share a shape: a
 * centred lockup, then a pinned 3D scene, then a full-width
 * instrument, then cinematic panels, then a list, then a mosaic, then
 * a grid. Repeating the heading-left/content-right pattern eight
 * times is what makes long pages feel generic, whatever the content.
 */
export default function Page() {
  return (
    <>
      <SmoothScroll />
      <Header />
      <main>
        <Hero />
        <Arc />
        <Compass />
        <Origins />
        <Noses />
        <Campaign />
        <Collection />
        <Boutiques />
      </main>
      <Footer />
    </>
  );
}
