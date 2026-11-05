<script setup lang="ts">
import "~/assets/markdown.css";

import type { MarkdownDocument as Parsed } from "comark";
import type { DocumentEntry } from "~~/shared/types";
import Outline from "./markdown/Outline.vue";
import { parse } from "~~/shared/markdown.ts";

const { document } = defineProps<{ document: DocumentEntry }>();
const { data, error } = await useFetch<string>(
  `/api/documents/markdown/${document.id}.md`,
);

if (!data.value) throw createError({ status: 500 });
if (error.value) throw error.value;
const parsed: Parsed = await parse(data.value);
</script>

<template>
  <h1 class="title" v-if="document.meta.title">{{ document.meta.title }}</h1>
  <aside v-if="!document.meta.serif">
    <h2 id="outline-title">
      {{ parsed?.meta?.toc?.title || "Table of Contents" }}
    </h2>
    <nav>
      <Outline :links="parsed?.meta?.toc?.links" />
    </nav>
  </aside>
  <Markdown :value="parsed" />
</template>
