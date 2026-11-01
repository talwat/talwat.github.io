<script setup lang="ts">
import "~/assets/markdown.css";

import { MarkdownDocument } from "@comark/vue";
import type { MarkdownDocument as Parsed } from "comark";

import type { DocumentEntry } from "~~/shared/types";
import MathEmbed from "./markdown/MathEmbed.vue";
import Blockquote from "./markdown/Blockquote.vue";

const { item } = defineProps<{ item: DocumentEntry }>();
const { data, error } = await useFetch<Parsed>(
  `/api/documents/markdown/${item.id}`,
);

if (error.value) throw error.value;
console.log(data.value?.meta?.toc);
</script>

<template>
  <!-- <aside>
      <h2>{{ data?.meta?.toc.title || 'On This Page' }}</h2>
      <nav>
        <ul>
          <li v-for="link in data?.meta.toc.links" :key="link.id">
            <NuxtLink :href="`#${link.id}`">{{ link.text }}</NuxtLink>
            <ul v-if="link.children">
              <li v-for="child in link.children" :key="child.id">
                <h1>{{ child }}</h1>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </aside> -->
  <h1 class="title" v-if="item.meta.title">{{ item.meta.title }}</h1>
  <MarkdownDocument
    :components="{ 'typst-math': MathEmbed, blockquote: Blockquote }"
    :value="data"
  />
</template>
