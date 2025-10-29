<script lang="ts" setup>
interface Technology {
    icon: string,
    link: string,
    color: string,
}

interface Category {
    name: string,
    technologies: Technology[],
}

const categories: Category[] = [
    {
        name: "Programming Languages",
        technologies: [
            { icon: "simple-icons:go", link: "https://go.dev", color: "blue" },
            { icon: "simple-icons:python", link: "https://www.python.org", color: "yellow" },
            { icon: "simple-icons:rust", link: "https://www.rust-lang.org", color: "orange" },
            { icon: "devicon:c", link: "https://en.wikipedia.org/wiki/C_(programming_language)", color: "cyan" },
            { icon: "ri:java-fill", link: "https://www.java.com", color: "red" },
            { icon: "simple-icons:kotlin", link: "https://kotlinlang.org", color: "purple" },
        ],
    },
    {
        name: "Frontend Technologies",
        technologies: [
            { icon: "simple-icons:html5", link: "https://developer.mozilla.org/en-US/docs/Web/HTML", color: "orange" },
            { icon: "simple-icons:javascript", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", color: "yellow" },
            { icon: "akar-icons:typescript-fill", link: "https://www.typescriptlang.org", color: "blue" },
            { icon: "mdi:vuejs", link: "https://vuejs.org", color: "green" },
            { icon: "simple-icons:svelte", link: "https://svelte.dev", color: "red" },
        ],
    },
    {
        name: "Tools & Platforms",
        technologies: [
            { icon: "simple-icons:git", link: "https://git-scm.com", color: "red" },
            { icon: "codicon:terminal-linux", link: "https://www.kernel.org", color: "green" },
        ],
    },
];
</script>

<template>
    <div id="container">
        <section id="about">
            <h1>About Me</h1>
            <p>
                I'm currently a high school student who has been doing programming for around 4 years now.
                I love computers, and more specifically, computer engineering. I am fascinated by the lower
                levels of computing, but still enjoy creating higher level applications with newer technologies.
                Currently, my focus is asynchronous development with <a href="https://rust-lang.org/">Rust</a> and
                <a href="https://tokio.rs/">tokio</a>.
            </p>
        </section>
        <section id="technologies">
            <h1>Technologies I Use</h1>
            <div class="technology-category" v-for="category in categories">
                <h2>{{ category.name }}</h2>
                <ul>
                    <li v-for="technology in category.technologies">
                        <a :href="technology.link">
                            <Icon :name="technology.icon" size="2rem" :style="{
                                color: `var(--${technology.color})`,
                            }" />
                        </a>
                    </li>
                </ul>
            </div>
        </section>
    </div>
</template>

<style lang="css" scoped>
#container {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
}

#container>* {
    flex: 1 1 248px;
    border: 2px solid var(--bg-1);
    border-radius: 1rem;
    padding: 1.2rem;
}

h1 {
    margin-top: 0;
    margin-bottom: 0.5rem;
}

p {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
}

.technology-category {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
}

h2 {
    margin: 0;
    font-size: 1.15rem;
    font-weight: normal;
}

ul {
    margin: 0;
    padding: 0;
    display: flex;
    gap: 0.4em;
}

li {
    display: contents;
    width: 32px;
}
</style>