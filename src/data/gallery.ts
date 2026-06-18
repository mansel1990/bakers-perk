export type Occasion =
  | "Weddings"
  | "Anniversary"
  | "Birthdays & Themed"
  | "Character & Novelty";

export type GalleryPhoto = {
  src: string;
  alt: string;
  caption: string;
  occasion?: Occasion; // used to group the curated showcase on /custom-cakes
};

export const GALLERY: GalleryPhoto[] = [
  { src: "/images/gallery-wedding-pradeep-ramya.jpg", alt: "Two-tier wedding cake for Pradeep and Ramya", caption: "Wedding — Pradeep & Ramya", occasion: "Weddings" },
  { src: "/images/gallery-silhouette-wedding.jpg", alt: "Four-tier love story silhouette wedding cake", caption: "Love story wedding cake", occasion: "Weddings" },
  { src: "/images/gallery-wedding-purple-gold.jpg", alt: "Four-tier purple and gold wedding cake", caption: "Purple & gold wedding", occasion: "Weddings" },
  { src: "/images/gallery-engagement-standing.jpg", alt: "Standing engagement celebration cake", caption: "Engagement cake", occasion: "Weddings" },
  { src: "/images/gallery-25th-anniversary.jpg", alt: "25th anniversary chocolate cake with gold roses", caption: "25th anniversary", occasion: "Anniversary" },
  { src: "/images/gallery-anniversary-hearts.jpg", alt: "Anniversary cake with red mirror glaze and hearts", caption: "Anniversary hearts", occasion: "Anniversary" },
  { src: "/images/gallery-heart-mirror-glaze.jpg", alt: "Heart-shaped mirror glaze cake with white roses", caption: "Heart mirror glaze", occasion: "Anniversary" },
  { src: "/images/gallery-red-velvet-heart.jpg", alt: "Heart-shaped red velvet birthday cake", caption: "Red velvet heart", occasion: "Birthdays & Themed" },
  { src: "/images/gallery-chocolate-birthday.jpg", alt: "Chocolate birthday cake with gold topper", caption: "Chocolate birthday", occasion: "Birthdays & Themed" },
  { src: "/images/gallery-apple-birthday.jpg", alt: "Apple-shaped birthday cake", caption: "Apple birthday cake", occasion: "Birthdays & Themed" },
  { src: "/images/gallery-gender-reveal.jpg", alt: "Gender reveal cake with boy or girl topper", caption: "Gender reveal", occasion: "Birthdays & Themed" },
  { src: "/images/gallery-floral-retirement.jpg", alt: "Two-tier floral retirement cake", caption: "Floral retirement cake", occasion: "Birthdays & Themed" },
  { src: "/images/gallery-minnie-mouse-birthday.jpg", alt: "Minnie Mouse first birthday cake", caption: "Minnie Mouse 1st birthday", occasion: "Character & Novelty" },
  { src: "/images/gallery-frozen-theme.jpg", alt: "Frozen themed birthday cake", caption: "Frozen theme", occasion: "Character & Novelty" },
  { src: "/images/gallery-farm-animals.jpg", alt: "Farm animals themed birthday cake", caption: "Farm animals theme", occasion: "Character & Novelty" },
  { src: "/images/gallery-spiderman-birthday.jpg", alt: "Spider-Man fourth birthday cake", caption: "Spider-Man 4th birthday", occasion: "Character & Novelty" },
  { src: "/images/gallery-astronaut-space.jpg", alt: "Astronaut space-themed third birthday cake", caption: "Space theme — 3rd birthday", occasion: "Character & Novelty" },
  { src: "/images/gallery-budweiser-bottle.jpg", alt: "Budweiser bottle shaped novelty cake", caption: "Budweiser bottle cake", occasion: "Character & Novelty" },
  { src: "/images/gallery-treasure-chest-belle.jpg", alt: "Treasure chest cake with Belle figurine", caption: "Treasure chest & Belle", occasion: "Character & Novelty" },
  { src: "/images/gallery-dog-topper.jpg", alt: "Hand-sculpted white dog cake topper", caption: "Dog cake topper", occasion: "Character & Novelty" },
  { src: "/images/gallery-peacock-cake.jpg", alt: "Peacock themed tiered cake", caption: "Peacock theme", occasion: "Character & Novelty" },
  { src: "/images/gallery-branding.jpg", alt: "Bakers Perk branded bags, boxes and napkins", caption: "Our packaging" },
];

/** Display order for the curated occasion rows on /custom-cakes. */
export const OCCASION_ORDER: Occasion[] = [
  "Weddings",
  "Birthdays & Themed",
  "Anniversary",
  "Character & Novelty",
];

export type OccasionGroup = { occasion: Occasion; photos: GalleryPhoto[] };

/**
 * Curated showcase for /custom-cakes — a representative subset per occasion
 * (not the full gallery). `limit` keeps each row tidy on mobile; the page links
 * out to /gallery for the rest.
 */
export function getCustomShowcase(limit = 4): OccasionGroup[] {
  return OCCASION_ORDER.map((occasion) => ({
    occasion,
    photos: GALLERY.filter((p) => p.occasion === occasion).slice(0, limit),
  })).filter((g) => g.photos.length > 0);
}
