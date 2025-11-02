<script lang="ts" setup>
  useSeoMeta({
    title: "talwat's personal website",
    ogTitle: "talwat's personal website",
    description: 'Developer portfolio, including several different projects as well as contact information and an about me.',
    ogDescription: 'Developer portfolio, including several different projects as well as contact information and an about me.',
  })

  useHead({
    meta: [
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover"}
    ]
  })
</script>

<template>
  <Header />
  <NuxtPage />
</template>
