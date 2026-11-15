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
  <div
    id="document"
    :class="{ full: document.type == 'typst' && !document.meta.embed }"
  >
    <aside id="left-aside">
      <NuxtLink to="/documents" id="back-link">
        <Icon name="mdi:arrow-back-circle" size="2rem" title="Back" />
      </NuxtLink>
    </aside>
    <main v-if="document.type == 'typst'" id="typst">
      <EmbedTypst v-if="document.meta.embed" :document />
      <TypstDocument v-else :document />
    </main>
    <main v-else id="markdown" :class="{ serif: document.meta.serif }">
      <MarkdownDocument :document />
    </main>
  </div>
</template>

<style lang="css" scoped>
#back-link {
  position: sticky;
  top: 4rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  box-sizing: border-box;
}

#document {
  display: grid;
  grid-template-columns: 6.5rem minmax(0, 45rem) 6.5rem;
  padding: 1.5rem 0rem;
  flex: 1;
}

.full {
  width: 100%;
  grid-template-columns: 6.5rem minmax(0, 1fr) 6.5rem !important;
}

main {
  padding: 0;
}

#back-link {
  color: var(--fg);
}

#typst {
  width: 100%;
}

@media (max-width: 800px) {
  #left-aside {
    display: none;
  }

  #document {
    grid-template-columns: minmax(0, 1fr) !important;
    padding: 1.5rem;
  }
}

#markdown.serif {
  line-height: 1.5;
}
</style>
