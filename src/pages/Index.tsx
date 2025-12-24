import Header from "@/components/Header";
import HeroWithSidebar from "@/components/HeroWithSidebar";
import FlashSales from "@/components/FlashSales";
import BestSelling from "@/components/BestSelling";
import PromoBanner from "@/components/PromoBanner";
import ExploreProducts from "@/components/ExploreProducts";
import NewArrival from "@/components/NewArrival";
import Footer from "@/components/Footer";

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
      </main>
      <Footer />
    </div>
  );
};

export default Index;
