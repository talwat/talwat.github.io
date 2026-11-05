<template>
  <blockquote :class="`quote-${as ?? 'plain'}`">
    <Icon v-if="as" class="quote-icon" :name="icons[as]" size="1.5rem" />
    <div>
      <slot />
    </div>
  </blockquote>
</template>

<script setup lang="ts">
defineProps<{
  as?: "note" | "tip" | "important" | "warning" | "caution" | "danger";
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

  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.quote-plain {
  background: none;
}

.quote-icon {
  display: inline-block;
  color: var(--quote-color);
  flex: 0 0 1.5rem;
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
