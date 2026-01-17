import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "react-router";
import { LinksFunction } from "react-router";
import "@/index.css";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

export const links: LinksFunction = () => [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
    },
    {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
    },
];

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 15,   // 15 minutes
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

const persister = createSyncStoragePersister({
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
});

import BackToTop from "./components/BackToTop";
import ScrollProgress from "./components/ScrollProgress";

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body>
                <PersistQueryClientProvider
                    client={queryClient}
                    persistOptions={{ persister }}
                >
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                        <AuthProvider>
                            <CartProvider>
                                <TooltipProvider>
                                    <ScrollProgress />
                                    {children}
                                    <BackToTop />
                                    <Toaster />
                                    <Sonner />
                                </TooltipProvider>
                            </CartProvider>
                        </AuthProvider>
                    </ThemeProvider>
                </PersistQueryClientProvider>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function Root() {
    return <Outlet />;
}
