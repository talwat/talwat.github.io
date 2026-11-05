<script setup lang="ts">
import EmbedTypst from "~/components/documents/EmbedTypst.vue";
import MarkdownDocument from "~/components/documents/MarkdownDocument.vue";
import TypstDocument from "~/components/documents/TypstDocument.vue";
import type { DocumentEntry } from "~~/shared/types";

const { document } = defineProps<{ document: DocumentEntry }>();

useSeoMeta({
  title: document?.meta.title ?? "Document",
  ogTitle: document?.meta.title ?? "Document",
  description: document?.meta.description ?? "A document lying around.",
  ogDescription: document?.meta.description ?? "A document lying around.",
});
</script>

<template>
  <main v-if="document.type == 'typst'" id="typst">
    <EmbedTypst v-if="document.meta.embed" :document />
    <TypstDocument v-else :document />
  </main>
  <main v-else id="markdown" :class="{ serif: document.meta.serif }">
    <MarkdownDocument :document />
  </main>
</template>

<style lang="css" scoped>
#typst {
  width: 100%;
}

#markdown {
  width: 60rem;
  box-sizing: border-box;
}

@media (min-width: 800px) {
  #markdown {
    padding-left: 8rem;
    padding-right: 8rem;
  }
}

#markdown.serif {
  width: 48rem;
  line-height: 1.5;
  padding: 1.5rem;
}
</style>
