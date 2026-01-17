import type { Config } from "@react-router/dev/config";

export default {
    appDirectory: "src",
    // Config options...
    // Server-side generate these paths for SEO
    async prerender() {
        return [
            "/",
            "/blog",
            "/blog/hello-world",
            "/blog/sensor-staircase-lights",
        ];
    },
} satisfies Config;
