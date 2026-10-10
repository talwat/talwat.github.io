<script setup lang="ts">
const name = useRoute().params.name;
if (!name) throw createError({ status: 400 });

const { data, error } = (await useFetch<{ pages: string[] }>(`/api/documents/${name}`));
const scale = ref(80);

function resize(amount: number) {
  scale.value = Math.max(30, Math.min(100, scale.value + amount));
}
</script>

<template>
  <div class="typst">
    <div class="toolbar">
      <button @click="resize(-10)" :disabled="scale <= 30"><Icon name="mdi:minus" /></button>
      <span>{{ scale }}%</span>
      <button @click="resize(10)" :disabled="scale >= 150"><Icon name="mdi:plus" /></button>
    </div>
    <div class="pages">
      <img class="page" v-for="page in data?.pages" :key="page" :src="page" loading="lazy" />
    </div>
  </div>
</template>

<style lang="css" scoped>
.toolbar {
  position: sticky;
  top: 4.5rem;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  margin: 0.6rem;
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

.pages {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  overflow-x: hidden;
  padding: 0;
  padding-left: 1rem;
  padding-right: 1rem;
  box-sizing: border-box;
  gap: 0.4rem;
}

.page {
  width: v-bind('scale + "%"');
  border: 1px solid var(--bg-1);
  aspect-ratio: 1 / 1.4142;
}
</style>