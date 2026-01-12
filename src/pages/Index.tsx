import Header from "@/components/Header";
import SEO from "@/components/SEO";

import HeroWithSidebar from "@/components/HeroWithSidebar";
import FlashSales from "@/components/FlashSales";
import BestSelling from "@/components/BestSelling";
import PromoBanner from "@/components/PromoBanner";
import ExploreProducts from "@/components/ExploreProducts";
import NewArrival from "@/components/NewArrival";
import Services from "@/components/Services";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Home"
        description="Discover curated luxury lighting, beauty essentials, and timeless accessories for the modern woman. Shop chandeliers, skincare, jewelry, and home decor."
      />
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
