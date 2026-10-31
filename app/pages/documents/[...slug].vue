<script setup lang="ts">
import EmbedTypst from "~/components/documents/EmbedTypst.vue";
import Markdown from "~/components/documents/Markdown.vue";
import Typst from "~/components/documents/Typst.vue";
import type { DocumentEntry } from "~~/shared/types";

let slug = useRoute().params.slug;
if (!slug) throw createError({ status: 400 });
if (typeof slug != "string") slug = slug.join("/");

const id = slug.replace(/\/+$/, "");

const list =
  (await useFetch<DocumentEntry[]>("/api/documents")).data.value ?? [];
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
  <main v-if="item.type == 'typst'" id="typst">
    <EmbedTypst v-if="item.meta.embed" :item />
    <Typst v-else :item />
  </main>
  <main v-else id="markdown">
    <Markdown :item />
  </main>
</template>

<style lang="css" scoped>
#typst {
  width: 100%;
}

#markdown {
  width: 86rem;
}

@media (min-width: 800px) {
  #markdown {
    padding-left: 8rem;
    padding-right: 8rem;
  }
}
</style>
