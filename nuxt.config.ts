import { Custom } from "./styles/primevue-theme";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  css: ["~/styles/style.css", "@fortawesome/fontawesome-svg-core/styles.css"],
  modules: ["@primevue/nuxt-module", "@vueuse/nuxt"],
  primevue: {
    options: {
      theme: {
        preset: Custom,
        options: {
          cssLayer: {
            name: "primevue",
            order: "tailwind-base, primevue, tailwind-utilities",
          },
        },
      },
    },
  },
  build: {
    transpile: ["@fortawesome/vue-fontawesome"],
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  nitro: {
    experimental: {
      websocket: true,
      tasks: true,
    },
  },
});
