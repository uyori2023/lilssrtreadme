const routes = ["boot", "setup", "ao", "light", "qa"];
const wipe = document.querySelector(".wipe");
let current = null;
const locales = window.lilSSRTLocales || {};

document.body.classList.add("is-intro");
window.setTimeout(() => {
  document.body.classList.remove("is-intro");
}, 1450);

function getLanguage() {
  let saved = "ja";
  try {
    saved = localStorage.getItem("lilssrt-readme-lang") || "ja";
  } catch (_) {
    saved = "ja";
  }
  return saved === "en" ? "en" : "ja";
}

function applyLanguage(lang) {
  const dictionary = locales[lang] || locales.ja || {};
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((item) => {
    const value = dictionary[item.dataset.i18n];
    if (typeof value === "string") item.textContent = value;
  });

  document.querySelectorAll("[data-i18n-html]").forEach((item) => {
    const value = dictionary[item.dataset.i18nHtml];
    if (typeof value === "string") item.innerHTML = value;
  });

  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lang === lang);
  });

  try {
    localStorage.setItem("lilssrt-readme-lang", lang);
  } catch (_) {}
}

function getRoute() {
  const route = location.hash.replace("#", "");
  return routes.includes(route) ? route : "boot";
}

function setNav(route) {
  document.querySelectorAll("[data-route]").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.route === route);
  });
}

function show(route, withWipe = true) {
  if (route === current) {
    setNav(route);
    return;
  }

  if (withWipe && wipe) {
    wipe.classList.remove("run");
    void wipe.offsetWidth;
    wipe.classList.add("run");
  }

  window.setTimeout(() => {
    document.querySelectorAll("[data-view]").forEach((view) => {
      view.classList.toggle("is-active", view.dataset.view === route);
    });
    current = route;
    setNav(route);
    scrollTo(0, 0);
  }, withWipe && wipe ? 260 : 0);
}

document.addEventListener("click", (event) => {
  const languageButton = event.target.closest("[data-lang]");
  if (languageButton) {
    applyLanguage(languageButton.dataset.lang === "en" ? "en" : "ja");
    return;
  }

  const link = event.target.closest("[data-route]");
  if (!link) return;

  const route = link.dataset.route;
  if (!routes.includes(route)) return;

  event.preventDefault();
  if (getRoute() === route) {
    show(route);
  } else {
    location.hash = route;
  }
});

document.querySelectorAll(".drop-table").forEach((details) => {
  details.addEventListener("toggle", () => {
    details.classList.remove("is-animating");
    if (!details.open) return;
    void details.offsetWidth;
    details.classList.add("is-animating");
  });
});

window.addEventListener("hashchange", () => show(getRoute()));

if (!location.hash) {
  history.replaceState(null, "", "#boot");
}

applyLanguage(getLanguage());
show(getRoute(), false);
