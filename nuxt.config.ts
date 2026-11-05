// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  css: ["~/assets/main.css"],
  modules: [
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxtjs/sitemap",
    "@nuxtjs/color-mode",
    "@comark/nuxt",
  ],
  fonts: {
    defaults: {
      weights: [300, 400, 500, 600],
      styles: ["normal", "italic"],
      preload: true,
    },
  },
  experimental: {
    payloadExtraction: "client",
    defaults: {
      nuxtLink: {
        prefetchOn: { visibility: false, interaction: true },
      },
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
