<script setup lang="ts">
import "~/assets/markdown.css";
import rangi from "@comark/vue/plugins/rangi";
import { catppuccin } from "rangi/themes";
import { Markdown } from "@comark/vue";
import type { Metadata } from "~~/shared/types";

const { id } = defineProps<{ id: string }>();
const { data, error } = await useFetch<{ content: string; meta: Metadata }>(
  `/api/documents/markdown/${id}`,
);

if (error.value) throw error.value;
</script>

<template>
  <Suspense>
    <Markdown :plugins="[rangi({ theme: catppuccin, lineNumbers: true })]">{{
      data?.content
    }}</Markdown>
  </Suspense>
</template>
