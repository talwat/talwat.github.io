<script setup lang="ts">
import "~/assets/markdown.css";

import { MarkdownDocument } from "@comark/vue";
import type { MarkdownDocument as Parsed } from "comark";

import type { DocumentEntry } from "~~/shared/types";
import MathEmbed from "./markdown/MathEmbed.vue";
import Blockquote from "./markdown/Blockquote.vue";
import Outline from "./markdown/Outline.vue";

const { document } = defineProps<{ document: DocumentEntry }>();
const { data, error } = await useFetch<Parsed>(
  `/api/documents/markdown/${document.id}`,
);

if (error.value) throw error.value;
</script>

<template>
  <h1 class="title" v-if="document.meta.title">{{ document.meta.title }}</h1>
  <aside v-if="!document.meta.serif">
    <h2 id="outline-title">
      {{ data?.meta?.toc?.title || "Table of Contents" }}
    </h2>
    <nav>
      <Outline :links="data?.meta?.toc?.links" />
    </nav>
  </aside>
  <MarkdownDocument
    :components="{ 'typst-math': MathEmbed, blockquote: Blockquote }"
    :value="data"
  />
</template>
