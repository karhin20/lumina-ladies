import { Button } from "@/components/ui/button";

const PromoBanner = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="bg-[#121212] rounded-sm p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden border-b border-white/20">
        {/* Green glow effect */}
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-md">
          <span className="text-green-400 font-medium text-sm">Categories</span>
          <h2 className="text-white text-3xl md:text-4xl font-semibold mt-2 mb-6">
            Enhance Your
            <br />
            Music Experience
          </h2>

          {/* Timer circles */}
          <div className="flex gap-4 mb-6">
            {[
              { value: "23", label: "Hours" },
              { value: "05", label: "Days" },
              { value: "59", label: "Minutes" },
              { value: "35", label: "Seconds" },
            ].map((item) => (
              <div
                key={item.label}
                className="w-16 h-16 rounded-full bg-white flex flex-col items-center justify-center"
              >
                <span className="text-lg font-bold text-black">{item.value}</span>
                <span className="text-[9px] text-gray-500">{item.label}</span>
              </div>
            ))}
          </div>

          <Button className="bg-green-500 hover:bg-green-600 text-white">
            Buy Now!
          </Button>
        </div>

        <div className="relative z-10">
          <img
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80"
            alt="Headphones"
            className="w-64 md:w-80"
          />
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;

