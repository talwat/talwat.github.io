<template>
  <blockquote :class="`quote-${as ?? 'plain'}`">
    <div v-if="as" class="flavor">
      <Icon class="flavor-icon" :name="icons[as]" size="1.25rem" />
      <span class="flavor-text">{{ as[0]?.toUpperCase() + as.slice(1) }}</span>
    </div>
    <slot />
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
  overflow: hidden;
}

.flavor {
  display: flex;
  align-items: center;
  color: var(--quote-color);
  gap: 0.5rem;
  margin-bottom: 1rem;
  margin-top: 0.5rem;
}

.flavor-text {
  line-height: 1;
  margin-top: 0.5px;
}

.content {
  overflow: hidden;
}

.quote-plain {
  background: none;
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
