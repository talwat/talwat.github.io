<script setup lang="ts">
// @ts-ignore
import "@splidejs/vue-splide/css";

// @ts-ignore
import { Splide, SplideSlide } from "@splidejs/vue-splide";

const collections = (await useFetch("/api/photography")).data.value!;

useSeoMeta({
  title: "Photography",
  ogTitle: "Photography",
  description: "Tal's photography portfolio.",
  ogDescription: "Tal's photography portfolio.",
});
</script>

<template>
  <main id="photography">
    <h1 class="title">Photography</h1>
    <div id="top">
      <section id="about">
        <h2 id="about-title">About</h2>
        <p id="about-text">
          Here is a collection of photos I've taken with either a Nikon D5500,
          or a Fujifilm X-T3. I'm certainly a beginner, but I try my best. I
          generally do landscape photography, although I have tried to
          experiment with street photography and am interested in trying macro
          photography when I can get a macro lens.
        </p>
      </section>
      <section class="graphic">
        <IsoCamera
          id="camera"
          :scale="0.8"
          back-color="color-mix(in srgb, var(--accent) 50%, transparent)"
        />
      </section>
    </div>
    <div id="collections">
      <section class="collection" v-for="collection in collections">
        <h2>
          <NuxtLink :to="`/photography/${collection.id}/`">{{
            collection.name
          }}</NuxtLink>
        </h2>
        <ClientOnly>
          <template #fallback>
            <NuxtLink
              :to="`/photography/${collection.id}/`"
              class="fallback-link"
            >
              <img
                class="fallback-img"
                :src="`/images/photography/${collection.name}/${collection.files[0]}`"
              />
            </NuxtLink>
          </template>
          <Splide
            :options="{
              rewind: true,
              lazyLoad: 'nearby',
              type: 'loop',
              preloadPages: 2,
              arrows: collection.files.length > 1,
            }"
            :aria-label="`image carousel for ${collection.name}`"
          >
            <SplideSlide v-for="(file, i) in collection.files">
              <img
                class="slide-img"
                :alt="`image ${i} of ${collection.name}`"
                :data-splide-lazy="`/images/photography/${collection.name}/${file}`"
              />
            </SplideSlide>
          </Splide>
        </ClientOnly>
      </section>
    </div>
  </main>
</template>

<style scoped>
#camera {
  margin-bottom: 2.25rem;
}

#top {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 2rem;
  margin-right: 2rem;
  margin-bottom: 1rem;
  margin-top: 1rem;
}

#top > * {
  flex: 1 1;
}

#about-title {
  margin-bottom: -0.8rem;
  font-size: 1.8rem;
}

#about-text {
  font-size: 1.2rem;
}

a {
  color: var(--fg);
}

.collection h2 {
  text-align: center;
  margin: 0;
  margin-bottom: 1rem;
}

.slide-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.fallback-link {
  height: 100%;
}

.fallback-img {
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: contain;
  display: block;
}

.collection {
  border: 2px solid var(--bg-1);
  padding: 1rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.collection > div {
  flex-grow: 1;
}

#collections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem 1rem;
}

@media (max-width: 800px) {
  #collections {
    grid-template-columns: 1fr;
  }

  .collection {
    border: 0;
    padding: 0;
  }

  .collection {
    padding-top: 1rem;
    border-top: 1px solid var(--bg-1);
  }

  #top {
    margin-left: 0;
    margin-right: 0;
  }
}
</style>

<style lang="css">
#photography .splide__track {
  aspect-ratio: 3 / 2;
}

.splide__list {
  list-style-type: none;
}
</style>
