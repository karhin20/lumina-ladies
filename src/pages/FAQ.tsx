import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
    const faqs = [
        {
            question: "How long does delivery take?",
            answer: "Delivery typically takes 1-3 business days within Accra and 3-5 business days for other regions in Ghana. Same-day delivery is available for orders placed before 11:00 AM in selected areas."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We currently accept Cash on Delivery (COD) and Mobile Money on Delivery. We are working on integrating online payments soon."
        },
        {
            question: "Can I return an item?",
            answer: "Yes, we accept returns within 7 days of delivery for items that are defective or incorrect. The item must be unused and in its original packaging. Please contact our support team to initiate a return."
        },
        {
            question: "Do you have a physical store?",
            answer: "Yes, our pickup location is at 07 Kingsby Street, Achimota, Accra. You can choose 'Pickup' at checkout to collect your order in person."
        },
        {
            question: "How can I track my order?",
            answer: "You can track your order status in the 'My Account' > 'Orders' section after logging in. We also send email updates when your order status changes."
        },
        {
            question: "Is my personal information safe?",
            answer: "Absolutely. We use industry-standard encryption to protect your data. We do not share your personal information with third parties without your consent. Please read our Privacy Policy for more details."
        }
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-8 py-8 pt-32">
                <Breadcrumbs
                    items={[
                        { label: "Home", href: "/" },
                        { label: "FAQ", href: "/faq" },
                    ]}
                />

                <div className="mt-8 max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="font-display text-4xl font-bold mb-4">Frequently Asked Questions</h1>
                        <p className="text-muted-foreground">
                            Have questions? We're here to help.
                        </p>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-left font-medium text-lg">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    <div className="mt-16 text-center bg-secondary/30 rounded-2xl p-8">
                        <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
                        <p className="text-muted-foreground mb-6">
                            Can't find the answer you're looking for? Please chat to our friendly team.
                        </p>
                        <a
                            href="mailto:kelsmall@gmail.com"
                            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        >
                            Contact Support
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default FAQ;
