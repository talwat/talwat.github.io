<template>
    <div id="intro" class="pattern">
        <div id="name">
            <p>Hey, I'm</p>
            <h1>talwat</h1>
        </div>
        <ul id="intro-description">
            <li>programming</li>
            <li>photography</li>
            <li>hiking</li>
        </ul>
    </div>
    <main>
        <About />
        <Projects />
    </main>
</template>

<style lang="css" scoped>
h1 {
    margin-bottom: 0.8rem;
    font-size: 1.8rem;
}

p {
    margin: 0;
}

#name {
    display: flex;
    flex-direction: column;
    align-items: center;
}

#name * {
    margin: 0;
}

#name h1 {
    font-size: 5rem;
    color: var(--blue);
}

#name p {
    font-style: italic;
}

#intro {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.2rem;
}

#intro-description {
    display: flex;
    padding: 0;
    margin: 0;
    align-items: center;
    gap: 1rem;
    color: var(--fg-2);
}

#intro-description li {
    display: inline;
}
</style>