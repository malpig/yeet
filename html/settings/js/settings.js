let tabData = {};
const tab = localStorage.getItem("tab");

if (tab) {
  try {
    tabData = JSON.parse(tab);
  } catch (e) {
    console.log("Error parsing tab data from localStorage", e);
  }
}

const settingsDefaultTab = {
  title: "Settings | lioxryt",
  icon: "/img/newlogo.png",
};

const setTitle = (title = "") => {
  document.title = title || settingsDefaultTab.title;
  if (title) {
    tabData.title = title;
  } else {
    delete tabData.title;
  }
  localStorage.setItem("tab", JSON.stringify(tabData));
};

const setFavicon = (icon) => {
  const faviconLink = document.querySelector("link[rel='icon']");
  faviconLink.href = icon || settingsDefaultTab.icon;

  if (icon) {
    tabData.icon = icon;
  } else {
    delete tabData.icon;
  }
  localStorage.setItem("tab", JSON.stringify(tabData));
};

const resetTab = () => {
  setTitle();
  setFavicon();
  document.getElementById("title").value = "";
  document.getElementById("icon").value = "";
  localStorage.setItem("tab", JSON.stringify({}));
};

if (tabData.title) {
  document.getElementById("title").value = tabData.title;
}

if (tabData.icon) {
  document.getElementById("icon").value = tabData.icon;
}
