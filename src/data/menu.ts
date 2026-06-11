/**
 * Seed menu (2020 rate card). Prices are admin-editable once the DB phase lands;
 * until then this file is the menu source.
 */
export type MenuItem = {
  slug: string;
  name: string;
  category: string;
  price: string;
  tags: string;
  image: string; // path under /public/images
};

export const MENU: MenuItem[] = [
  { slug: "choco-truffle", name: "Choco truffle", category: "Signature", price: "½ kg ₹450 — 1 kg ₹850", tags: "chocolate eggless", image: "/images/choco-truffle.jpg" },
  { slug: "red-velvet", name: "Red velvet", category: "Premium", price: "½ kg ₹650 — 1 kg ₹1,100", tags: "eggless", image: "/images/red-velvet.jpg" },
  { slug: "belgian-chocolate", name: "Belgian chocolate", category: "Premium", price: "½ kg ₹600 — 1 kg ₹1,200", tags: "chocolate", image: "/images/belgian-chocolate.jpg" },
  { slug: "blueberry-bliss", name: "Blueberry bliss", category: "Signature", price: "½ kg ₹600 — 1 kg ₹1,100", tags: "berry fruit", image: "/images/blueberry-bliss.jpg" },
  { slug: "new-york-cheesecake", name: "New York cheesecake", category: "Exotic cheesecakes", price: "1 kg ₹1,100", tags: "cheese", image: "/images/new-york-cheesecake.jpg" },
  { slug: "ferrero-rocher", name: "Ferrero rocher treat", category: "Premium", price: "½ kg ₹650 — 1 kg ₹1,200", tags: "chocolate nuts hazelnut", image: "/images/ferrero-rocher.jpg" },
  { slug: "butterscotch", name: "Butterscotch", category: "Signature", price: "½ kg ₹450 — 1 kg ₹800", tags: "caramel", image: "/images/butterscotch.jpg" },
  { slug: "cupcakes", name: "Cupcakes — 6 flavours", category: "Cupcakes", price: "₹70 each", tags: "vanilla blueberry caramel chocolate red velvet", image: "/images/cupcakes.jpg" },
  { slug: "dessert-jars", name: "Dessert jars", category: "Jars", price: "₹160 each", tags: "tiramisu mousse irish coffee jar", image: "/images/dessert-jars.jpg" },
  { slug: "doughnuts-tarts", name: "Doughnuts & tarts", category: "Treats", price: "from ₹35", tags: "donut lemon apple pie", image: "/images/doughnuts-tarts.jpg" },
];
