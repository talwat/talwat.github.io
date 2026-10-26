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
          specialty. I love trying and learning new things. Thus, this website
          serves as a display of my work, in any field and on any topic.
        </p>
        <div id="links">
          <NuxtLink to="/photography">My Photography</NuxtLink>
          <NuxtLink to="/programming">My Programming</NuxtLink>
        </div>
        <noscript>
          <p
            :style="{
              color: 'var(--fg-1)',
            }"
          >
            Looks like you aren't using Javascript. No worries, everything still
            works. Enjoy! :)
          </p>
        </noscript>
      </section>
      <section class="graphic">
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
  column-gap: 2rem;
  row-gap: 1rem;
}

#links a {
  font-size: 1.2rem;
  border: 2px solid var(--bg-1);
  padding: 1rem;
  flex: 1 1;
  text-align: center;
  white-space: nowrap;
}

#links a:hover {
  background-color: var(--bg-1);
}

#top {
  display: flex;
  flex-direction: row;
  padding: 4rem;
  padding-top: 2rem;
  padding-bottom: 0rem;
}

@media (max-width: 600px) {
  #top {
    padding: 0;
  }
}

#top > * {
  flex: 1 1;
}

#about h2 {
  font-size: 2rem;
  margin-top: 0.5rem;
  margin-bottom: -0.7rem;
}

#about p {
  font-size: 1.2rem;
  margin-bottom: 1.2rem;
  margin-top: 1.2rem;
}

#about {
  width: 50%;
}
</style>
