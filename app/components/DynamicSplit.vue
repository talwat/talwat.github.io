<script setup lang="ts">
const { separator } = defineProps<{
  separator?: boolean;
  wrap?: boolean;
  breakpoint?: number;
}>();
</script>

<template>
  <div class="dynamic-split" :class="{ wrap }">
    <section id="about">
      <h2>About</h2>
      <slot name="left"></slot>
    </section>
    <div v-if="separator" class="separator" />
    <section id="right">
      <slot name="right"></slot>
    </section>
  </div>
</template>

<style lang="css" scoped>
h2 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

p {
  margin: 0;
  font-size: 1.2rem;
}

.dynamic-split > section {
  flex: 1 1 248px;
  padding: 1rem;
}

.dynamic-split {
  display: flex;
  gap: 2rem;
  flex-wrap: nowrap;
}

.separator {
  flex: 0 0 1px;
  align-self: stretch;
  background: var(--bg-1);
  margin-top: 1rem;
  margin-bottom: 1rem;
}

@media (max-width: 912px) {
  .dynamic-split:not(.wrap) {
    #right,
    .separator {
      display: none;
    }
  }

  .dynamic-split.wrap {
    flex-direction: column;
    gap: 0;
  }

  .dynamic-split > section {
    flex: unset;
    padding: 1rem;
  }

  /* Becomes a horizontal rule */
  .dynamic-split > .separator {
    flex: 0 0 1px;
    align-self: stretch;
    width: auto;
    height: 1px;
    margin: 0;
    margin-right: 1rem;
    margin-left: 1rem;
  }
}
</style>
