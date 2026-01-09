<script lang="ts" setup>
interface Page {
    name: string,
    link: string
}

const pages: Page[] = [
    { name: "Home", link: "/" },
    { name: "Projects", link: "/#projects" },
    { name: "Photography", link: "/photography/" },
];

interface Social {
    icon: string,
    color: string,
    link: string
}

const socials: Social[] = [
    { icon: "util:github", color: "#000000", link: "https://github.com/talwat" }
]

let menu = ref(false);

onMounted(() => {
    let callback = () => menu.value = false;
    window.onresize = callback;
    window.onscroll = callback;
})
</script>
<template>
    <header>
        <nav>
            <p id="name">
                talwat
            </p>
            <div id="pages">
                <NuxtLink v-for="page in pages" :to="page.link">{{ page.name }}</NuxtLink>
            </div>
            <button id="menu-btn" @click="menu = !menu">
                <Icon name="mdi:hamburger-menu" size="2rem" />
            </button>
            <div id="socials">
                <a class="icon" v-for="social in socials" :href="social.link" aria-label="github link">
                    <Icon name="uil:github" size="2rem" />
                </a>
            </div>
        </nav>

        <Transition name="slide">
            <div id="menu" v-show="menu">
                <NuxtLink v-for="page in pages" :to="page.link" @click="menu = false">{{ page.name }}</NuxtLink>
            </div>
        </Transition>
    </header>
</template>

<style lang="css" scoped>
header {
    position: sticky;
    top: 0;
    z-index: 4;
}

nav {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    z-index: 8;
    background-color: var(--bg-0);
    padding: 1rem;
    padding-left: 2rem;
    padding-right: 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

nav>* {
    flex-grow: 1;
    flex-basis: 0;
    display: flex;
    flex-direction: row;
    gap: 1rem;
}

nav * {
    text-decoration: none;
    color: var(--fg);
    margin: 0;
}

a {
    text-decoration: none;
    color: var(--fg);
}

.icon {
    display: contents;
}

#name {
    user-select: none;
    color: var(--blue);
    font-size: 1.5rem;
    justify-content: start;
}

#pages {
    justify-content: center;
}

#menu-btn {
    display: none;
}

#menu {
    display: flex;
    position: absolute;
    z-index: 1;
    width: 100%;
    top: 64px;
    left: 0;
    overflow: hidden;
    box-sizing: border-box;
    padding: 0.5rem;
    padding-left: 2rem;
    flex-direction: column;
    background-color: var(--bg-0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

#menu > * {
    padding-top: 1rem;
    padding-bottom: 1rem;
}

.slide-enter-active,
.slide-leave-active {
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide-enter-from,
.slide-leave-to {
    transform: translateY(-100%);
}

@media only screen and (max-width: 600px) {
    #pages {
        display: none;
    }

    #menu-btn {
        display: contents;
        cursor: pointer;
    }
}

#socials {
    justify-content: end;
}
</style>