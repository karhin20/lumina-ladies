import Header from "@/components/Header";
import AdvertBanner from "@/components/AdvertBanner";
import ProductListing from "@/components/ProductListing";
import AboutSection from "@/components/AboutSection";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <AdvertBanner />
        <ProductListing />
        <AboutSection />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
