<script setup lang="ts">
import EmbedPages from '~/components/EmbedPages.vue';

const name = useRoute().params.name;
if (!name) throw createError({ status: 400 });

const { data, error } = await useFetch<{ pages: string[] }>(
  `/api/documents/${name}?format=svg&transparent=true`,
);
if (error.value) throw error.value;
</script>

<template>
  <main>
    <h1 class="title">Embed of {{ name }}</h1>
    <EmbedPages :pages="data!.pages" />
  </main>
</template>