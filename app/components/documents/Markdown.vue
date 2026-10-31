<script setup lang="ts">
import "~/assets/markdown.css";

import { MarkdownDocument } from "@comark/vue";
import { parseMarkdown } from "comark";
import rangi from "@comark/vue/plugins/rangi";
import { catppuccin } from "rangi/themes";
import math from "./math/plugin.ts";

import type { Item } from "~~/shared/types";
import MathEmbed from "./math/MathEmbed.vue";

const { item } = defineProps<{ item: Item }>();
const { data, error } = await useFetch<string>(
  `/api/documents/markdown/${item.id}`,
);

if (error.value) throw error.value;
const document = await parseMarkdown(data?.value ?? "", {
  plugins: [rangi({ theme: catppuccin, lineNumbers: true }), math()],
});
</script>

<template>
  <div>
    <h1 class="title" v-if="item.meta.title">{{ item.meta.title }}</h1>
    <MarkdownDocument
      :components="{ 'typst-math': MathEmbed }"
      :value="document"
    />
  </div>
</template>
