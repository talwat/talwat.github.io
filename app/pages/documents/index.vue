<script lang="ts" setup>
useSeoMeta({
  title: "Miscellaneous",
  ogTitle: "Miscellaneous",
  description: "Miscellaneous documents and archive.",
  ogDescription: "Miscellaneous documents and archive.",
});

import Entry from "~/components/documents/Entry.vue";
import type { Item } from "~~/shared/types";

const list = (await useFetch<Item[]>("/api/documents")).data.value ?? [];

interface Category {
  name: string;
  description: string;
  items: Item[];
}

const categories: Category[] = [
  {
    name: "Math & Physics",
    description: "Some notes from Math or Physics, written in Typst.",
    items: list.filter((x) => x.type == "typst"),
  },
  {
    name: "Blog Archive",
    description: "Two of my old blog posts. They're quite bad.",
    items: list.filter((x) => x.id.startsWith("archive/")),
  },
  {
    name: "Technical Tests",
    description: "Documents that just exist to test the rendering system.",
    items: list.filter((x) => x.id.startsWith("test/")),
  },
];
</script>
<template>
  <main>
    <h1 class="title">Documents & Archive</h1>
    <p>
      Eventually there will be more here, but for now, this is what there is.
      This page serves to compile all of my documents, random "gist" posts,
      notes, etc...
    </p>
    <div id="categories">
      <div v-for="category in categories">
        <h2>{{ category.name }}</h2>
        <p class="description">{{ category.description }}</p>
        <ul>
          <li v-for="item in category.items"><Entry :item /></li>
        </ul>
      </div>
    </div>
  </main>
</template>

<style lang="css" scoped>
main {
  width: 60rem;
}

.description {
  color: var(--fg-1);
  margin-top: 0.4rem;
  margin-bottom: 0.4rem;
}

ul {
  margin: 0;
}

h2 {
  margin-top: 1rem;
  margin-bottom: 0.4rem;
}
</style>
