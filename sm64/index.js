const tab = localStorage.getItem("tab");
const tabData = tab ? JSON.parse(tab) : {};

if (tabData.title) {
  document.title = tabData.title;
}

if (tabData.icon) {
  const faviconLink = document.querySelector("link[rel='icon']");
  faviconLink.href = tabData.icon;
}
