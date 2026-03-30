export function renderCaseStudies(profile) {
  if (!profile.caseStudies || profile.caseStudies.length === 0) {
    return "";
  }

  const slides = profile.caseStudies
    .map(
      (study, index) => `
    <div class="case-slide reveal" data-case="${study.id}" ${index === 0 ? 'data-active="true"' : ""}>
      <div class="case-header">
        <span class="case-sector">${study.sector}</span>
        <h3>${study.title}</h3>
      </div>
      
      <div class="case-comparison">
        <div class="case-column before-column">
          <div class="column-badge">
            <span class="badge-icon">${study.before.icon}</span>
            <span class="badge-label">Before</span>
          </div>
          <h4>Challenges</h4>
          <ul class="case-list">
            ${study.before.challenges.map((challenge) => `<li>${challenge}</li>`).join("")}
          </ul>
        </div>

        <div class="case-divider">
          <div class="arrow-icon">→</div>
        </div>

        <div class="case-column after-column">
          <div class="column-badge success">
            <span class="badge-icon">${study.after.icon}</span>
            <span class="badge-label">After</span>
          </div>
          <h4>Outcomes</h4>
          <ul class="case-list results">
            ${study.after.improvements.map((improvement) => `<li>${improvement}</li>`).join("")}
          </ul>
          <div class="case-metric">
            <div class="metric-value">${study.after.metric}</div>
            <div class="metric-label">${study.after.label}</div>
          </div>
        </div>
      </div>
    </div>
  `
    )
    .join("");

  const indicators = profile.caseStudies
    .map(
      (study, index) => `
    <button 
      class="case-indicator" 
      data-index="${index}" 
      aria-label="Go to ${study.sector} case study"
      ${index === 0 ? 'aria-current="page"' : ""}
    >
      <span class="indicator-dot"></span>
      <span class="indicator-label">${study.sector}</span>
    </button>
  `
    )
    .join("");

  return `
    <section class="section-block case-studies story-chapter" id="case-studies">
      <div class="section-head reveal">
        <p class="eyebrow">Success Stories</p>
        <h2>Results That Speak</h2>
        <p class="section-subtitle">See how we've transformed organizations across sectors</p>
      </div>

      <div class="case-slider-wrap">
        <div class="case-slider">
          ${slides}
        </div>

        <div class="case-controls">
          <button class="case-nav prev" aria-label="Previous case study">
            <span>←</span>
          </button>
          
          <div class="case-indicators">
            ${indicators}
          </div>
          
          <button class="case-nav next" aria-label="Next case study">
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  `;
}
