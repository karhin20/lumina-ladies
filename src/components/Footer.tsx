import { Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Exclusive */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-display text-xl font-bold mb-4">Exclusive</h3>
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
              <li>111 Bijoy sarani, Dhaka,<br />DH 1515, Bangladesh.</li>
              <li>exclusive@gmail.com</li>
              <li>+88015-88888-9999</li>
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

          {/* Download App */}
          <div>
            <h4 className="font-medium mb-4">Download App</h4>
            <p className="text-xs text-background/50 mb-3">Save $3 with App New User Only</p>
            <div className="flex gap-2 mb-4">
              <div className="w-20 h-20 bg-background/20 rounded" />
              <div className="space-y-2">
                <div className="bg-background/20 rounded px-2 py-1 text-xs">Get it on Google Play</div>
                <div className="bg-background/20 rounded px-2 py-1 text-xs">Download on App Store</div>
              </div>
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-background/70 hover:text-background transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-background transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-background transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-background transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
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
