<script lang="ts" setup>
import type { Item } from "~~/shared/types";

const { item } = defineProps<{ item: Item }>();
</script>
<template>
  <div>
    <NuxtLink :to="`/documents/${item.id}/`">{{ item.meta.title }}</NuxtLink>
    <span v-if="item.meta.description"> / {{ item.meta.description }}</span>
  </div>
</template>
