<template>
  <footer>
    <div id="copyright">
      <Icon name="mdi:copyright" size="20px" />
      <span>{{ new Date().getFullYear() }} talwat</span>
    </div>
    <div>
      <NuxtLink to="/credits" id="credit-link">Made with &lt3</NuxtLink>
    </div>
  </footer>
</template>

<style lang="css" scoped>
footer {
  border-top: solid 1px var(--bg-1);
  padding: 1rem;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

#copyright {
  display: flex;
  align-items: center;
  gap: 0.9ch;
}

#credit-link {
  color: var(--fg);
}
</style>
