import productLamp1 from "@/assets/product-lamp-1.jpg";
import productLamp2 from "@/assets/product-lamp-2.jpg";
import productLamp3 from "@/assets/product-lamp-3.jpg";
import productSkincare from "@/assets/product-skincare.jpg";
import productJewelry from "@/assets/product-jewelry.jpg";
import productCandles from "@/assets/product-candles.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  description: string;
  details: string[];
  images?: string[];
  isFlashSale?: boolean;
  flashSaleEndTime?: string;
  isFeatured?: boolean;
  salesCount?: number;
  vendorId?: string;
  vendorName?: string;
  vendorSlug?: string;
  videoUrl?: string;
}

export const allProducts: Product[] = [
  {
    id: "crystal-chandelier-pendant",
    name: "Crystal Chandelier Pendant",
    price: 489.00,
    image: productLamp1,
    category: "Lighting",
    isNew: true,
    description: "Elevate your space with our exquisite Crystal Chandelier Pendant. Handcrafted with premium crystals that catch and refract light beautifully, creating a mesmerizing ambiance in any room.",
    details: [
      "Handcrafted premium crystals",
      "Adjustable hanging height",
      "Compatible with LED bulbs",
      "Dimensions: 18\" diameter x 24\" height",
      "1-year warranty included",
    ],
    vendorId: "local-vendor-1",
    vendorName: "Luxe Lighting",
    vendorSlug: "luxe-lighting",
    isFlashSale: true,
    flashSaleEndTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days from now
  },
  {
    id: "blush-ceramic-table-lamp",
    name: "Blush Ceramic Table Lamp",
    price: 189.00,
    originalPrice: 249.00,
    image: productLamp2,
    category: "Lighting",
    description: "A stunning blush ceramic table lamp that combines modern elegance with timeless design. Perfect for bedside tables, living rooms, or office spaces.",
    details: [
      "Hand-glazed ceramic base",
      "Linen fabric shade included",
      "3-way touch dimmer switch",
      "Dimensions: 12\" diameter x 22\" height",
      "UL listed for safety",
    ],
    isFlashSale: true,
    flashSaleEndTime: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(), // 5 hours from now
  },
  {
    id: "arc-floor-lamp",
    name: "Arc Floor Lamp",
    price: 349.00,
    image: productLamp3,
    category: "Lighting",
    description: "Make a bold statement with our Arc Floor Lamp. The sweeping curved arm brings light exactly where you need it, perfect for reading nooks or as a sculptural accent piece.",
    details: [
      "Brushed brass finish",
      "Weighted marble base",
      "Adjustable arm angle",
      "Dimensions: 72\" height, 36\" arc reach",
      "Compatible with smart bulbs",
    ],
  },
  {
    id: "rose-essence-collection",
    name: "Rose Essence Collection",
    price: 124.00,
    image: productSkincare,
    category: "Beauty",
    isNew: true,
    description: "Indulge in our Rose Essence Collection, featuring luxurious skincare infused with pure rose extract. This set includes everything you need for a radiant, hydrated complexion.",
    details: [
      "Rose water toner (100ml)",
      "Rose serum (30ml)",
      "Rose moisturizer (50ml)",
      "Cruelty-free & vegan",
      "Suitable for all skin types",
    ],
  },
  {
    id: "pearl-necklace-set",
    name: "Pearl Necklace Set",
    price: 275.00,
    image: productJewelry,
    category: "Jewelry",
    description: "Timeless elegance meets modern sophistication. Our Pearl Necklace Set features lustrous freshwater pearls delicately strung on a sterling silver chain.",
    details: [
      "Genuine freshwater pearls",
      "925 sterling silver chain",
      "Adjustable length: 16-18\"",
      "Matching earrings included",
      "Comes in luxury gift box",
    ],
  },
  {
    id: "blossom-candle-duo",
    name: "Blossom Candle Duo",
    price: 68.00,
    originalPrice: 85.00,
    image: productCandles,
    category: "Home",
    description: "Transform your home with our Blossom Candle Duo. Hand-poured with natural soy wax and infused with delicate floral notes of jasmine, peony, and fresh garden blooms.",
    details: [
      "100% natural soy wax",
      "Cotton wick for clean burn",
      "40+ hour burn time each",
      "Set of 2 candles",
      "Reusable ceramic containers",
    ],
  },
];

export const categories = ["All", "Lighting", "Beauty", "Jewelry", "Home"];

export const getProductById = (id: string): Product | undefined => {
  return allProducts.find((product) => product.id === id);
};

