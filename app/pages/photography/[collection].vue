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
    <h1 class="title-underlined">{{ collection.name }}</h1>
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
main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

#images {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(auto-fit, minmax(min(600px, 100%), 1fr));
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
