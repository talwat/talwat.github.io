<template>
    <main>
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
    </main>
</template>

<style lang="css" scoped>
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
    width: 100%;
    padding: 1.2rem;
}

#intro-description {
    display: flex;
    padding: 0;
    margin: 0;
    align-items: center;
    gap: 1rem;
}

#intro-description li {
    display: inline;
}

main {
    display: flex;
    justify-content: stretch;
}
</style>