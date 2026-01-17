import { useLocation } from "react-router";

interface SEOProps {
    title: string;
    description: string;
    canonical?: string;
    ogImage?: string;
    ogType?: 'website' | 'article' | 'product';
    jsonLd?: Record<string, any>;
}

/**
 * SEO Component - Note: In React Router v7 framework mode, 
 * document-level meta tags are handled by the `meta` export in route modules.
 * This component now returns null and serves as a placeholder.
 * 
 * For proper SEO, add a `meta` function export to your route modules:
 * 
 * export const meta: MetaFunction = () => [
 *   { title: "Page Title | KelsMall" },
 *   { name: "description", content: "Page description" },
 * ];
 */
const SEO = ({
    title,
    description,
    canonical,
    ogImage = 'https://lovable.dev/opengraph-image-p98pqg.png',
    ogType = 'website',
    jsonLd
}: SEOProps) => {
    // In React Router v7 framework mode, meta tags are handled at the route level
    // This component is kept for backward compatibility but no longer renders anything
    // Use the `meta` export in route modules instead

    // For JSON-LD structured data, we can still render a script tag
    if (jsonLd) {
        return (
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
        );
    }

    return null;
};

export default SEO;
