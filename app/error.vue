<script setup lang="ts">
const error = useError().value!;
console.log(error)
</script>

<template>
  <main>
    <div id="error">
        <h1>{{ error.statusCode }}</h1>
        <h2>{{ error.message }}</h2>
    </div>
    <NuxtLink to="/">Return Home</NuxtLink>
  </main>
</template>

<style scoped>
h1 {
    font-size: 5rem;
}

h2, h1 {
    margin: 0;
    text-align: center;
}

#error {
    padding-bottom: 0.4rem;
    border-bottom: 1px solid var(--bg-1);
}

main {
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 0.4rem;
    height: 100vh;
    margin: 0;
    align-items: center;
}
</style>