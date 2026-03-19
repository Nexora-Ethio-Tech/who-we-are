export function renderNavbar(profile) {
  const links = profile.nav
    .map((item) => `<a href="#${item.id}">${item.label}</a>`)
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
      <a class="cta-btn" href="#contact">Work With Us</a>
    </header>
  `;
}
