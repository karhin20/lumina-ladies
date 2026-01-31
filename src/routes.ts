import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("pages/Index.tsx"),
    route("products", "pages/Products.tsx"),
    route("flash-sales", "pages/FlashSalesPage.tsx"),
    route("product/:id", "pages/ProductPage.tsx"),
    route("sellers", "pages/VendorsPage.tsx"),
    route("auth", "pages/AuthPage.tsx"),
    // Protected routes will be handled by the components themselves or we can wrap them
    route("checkout", "pages/CheckoutPage.tsx"),
    route("account", "pages/AccountPage.tsx"),
    route("privacy-policy", "pages/PrivacyPolicy.tsx"),
    route("terms", "pages/TermsOfUse.tsx"),
    route("faq", "pages/FAQ.tsx"),

    // Admin routes - nested
    route("admin", "pages/admin/AdminDashboard.tsx", [
        index("pages/admin/AdminHome.tsx"),
        route("products", "pages/admin/AdminProducts.tsx"),
        route("orders", "pages/admin/AdminOrders.tsx"),
        route("customers", "pages/admin/AdminCustomers.tsx"),
        route("vendors", "pages/admin/AdminVendors.tsx"),
        route("vendor-profile", "pages/admin/AdminVendorProfile.tsx"),
        route("logs", "pages/admin/AdminLogs.tsx"),
        route("settings", "pages/admin/AdminSettings.tsx"),
    ]),

    // Blog routes
    route("blog", "routes/blog.tsx"),
    route("blog/hello-world", "blog/hello-world.mdx"),
    route("blog/sensor-staircase-lights", "blog/sensor-staircase-lights.mdx"),

    // Vendor User Page (Direct URL)
    route(":slug", "pages/VendorPage.tsx"),

    // 404
    route("*", "pages/NotFound.tsx"),

] satisfies RouteConfig;

