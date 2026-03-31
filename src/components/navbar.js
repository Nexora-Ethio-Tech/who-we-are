export function renderNavbar(profile, state) {
  const links = profile.nav
    .map((item) => `<a href="#${item.id}">${item.label}</a>`)
    .join("");

  const lang = state?.lang || "en";
  const theme = state?.theme || "dark";

  const langButtons = [
    { value: "en", label: "EN" },
    { value: "am", label: "AM" },
    { value: "om", label: "OM" },
  ]
    .map(
      (item) => `
      <button
        type="button"
        class="lang-btn ${lang === item.value ? "is-active" : ""}"
        data-lang-btn="${item.value}"
        aria-pressed="${lang === item.value ? "true" : "false"}"
      >${item.label}</button>
    `
    )
    .join("");

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
        <div class="lang-switch" role="group" aria-label="Language">
          ${langButtons}
        </div>
        <button id="theme-toggle" class="theme-toggle" type="button" aria-label="Toggle theme">
          ${theme === "light" ? profile.ui.themeDark : profile.ui.themeLight}
        </button>
        <a class="cta-btn magnetic" href="./work-with-us.html">${profile.ui.workWithUs}</a>
      </div>
    </header>
  `;
}
