<script setup lang="ts">
const collections = (await useFetch("/api/photography")).data.value!;
const route = useRoute();
const error = createError({
    status: 404,
    statusText: 'Page Not Found',
});

if (!route.params.collection) {
    throw error;
}

const param = route.params.collection.toString().toLowerCase();
const collection = collections.find(x => x.id == param);
if (!collection) {
    throw error;
}
</script>
<template>
    <main>
        <h1>{{ collection.name }}</h1>
        <div id="images">
            <img v-for="(file, i) in collection.files" :alt="`image ${i} of ${collection.name}`"
                :src="`/images/photography/${collection.name}/${file}`" loading="lazy"></img>
        </div>
    </main>
</template>

<style lang="css" scoped>
h1 {
    text-align: center;
    margin-top: 0;
    margin-bottom: 0.4rem;
    padding-bottom: 0.4rem;
    border-bottom: 1px solid var(--bg-1);
}

main {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

#images {
    display: grid;
    gap: 0.5rem;
    grid-template-columns: repeat(auto-fit,
            minmax(min(600px, 100%), 1fr));
}

img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>