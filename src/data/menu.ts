export type Category = "coffee" | "non-coffee" | "pastry" | "mains";

export type Addon = {
  name: string;
  extra: number;
};

export type MenuItem = {
  id: string;
  name: string;
  origin: string;
  desc: string;
  price: number;
  category: Category;
  image: string;
  tag?: string;
  soldOut?: boolean;
  /** Radio options (pilih salah satu per grup, mis. ukuran/penyajian) */
  options?: { label: string; choices: { name: string; extra: number }[] }[];
  /** Checkbox addons (boleh pilih banyak, mis. oat milk, telur) */
  addons?: Addon[];
};

export const categories: { id: Category | "all"; label: string; sub: string }[] = [
  { id: "all", label: "Semua", sub: "01" },
  { id: "coffee", label: "Coffee", sub: "02" },
  { id: "non-coffee", label: "Non-Coffee", sub: "03" },
  { id: "pastry", label: "Pastry", sub: "04" },
  { id: "mains", label: "Mains", sub: "05" },
];

const sizeOpt = {
  label: "Ukuran",
  choices: [
    { name: "Regular", extra: 0 },
    { name: "Large", extra: 8000 },
  ],
};

const tempOpt = {
  label: "Penyajian",
  choices: [
    { name: "Hot", extra: 0 },
    { name: "Iced", extra: 3000 },
  ],
};

export const menu: MenuItem[] = [
  {
    id: "c1",
    name: "Kala Latte",
    origin: "Single Origin · Gayo",
    desc: "Espresso lembut dengan susu segar, ditutup microfoam sutra.",
    price: 34000,
    category: "coffee",
    tag: "Signature",
    image:
      "https://images.pexels.com/photos/34528555/pexels-photo-34528555.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    options: [sizeOpt, tempOpt],
    addons: [
      { name: "Oat Milk", extra: 4000 },
      { name: "Almond Milk", extra: 5000 },
      { name: "Extra Shot", extra: 6000 },
      { name: "Less Sugar", extra: 0 },
    ],
  },
  {
    id: "c2",
    name: "Cappuccino Klasik",
    origin: "House Blend",
    desc: "Perbandingan seimbang espresso, susu, dan busa halus.",
    price: 32000,
    category: "coffee",
    addons: [
      { name: "Oat Milk", extra: 4000 },
      { name: "Extra Shot", extra: 6000 },
    ],
    image:
      "https://images.pexels.com/photos/19375004/pexels-photo-19375004.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    options: [sizeOpt, tempOpt],
  },
  {
    id: "c3",
    name: "Piccolo Rosa",
    origin: "Natural Process",
    desc: "Ristretto pekat dengan sedikit susu, aroma cokelat gelap.",
    price: 30000,
    category: "coffee",
    image:
      "https://images.pexels.com/photos/9195016/pexels-photo-9195016.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    options: [sizeOpt],
  },
  {
    id: "c4",
    name: "Cold Brew Sunyi",
    origin: "18 Hours Steep",
    desc: "Diseduh dingin perlahan, bersih dengan sentuhan karamel.",
    price: 36000,
    category: "coffee",
    image:
      "https://images.pexels.com/photos/16284352/pexels-photo-16284352.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    options: [sizeOpt],
  },
  {
    id: "n1",
    name: "Matcha Kirana",
    origin: "Ceremonial Grade",
    desc: "Matcha Uji dengan susu oat, sedikit manis dan bertekstur.",
    price: 38000,
    category: "non-coffee",
    tag: "Favorit",
    addons: [
      { name: "Extra Matcha", extra: 5000 },
      { name: "Oat Milk", extra: 4000 },
      { name: "Gula Aren", extra: 3000 },
    ],
    image:
      "https://images.pexels.com/photos/32865304/pexels-photo-32865304.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    options: [sizeOpt, tempOpt],
  },
  {
    id: "n2",
    name: "Lemon Verbena Tea",
    origin: "Herbal Infusion",
    desc: "Teh herbal dingin dengan irisan lemon dan madu bunga.",
    price: 29000,
    category: "non-coffee",
    image:
      "https://images.pexels.com/photos/7333002/pexels-photo-7333002.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    options: [sizeOpt],
  },
  {
    id: "n3",
    name: "Cokelat Senja",
    origin: "70% Dark Couverture",
    desc: "Cokelat pekat dilelehkan dengan susu hangat, tanpa gula tambahan.",
    price: 35000,
    category: "non-coffee",
    image:
      "https://images.pexels.com/photos/34623626/pexels-photo-34623626.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    options: [tempOpt],
  },
  {
    id: "p1",
    name: "Butter Croissant",
    origin: "Laminated 72 Hours",
    desc: "Lapisan rapuh dengan mentega Eropa, dipanggang setiap pagi.",
    price: 28000,
    category: "pastry",
    image:
      "https://images.pexels.com/photos/12176269/pexels-photo-12176269.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    id: "p2",
    name: "Pistachio Cream",
    origin: "House Pastry",
    desc: "Croissant isi krim pistachio, taburan gula halus.",
    price: 42000,
    category: "pastry",
    tag: "Terbatas",
    image:
      "https://images.pexels.com/photos/29125004/pexels-photo-29125004.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    id: "p3",
    name: "Almond Danish",
    origin: "House Pastry",
    desc: "Isian frangipane almond dengan aroma vanilla bourbon.",
    price: 38000,
    category: "pastry",
    image:
      "https://images.pexels.com/photos/13439698/pexels-photo-13439698.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    id: "m1",
    name: "Truffle Tagliatelle",
    origin: "Kitchen · 15 mnt",
    desc: "Pasta segar, jamur, dan minyak truffle hitam.",
    price: 78000,
    category: "mains",
    image:
      "https://images.pexels.com/photos/6241091/pexels-photo-6241091.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    id: "m2",
    name: "Garden Plate",
    origin: "Kitchen · 12 mnt",
    desc: "Sayuran panggang, keju lembut, dan roti sourdough.",
    price: 68000,
    category: "mains",
    image:
      "https://images.pexels.com/photos/8743928/pexels-photo-8743928.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    id: "m3",
    name: "Nasi Pagi Monokala",
    origin: "Kitchen · 14 mnt",
    desc: "Nasi hangat, telur mata sapi, sambal matah, dan lauk pilihan.",
    price: 62000,
    category: "mains",
    addons: [
      { name: "Telur Tambahan", extra: 6000 },
      { name: "Kerupuk", extra: 2000 },
      { name: "Nasi Porsi Double", extra: 8000 },
    ],
    image:
      "https://images.pexels.com/photos/20885766/pexels-photo-20885766.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
];

export const rupiah = (n: number) =>
  "Rp " + n.toLocaleString("id-ID", { maximumFractionDigits: 0 });
