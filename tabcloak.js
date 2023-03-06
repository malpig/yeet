document.addEventListener("visibilitychange", (event)  => {
    if (document.hidden) {
        document.title = "Classes";
        const element = document.getElementById("iconi");
        element.href = "./favicon.png";
    }
    else {
        document.title = "yeet";
        const element = document.getElementById("iconi");
        element.href = "./yeet.png";
    }
});
