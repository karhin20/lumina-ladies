interface CategoryCardProps {
  title: string;
  image: string;
  productCount: number;
  href: string;
}

const CategoryCard = ({ title, image, productCount, href }: CategoryCardProps) => {
  return (
    <a
      href={href}
      className="group relative overflow-hidden rounded-lg aspect-[3/4] block"
    >
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <span className="text-xs text-cream/70 tracking-widest uppercase">
          {productCount} Products
        </span>
        <h3 className="font-display text-2xl md:text-3xl text-cream font-semibold mt-1 group-hover:translate-x-2 transition-transform duration-300">
          {title}
        </h3>
      </div>
      <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-cream/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg className="w-5 h-5 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>
    </a>
  );
};

export default CategoryCard;
