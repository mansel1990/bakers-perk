/**
 * Seed menu (2026 rate card from cake_menu.md). Prices are admin-editable once the
 * DB phase lands; until then this file is the menu source.
 */
export type MenuItem = {
  slug: string;
  name: string;
  category: string;
  price: string;
  tags: string;
  image?: string; // product photo under /public/images — add when available
};

const INR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function cakePrice(half: number | null, full: number | null) {
  if (half != null && full != null) return `½ kg ${INR(half)} — 1 kg ${INR(full)}`;
  if (full != null) return `1 kg ${INR(full)}`;
  if (half != null) return `½ kg ${INR(half)}`;
  return "Enquire for price";
}

function item(name: string, category: string, price: string, tags: string): MenuItem {
  return { slug: slugify(name), name, category, price, tags };
}

export const FULL_MENU: MenuItem[] = [
  // Standard Cakes
  item("Bakers Pak French Vanilla", "Standard Cakes", cakePrice(600, 1200), "vanilla eggless"),
  item("Black Forest", "Standard Cakes", cakePrice(600, 1200), "chocolate"),
  item("Irish Coffee", "Standard Cakes", cakePrice(600, 1300), "coffee"),
  item("Nougat", "Standard Cakes", cakePrice(650, 1300), "nuts"),
  item("Lychee Rose", "Standard Cakes", cakePrice(650, 1300), "lychee rose fruit"),
  item("Fruit Trifle", "Standard Cakes", cakePrice(700, 1400), "fruit trifle"),
  item("Black Currant Pineapple", "Standard Cakes", cakePrice(650, 1200), "blackcurrant pineapple fruit"),
  item("Raspberry", "Standard Cakes", cakePrice(700, 1300), "berry raspberry fruit"),
  item("White Chocolate Gateau", "Standard Cakes", cakePrice(700, 1300), "white chocolate"),
  item("German Chocolate", "Standard Cakes", cakePrice(600, 1200), "chocolate german"),
  item("Double Chocolate", "Standard Cakes", cakePrice(700, 1300), "chocolate"),
  item("Swiss Blueberry", "Standard Cakes", cakePrice(650, 1300), "berry blueberry fruit"),
  item("Nutty Crunch", "Standard Cakes", cakePrice(700, 1400), "nuts crunch"),
  item("Chocolate Delight/Cream", "Standard Cakes", cakePrice(550, 1100), "chocolate cream"),
  item("Toffee Chocolate", "Standard Cakes", cakePrice(700, 1400), "chocolate toffee caramel"),
  item("Berry", "Standard Cakes", cakePrice(700, 1400), "berry fruit"),

  // Premium Cakes
  item("Golden Belgian Chocolate", "Premium Cakes", cakePrice(800, 1600), "chocolate belgian premium"),
  item("Ferrero Rocher Treat", "Premium Cakes", cakePrice(900, 1800), "chocolate nuts hazelnut ferrero premium"),
  item("Hazelnut Rich Chocolate Cream", "Premium Cakes", cakePrice(850, 1700), "chocolate hazelnut nuts premium"),
  item("Oreo Cookie", "Premium Cakes", cakePrice(800, 1600), "chocolate oreo cookie premium"),
  item("Pistachio", "Premium Cakes", cakePrice(850, 1700), "pistachio nuts premium"),
  item("Caramel King", "Premium Cakes", cakePrice(800, 1500), "caramel premium"),
  item("Rasmalai Cream", "Premium Cakes", cakePrice(850, 1700), "rasmalai indian premium"),
  item("Rainbow", "Premium Cakes", cakePrice(null, 1500), "rainbow premium"),
  item("Twin Delight", "Premium Cakes", cakePrice(750, 1500), "premium"),
  item("Pina Colada", "Premium Cakes", cakePrice(900, 1800), "pina colada tropical premium"),
  item("Red Velvet", "Premium Cakes", cakePrice(800, 1600), "red velvet eggless premium"),
  item("Opera", "Premium Cakes", cakePrice(950, 2000), "chocolate opera premium"),

  // Exotic Cakes
  item("New York Baked Cheese Cake", "Exotic Cakes", "Enquire for price", "cheesecake cheese exotic"),
  item("Blueberry, Lemon, Strawberry, Mango", "Exotic Cakes", "Enquire for price", "blueberry lemon strawberry mango fruit exotic"),

  // Tiramisu & Mousse
  item("Tiramisu Tub", "Tiramisu & Mousse", cakePrice(900, 2000), "tiramisu coffee mousse jar"),
  item("Dream Cake", "Tiramisu & Mousse", cakePrice(850, 1900), "mousse dream"),
  item("Caramel Fudge", "Tiramisu & Mousse", cakePrice(900, 2000), "caramel fudge mousse"),
  item("Triple Chocolate Mousse", "Tiramisu & Mousse", cakePrice(null, 1800), "chocolate mousse"),
  item("Hazelnut Praline", "Tiramisu & Mousse", cakePrice(900, 1800), "hazelnut praline mousse nuts"),

  // Doughnuts
  item("Custard Doughnut", "Doughnuts", INR(120), "custard donut"),
  item("Cream Doughnut", "Doughnuts", INR(120), "cream donut"),
  item("Steffect Doughnut", "Doughnuts", INR(110), "donut"),
  item("Chocolate Glazed Doughnut", "Doughnuts", INR(90), "chocolate donut glazed"),
  item("Double Chocolate Doughnut", "Doughnuts", INR(100), "chocolate donut"),

  // Tarts & Pies
  item("Lemon Tart", "Tarts & Pies", INR(70), "lemon tart"),
  item("Chocolate Tart", "Tarts & Pies", INR(70), "chocolate tart"),
  item("Apple Pie", "Tarts & Pies", INR(80), "apple pie tart"),
];

/**
 * Category metadata for the /menu page — drives the section banners and the
 * sticky jump-nav. `image` is an optional hook: drop a real product/mood photo
 * path here later and the banner upgrades from a typographic gradient to a photo
 * automatically. Order here is the order categories render in.
 */
export type MenuCategory = {
  name: string;
  id: string;
  blurb: string;
  image?: string;
};

export const MENU_CATEGORIES: MenuCategory[] = [
  { name: "Standard Cakes", id: "standard-cakes", blurb: "Everyday classics, baked fresh — vanilla, black forest, chocolate and more.", image: "/images/menu-standard.jpg" },
  { name: "Premium Cakes", id: "premium-cakes", blurb: "A richer league — Belgian chocolate, Ferrero, pistachio and red velvet.", image: "/images/menu-premium.jpg" },
  { name: "Exotic Cakes", id: "exotic-cakes", blurb: "Baked cheesecakes and seasonal fruit specials, made to enquiry.", image: "/images/menu-exotic.jpg" },
  { name: "Tiramisu & Mousse", id: "tiramisu-mousse", blurb: "Spoonable indulgence — tiramisu tubs, mousse and praline dreams.", image: "/images/menu-tiramisu.jpg" },
  { name: "Doughnuts", id: "doughnuts", blurb: "Soft, filled and glazed — the daily counter favourites.", image: "/images/menu-doughnuts.jpg" },
  { name: "Tarts & Pies", id: "tarts-pies", blurb: "Buttery shells with lemon, chocolate and spiced apple.", image: "/images/menu-tarts.jpg" },
];

/** Items grouped by category, in MENU_CATEGORIES order — for the menu page. */
export function getMenuByCategory(): { category: MenuCategory; items: MenuItem[] }[] {
  return MENU_CATEGORIES.map((category) => ({
    category,
    items: FULL_MENU.filter((m) => m.category === category.name),
  })).filter((g) => g.items.length > 0);
}

/** True when a menu item is flagged eggless via its tags. */
export const isEggless = (m: MenuItem) => /\beggless\b/.test(m.tags);

/** Home-page index — curated highlights; full rate card is on /menu */
const FEATURED_SLUGS = [
  "black-forest",
  "double-chocolate",
  "red-velvet",
  "golden-belgian-chocolate",
  "ferrero-rocher-treat",
  "swiss-blueberry",
  "new-york-baked-cheese-cake",
  "tiramisu-tub",
  "custard-doughnut",
  "lemon-tart",
] as const;

export const FEATURED_MENU: MenuItem[] = FEATURED_SLUGS.map(
  (slug) => FULL_MENU.find((m) => m.slug === slug)!
);
