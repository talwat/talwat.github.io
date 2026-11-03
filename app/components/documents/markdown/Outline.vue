<script setup lang="ts">
interface Link {
  id: string;
  text: string;
  depth?: number;
  children?: Link[];
}

defineProps<{
  links?: Link[];
}>();
</script>

<template>
  <ul v-if="links?.length">
    <li v-for="link in links" :key="link.id">
      <NuxtLink class="link" :to="`#${link.id}`">
        <span class="text">{{ link.text }}</span>
        <span class="dots" aria-hidden="true" />
      </NuxtLink>
      <Outline :links="link.children" />
    </li>
  </ul>
</template>

<style lang="css" scoped>
.link {
  color: var(--fg);
}

.link {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  padding: 0.2rem 0;
  color: var(--fg);
}

.text {
  flex: 0 1 auto;
}

.dots {
  flex: 1 1 1rem;
  min-width: 1rem;
  height: 4px;
  margin-bottom: 0.2em;
  background-image: radial-gradient(circle, var(--bg-2) 1px, transparent 1.5px);
  background-size: 6px 4px;
  background-repeat: space no-repeat;
}

.link:hover {
  color: var(--accent);
}

.link:hover .dots {
  opacity: 1;
  background-image: radial-gradient(
    circle,
    var(--accent) 1px,
    transparent 1.5px
  );
}
</style>
