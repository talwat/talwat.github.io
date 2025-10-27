<script setup lang="ts">
import '@splidejs/vue-splide/css';

const collections = (await useFetch("/api/photography")).data.value!;
// @ts-ignore
import { Splide, SplideSlide } from '@splidejs/vue-splide';
</script>

<template>
    <main>
        <section v-for="collection in collections">
            <h1>{{ collection.name }}</h1>
            <Splide :options="{ rewind: true }" aria-label="My Favorite Images">
                <SplideSlide v-for="file in collection.files">
                    <img :src="`/images/photography/${collection.name}/${file}`" />
                </SplideSlide>
            </Splide>
        </section>
    </main>
</template>

<style scoped>
h1 {
    text-align: center;
    margin: 0;
    margin-bottom: 1rem;
}

main {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

img {
    width: 100%;
    height: 100%;
    max-height: 70vh;
    object-fit: contain;
}

section {
    border: 2px solid var(--bg-1);
    padding: 1rem;
    border-radius: 1rem;
}
</style>
