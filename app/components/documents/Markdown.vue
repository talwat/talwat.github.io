<script setup lang="ts">
import "~/assets/markdown.css";

import { MarkdownDocument } from "@comark/vue";
import type { Parsed } from "comark";

import type { Item } from "~~/shared/types";
import MathEmbed from "./math/MathEmbed.vue";

const { item } = defineProps<{ item: Item }>();
const { data, error } = await useFetch<Parsed>(
  `/api/documents/markdown/${item.id}`,
);

if (error.value) throw error.value;
</script>

<template>
  <div>
    <h1 class="title" v-if="item.meta.title">{{ item.meta.title }}</h1>
    <MarkdownDocument :components="{ 'typst-math': MathEmbed }" :value="data" />
  </div>
</template>
