import { Link } from "react-router";
import type { MetaFunction } from "react-router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// SEO meta for the blog index page
export const meta: MetaFunction = () => [
    { title: "Blog | KelsMall - Home & Living Tips" },
    { name: "description", content: "Discover helpful guides, product tips, and trends for your home. From lighting solutions to décor ideas, our blog helps you make informed shopping decisions." },
    { property: "og:title", content: "KelsMall Blog - Home & Living Tips" },
    { property: "og:description", content: "Expert guides and tips for home improvement and smart living." },
    { property: "og:type", content: "website" },
];

// Blog post data - in a real app, this would come from a CMS or file system
const blogPosts = [
    {
        slug: "sensor-staircase-lights",
        title: "Sensor Staircase Lights: The Ultimate Guide for Smart Home Safety",
        excerpt: "Learn how sensor staircase lights work, their benefits, installation tips, and why they're a must-have for modern homes in Ghana.",
        date: "January 16, 2026",
        category: "Home & Living",
        image: "/placeholder.png",
    },
    {
        slug: "hello-world",
        title: "Hello World",
        excerpt: "Welcome to the KelsMall blog! This is our first post using MDX and React Router v7.",
        date: "January 16, 2026",
        category: "Announcements",
        image: "/placeholder.png",
    },
];

export default function BlogIndex() {
    return (
        <>
            <Header />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                            KelsMall Blog
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Discover guides, tips, and trends for your home. Make informed decisions with expert advice.
                        </p>
                    </div>

                    {/* Blog Posts Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.map((post) => (
                            <article
                                key={post.slug}
                                className="group border rounded-xl overflow-hidden hover:border-accent hover:shadow-lg transition-all duration-300"
                            >
                                <Link to={`/blog/${post.slug}`} className="block">
                                    {/* Image */}
                                    <div className="aspect-video bg-secondary overflow-hidden">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-xs font-medium text-accent uppercase tracking-wider">
                                                {post.category}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {post.date}
                                            </span>
                                        </div>

                                        <h2 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors line-clamp-2">
                                            {post.title}
                                        </h2>

                                        <p className="text-muted-foreground text-sm line-clamp-3">
                                            {post.excerpt}
                                        </p>

                                        <div className="mt-4 text-sm font-medium text-accent group-hover:underline">
                                            Read more →
                                        </div>
                                    </div>
                                </Link>
                            </article>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
