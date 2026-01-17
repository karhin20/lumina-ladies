import { Link } from "react-router";
import type { MetaFunction } from "react-router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// This is a wrapper/layout component for individual blog posts
// It provides the Header, Footer, and styling for MDX content

interface BlogPostLayoutProps {
    children: React.ReactNode;
    frontmatter?: {
        title?: string;
        description?: string;
        date?: string;
        author?: string;
        category?: string;
        image?: string;
    };
}

export default function BlogPostLayout({ children, frontmatter }: BlogPostLayoutProps) {
    return (
        <>
            <Header />
            <main className="pt-24 pb-16">
                <article className="container mx-auto px-4 max-w-3xl">
                    {/* Back Link */}
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
                    >
                        <svg
                            className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Blog
                    </Link>

                    {/* Article Header */}
                    {frontmatter && (
                        <header className="mb-10">
                            {frontmatter.category && (
                                <span className="text-sm font-medium text-accent uppercase tracking-wider">
                                    {frontmatter.category}
                                </span>
                            )}
                            {frontmatter.title && (
                                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mt-2 mb-4">
                                    {frontmatter.title}
                                </h1>
                            )}
                            <div className="flex items-center gap-4 text-muted-foreground text-sm">
                                {frontmatter.author && <span>By {frontmatter.author}</span>}
                                {frontmatter.date && <span>• {frontmatter.date}</span>}
                            </div>
                        </header>
                    )}

                    {/* MDX Content with Prose Styling */}
                    <div className="prose prose-lg dark:prose-invert max-w-none
                        prose-headings:font-display prose-headings:font-bold
                        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                        prose-p:text-muted-foreground prose-p:leading-relaxed
                        prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-foreground
                        prose-ul:text-muted-foreground prose-ol:text-muted-foreground
                        prose-li:marker:text-accent
                        prose-table:text-sm
                        prose-th:bg-secondary prose-th:px-4 prose-th:py-2
                        prose-td:px-4 prose-td:py-2 prose-td:border-b prose-td:border-border
                        prose-blockquote:border-accent prose-blockquote:bg-secondary/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
                        prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                        prose-pre:bg-secondary prose-pre:border prose-pre:border-border
                    ">
                        {children}
                    </div>

                    {/* Article Footer */}
                    <footer className="mt-16 pt-8 border-t border-border">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <p className="text-muted-foreground">
                                    Enjoyed this article? Share it with friends!
                                </p>
                            </div>
                            <Link
                                to="/blog"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                                Browse more articles
                            </Link>
                        </div>
                    </footer>
                </article>
            </main>
            <Footer />
        </>
    );
}
