import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useFlashSales } from "@/hooks/useFlashSales";

const FlashSales = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 23,
    minutes: 19,
    seconds: 56,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 23;
          days--;
        }
        if (days < 0) {
          return { days: 3, hours: 23, minutes: 19, seconds: 56 };
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: flashProducts = [], isLoading } = useFlashSales();

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-4 h-8 bg-accent rounded-sm" />
        <span className="text-accent font-semibold text-sm">Today's</span>
      </div>

      {/* Title and Timer */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="flex items-center gap-8">
          <h2 className="font-display text-2xl md:text-3xl font-semibold">Flash Sales</h2>
          <div className="flex items-center gap-4">
            <TimeUnit label="Days" value={timeLeft.days} />
            <span className="text-accent text-2xl font-bold">:</span>
            <TimeUnit label="Hours" value={timeLeft.hours} />
            <span className="text-accent text-2xl font-bold">:</span>
            <TimeUnit label="Minutes" value={timeLeft.minutes} />
            <span className="text-accent text-2xl font-bold">:</span>
            <TimeUnit label="Seconds" value={timeLeft.seconds} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-full">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {isLoading ? (
          <div className="col-span-full text-center text-muted-foreground">Loading flash sales...</div>
        ) : (
          flashProducts.map((product) => (
            <ProductCard key={product.id} {...product} showDiscount />
          ))
        )}
      </div>

      {/* View All Button */}
      <div className="text-center mt-10">
        <Link to="/products">
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground px-12">
            View All Products
          </Button>
        </Link>
      </div>
    </section>
  );
};

const TimeUnit = ({ label, value }: { label: string; value: number }) => (
  <div className="text-center">
    <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
    <p className="text-2xl md:text-3xl font-bold">{String(value).padStart(2, "0")}</p>
  </div>
);

export default FlashSales;
