<script setup lang="ts">
import "~/assets/markdown.css";
import rangi from "@comark/vue/plugins/rangi";
import { catppuccin } from "rangi/themes";
import { Markdown } from "@comark/vue";
import type { Item, Metadata } from "~~/shared/types";

const { item } = defineProps<{ item: Item }>();
const { data, error } = await useFetch<{ content: string; meta: Metadata }>(
  `/api/documents/markdown/${item.id}`,
);

if (error.value) throw error.value;
</script>

<template>
  <main class="wide-margin-main">
    <h1 class="title" v-if="item.meta.title">{{ item.meta.title }}</h1>
    <Suspense>
      <Markdown :plugins="[rangi({ theme: catppuccin, lineNumbers: true })]">{{
        data?.content
      }}</Markdown>
    </Suspense>
  </main>
</template>
