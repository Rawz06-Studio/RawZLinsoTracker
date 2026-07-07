import pkg from "./package.json";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      version: pkg.version,
    },
  },
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@nuxt/icon",
    "@nuxtjs/color-mode",
    "@nuxt/fonts",
    "@nuxt/eslint",
    "@pinia/nuxt",
  ],
  nitro: {
    experimental: {
      websocket: true,
    },
  },
  css: ["~/assets/css/main.css"],
  vite: {
    optimizeDeps: {
      include: ["socket.io-client"],
    },
  },
});
