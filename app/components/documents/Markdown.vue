<script setup lang="ts">
import "~/assets/markdown.css";

import { MarkdownDocument } from "@comark/vue";
import type { MarkdownDocument as Parsed } from "comark";

import type { DocumentEntry } from "~~/shared/types";
import MathEmbed from "./math/MathEmbed.vue";

const { item } = defineProps<{ item: DocumentEntry }>();
const { data, error } = await useFetch<Parsed>(
  `/api/documents/markdown/${item.id}`,
);

if (error.value) throw error.value;
prerenderRoutes(`/api/documents/markdown/${item.id}`);
</script>

<template>
  <div>
    <h1 class="title" v-if="item.meta.title">{{ item.meta.title }}</h1>
    <MarkdownDocument :components="{ 'typst-math': MathEmbed }" :value="data" />
  </div>
</template>
