// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-04-03",
    devtools: {enabled: true},
    modules: [
      "@nuxt/ui",
      "@nuxt/icon",
      "@nuxtjs/color-mode",
      "@nuxt/fonts",
      "@nuxt/eslint",
      "@pinia/nuxt",
      // "@vite-pwa/nuxt"
    ],
    nitro: {
        experimental: {
            websocket: true
        },
    },
    // pwa: {
    //     registerType: 'autoUpdate',
    //     manifest: {
    //         name: 'RawZLinsoTracker',
    //         short_name: 'RLT',
    //         description: 'An Online version of LinsoTracker PWA',
    //         theme_color: '#ffffff',
    //         background_color: '#ffffff',
    //         display: 'standalone',
    //         icons: [
    //             {
    //                 src: '/icon.ico',
    //                 sizes: '192x192',
    //                 type: 'image/ico',
    //             },
    //         ],
    //     },
    //     workbox: {
    //         globPatterns: ['**/*.{js,css,html,png,svg,ico}'], // Configure les fichiers mis en cache
    //     },
    //     devOptions: {
    //         enabled: false, // Active le mode PWA en développement
    //     },
    // },
    ssr: false,
    css: ["~/assets/css/main.css"],
});