<script setup lang="ts">
const name = useRoute().params.name;
if (!name) throw createError({ status: 400 });

const { data: pages, error } = (await useFetch<string[]>(`/api/documents/${name}`));
const scale = ref(80);

function resize(amount: number) {
  scale.value = Math.max(30, Math.min(150, scale.value + amount));
}
</script>

<template>
  <div class="typst">
    <div class="toolbar">
      <button @click="resize(-10)" :disabled="scale <= 30"><Icon name="mdi:minus" /></button>
      <span>{{ scale }}%</span>
      <button @click="resize(10)" :disabled="scale >= 150"><Icon name="mdi:plus" /></button>
    </div>
    <div class="typst-scroll">
      <div class="typst-pages">
        <div class="typst-page" v-for="page in pages" :key="page" v-html="page" />
      </div>
    </div>
  </div>
</template>

<style lang="css">
.toolbar {
  position: sticky;
  top: 4.5rem;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  margin: 0.5rem;
  margin-top: 0.8rem;
  background: var(--bg);
  border: 1px solid var(--bg-1);
  color: var(--fg);
  border-radius: 0.5rem;
  user-select: none;
}

.toolbar button {
  width: 2rem;
  height: 2rem;
  font-size: 1.25rem;
  cursor: pointer;
  color: var(--fg);
}

.toolbar button:disabled {
  opacity: 0.4;
  cursor: default;
}

.typst {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.typst-scroll {
  width: 100%;
  overflow-x: auto;
}

.typst-pages {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.typst-page {
  width: v-bind('scale - 4 + "%"');
  margin-inline: auto;
}

.typst-page svg {
  width: 100%;
  height: auto;
  border: 1px solid var(--bg-1);
  margin: 0.2rem;
}
</style>