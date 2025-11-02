<script lang="ts" setup>
useSeoMeta({
  title: "talwat's personal website",
  ogTitle: "talwat's personal website",
  description: 'Developer portfolio, including several different projects as well as contact information and an about me.',
  ogDescription: 'Developer portfolio, including several different projects as well as contact information and an about me.',
})

useHead({
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
  ],
  htmlAttrs: {
    lang: "en"
  },
  link: [
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
    { rel: 'manifest', href: '/site.webmanifest' }
  ]
})
</script>

<template>
  <Header />
  <NuxtPage />
</template>
