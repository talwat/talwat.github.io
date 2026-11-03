<script setup lang="ts">
import Document from "~/components/documents/Document.vue";
import type { DocumentEntry } from "~~/shared/types";

const id = useSlugID();

const { data } = await useFetch<DocumentEntry>(`/api/documents/meta/${id}`);
const document = data.value;

if (!document)
  throw createError({
    status: 404,
    message: "Document not found.",
  });
</script>

<template>
  <Document :document />
</template>
