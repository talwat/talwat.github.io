<script setup lang="ts">
const name = useRoute().params.name;
if (!name) throw createError({ status: 400 });

const { data, error } = await useFetch<{ pages: string[] }>(
  `/api/documents/${name}?format=svg&transparent=true`,
);
if (error.value) throw error.value;
</script>

<template>
  <main>
    <h1>Example Math Notes</h1>
    <img
      id="page"
      v-for="(page, index) in data?.pages"
      :key="index"
      :src="page"
    />
  </main>
</template>

<style lang="css" scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#page {
  width: 100%;
  max-width: 60em;
  height: auto;
}

:global(.dark #page) {
  filter: invert(1);
}
</style>
