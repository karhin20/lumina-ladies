import { Facebook, Instagram, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Lampo */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="font-display text-xl font-bold mb-4 block">KelsMall</Link>
            <p className="font-medium mb-3">Subscribe</p>
            <p className="text-sm text-background/70 mb-4">Get 10% off your first order</p>
            <div className="relative">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent border-background/50 text-background placeholder:text-background/50 pr-10"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 hover:bg-transparent"
              >
                <Send className="h-4 w-4 text-background" />
              </Button>
            </div>
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/70 hover:text-background transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/70 hover:text-background transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-medium mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li>Red Okai Street, Achimota<br />Accra, Ghana.</li>
              <li>
                <a href="mailto:kelsmall@gmail.com" className="hover:text-background transition-colors">
                  kelsmall@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+233543119117" className="hover:text-background transition-colors">
                  +233 543119117
                </a>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-medium mb-4">Account</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li><Link to="/account" className="hover:text-background transition-colors">My Account</Link></li>
              <li><Link to="/auth" className="hover:text-background transition-colors">Login / Register</Link></li>
              <li><Link to="/products" className="hover:text-background transition-colors">Shop</Link></li>
              <li><Link to="/blog" className="hover:text-background transition-colors">Blog</Link></li>
              <li><Link to="/account?tab=wishlist" className="hover:text-background transition-colors">Wishlist</Link></li>
              <li><Link to="/account?tab=orders" className="hover:text-background transition-colors">Orders</Link></li>
            </ul>
          </div>

          {/* Quick Link */}
          <div>
            <h4 className="font-medium mb-4">Quick Link</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li><Link to="/privacy-policy" className="hover:text-background transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-background transition-colors">Terms Of Use</Link></li>
              <li><Link to="/faq" className="hover:text-background transition-colors">FAQ</Link></li>
              <li><a href="mailto:lumigh@gmail.com" className="hover:text-background transition-colors">Contact</a></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-background/10 py-4">
        <p className="text-center text-sm text-background/40">
          © Copyright KelsMall {new Date().getFullYear()}. All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;

