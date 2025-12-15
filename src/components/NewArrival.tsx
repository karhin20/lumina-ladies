const NewArrival = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-4 h-8 bg-accent rounded-sm" />
        <span className="text-accent font-semibold text-sm">Featured</span>
      </div>

      {/* Title */}
      <h2 className="font-display text-2xl md:text-3xl font-semibold mb-8">New Arrival</h2>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Large Card - PlayStation */}
        <div className="bg-foreground rounded-sm p-8 relative overflow-hidden min-h-[400px] md:row-span-2 flex items-end">
          <img
            src="https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80"
            alt="PlayStation 5"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="relative z-10 text-background">
            <h3 className="text-xl font-semibold mb-2">PlayStation 5</h3>
            <p className="text-sm text-background/70 mb-4 max-w-xs">
              Black and White version of the PS5 coming out on sale.
            </p>
            <a href="#" className="text-background border-b border-background pb-1 text-sm">
              Shop Now
            </a>
          </div>
        </div>

        {/* Right Column */}
        <div className="grid gap-4 md:gap-6">
          {/* Women's Collections */}
          <div className="bg-foreground rounded-sm p-6 relative overflow-hidden min-h-[180px] flex items-end">
            <img
              src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&q=80"
              alt="Women's Collections"
              className="absolute inset-0 w-full h-full object-cover opacity-70"
            />
            <div className="relative z-10 text-background">
              <h3 className="text-lg font-semibold mb-1">Women's Collections</h3>
              <p className="text-xs text-background/70 mb-2">
                Featured woman collections that give you another vibe.
              </p>
              <a href="#" className="text-background border-b border-background pb-1 text-xs">
                Shop Now
              </a>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {/* Speakers */}
            <div className="bg-foreground rounded-sm p-4 relative overflow-hidden min-h-[180px] flex items-end">
              <img
                src="https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&q=80"
                alt="Speakers"
                className="absolute inset-0 w-full h-full object-cover opacity-70"
              />
              <div className="relative z-10 text-background">
                <h3 className="text-sm font-semibold mb-1">Speakers</h3>
                <p className="text-[10px] text-background/70 mb-2">
                  Amazon wireless speakers
                </p>
                <a href="#" className="text-background border-b border-background pb-1 text-[10px]">
                  Shop Now
                </a>
              </div>
            </div>

            {/* Perfume */}
            <div className="bg-foreground rounded-sm p-4 relative overflow-hidden min-h-[180px] flex items-end">
              <img
                src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&q=80"
                alt="Perfume"
                className="absolute inset-0 w-full h-full object-cover opacity-70"
              />
              <div className="relative z-10 text-background">
                <h3 className="text-sm font-semibold mb-1">Perfume</h3>
                <p className="text-[10px] text-background/70 mb-2">
                  GUCCI INTENSE OUD EDP
                </p>
                <a href="#" className="text-background border-b border-background pb-1 text-[10px]">
                  Shop Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewArrival;
