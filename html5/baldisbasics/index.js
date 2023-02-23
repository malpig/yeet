navigator.serviceWorker.register(location.origin + "/sw.js");

var tab = localStorage.getItem("tab");
if (tab) {
  try {
    var tabData = JSON.parse(tab);
  } catch {
    var tabData = {};
  }
} else {
  var tabData = {};
}
if (tabData.title) {
  document.title = tabData.title;
}
if (tabData.icon) {
  document.querySelector("link[rel='icon']").href = tabData.icon;
}

var theme = localStorage.getItem("theme") || "default";

document.body.setAttribute("theme", theme);

class changelogAdded extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
        <div class="changelog-item">
        <div class="changelog-type" added></div>
        ${this.innerText}
        </div>
        `;
  }
}

customElements.define("changelog-added", changelogAdded);

class changelogRemoved extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
        <div class="changelog-item">
        <div class="changelog-type" removed></div>
        ${this.innerText}
        </div>
        `;
  }
}

customElements.define("changelog-removed", changelogRemoved);

class changelogChanged extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
        <div class="changelog-item">
        <div class="changelog-type" changed></div>
        ${this.innerText}
        </div>
        `;
  }
}

customElements.define("changelog-changed", changelogChanged);

var pattern = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
var current = 0;

document.addEventListener("keydown", function (e) {
  if (e.key !== pattern[current]) {
    return (current = 0);
  }

  current++;

  if (pattern.length == current) {
    current = 0;
    document.body.setAttribute("theme", "nebelung");
    localStorage.setItem("theme", "nebelung");
    localStorage.setItem("nebelung", "true");
    if (document.querySelector(".nebelung")) {
      document.querySelector(".nebelung").removeAttribute("hidden");
    }
  }
});

var penguin = ["p", "i", "p", "l", "u", "p", "i", "s", "c", "o", "o", "l"];
var stream = 0;

document.addEventListener("keydown", function (amongusimpostor) {
  if (amongusimpostor.key !== penguin[stream]) {
    return (stream = 0);
  }

  stream++;

  if (penguin.length == stream) {
    stream = 0;
    document.body.setAttribute("theme", "piplup");
    localStorage.setItem("theme", "piplup");
    localStorage.setItem("piplup", "true");
    if (document.querySelector(".piplup")) {
      document.querySelector(".piplup").removeAttribute("hidden");
    }
  }
});