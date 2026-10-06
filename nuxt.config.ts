// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/main.css"],
  modules: [
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxtjs/sitemap",
    "@nuxtjs/color-mode",
  ],
  fonts: {
    defaults: {
      weights: [400],
      styles: ["normal", "italic"],
      preload: true,
    },
  },
  icon: {
    clientBundle: {
      scan: true,
    },
  },
  site: {
    url: "talwat.com",
    name: "talwat's website",
    trailingSlash: true,
  },
  sitemap: {
    xsl: false,
    zeroRuntime: true,
  },
});
