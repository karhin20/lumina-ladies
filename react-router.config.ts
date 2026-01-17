import type { Config } from "@react-router/dev/config";
import { vercelPreset } from "@vercel/react-router/vite";

export default {
    appDirectory: "src",
    presets: [vercelPreset()],
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
