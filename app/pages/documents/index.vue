<script lang="ts" setup>
import Entry from '~/components/documents/Entry.vue';
import type { Item } from '~~/shared/types';

const list = (await useFetch<Item[]>("/api/documents/list")).data.value ?? [];

interface Category {
  name: string,
  items: Item[]
}

const categories: Category[] = [
  {
    name: "Blog Archive",
    items: list.filter(x => x.id.startsWith("archive/"))
  },
  {
    name: "Math & Physics",
    items: list.filter(x => x.type == "typst")
  }
]
</script>
<template>
  <main>
    <h1 class="title">Documents & Archive</h1>
    <div v-for="category in categories">
      <h2>{{ category.name }}</h2>
      <ul>
        <li v-for="item in category.items"><Entry :item /></li>
      </ul>
    </div>
  </main>
</template>

<style lang="css" scoped>
ul {
  margin: 0;
}

h2 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}
</style>