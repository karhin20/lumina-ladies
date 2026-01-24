import { useState, useMemo } from "react";
import { Menu, X, Search, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/hooks/useProducts";
import { getValidImageUrl } from "@/lib/utils";
import CartDrawer from "@/components/CartDrawer";
import { ThemeToggle } from "./ThemeToggle";
import { useVendors } from "@/hooks/useVendors";
import Fuse from 'fuse.js';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();
  const { data: products = [] } = useProducts();
  const { data: vendors = [] } = useVendors(); // Fetch active vendors
  const navigate = useNavigate();

  // Configure Fuse for Products
  const productFuse = useMemo(() => {
    return new Fuse(products, {
      keys: ['name', 'category', 'description'],
      threshold: 0.4, // Lower is stricter (0.0 = exact), 0.4 allows for typos
      distance: 100,
    });
  }, [products]);

  // Configure Fuse for Vendors
  const vendorFuse = useMemo(() => {
    return new Fuse(vendors, {
      keys: ['name'],
      threshold: 0.4,
    });
  }, [vendors]);

  // Perform search
  const productResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return productFuse.search(searchQuery).map(result => result.item);
  }, [searchQuery, productFuse]);

  const vendorResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return vendorFuse.search(searchQuery).map(result => result.item);
  }, [searchQuery, vendorFuse]);

  // Flatten results for display (prioritize vendors or mix them? - let's show both)
  // For the dropdown, we'll limit both
  const displayProductResults = productResults.slice(0, 5);
  const displayVendorResults = vendorResults.slice(0, 3);

  const hasResults = displayProductResults.length > 0 || displayVendorResults.length > 0;

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false); // Close mobile menu if open
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/products" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <>
      {/* Top Banner */}
      <div className="bg-[#121212] text-white text-center py-2 text-xs md:text-sm border-b border-white/20">
        <span>New Year Discounted Sale - OFF 30%!</span>
        <Link to="/products" className="underline ml-2 font-semibold hover:text-white/80 transition-colors">ShopNow</Link>
      </div>

      {/* Main Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="font-display text-xl md:text-2xl font-bold text-foreground tracking-tight">
              KelsMall
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-sm font-medium text-foreground hover:text-accent transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Search & Icons */}
            <div className="hidden md:flex items-center gap-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="What are you looking for?"
                  className="w-64 pr-10 bg-secondary border-0 text-sm h-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button onClick={() => handleSearch()} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <Search className="h-4 w-4" />
                </button>

                {/* Search Preview */}
                {hasResults && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-card border border-border rounded-lg shadow-elevated overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">

                    {/* Vendor Results */}
                    {displayVendorResults.map((vendor) => (
                      <Link
                        key={vendor.id}
                        to={`/seller/${vendor.id}`}
                        className="flex items-center gap-3 p-3 hover:bg-secondary transition-colors border-b border-border/50 last:border-0"
                        onClick={() => setSearchQuery("")}
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center border border-border">
                          {vendor.logo_url ? (
                            <img src={getValidImageUrl(vendor.logo_url)} alt={vendor.name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{vendor.name}</p>
                          <p className="text-xs text-muted-foreground">Seller</p>
                        </div>
                      </Link>
                    ))}

                    {/* Product Results */}
                    {displayProductResults.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        className="flex items-center gap-3 p-3 hover:bg-secondary transition-colors"
                        onClick={() => setSearchQuery("")}
                      >
                        <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                          <img src={getValidImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground">₵{product.price.toFixed(2)}</p>
                        </div>
                      </Link>
                    ))}
                    <button
                      onClick={() => handleSearch()}
                      className="w-full p-2 text-xs font-medium text-accent hover:bg-secondary transition-colors border-t border-border"
                    >
                      View all results
                    </button>
                  </div>
                )}
              </div>
              <Link to={user ? "/account?tab=wishlist" : "/auth"}>
                <Button variant="ghost" size="icon" className="relative hover:bg-transparent">
                  <Heart className="h-5 w-5" />
                  {user && user.favorites && user.favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                      {user.favorites.length}
                    </span>
                  )}
                </Button>
              </Link>
              <CartDrawer />
              <Link to={user ? (['admin', 'super_admin', 'vendor_admin'].includes(user.role) ? '/admin' : '/account') : "/auth"}>
                <Button variant="ghost" size="icon" className="hover:bg-transparent">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-1">
              <Link to={user ? "/account?tab=wishlist" : "/auth"}>
                <Button variant="ghost" size="icon" className="relative hover:bg-transparent h-11 w-11">
                  <Heart className="h-5 w-5" />
                  {user && user.favorites && user.favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                      {user.favorites.length}
                    </span>
                  )}
                </Button>
              </Link>
              <div className="h-11 w-11 flex items-center justify-center">
                <CartDrawer />
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="h-11 w-11">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search Bar - Below Logo Row */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products & vendors..."
                className="w-full pr-10 bg-secondary border-0 text-sm h-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button onClick={() => handleSearch()} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <Search className="h-5 w-5" />
              </button>

              {/* Mobile Search Preview */}
              {hasResults && (
                <div className="absolute top-full left-0 w-full mt-2 bg-card border border-border rounded-lg shadow-elevated overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Vendor Results */}
                  {displayVendorResults.map((vendor) => (
                    <Link
                      key={vendor.id}
                      to={`/seller/${vendor.id}`}
                      className="flex items-center gap-3 p-3 hover:bg-secondary transition-colors border-b border-border/50 last:border-0"
                      onClick={() => setSearchQuery("")}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center border border-border">
                        {vendor.logo_url ? (
                          <img src={getValidImageUrl(vendor.logo_url)} alt={vendor.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{vendor.name}</p>
                        <p className="text-xs text-muted-foreground">Seller</p>
                      </div>
                    </Link>
                  ))}
                  {/* Product Results */}
                  {displayProductResults.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      className="flex items-center gap-3 p-3 hover:bg-secondary transition-colors"
                      onClick={() => setSearchQuery("")}
                    >
                      <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                        <img src={getValidImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">₵{product.price.toFixed(2)}</p>
                      </div>
                    </Link>
                  ))}
                  <button
                    onClick={() => handleSearch()}
                    className="w-full p-2 text-xs font-medium text-accent hover:bg-secondary transition-colors border-t border-border"
                  >
                    View all results
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden py-4 border-t border-border animate-fade-in">
              <div className="flex flex-col gap-4">
                {/* Account/Sign In at top */}
                {user ? (
                  <>
                    <Link
                      to={user.role === 'admin' ? '/admin' : '/account'}
                      className="text-base font-medium text-foreground py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {user.role === 'admin' ? 'Dashboard' : 'My Account'}
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    className="text-base font-medium text-foreground py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
                {/* Navigation Links */}
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-base font-medium text-foreground py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                {/* Log Out at bottom if logged in */}
                {user && (
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="text-base font-medium text-foreground py-2 text-left"
                  >
                    Log Out
                  </button>
                )}
                {/* Theme Toggle in Menu */}
                <div className="flex items-center justify-between py-2 border-t border-border mt-2 pt-4">
                  <span className="text-base font-medium text-foreground">Theme</span>
                  <ThemeToggle />
                </div>
              </div>
            </nav>
          )}
        </div>
      </header >
    </>
  );
};

export default Header;

