<script setup lang="ts">
const { pages } = defineProps<{ pages: string[] }>();
</script>

<template>
  <div id="pages">
    <img id="page" v-for="(page, index) in pages" :key="index" :src="page" />
  </div>
</template>

<style lang="css" scoped>
#pages {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#page {
  width: 100%;
  max-width: 60em;
  height: auto;
}

:root:not(.light) #page {
  filter: invert(1);
}
</style>
