<script setup lang="ts">
import type { DocumentEntry } from "~~/shared/types";

const { document: document } = defineProps<{ document: DocumentEntry }>();
const theme = useColorMode();

const parent = `/api/documents/typst/${document.id}`;

const loading = ref(true);
const src = computed(
  () => `${parent}~${theme.value === "light" ? "light" : "dark"}.svg`,
);

watch(src, () => {
  loading.value = true;
});

prerenderRoutes([`${parent}~light.svg`, `${parent}~dark.svg`]);
</script>

<template>
  <h1 class="title" v-if="document.meta.title">{{ document.meta.title }}</h1>
  <div id="container">
    <span class="loading">Loading...</span>
    <div id="image-container">
      <ClientOnly>
        <img
          v-show="!loading"
          class="page"
          :src
          @load="loading = false"
          @error="loading = false"
          loading="eager"
        />
      </ClientOnly>
      <noscript>
        <img class="page" :src loading="eager" />
      </noscript>
    </div>
  </div>
</template>

<style lang="css" scoped>
.loading {
  position: absolute;
  margin-top: 2rem;
}

#container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page {
  width: 100%;
  height: auto;
}

#image-container {
  z-index: 3;
  width: 100%;
  background-color: var(--bg);
}
</style>
