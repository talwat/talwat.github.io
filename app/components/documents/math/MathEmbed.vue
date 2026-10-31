<script setup lang="ts">
const props = defineProps<{ class?: string; content: string }>();
const block = computed(() => props.class?.includes("block") ?? false);

const { data: compiled, error } = await useAsyncData(
  () => `math:${block.value ? "b" : "i"}:${props.content}`,
  async () =>
    (await import("./render")).render(props.content, block.value, "svg"),
);
</script>

<template>
  <div>
    <code v-if="error" class="math-error">{{ content }}</code>
    <span v-else-if="block" class="math-embed math-block" v-html="compiled" />
    <span v-else class="math-embed math-inline" v-html="compiled" />
  </div>
</template>

<style lang="css">
.math-block {
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.comark-content .math-embed svg * {
  fill: var(--fg);
  stroke: var(--fg);
}
</style>
