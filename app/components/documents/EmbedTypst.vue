<script setup lang="ts">
const { id } = defineProps<{ id: string }>();

const { data, error } = await useFetch<{ pages: string[] }>(
  `/api/documents/typst/${id}?format=svg&transparent=true`,
);

if (error.value) throw error.value;
</script>

<template>
  <div id="pages">
    <img
      id="page"
      v-for="(page, index) in data?.pages"
      :key="index"
      :src="page"
    />
  </div>
</template>

<style lang="css" scoped>
#pages {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

#page {
  width: 100%;
  max-width: 60em;
  height: auto;
}

:root:not(.light) #page {
  filter: invert(1);
}
</style>
