<script setup lang="ts">
import '@splidejs/vue-splide/css';

const collections = (await useFetch("/api/photography")).data.value!;
// @ts-ignore
import { Splide, SplideSlide } from '@splidejs/vue-splide';
</script>

<template>
    <main>
        <section>
            <h1>Photography</h1>
            <p>
                Here is a collection of photos I've taken with either a Nikon D5500,
                or a Fujifilm X-T3. I'm certainly a beginner, but I try my best.
            </p>
        </section>
        <div id="collections">
            <section class="collection" v-for="collection in collections">
                <h1><a :href="`/photography/${collection.id}`">{{ collection.name }}</a></h1>
                <Splide
                    :options="{ rewind: true, lazyLoad: 'nearby', preloadPages: 2, arrows: collection.files.length > 1 }"
                    :aria-label="`image carousel for ${collection.name}`">
                    <SplideSlide v-for="(file, i) in collection.files">
                        <img :alt="`image ${i} of ${collection.name}`"
                            :data-splide-lazy="`/images/photography/${collection.name}/${file}`" />
                    </SplideSlide>
                </Splide>
            </section>
        </div>
    </main>
</template>

<style scoped>
p {
    margin: 0;
}

a {
    color: var(--fg);
    text-decoration: none;
}

h1 {
    margin-top: 0;
    margin-bottom: 0.5rem;
}

.collection h1 {
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
    object-fit: cover;
}

.collection {
    border: 2px solid var(--bg-1);
    padding: 1rem;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
}

.collection>div {
    flex-grow: 1;
}

#collections {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1em;
}

@media (max-width: 800px) {
    #collections {
        grid-template-columns: 1fr;
    }

    .collection {
        border: 0;
        padding: 0;
        margin-top: 1rem;
    }
}
</style>

<style lang="css">
.splide__track {
    aspect-ratio: 3 / 2;
}

.splide__list {
    list-style-type: none;
}
</style>