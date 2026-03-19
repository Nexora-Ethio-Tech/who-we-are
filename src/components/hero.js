export function renderHero(profile) {
  return `
    <section class="hero story-chapter reveal" id="hero">
      <canvas id="neural-canvas" class="neural-canvas" aria-hidden="true"></canvas>
      <div class="hero-content">
        <p class="eyebrow">Nexora Technology PLC</p>
        <h1>${profile.tagline}</h1>
        <p class="hero-copy">${profile.intro}</p>
        <div class="hero-actions">
          <a class="btn-primary magnetic" href="#capabilities">Explore Services</a>
          <a class="btn-secondary magnetic" href="#governance">How We Operate</a>
        </div>
        <div class="hero-meta">
          <span>Head Office: ${profile.office}</span>
          <span>Built for long-term digital impact</span>
        </div>
      </div>
    </section>
  `;
}
