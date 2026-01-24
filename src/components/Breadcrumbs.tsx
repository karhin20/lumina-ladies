import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

const Breadcrumbs = ({ items, className }: BreadcrumbsProps) => {
    return (
        <nav className={cn("flex", className)} aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={index} className="inline-flex items-center">
                            {index > 0 && (
                                <ChevronRight className="w-4 h-4 text-muted-foreground mx-1" />
                            )}
                            {item.href && !isLast ? (
                                <Link
                                    to={item.href}
                                    className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="text-sm font-medium text-foreground">
                                    {item.label}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
