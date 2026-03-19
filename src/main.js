import { companyProfile } from "./data/content.js";
import { renderNavbar } from "./components/navbar.js";
import { renderHero } from "./components/hero.js";
import {
  renderKpis,
  renderCapabilities,
  renderGovernance,
  renderRoadmap,
  renderContact,
} from "./components/sections.js";

const app = document.querySelector("#app");

if (!app) {
  throw new Error("App root not found.");
}

app.innerHTML = `
  <div class="site-shell">
    ${renderNavbar(companyProfile)}
    <main>
      ${renderHero(companyProfile)}
      ${renderKpis(companyProfile)}
      ${renderCapabilities(companyProfile)}
      ${renderGovernance(companyProfile)}
      ${renderRoadmap(companyProfile)}
      ${renderContact(companyProfile)}
    </main>
  </div>
`;

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
