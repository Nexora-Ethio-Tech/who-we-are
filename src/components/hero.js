export function renderHero(profile) {
  return `
    <section class="hero reveal">
      <p class="eyebrow">Nexora Technology PLC</p>
      <h1>${profile.tagline}</h1>
      <p class="hero-copy">${profile.intro}</p>
      <div class="hero-actions">
        <a class="btn-primary" href="#capabilities">Explore Services</a>
        <a class="btn-secondary" href="#governance">How We Operate</a>
      </div>
      <div class="hero-meta">
        <span>Head Office: ${profile.office}</span>
        <span>Built for long-term digital impact</span>
      </div>
    </section>
  `;
}
