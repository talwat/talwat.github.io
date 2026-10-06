<template>
  <Intro />
  <main>
    <div id="top">
      <section id="about">
        <h2>About</h2>
        <p>
          I'm a high school student, currently in my second year of the IB
          program. Eventually, I plan to study Mechanical Engineering in
          Northern Europe.
        </p>
        <p>
          As a person, I don't consider myself married to one field or
          specialty, and I am undeterred by trying new things. This website
          serves as a display of my work, in any field and on any topic.
        </p>
        <div id="links">
          <NuxtLink to="/photography">My Photography</NuxtLink>
          <NuxtLink to="/programming">My Programming</NuxtLink>
        </div>
      </section>
      <section id="graphic">
        <IsoCylinder
          :height="200"
          :radius="70"
          :thickness="1.5"
          :tilt="0"
          :tilt-range="45"
          :scale="1.25"
          :rings="6"
        />
      </section>
    </div>
  </main>
</template>

<style lang="css" scoped>
main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

#links {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

#links a {
  font-size: 1.2rem;
  text-decoration: none;
}

#top {
  display: flex;
  flex-direction: row;
  padding: 4rem;
  padding-top: 2rem;
  padding-bottom: 0rem;
}

@media (max-width: 1000px) {
  #graphic {
    display: none !important;
  }

  #top {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

#top > * {
  flex: 1 1;
}

#about h2 {
  font-size: 3rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

#about p {
  font-size: 1.2rem;
  margin-bottom: 1.2rem;
  margin-top: 0;
}

#about {
  width: 50%;
}

#graphic {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

#graphic > * {
  position: relative;
  z-index: 1;
}

#graphic::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;

  /* isometric (triangular) grid: three line sets at 30°, 90°, 150° */
  --line: color-mix(in srgb, var(--fg-1) 12%, transparent);
  background-image:
    repeating-linear-gradient(30deg, var(--line) 0 1px, transparent 1px 36px),
    repeating-linear-gradient(90deg, var(--line) 0 1px, transparent 1px 36px),
    repeating-linear-gradient(150deg, var(--line) 0 1px, transparent 1px 36px);

  /* fade the edges so it dissolves into the page */
  -webkit-mask-image: radial-gradient(closest-side, #000 75%, transparent 100%);
  mask-image: radial-gradient(closest-side, #000 75%, transparent 100%);
}
</style>
