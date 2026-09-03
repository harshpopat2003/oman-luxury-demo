/**
 * Every fact here is taken from omanluxury.store, the brand's Shopify
 * catalogue, or their own product pages — note pyramids, perfumer
 * credits, prices in OMR. Nothing is invented, because the pitch is
 * that the *structure* is new, not the truth.
 *
 * The two numbers that don't come from the brand are `depth` and
 * `force`. They're a reading of each composition, and they exist so
 * the Compass can lay seventeen bottles on a plane instead of an
 * alphabetical list. Labelled as the house's reading in the UI.
 */

export const house = {
  name: "OMANLUXURY",
  spoken: "Oman Luxury",
  tagline: "The essence of elegance",
  promise: "Born in Oman. Crafted for the world.",
  founded: 2012,
  city: "Muscat",
  country: "Sultanate of Oman",
  doors: 550,
  countries: 25,
  phone: "+968 9200 0000",
  whatsapp: "96892000000",
  email: "concierge@omanluxury.store",
  social: {
    instagram: "https://www.instagram.com/omanluxury/",
    facebook: "https://facebook.com/omanluxury",
    tiktok: "https://tiktok.com/@omanluxury",
    youtube: "https://youtube.com/@omanluxury",
  },
  shipping: "Complimentary delivery across Oman on orders over 67 OMR",
  engraving: "Free engraving on every 100ml bottle",
} as const;

export type Tier = "Main" | "Private" | "Limited";

export type Family = "Citrus" | "Green" | "Floral" | "Rose" | "Amber" | "Oud" | "Incense";

export type Fragrance = {
  id: string;
  name: string;
  /** Arabic name as the house writes it. */
  ar: string;
  price: number;
  tier: Tier;
  perfumer: string;
  /** One line — the thing you would say to someone at the counter. */
  line: string;
  /** The brand's own words, trimmed. */
  story: string;
  top: string[];
  heart: string[];
  base: string[];
  family: Family;
  /**
   * Compass coordinates, 0–100.
   * depth — luminous and airy (0) → resinous and dark (100)
   * force — worn close to the skin (0) → fills the room (100)
   */
  depth: number;
  force: number;
  image: string;
  /** Editorial still, where the house has shot one. */
  scene?: string;
  accolade?: string;
};

export const fragrances: Fragrance[] = [
  {
    id: "hommage-1744",
    name: "Hommage 1744",
    ar: "هوماج ١٧٤٤",
    price: 75,
    tier: "Main",
    perfumer: "Théo Belmas",
    line: "Natural oud, two years in the making, built around a date.",
    story:
      "A tribute to the founding of the Al Busaid state on 20 November 1744. Two years of development and Headspace extraction to hold natural agarwood still — smoke, restrained sweetness, and woody depth.",
    top: ["Pomelo", "Bergamot", "Lemon", "Raspberry"],
    heart: ["Oud", "White florals", "Ambroxan"],
    base: ["Cashmeran", "Incense", "Patchouli", "Amber"],
    family: "Oud",
    depth: 68,
    force: 74,
    image: "/products/hommage.webp",
    scene: "/scenes/scene-hommage.webp",
  },
  {
    id: "caden",
    name: "Caden",
    ar: "كيدن",
    price: 75,
    tier: "Main",
    perfumer: "Maxime Exler",
    line: "Coffee, booze and vanilla. The one that misbehaves.",
    story:
      "Bold and addictive — luxury with a playful twist. Boozy and smoky over vanilla sweetness, with suede, cade and tonka underneath.",
    top: ["Cardamom", "Saffron", "Boozy notes", "Cade"],
    heart: ["Cistus", "Suede", "Benzoin", "Coffee"],
    base: ["Tonka", "Vanilla", "Labdanum", "Guaiac wood", "Amberwood"],
    family: "Amber",
    depth: 72,
    force: 82,
    image: "/products/caden.webp",
    scene: "/scenes/scene-caden.webp",
    accolade: "Niche Fragrance of the Year 2025",
  },
  {
    id: "wanderlust",
    name: "Wanderlust",
    ar: "وندرلست",
    price: 75,
    tier: "Main",
    perfumer: "Jean-Louis Sieuzac",
    line: "Oman after rain — green, cool, unhurried.",
    story:
      "The essence of nature in a green olfactive direction: a fresh aromatic fougère laid over woody undertones.",
    top: ["Black currant", "Bergamot", "Green apple", "Orange", "Black pepper"],
    heart: ["Clary sage", "Tea", "Jasmine", "Fig"],
    base: ["Cedarwood", "Amber", "Sandalwood", "Musk"],
    family: "Green",
    depth: 18,
    force: 40,
    image: "/products/wanderlust.webp",
  },
  {
    id: "voyage",
    name: "Voyage",
    ar: "فوياج",
    price: 75,
    tier: "Main",
    perfumer: "Muatasim Al Hinai",
    line: "The frankincense route, worn as smoke and rope.",
    story:
      "A journey of a thousand tales beginning in the east, where a gate opens onto the golden era of Oman's maritime trade. Smoky, spiced, and built to last the day.",
    top: ["Bergamot", "Pink pepper", "Ginger"],
    heart: ["Rose", "Geranium", "Florals"],
    base: ["Patchouli", "Labdanum", "Incense", "Ambergris", "Musk"],
    family: "Incense",
    depth: 80,
    force: 72,
    image: "/products/voyage.webp",
  },
  {
    id: "flowerlush",
    name: "Flowerlush",
    ar: "فلاورلاش",
    price: 75,
    tier: "Main",
    perfumer: "Philippine Courtiere · Maurice Roucel · Pierre-Constantin Guéros",
    line: "A bouquet with oud beneath the floorboards.",
    story:
      "Charm and elegance in a floral–woody composition, given weight by oud, patchouli and sandalwood.",
    top: ["Citrus", "Bergamot", "Mandarin"],
    heart: ["Jasmine", "Rose", "Cyclamen"],
    base: ["Woods", "Musk", "Sandalwood", "Patchouli", "Oud"],
    family: "Floral",
    depth: 55,
    force: 50,
    image: "/products/flowerlush.webp",
    scene: "/scenes/scene-flowerlush.webp",
  },
  {
    id: "oud-aquilaria",
    name: "Oud Aquilaria",
    ar: "عود أكويلاريا",
    price: 67,
    tier: "Main",
    perfumer: "Dominique Ropion",
    line: "Two roses and an apple, falling into oud.",
    story:
      "A rich oudy rose that opens bright and settles warm — Omani mystique held in a composition by one of the great living perfumers.",
    top: ["Pink pepper", "Rosemary", "Apple"],
    heart: ["Damascus rose", "Bulgarian rose", "Clove", "Sage"],
    base: ["Amber", "Cistus", "Patchouli", "Oud"],
    family: "Rose",
    depth: 76,
    force: 70,
    image: "/products/oud-aquilaria.webp",
    scene: "/scenes/scene-oudaquilaria.webp",
  },
  {
    id: "royal-incense",
    name: "Royal Incense",
    ar: "البخور الملكي",
    price: 67,
    tier: "Main",
    perfumer: "Philippine Courtiere",
    line: "Honey poured over burning luban.",
    story:
      "A strong presence of pink pepper, then lily and geranium, falling to a dense sweet base of incense, honey, amber and leather.",
    top: ["Pink pepper"],
    heart: ["Lily", "Geranium"],
    base: ["Incense", "Amber", "Honey", "Vetiver", "Leather", "Cedarwood", "Musk"],
    family: "Incense",
    depth: 70,
    force: 62,
    image: "/products/royal-incense.webp",
  },
  {
    id: "belfiore",
    name: "Belfiore",
    ar: "بلفيوري",
    price: 67,
    tier: "Main",
    perfumer: "Marie Salamagne",
    line: "Apricots in Wakan, powdered and warm.",
    story:
      "For Wakan — the Omani village of palms, flowering trees and apricots. Sweet, powdery and floral, with fruit and suede.",
    top: ["Carrot", "Apricot"],
    heart: ["Osmanthus", "Gardenia"],
    base: ["Suede", "Oakmoss", "Honey"],
    family: "Floral",
    depth: 25,
    force: 30,
    image: "/products/belfiore.webp",
  },
  {
    id: "paramour",
    name: "Paramour",
    ar: "بارامور",
    price: 67,
    tier: "Main",
    perfumer: "Philippe Paparella-Paris",
    line: "Leathery rose with caramel on its breath.",
    story:
      "A lavish, erotic leathery rose — tangy and almost candied, iced with smoky leather over caramel, vanilla, musk and amber.",
    top: ["Bergamot", "Raspberry", "Grapefruit", "Saffron"],
    heart: ["Jasmine", "Lily", "Cinnamon", "Rose"],
    base: ["Musk", "Cedarwood", "Sandalwood", "Amber", "Vanilla", "Leather", "Caramel"],
    family: "Rose",
    depth: 66,
    force: 78,
    image: "/products/paramour.webp",
  },
  {
    id: "serenity",
    name: "Serenity",
    ar: "سيرينيتي",
    price: 67,
    tier: "Main",
    perfumer: "Pierre Negrin",
    line: "A mukhallat rewritten with light in it.",
    story:
      "Cumin, spice and oud — a traditional Middle Eastern structure infused with light and shadow.",
    top: ["Rose centifolia", "Saffron"],
    heart: ["Jasmine", "Clove", "Cedarwood", "Cumin"],
    base: ["Agarwood", "Patchouli", "Olibanum", "Leather", "Musk"],
    family: "Oud",
    depth: 78,
    force: 66,
    image: "/products/serenity.webp",
  },
  {
    id: "overdose",
    name: "Overdose",
    ar: "أوفردوز",
    price: 67,
    tier: "Main",
    perfumer: "Philippe Paparella-Paris",
    line: "Eight citruses at once. Exactly as reckless as it sounds.",
    story:
      "Built to evoke extreme bliss — an overdosed freshness of citrus, enriched with spice.",
    top: [
      "Lemon",
      "Orange",
      "Bergamot",
      "Black pepper",
      "Saffron",
      "Cardamom",
      "Grapefruit",
      "Mandarin",
    ],
    heart: ["Jasmine", "Orris", "Lily", "Orange flower", "Sage", "Fig"],
    base: [
      "Cedarwood",
      "Musk",
      "Sandalwood",
      "Vetiver",
      "Ambergris",
      "Tonka",
      "Patchouli",
      "Plum",
    ],
    family: "Citrus",
    depth: 12,
    force: 55,
    image: "/products/overdose.webp",
    scene: "/scenes/scene-overdose.webp",
  },
  {
    id: "zafar",
    name: "Zafar",
    ar: "ظفار",
    price: 97,
    tier: "Private",
    perfumer: "Pierre-Constantin Guéros",
    line: "Dhofar itself — olibanum, spice, and natural oud.",
    story:
      "A tribute to the land of incense and its scented heritage: oriental notes carried on fine natural oud, olibanum and spice.",
    top: ["Bergamot", "Pink pepper", "Rose"],
    heart: [
      "Lily of the valley",
      "Jasmine",
      "Olibanum",
      "Orris",
      "Orange flower",
      "Cinnamon",
    ],
    base: [
      "Vanilla",
      "Tonka",
      "Sandalwood",
      "Musk",
      "Patchouli",
      "Amber",
      "Moss",
      "Vetiver",
      "Oud",
    ],
    family: "Incense",
    depth: 82,
    force: 88,
    image: "/products/zafar.webp",
  },
  {
    id: "nasaj",
    name: "Nasaj",
    ar: "نسج",
    price: 97,
    tier: "Private",
    perfumer: "Meabh McCurtain",
    line: "Omani embroidery, read as white flowers on leather.",
    story:
      "Named for the traditional embroidery of Oman — delicate floral motifs threaded through contemporary design, an enduring expression of an artistic legacy.",
    top: ["Mandarin", "Tangerine", "Pink pepper", "Grapefruit", "Cardamom", "Pear"],
    heart: ["Tuberose", "Jasmine", "Neroli", "Lily", "Magnolia", "Gardenia"],
    base: [
      "Saffiano leather",
      "Benzoin",
      "Sandalwood",
      "Omani frankincense",
      "Tonka",
      "Patchouli",
      "Cypriol",
      "Ambroxan",
    ],
    family: "Floral",
    depth: 58,
    force: 68,
    image: "/products/nasaj.webp",
    scene: "/products/nasaj-alt.webp",
  },
  {
    id: "khanjar",
    name: "Khanjar",
    ar: "خنجر",
    price: 97,
    tier: "Private",
    perfumer: "Philippe Paparella-Paris · Muatasim Al Hinai",
    line: "The dagger on the flag — ambergris, leather, pure oud.",
    story:
      "Inspired by Oman's symbol of prestige: florals, saffron and bergamot, then a precious weight of natural pure oud, ambergris and leather.",
    top: [
      "Artemisia",
      "Bergamot",
      "Coriander",
      "Davana",
      "Mandarin",
      "Lavender",
      "Saffron",
    ],
    heart: [
      "Orris",
      "Geranium",
      "Everlasting",
      "Rose",
      "Vetiver",
      "Nutmeg",
      "Cedarwood",
    ],
    base: [
      "Ambergris",
      "Amyris",
      "Cypriol",
      "Patchouli",
      "Leather",
      "Labdanum",
      "Tonka",
      "Styrax",
      "Vanilla",
      "Musk",
      "Sandalwood",
      "Oud",
    ],
    family: "Oud",
    depth: 88,
    force: 90,
    image: "/products/khanjar.webp",
  },
  {
    id: "mariya",
    name: "Mariya",
    ar: "مارية",
    price: 97,
    tier: "Private",
    perfumer: "Hamid Merati-Kashani",
    line: "Taif rose over coffee and caramel.",
    story:
      "A handcrafted jewel of a young Omani woman — a rich blend of love and glamour, rose-forward with bourbon, over coffee, vanilla and caramel.",
    top: ["Bergamot", "Mandarin", "Orange blossom", "Coriander"],
    heart: ["Taif rose", "Bulgarian rose", "Geranium", "Bourbon"],
    base: ["Coffee santos", "Vanilla", "Patchouli", "Caramel"],
    family: "Rose",
    depth: 62,
    force: 72,
    image: "/products/mariya.webp",
  },
  {
    id: "angham",
    name: "Angham",
    ar: "أنغام",
    price: 140,
    tier: "Limited",
    perfumer: "Emilie Coppermann",
    line: "Written for the Royal Opera House. It carries.",
    story:
      "An orchestral symphony drawn from the Royal Opera House Muscat — exotic and sensual, bold yet mysterious, resolving into natural ambergris, sandalwood and leather.",
    top: ["Saffron", "Apple", "Citrus", "Clove"],
    heart: ["Orris", "Geranium", "Jasmine"],
    base: ["Ambergris", "Cedarwood", "Sandalwood", "Leather", "Benzoin", "Vanilla"],
    family: "Amber",
    depth: 74,
    force: 84,
    image: "/products/angham.webp",
  },
  {
    id: "dejan",
    name: "Dejan",
    ar: "دجن",
    price: 140,
    tier: "Limited",
    perfumer: "Dominique Ropion",
    line: "Jabal Akhdar rose, held over smoke.",
    story:
      "Inspired by the roses of Jabal Akhdar — an overwhelming smoky rose essence blended with natural exotic oud, musk and amber.",
    top: ["Jabal Akhdar rose water"],
    heart: ["Cypriol", "Cistus", "Labdanum"],
    base: ["Musk", "Amber", "Oud"],
    family: "Rose",
    depth: 85,
    force: 80,
    image: "/products/dejan.webp",
  },
];

export const byId = (id: string) => fragrances.find((f) => f.id === id)!;

/* ------------------------------------------------------------------ *
 * The three landscapes the house draws from — their own framing.
 *
 * `focus` and `side` are art direction, not layout defaults. Each
 * photograph has its subject in a different part of the frame, so the
 * crop origin and the corner the copy sits in are chosen per panel —
 * blind left/right alternation drops the rose out of frame on one and
 * prints the headline straight over the burning chips on the next.
 * ------------------------------------------------------------------ */

export const terroir = [
  {
    id: "dhofar",
    place: "Dhofar",
    coord: "17.0° N",
    material: "Boswellia sacra",
    common: "Frankincense · لبان",
    claim: "The finest frankincense on earth grows in one valley.",
    body:
      "Hojari resin comes from trees that survive the khareef — the monsoon that turns southern Oman green for three months a year. The tree is cut, then left alone. What bleeds out hardens into a tear you can burn, chew, or distil. Zafar, Royal Incense and Voyage are all built on it.",
    image: "/products/frankincense-resin.webp",
    focus: "62% 62%",
    side: "left",
    tint: "luban",
  },
  {
    id: "jabal-akhdar",
    place: "Jabal Akhdar",
    coord: "2,000 m",
    material: "Rosa damascena",
    common: "Omani rose · ورد",
    claim: "Picked before sunrise, distilled over a wood fire.",
    body:
      "On the terraces of the Green Mountain the rose harvest lasts about thirty days in April. The flowers are still cooked in clay stills over wood, by families who have held the method for generations. Dejan is that rose, put over smoke.",
    image: "/scenes/scene-oudaquilaria.webp",
    focus: "22% 68%",
    side: "right",
    tint: "rose",
  },
  {
    id: "agarwood",
    place: "The trade route",
    coord: "Muscat → Malabar",
    material: "Aquilaria",
    common: "Oud · عود",
    claim: "Oman did not grow oud. Oman moved it.",
    body:
      "Agarwood is a wound — resin an Aquilaria tree makes only once infection sets in. It never grew here, but Omani dhows carried it for centuries, which is why the Gulf wears it and Europe does not. The house buys the wood and distils, rather than reaching for a synthetic.",
    image: "/products/agarwood-anbar.webp",
    focus: "26% 72%",
    side: "right",
    tint: "oudh",
  },
] as const;

/* ------------------------------------------------------------------ *
 * The noses. Publicly credited on each product page — and buried there.
 * ------------------------------------------------------------------ */

export const noses = [
  {
    name: "Dominique Ropion",
    house: "IFF",
    known: "Portrait of a Lady · Alien · Carnal Flower",
    made: ["Oud Aquilaria", "Dejan"],
  },
  {
    name: "Jean-Louis Sieuzac",
    house: "Firmenich",
    known: "Opium · Dune · Fahrenheit",
    made: ["Wanderlust"],
  },
  {
    name: "Maurice Roucel",
    house: "Symrise",
    known: "Musc Ravageur · Envy · 24 Faubourg",
    made: ["Flowerlush"],
  },
  {
    name: "Pierre-Constantin Guéros",
    house: "Symrise",
    known: "A specialist in resins and incense",
    made: ["Zafar", "Flowerlush"],
  },
  {
    name: "Philippe Paparella-Paris",
    house: "Argeville",
    known: "Three compositions for the house",
    made: ["Khanjar", "Paramour", "Overdose"],
  },
  {
    name: "Emilie Coppermann",
    house: "Symrise",
    known: "Composed Angham for the Royal Opera House",
    made: ["Angham"],
  },
  {
    name: "Marie Salamagne",
    house: "Firmenich",
    known: "Known for luminous fruit and osmanthus",
    made: ["Belfiore"],
  },
  {
    name: "Muatasim Al Hinai",
    house: "OMANLUXURY",
    known: "Founder. The only Omani nose on this list.",
    made: ["Voyage", "Khanjar"],
  },
] as const;

/* ------------------------------------------------------------------ *
 * Retail
 * ------------------------------------------------------------------ */

export const boutiques = [
  { city: "Muscat", place: "Oman Avenues Mall", note: "Flagship · engraving bar in store" },
  { city: "Muscat", place: "Muscat Grand Mall", note: "Full collection" },
  { city: "Muscat", place: "Muscat International Airport", note: "Departures, Duty Free" },
  { city: "Salalah", place: "Salalah Grand Mall", note: "Frankincense counter" },
  { city: "Doha", place: "Printemps Doha", note: "Private Collection" },
  { city: "Paris", place: "Jovoy Paris", note: "Selected fragrances" },
  { city: "Milan", place: "Esxence", note: "Shown annually" },
  { city: "London", place: "Harrods Salon de Parfums", note: "Selected fragrances" },
] as const;

export const giftSets = [
  {
    name: "The Explorer Collection",
    price: 48,
    note: "All seventeen at 3ml. The honest way to choose.",
    image: "/products/explorer.webp",
  },
  {
    name: "The Trio Collection",
    price: 217,
    note: "Three 100ml bottles in the house case.",
    image: "/scenes/gift-scene.webp",
  },
  {
    name: "Royal Hojari Frankincense",
    price: 29,
    note: "300g of Dhofar's highest grade, in a hand-finished tin.",
    image: "/products/frankincense.webp",
  },
] as const;

/** The six beats of the Arc, in order. */
export const arcStages = [
  { at: "0 min", label: "The spray", phase: "top" },
  { at: "2 min", label: "Top notes flare", phase: "top" },
  { at: "20 min", label: "The heart opens", phase: "heart" },
  { at: "2 hrs", label: "The heart holds", phase: "heart" },
  { at: "5 hrs", label: "The base emerges", phase: "base" },
  { at: "12 hrs", label: "What stays on cloth", phase: "base" },
] as const;
