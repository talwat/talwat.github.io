<script setup lang="ts">
import Document from "~/components/documents/Document.vue";
import type { DocumentEntry } from "~~/shared/types";

const id = useSlugID();
const notFound = createError({
  status: 404,
  message: `Page not found: /${id}`,
});

if (!id.includes("/")) throw notFound;
const { data, error } = await useFetch<DocumentEntry>(
  `/api/documents/meta/${id}`,
);
const document = data.value;

if (!document || error.value?.status == 404) throw notFound;
else if (error.value) {
  throw error.value;
}
</script>

<template>
  <Document v-if="data" :document />
</template>
