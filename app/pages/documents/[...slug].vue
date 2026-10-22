<script setup lang="ts">
import EmbedTypst from "~/components/documents/EmbedTypst.vue";
import Markdown from "~/components/documents/Markdown.vue";
import Typst from "~/components/documents/Typst.vue";
import type { Item } from "~~/shared/types";

let id = useRoute().params.slug;
if (!id) throw createError({ status: 400 });
if (typeof id != "string") id = id.join("/");

const list = (await useFetch<Item[]>("/api/documents/list")).data.value ?? [];
const item = list.find((x) => x.id == id);

useSeoMeta({
  title: item?.meta.title ?? "Document",
  ogTitle: item?.meta.title ?? "Document",
  description: item?.meta.description ?? "A document lying around.",
  ogDescription: item?.meta.description ?? "A document lying around.",
});

if (!item)
  throw createError({
    status: 404,
    message: "Document not found.",
  });
</script>

<template>
  <template v-if="item.type == 'typst'">
    <EmbedTypst v-if="item.meta.embed" :item />
    <Typst v-else :item />
  </template>
  <Markdown v-else :item />
</template>
