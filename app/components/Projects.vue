<script lang="ts" setup>
interface Project {
  image: string;
  name: string;
  language: string;
  description: string;
  repo: string;
  link?: string;
}

const projects: Project[] = [
  {
    image: "https://github.com/talwat/geoterm/raw/main/assets/ti84.jpeg",
    name: "geoterm",
    language: "Rust, C, Python",
    description:
      "A geographical guessing game, with online multiplayer, on the TI84 calculator.",
    repo: "geoterm",
  },
  {
    image: "https://github.com/talwat/lowfi/raw/main/docs/media/example1.png",
    name: "lowfi",
    language: "Rust",
    description:
      "An extremely simple TUI lofi player, with 800+ github stars and 25k+ downloads.",
    repo: "lowfi",
  },
  {
    image: "/images/projects/earthsmp.png",
    name: "earthsmp",
    language: "Java, Vue",
    description:
      "Minecraft plugin implementing land borders, with a web UI for configuration.",
    repo: "earthsmp",
  },
  {
    image: "/images/projects/battleship.png",
    name: "battleship",
    language: "C",
    description:
      "A simple implementation of battleship in C with basic TCP multiplayer.",
    repo: "battleship",
  },
  {
    image: "/images/projects/transiteer.png",
    name: "transiteer",
    language: "Vue",
    description: "Web app for making transit diagrams easily and quickly.",
    repo: "transiteer",
  },
  {
    image: "/images/projects/indiepkg.jpg",
    name: "indiepkg",
    language: "Go",
    description: "CLI package manager, complete with a custom JSON format.",
    repo: "indiepkg",
  },
  {
    image: "/images/projects/coffee-tracker.png",
    name: "Coffee Tracker",
    language: "Svelte",
    description:
      "A web app to track coffee consumption, with animated visuals and persistent storage.",
    repo: "coffee-tracker",
    link: "https://talwat.com/coffee-tracker/",
  },
  {
    image: "/images/projects/pokesave.png",
    name: "pokesave",
    language: "Rust",
    description:
      "Read raw binary save files from the original Pokemon red & blue.",
    repo: "pokesave",
  },
  {
    image: "/images/projects/pap.png",
    name: "pap",
    language: "Go",
    description:
      "A swiss army knife for managing and creating minecraft servers.",
    repo: "pap",
  },
  {
    image: "/images/projects/pokeget.png",
    name: "pokeget-rs",
    language: "Rust",
    description: "Displays pokemon sprites in the terminal.",
    repo: "pokeget-rs",
  },
];
</script>

<template>
  <section>
    <h1 class="title-underlined">Projects</h1>
    <div id="projects">
      <a
        class="project hover-elevate"
        v-for="project in projects"
        :href="
          project.link
            ? project.link
            : `https://github.com/talwat/${project.repo}`
        "
        target="_blank"
      >
        <div class="project-top">
          <h2>{{ project.name }}</h2>
          <p>{{ project.language }}</p>
        </div>

        <img :alt="`image of ${project.name} by talwat`" :src="project.image" />
        <p>{{ project.description }}</p>
      </a>
    </div>
  </section>
</template>

<style scoped>
h1 {
  margin-top: 1.4rem;
  margin-bottom: 1.1rem;
}

#projects {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
}

.project h2,
.project p {
  margin: 0;
}

.project {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.project-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

p {
  text-align: center;
}

img {
  display: block;
  margin: 1rem;
  max-height: 14rem;
  max-width: calc(100% - 2rem);
  object-fit: contain;
}
</style>
