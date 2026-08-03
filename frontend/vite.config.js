import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
// Re-trigger Vite bundle

export default defineConfig(({ mode }) => ({
    server: {
        host: "::",
        port: 8080,
        hmr: {
            overlay: false,
        },
    },
    plugins: [
        react(),
        mode === "development" && componentTagger(),
        VitePWA({
            registerType: 'autoUpdate',
            workbox: {
                maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
            },
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg', 'bedbuddy-logo-blue.svg', 'bedbuddy-logo-white.svg', 'bedbuddy-favicon.svg'],
            manifest: {
                name: 'NestNode - Find Your Perfect Stay',
                short_name: 'NestNode',
                description: 'The easiest way to find and book hostels, PGs, and co-living spaces.',
                theme_color: '#3b82f6',
                background_color: '#ffffff',
                display: 'standalone',
                scope: '/',
                start_url: '/',
                orientation: 'portrait',
                icons: [
                    {
                        src: 'bedbuddy-favicon.svg',
                        sizes: '192x192',
                        type: 'image/svg+xml'
                    },
                    {
                        src: 'bedbuddy-favicon.svg',
                        sizes: '512x512',
                        type: 'image/svg+xml'
                    },
                    {
                        src: 'bedbuddy-favicon.svg',
                        sizes: '512x512',
                        type: 'image/svg+xml',
                        purpose: 'any maskable'
                    }
                ]
            }
        })
    ].filter(Boolean),
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "plotly.js/dist/plotly": "plotly.js-dist-min",
        },
    },
}));
