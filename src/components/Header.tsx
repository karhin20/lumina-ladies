import { useState } from "react";
import { Menu, X, Search, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import CartDrawer from "@/components/CartDrawer";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
    { name: "Contact", href: "#contact" },
    { name: "About", href: "#about" },
  ];

  return (
    <>
      {/* Top Banner */}
      <div className="bg-foreground text-background text-center py-2 text-xs md:text-sm">
        <span>New Year Discounted Sale - OFF 30%!</span>
        <Link to="/products" className="underline ml-2 font-semibold">ShopNow</Link>
      </div>

      {/* Main Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="font-display text-xl md:text-2xl font-bold text-foreground tracking-tight">
              Lampo
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
              </div>
              <Button variant="ghost" size="icon" className="hover:bg-transparent">
                <Heart className="h-5 w-5" />
              </Button>
              <CartDrawer />
              <Link to={user ? (['admin', 'super_admin', 'vendor_admin'].includes(user.role) ? '/admin' : '/account') : "/auth"}>
                <Button variant="ghost" size="icon" className="hover:bg-transparent">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <CartDrawer />
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden py-4 border-t border-border animate-fade-in">
              <div className="flex flex-col gap-4">
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
                {user ? (
                  <>
                    <Link
                      to={user.role === 'admin' ? '/admin' : '/account'}
                      className="text-base font-medium text-foreground py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {user.role === 'admin' ? 'Dashboard' : 'Account'}
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="text-base font-medium text-foreground py-2 text-left"
                    >
                      Log Out
                    </button>
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
                <div className="relative mt-2">
                  <Input
                    type="text"
                    placeholder="What are you looking for?"
                    className="w-full pr-10 bg-secondary border-0 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button onClick={() => handleSearch()} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
