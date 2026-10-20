<script setup lang="ts">
import VuePdfEmbed from "vue-pdf-embed";

const name = useRoute().params.name;
if (!name) throw createError({ status: 400 });

const { data, error } = await useFetch<{ pages: string[] }>(
  `/api/documents/${name}?format=pdf`,
);
if (error.value) throw error.value;

const pages = data.value?.pages;
if (!pages) throw createError({ status: 500 });

const scale = ref(50);
function resize(amount: number) {
  scale.value += amount;
  console.log(scale.value);
}
</script>

<template>
  <main>
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
      <VuePdfEmbed v-if="pages[0]" :source="pages[0]" :width="1000" />
    </ClientOnly>
  </main>
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
  margin-top: 0.5rem;
  background: var(--bg);
  border: 1px solid var(--bg-1);
  color: var(--fg);
  border-radius: 0.5rem;
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

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
}

:global(.vue-pdf-embed) {
  padding: 1rem;
  padding-top: 0.5rem;
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
