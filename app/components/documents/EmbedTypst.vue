<script setup lang="ts">
import type { DocumentEntry } from "~~/shared/types";

const { item } = defineProps<{ item: DocumentEntry }>();
prerenderRoutes(`/api/documents/typst/${item.id}.svg`);
</script>

<template>
  <h1 class="title" v-if="item.meta.title">{{ item.meta.title }}</h1>
  <div id="container">
    <img id="page" :src="`/api/documents/typst/${item.id}.svg`" />
  </div>
</template>

<style lang="css" scoped>
#container {
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
