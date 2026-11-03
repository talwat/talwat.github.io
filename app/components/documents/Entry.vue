<script lang="ts" setup>
import type { DocumentEntry } from "~~/shared/types";

const { document } = defineProps<{ document: DocumentEntry }>();
</script>
<template>
  <div>
    <NuxtLink
      :to="`/${!document.id.includes('/') || document.id.startsWith('test/') ? 'documents/' : ''}${document.id}/`"
      >{{ document.meta.title }}</NuxtLink
    >
    <span v-if="document.meta.description">
      / {{ document.meta.description }}</span
    >
  </div>
</template>
