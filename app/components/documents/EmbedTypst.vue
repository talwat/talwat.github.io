<script setup lang="ts">
import type { DocumentEntry } from "~~/shared/types";

const { document: document } = defineProps<{ document: DocumentEntry }>();
const theme = useColorMode();

const fg = {
  light: "4c4f69",
  dark: "cad3f5",
};

const image = `/api/documents/typst/${document.id}.svg`;

const loading = ref(true);
const src = computed(
  () => `${image}?fg=${theme.value === "light" ? fg.light : fg.dark}`,
);

watch(src, () => {
  loading.value = true;
});

prerenderRoutes([`${image}?fg=${fg.dark}`, `${image}?fg=${fg.light}`]);
</script>

<template>
  <h1 class="title" v-if="document.meta.title">{{ document.meta.title }}</h1>
  <div id="container">
    <span class="loading">Loading...</span>
    <div id="image-container">
      <ClientOnly>
        <img
          v-show="!loading"
          class="dynamic page"
          :src
          @load="loading = false"
          @error="loading = false"
          loading="eager"
        />
      </ClientOnly>
      <noscript>
        <img class="fallback page" :src="image" loading="lazy" />
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
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.page {
  width: 100%;
  max-width: 60em;
  height: auto;
}

#image-container {
  z-index: 3;
  width: 100%;
  background-color: var(--bg);
}

:root:not(.light) .fallback {
  filter: invert(1);
}
</style>
