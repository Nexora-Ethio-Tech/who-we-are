export function renderHero(profile) {
  // Wrap key terms with interactive span for hover effects
  const highlightedIntro = profile.intro
    .replace(/intelligent/gi, '<span class="hero-term" data-term="ai">intelligent</span>')
    .replace(/scalable/gi, '<span class="hero-term" data-term="scale">scalable</span>')
    .replace(/secure/gi, '<span class="hero-term" data-term="secure">secure</span>')
    .replace(/reliable/gi, '<span class="hero-term" data-term="reliability">reliable</span>');

  return `
    <section class="hero story-chapter reveal" id="hero">
      <canvas id="neural-canvas" class="neural-canvas" aria-hidden="true"></canvas>
      <div class="hero-content">
        <p class="eyebrow">Nexora Technology PLC</p>
        <h1>${profile.tagline}</h1>
        <p class="hero-copy">${highlightedIntro}</p>
        <div class="hero-actions">
          <a class="btn-primary magnetic" href="#capabilities">${profile.ui.heroExplore}</a>
          <a class="btn-secondary magnetic" href="#governance">${profile.ui.heroOperate}</a>
        </div>
        <div class="hero-meta">
          <span>${profile.ui.heroHeadOffice}: ${profile.office}</span>
          <span>${profile.ui.heroMetaImpact}</span>
        </div>
      </div>
    </section>
  `;
}
