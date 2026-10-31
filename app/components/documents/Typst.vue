<script setup lang="ts">
import VuePdfEmbed from "vue-pdf-embed";
import type { DocumentEntry } from "~~/shared/types";

const { item } = defineProps<{ item: DocumentEntry }>();

const scale = ref(50);
function resize(amount: number) {
  scale.value += amount;
  console.log(scale.value);
}

prerenderRoutes(`/api/documents/typst/${item.id}.pdf`);
</script>

<template>
  <h1 class="title" v-if="item.meta.title">{{ item.meta.title }}</h1>
  <div id="container">
    <div id="toolbar">
      <button @click="resize(-10)" :disabled="scale <= 30">
        <Icon name="mdi:minus" />
      </button>
      <span>{{ scale }}%</span>
      <button @click="resize(10)" :disabled="scale >= 100">
        <Icon name="mdi:plus" />
      </button>
    </div>
    <ClientOnly>
      <VuePdfEmbed
        :source="`/api/documents/typst/${item.id}.pdf`"
        :width="1920"
      />
    </ClientOnly>
  </div>
</template>

<style lang="css" scoped>
#toolbar {
  position: sticky;
  top: 4.5rem;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: var(--bg);
  border: 1px solid var(--bg-1);
  color: var(--fg);
  user-select: none;
}

#toolbar button {
  width: 2rem;
  height: 2rem;
  font-size: 1.25rem;
  cursor: pointer;
  color: var(--fg);
}

#toolbar button:disabled {
  opacity: 0.4;
  cursor: default;
}

#container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
}

:global(.vue-pdf-embed) {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  gap: 0.4rem;
}

:global(.vue-pdf-embed > div) {
  width: v-bind('scale + "%"');
  border: 1px solid var(--bg-1);
}

:global(.vue-pdf-embed__page canvas) {
  width: 100% !important;
  height: auto !important;
}
</style>
