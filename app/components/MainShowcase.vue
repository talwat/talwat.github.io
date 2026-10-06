<script setup lang="ts">
// @ts-ignore
import "@splidejs/vue-splide/css";

// @ts-ignore
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";

interface Interest {
  image: string;
  title: string;
}

const interests: Interest[] = [
  {
    image: "/images/showcase/zaragoza_tram.png",
    title: "Urbanism/Transit",
  },
  {
    image: "/images/showcase/hiking.webp",
    title: "Hiking",
  },
  {
    image: "/images/showcase/hiking.webp",
    title: "Hiking",
  },
];

/*
<ul>
<li>Programming</li>
<li>Photography</li>
<li>Math</li>
<li>Physics</li>
<li>Politics & Philosophy</li>
<li>History</li>
<li>Urbanism & Transit</li>
 */
</script>

<template>
  <Splide
    :extensions="{ AutoScroll }"
    :options="{
      type: 'loop',
      autoScroll: {
        speed: 1,
        pauseOnHover: true,
        pauseOnFocus: false,
      },
      arrows: false,
      pagination: false,
      autoWidth: true,
      gap: 16,
      drag: false,
    }"
    :aria-label="`showcase of interests`"
  >
    <SplideSlide v-for="{ image, title } in interests">
      <div class="slide-content">
        <img :alt="`image of ${title}`" :src="image" />
        <p>{{ title }}</p>
      </div>
    </SplideSlide>
  </Splide>
</template>

<style lang="css" scoped>
img {
  max-width: 100%;
  height: 14rem;
  object-fit: contain;
}

p {
  margin: 0;
}

.slide-content {
  display: flex;
  gap: 1rem;
  flex-direction: column;
  align-items: center;
}
</style>
