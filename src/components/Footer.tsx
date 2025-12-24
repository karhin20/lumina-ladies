import { Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Lampo */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-display text-xl font-bold mb-4">Lampo</h3>
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
          </div>

          {/* Support */}
          <div>
            <h4 className="font-medium mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li>Red Okai Street, Achimota<br />Accra, Ghana.</li>
              <li>lampo@gmail.com</li>
              <li>+233 543119117</li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-medium mb-4">Account</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li><a href="#" className="hover:text-background transition-colors">My Account</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Login / Register</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Cart</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Wishlist</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Shop</a></li>
            </ul>
          </div>

          {/* Quick Link */}
          <div>
            <h4 className="font-medium mb-4">Quick Link</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li><a href="#" className="hover:text-background transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Terms Of Use</a></li>
              <li><a href="#" className="hover:text-background transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Contact</a></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-background/10 py-4">
        <p className="text-center text-sm text-background/40">
          © Copyright Rimel 2022. All right reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
