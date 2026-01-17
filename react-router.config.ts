import type { Config } from "@react-router/dev/config";

export default {
    appDirectory: "src",
    // Prerender static paths for SEO
    async prerender() {
        return [
            "/",
            "/blog",
            "/blog/hello-world",
            "/blog/sensor-staircase-lights",
        ];
    },
} satisfies Config;
