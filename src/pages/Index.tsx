import Header from "@/components/Header";
import type { MetaFunction } from "react-router";

import HeroWithSidebar from "@/components/HeroWithSidebar";
import FlashSales from "@/components/FlashSales";
import BestSelling from "@/components/BestSelling";
import PromoBanner from "@/components/PromoBanner";
import ExploreProducts from "@/components/ExploreProducts";
import NewArrival from "@/components/NewArrival";
import Services from "@/components/Services";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const siteUrl = import.meta.env.VITE_SITE_URL || "https://lumina-ladies.vercel.app";

export const meta: MetaFunction = () => {
  return [
    { title: "KelsMall | Luxury Lighting, Beauty & Home Essentials" },
    { name: "description", content: "Discover curated luxury lighting, beauty essentials, and timeless accessories for the modern woman. Shop chandeliers, skincare, jewelry, and home decor." },
    // Open Graph
    { property: "og:title", content: "KelsMall | Luxury Lighting, Beauty & Home Essentials" },
    { property: "og:description", content: "Discover curated luxury lighting, beauty essentials, and timeless accessories for the modern woman." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: `${siteUrl}/` },
    // Twitter Cards
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "KelsMall | Luxury Lighting, Beauty & Home Essentials" },
    { name: "twitter:description", content: "Discover curated luxury lighting, beauty essentials, and timeless accessories for the modern woman." },
    // Canonical
    { tagName: "link", rel: "canonical", href: `${siteUrl}/` },
  ];
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroWithSidebar />
        <FlashSales />
        <BestSelling />
        <PromoBanner />
        <ExploreProducts />
        <NewArrival />
        <Services />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

