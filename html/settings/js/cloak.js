fetch("cloak.json")
  .then((response) => response.json())
  .then((data) => {
    const container = document.getElementById("buttons-container");

    data.forEach((link) => {
      const img = document.createElement("img");
      img.className = "presets";
      img.src = link.favicon;
      img.style.width = "50px";
      img.style.height = "50px";
      img.style.borderRadius = "50%";
      img.style.objectFit = "cover";
      img.style.borderColor = "black";
      img.addEventListener("click", function () {
        setTitle(link.title);
        setFavicon(link.favicon);
      });
      container.appendChild(img);
    });
  });
