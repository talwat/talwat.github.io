<script setup lang="ts">
const collections = (await useFetch("/api/photography")).data.value!;
const route = useRoute();
const error = createError({
  status: 404,
  message: `Collection not found: ${route.params.collection}`,
});

if (!route.params.collection) {
  throw error;
}

const param = route.params.collection.toString().toLowerCase();
const collection = collections.find((x) => x.id == param);
if (!collection) {
  throw error;
}

const title = `${collection.name.toLocaleLowerCase()} collection`;
const description = `A small collection of photos from ${collection.name}.`;
useSeoMeta({
  title: title,
  ogTitle: title,
  description: description,
  ogDescription: description,
});
</script>
<template>
  <main>
    <h1 class="title">{{ collection.name }}</h1>
    <div id="images">
      <img
        v-for="(file, i) in collection.files"
        :alt="`image ${i} of ${collection.name}`"
        :src="`/images/photography/${collection.name}/${file}`"
        loading="lazy"
      />
    </div>
  </main>
</template>

<style lang="css" scoped>
#images {
  columns: 3 512px;
  gap: 0.5rem;
}

img {
  width: 100%;
  display: block;
  margin-bottom: 0.5rem;
  break-inside: avoid;
}
</style>
