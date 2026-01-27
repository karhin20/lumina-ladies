import { Store } from "lucide-react";
import { Vendor } from "@/types/vendor";
import { Link } from "react-router";

interface VendorCardProps extends Vendor { }

const VendorCard = ({ id, name, slug, description, logo_url, banner_url }: VendorCardProps) => {
    return (
        <Link to={`/${slug || id}`} className="group">
            <div className="border border-border rounded-sm overflow-hidden hover:shadow-lg transition-shadow">
                {/* Banner */}
                <div className="h-32 bg-gradient-to-br from-accent/20 to-accent/5 relative">
                    {banner_url ? (
                        <img src={banner_url} alt={`${name} banner`} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Store className="h-12 w-12 text-accent/40" />
                        </div>
                    )}
                </div>

                {/* Logo & Info */}
                <div className="p-4 relative">
                    {/* Logo */}
                    <div className="absolute -top-8 left-4 w-16 h-16 rounded-full border-4 border-background bg-background overflow-hidden">
                        {logo_url ? (
                            <img src={logo_url} alt={`${name} logo`} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-accent/10 flex items-center justify-center">
                                <Store className="h-8 w-8 text-accent" />
                            </div>
                        )}
                    </div>

                    {/* Vendor Name */}
                    <div className="mt-10">
                        <h3 className="font-semibold text-lg group-hover:text-accent transition-colors">
                            {name}
                        </h3>
                        {description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default VendorCard;

