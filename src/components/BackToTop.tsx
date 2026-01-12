import { ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 500) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <>
            {isVisible && (
                <Button
                    onClick={scrollToTop}
                    variant="secondary"
                    size="icon"
                    className="fixed bottom-8 right-8 z-50 rounded-full w-12 h-12 shadow-elevated animate-fade-in border border-border/50 bg-background/80 backdrop-blur-sm"
                    title="Back to top"
                >
                    <ChevronUp className="h-6 w-6" />
                </Button>
            )}
        </>
    );
};

export default BackToTop;
