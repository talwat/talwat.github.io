<template>
  <blockquote :class="`quote-${as}`">
    <Icon class="quote-icon" :name="icons[as]" />
    <slot />
  </blockquote>
</template>

<script setup lang="ts">
defineProps<{
  as: "note" | "tip" | "important" | "warning" | "caution" | "danger";
}>();

const icons = {
  note: "mdi:information-outline",
  tip: "mdi:lightbulb-outline",
  important: "mdi:star-four-points-outline",
  warning: "mdi:alert-outline",
  caution: "mdi:alert-circle-outline",
  danger: "mdi:alert-octagon-outline",
} as const;
</script>

<style scoped>
blockquote {
  --quote-color: var(--fg);
  margin: 1rem 0;
  padding: 0.75rem 1rem;
  border-left: 3px solid var(--quote-color);
  background: color-mix(in srgb, var(--quote-color) 10%, var(--bg));
  color: var(--fg);
}

.quote-icon {
  display: inline-block;
  font-size: 1.5rem;
  color: var(--quote-color);
  vertical-align: central;
  margin-right: 0.5rem;
}

.quote-note {
  --quote-color: var(--blue);
}

.quote-tip {
  --quote-color: var(--green);
}

.quote-important {
  --quote-color: var(--purple);
}

.quote-warning {
  --quote-color: var(--yellow);
}

.quote-caution {
  --quote-color: var(--orange);
}

.quote-danger {
  --quote-color: var(--red);
}
</style>
