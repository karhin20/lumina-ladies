import { Truck, Headphones, Banknote } from "lucide-react";

const services = [
    {
        icon: <Truck className="w-8 h-8" />,
        title: "FAST DELIVERY",
        description: "Extremely fast delivery for all orders",
    },
    {
        icon: <Headphones className="w-8 h-8" />,
        title: "24/7 CUSTOMER SERVICE",
        description: "Friendly 24/7 customer support",
    },
    {
        icon: <Banknote className="w-8 h-8" />,
        title: "CASH ON DELIVERY",
        description: "Pay when you receive your items",
    },
];

const Services = () => {
    return (
        <section className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {services.map((service, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center text-center group transition-all duration-300 hover:-translate-y-2"
                    >
                        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6 ring-8 ring-secondary/30 transition-all duration-300 group-hover:bg-foreground group-hover:text-background group-hover:ring-foreground/10">
                            {service.icon}
                        </div>
                        <h3 className="font-display font-bold text-lg mb-2 tracking-wider">
                            {service.title}
                        </h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                            {service.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Services;

