export function renderNavbar(profile, state) {
  const links = profile.nav
    .map((item) => `<a href="#${item.id}">${item.label}</a>`)
    .join("");

  const lang = state?.lang || "en";
  const theme = state?.theme || "dark";

  return `
    <header class="topbar reveal">
      <div class="brand-wrap">
        <span class="brand-pulse" aria-hidden="true"></span>
        <div>
          <p class="brand-name">${profile.name}</p>
          <p class="brand-badge">${profile.badge}</p>
        </div>
      </div>
      <nav class="nav-links">
        ${links}
      </nav>
      <div class="topbar-actions">
        <label class="lang-wrap" for="lang-select">
          <span class="sr-only">Language</span>
          <select id="lang-select" class="lang-select" aria-label="Language">
            <option value="en" ${lang === "en" ? "selected" : ""}>EN</option>
            <option value="am" ${lang === "am" ? "selected" : ""}>AM</option>
            <option value="om" ${lang === "om" ? "selected" : ""}>OM</option>
          </select>
        </label>
        <button id="theme-toggle" class="theme-toggle" type="button" aria-label="Toggle theme">
          ${theme === "light" ? profile.ui.themeDark : profile.ui.themeLight}
        </button>
        <a class="cta-btn magnetic" href="./work-with-us.html">${profile.ui.workWithUs}</a>
      </div>
    </header>
  `;
}
