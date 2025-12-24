import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const PromoBanner = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 23,
    minutes: 59,
    seconds: 35,
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
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="bg-foreground rounded-sm p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden min-h-[400px]">
        {/* Green glow effect */}
        <div className="absolute left-1/4 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#00ff66]/30 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-md">
          <span className="text-[#00ff66] font-medium text-sm tracking-wide">Categories</span>
          <h2 className="text-background text-4xl md:text-5xl font-semibold mt-4 mb-8 leading-tight">
            Enhance Your
            <br />
            Music Experience
          </h2>

          {/* Timer circles */}
          <div className="flex gap-6 mb-8">
            {[
              { value: formatNumber(timeLeft.days), label: "Days" },
              { value: formatNumber(timeLeft.hours), label: "Hours" },
              { value: formatNumber(timeLeft.minutes), label: "Minutes" },
              { value: formatNumber(timeLeft.seconds), label: "Seconds" },
            ].map((item) => (
              <div
                key={item.label}
                className="w-16 h-16 md:w-[68px] md:h-[68px] rounded-full bg-background flex flex-col items-center justify-center"
              >
                <span className="text-base md:text-lg font-bold text-foreground leading-none">{item.value}</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">{item.label}</span>
              </div>
            ))}
          </div>

          <Button className="bg-[#00ff66] hover:bg-[#00dd55] text-foreground font-medium px-8 py-6 text-base">
            Buy Now!
          </Button>
        </div>

        <div className="relative z-10 flex-shrink-0">
          <img
            src="https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80"
            alt="JBL Speaker"
            className="w-72 md:w-96 object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;