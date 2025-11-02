// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/main.css'],
  modules: ['@nuxt/fonts', '@nuxt/icon', '@nuxtjs/sitemap'],
  fonts: {
    defaults: {
      weights: [400],
      styles: ['normal', 'italic'],
      preload: true,
    },
  }
})