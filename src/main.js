import { getLocalizedProfile } from "./data/content.js";
import { renderNavbar } from "./components/navbar.js";
import { renderHero } from "./components/hero.js";
import { setupCinematic } from "./cinematic.js";
import {
  renderPositioning,
  renderCapabilities,
  renderRoadmap,
  renderContact,
} from "./components/sections.js";

import { renderGovernanceWithEngine } from "./components/sections.js";

import { renderCaseStudies } from "./components/case-studies.js";

import { renderShowcase } from "./components/showcase.js";

const STORAGE_LANG = "nexora-lang";
const STORAGE_THEME = "nexora-theme";

const app = document.querySelector("#app");

if (!app) {
  throw new Error("App root not found.");
}

const state = {
  lang: localStorage.getItem(STORAGE_LANG) || "en",
  theme: localStorage.getItem(STORAGE_THEME) || "dark",
};

let currentProfile = null;

function applyTheme(theme) {
  state.theme = theme === "light" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", state.theme);
  localStorage.setItem(STORAGE_THEME, state.theme);
}

function bindControls() {
  const themeToggle = document.querySelector("#theme-toggle");
  const langButtons = document.querySelectorAll("[data-lang-btn]");

  if (langButtons.length) {
    langButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const nextLang = button.getAttribute("data-lang-btn");
        if (!nextLang || nextLang === state.lang) {
          return;
        }

        localStorage.setItem(STORAGE_LANG, nextLang);
        window.location.reload();
      });
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      applyTheme(state.theme === "dark" ? "light" : "dark");
      render();
    });
  }
}

function bindRevealObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

function render() {
  const profile = getLocalizedProfile(state.lang);
  currentProfile = profile;

  app.innerHTML = `
    <div class="site-shell">
      ${renderNavbar(profile, state)}
      <main>
        ${renderHero(profile)}
        ${renderPositioning(profile)}
        ${renderCapabilities(profile)}
        ${renderCaseStudies(profile)}
        ${renderShowcase(profile)}
        ${renderGovernanceWithEngine(profile)}
        ${renderRoadmap(profile)}
        ${renderContact(profile)}
      </main>
    </div>
  `;

  bindControls();
  bindRevealObserver();
}

applyTheme(state.theme);
render();
setupCinematic(currentProfile || getLocalizedProfile(state.lang));
