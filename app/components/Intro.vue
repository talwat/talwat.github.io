<script lang="ts" setup>
import "@/assets/pattern.css";
</script>
<template>
  <section class="pattern">
    <div id="name">
      <p>Hey, I'm</p>
      <h1>
        <span id="name-en">tal</span>
        <span id="name-he">טל</span>
      </h1>
    </div>
    <ul id="description">
      <li>programming</li>
      <li>photography</li>
      <li>hiking</li>
    </ul>
  </section>
</template>

<style lang="css" scoped>
p {
  margin: 0;
}

#name {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#name * {
  margin: 0;
}

h1 {
  padding: 0;
  border: 0;
  margin-bottom: 0.8rem;
  font-size: 5rem;
  color: var(--blue);
  text-align: center;
  position: relative;
  display: inline-grid;
  justify-items: center;
  align-items: end;
  user-select: none;
}

#name h1 span {
  display: inline-block;
  transition: opacity 0.5s ease-in-out;
  grid-area: 1 / 1 / 2 / 2;
}

#name-he {
  opacity: 0;
  font-size: 4.2rem;
}

#name-en {
  opacity: 1;
}

#name:hover #name-he {
  display: inline-block;
  opacity: 1;
}

#name:hover #name-en {
  opacity: 0;
}

#name p {
  font-style: italic;
}

section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.2rem;
}

#description {
  display: flex;
  padding: 0;
  margin: 0;
  align-items: center;
  gap: 1rem;
  color: var(--fg-2);
}

#description li {
  display: inline;
}
</style>
