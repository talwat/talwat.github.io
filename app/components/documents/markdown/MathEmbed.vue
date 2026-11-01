<script setup lang="ts">
const props = defineProps<{ class?: string; content: string }>();
const block = computed(() => props.class?.includes("block") ?? false);

const { data: compiled, error } = await useFetch(
  `/api/math/?mode=svg&block=${block.value}`,
  {
    method: "POST",
    body: {
      content: props.content,
    },
  },
);
</script>

<template>
  <code v-if="error" class="math-error">{{ content }}</code>
  <span
    :class="`math-embed ${block ? 'math-block' : 'math-inline'}`"
    v-html="compiled"
  />
</template>

<style lang="css">
.math-block {
  display: block;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  overflow-x: auto;
  width: 100%;
  box-sizing: border-box;
}

.math-block svg {
  min-width: 100%;
}

.comark-content .math-embed svg * {
  fill: var(--fg);
  stroke: var(--fg);
}
</style>
