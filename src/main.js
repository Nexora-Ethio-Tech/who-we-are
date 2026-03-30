import { companyProfile } from "./data/content.js";
import { renderNavbar } from "./components/navbar.js";
import { renderHero } from "./components/hero.js";
import { setupCinematic } from "./cinematic.js";
import {
  renderPositioning,
  renderCapabilities,
  renderGovernance,
  renderRoadmap,
  renderContact,
} from "./components/sections.js";

import { renderGovernanceWithEngine } from "./components/sections.js";

import { renderCaseStudies } from "./components/case-studies.js";

import { renderShowcase } from "./components/showcase.js";

const app = document.querySelector("#app");

if (!app) {
  throw new Error("App root not found.");
}

app.innerHTML = `
  <div class="site-shell">
    ${renderNavbar(companyProfile)}
    <main>
      ${renderHero(companyProfile)}
      ${renderPositioning(companyProfile)}
      ${renderCapabilities(companyProfile)}
        ${renderCaseStudies(companyProfile)}
        ${renderShowcase(companyProfile)}
      ${renderGovernanceWithEngine(companyProfile)}
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

setupCinematic();
