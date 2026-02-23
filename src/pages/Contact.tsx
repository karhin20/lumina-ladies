import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
    return [
        { title: "Contact Us | KelsMall" },
        { name: "description", content: "Get in touch with KelsMall. We are here to help you with your Smart Lighting, Beauty & Home Essentials." },
        { tagName: "link", rel: "canonical", href: "https://www.kelsmall.com/contact" },
    ];
};

const Contact = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-8 py-12 pt-32">
                <div className="max-w-3xl mx-auto">
                    <h1 className="font-display text-4xl font-bold mb-4 text-center">Contact Us</h1>
                    <p className="text-muted-foreground text-center mb-12">
                        Have a question about an order or a product? We're here to help. Reach out to us through any of the channels below.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        {/* WhatsApp (Primary) */}
                        <a
                            href="https://wa.link/6bwalt"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-50 hover:bg-green-100 border border-green-200 dark:bg-green-950/30 dark:border-green-800 rounded-xl p-8 flex flex-col items-center text-center transition-all group"
                        >
                            <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/20">
                                <MessageCircle className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="font-semibold text-xl mb-2 text-green-900 dark:text-green-400">WhatsApp</h3>
                            <p className="text-green-800/80 dark:text-green-500/80 mb-4">Fastest way to reach us</p>
                            <span className="font-medium text-green-600 flex items-center gap-1">
                                Chat with us <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </span>
                        </a>

                        {/* Phone call */}
                        <a
                            href="tel:+233534571994"
                            className="bg-card hover:bg-accent/50 border border-border rounded-xl p-8 flex flex-col items-center text-center transition-all group"
                        >
                            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Phone className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="font-semibold text-xl mb-2">Call Us</h3>
                            <p className="text-muted-foreground mb-4">Mon-Fri from 8am to 5pm</p>
                            <span className="font-medium text-primary">053 457 1994</span>
                        </a>

                        {/* Email */}
                        <a
                            href="mailto:support@kelsmall.com"
                            className="bg-card hover:bg-accent/50 border border-border rounded-xl p-8 flex flex-col items-center text-center transition-all group"
                        >
                            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Mail className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="font-semibold text-xl mb-2">Email</h3>
                            <p className="text-muted-foreground mb-4">We usually reply within 24 hours</p>
                            <span className="font-medium text-primary">support@kelsmall.com</span>
                        </a>

                        {/* Location */}
                        <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center text-center">
                            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <MapPin className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="font-semibold text-xl mb-2">Office</h3>
                            <p className="text-muted-foreground">
                                Accra, Ghana
                            </p>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
