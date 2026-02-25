import Header from "@/components/Header";
import type { MetaFunction } from "react-router";

import HeroWithSidebar from "@/components/HeroWithSidebar";
import FlashSales from "@/components/FlashSales";
import BestSelling from "@/components/BestSelling";
import ExploreProducts from "@/components/ExploreProducts";
import NewArrival from "@/components/NewArrival";
import Services from "@/components/Services";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const siteUrl = import.meta.env.VITE_SITE_URL || "https://kelsmall.com";

export const meta: MetaFunction = () => {
  return [
    { title: "KelsMall | Sensor Lights, Beauty & Home Essentials" },
    { name: "description", content: "Discover Smart Sensor lights, electronic gadgets, beauty essentials, and timeless accessories. Shop smart staircase lights, skincare, jewelry, and home decor." },
    // Open Graph
    { property: "og:title", content: "KelsMall |  Lighting, Beauty & Home Essentials" },
    { property: "og:description", content: "Discover Smart Sensor lights, electronic gadgets, beauty essentials, and timeless accessories. Shop smart staircase lights, skincare, jewelry, and home decor." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: `${siteUrl}/` },
    // Twitter Cards
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "KelsMall | Luxury Lighting, Beauty & Home Essentials" },
    { name: "twitter:description", content: "Discover Smart Sensor lights, electronic gadgets, beauty essentials, and timeless accessories. Shop smart staircase lights, skincare, jewelry, and home decor." },
    // Canonical
    { tagName: "link", rel: "canonical", href: `${siteUrl}/` },
  ];
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <h1 className="sr-only">KelsMall: Premium Smart Lighting, Beauty & Home Essentials</h1>
        <HeroWithSidebar />
        <FlashSales />
        <BestSelling />
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

