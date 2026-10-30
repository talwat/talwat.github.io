<script setup lang="ts">
import IsoCylinder from "~/components/graphics/IsoCylinder.vue";
import NoScript from "~/components/NoScript.vue";
</script>

<template>
  <Intro />
  <main>
    <div id="container">
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
        <NoScript>
          <p>
            Looks like you aren't using Javascript.<br />
            No worries, everything still works. Enjoy! :)
          </p>
        </NoScript>
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
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1 1;
  padding-top: 3.5rem;
  padding-left: 5.5rem;
  padding-right: 5.5rem;
}

#links {
  display: flex;
  flex-direction: row;
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

#container {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-evenly;
}

#container > * {
  flex: 1 1;
  max-width: 40rem;
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

@media (max-width: 600px) {
  #about h2 {
    margin-top: 0;
  }

  main {
    padding: 1.5rem;
  }
}

@media (max-width: 500px) {
  #links {
    flex-direction: column;
  }
}
</style>
