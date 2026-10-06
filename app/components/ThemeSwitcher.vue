<script setup lang="ts">
const theme = useColorMode();

function change() {
  theme.preference = theme.value === "dark" ? "light" : "dark";
}
</script>

<template>
  <button @click="change">
    <Icon
      class="theme-icon loading-theme-icon"
      name="mdi:radiobox-indeterminate-variant"
      size="1.5rem"
    />
    <Icon
      class="theme-icon light-theme-icon"
      name="mdi:weather-night"
      size="1.5rem"
    />
    <Icon
      class="theme-icon dark-theme-icon"
      name="mdi:weather-sunny"
      size="1.5rem"
    />
  </button>
</template>

<style>
button {
  display: contents;
}

button:hover {
  cursor: pointer;
}

.theme-icon {
  display: none;
}

.loading-theme-icon {
  display: inline;
}

.light-theme-icon,
.dark-theme-icon {
  display: none;
}

.light .loading-theme-icon,
.dark .loading-theme-icon {
  display: none;
}

.light .light-theme-icon {
  display: inline;
}

.dark .dark-theme-icon {
  display: inline;
}
</style>
