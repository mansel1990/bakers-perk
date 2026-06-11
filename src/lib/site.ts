/**
 * Single source of truth for shop info.
 * In a later phase these move to the `settings` table and become admin-editable.
 */
export const SITE = {
  name: "Baker's Perk",
  byline: "By Chef Alex",
  tagline: '"Bake this world a better place."',
  whatsapp: "919566074342",
  instagram: "https://www.instagram.com/bakers_perk",
  email: "alexjamez255@gmail.com",
  address: "13/5 Munusamy Lane, Adithanar Salai, Pudupet, Chennai 600002",
  hours: "Open daily · 11 AM – 7 PM",
  deliveryNote: "Delivering anywhere in Chennai",
  minLeadDays: 2,
};

export const waLink = (text: string) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
