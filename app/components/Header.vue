<script lang="ts" setup>
interface Page {
    name: string,
    link: string
}

const pages: Page[] = [
    { name: "Home", link: "/" },
    { name: "Projects", link: "/#projects" },
    { name: "Photography", link: "/photography" }
];

interface Social {
    icon: string,
    color: string,
    link: string
}

const socials: Social[] = [
    { icon: "util:github", color: "#000000", link: "https://github.com/talwat" }
]
</script>
<template>
    <header>
        <nav>
            <h2 id="name">
                talwat
            </h2>
            <div id="pages">
                <NuxtLink v-for="page in pages" :to="page.link">{{ page.name }}</NuxtLink>
            </div>
            <div id="socials">
                <a class="icon" v-for="social in socials" :href="social.link"><Icon name="uil:github" size="2rem"/></a>
            </div>
        </nav>
    </header>
</template>

<style lang="css" scoped>
header {
    position: sticky;
    padding: 1rem;
}

nav {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

nav > * {
    display: flex;
    flex-direction: row;
    gap: 1rem;
}

nav * {
    text-decoration: none;
    color: var(--fg);
    margin: 0;
}

.icon {
    display: contents;
}
</style>