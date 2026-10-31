<script lang="ts" setup>
import type { DocumentEntry } from "~~/shared/types";

const { item } = defineProps<{ item: DocumentEntry }>();
</script>
<template>
  <div>
    <NuxtLink :to="`/documents/${item.id}/`">{{ item.meta.title }}</NuxtLink>
    <span v-if="item.meta.description"> / {{ item.meta.description }}</span>
  </div>
</template>
