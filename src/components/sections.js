function sectionTitle(id, title, subtitle) {
  return `
    <div class="section-head reveal" id="${id}">
      <p class="eyebrow">${subtitle}</p>
      <h2>${title}</h2>
    </div>
  `;
}

export function renderPositioning(profile) {
  const cards = profile.positioning
    .map(
      (item) => `
      <article class="positioning-card reveal">
        <p class="positioning-title">${item.title}</p>
        <p class="positioning-detail">${item.detail}</p>
      </article>
    `
    )
    .join("");

  return `
    <section class="positioning story-chapter" id="positioning">
      <div class="positioning-grid">
        ${cards}
      </div>
    </section>
  `;
}

export function renderCapabilities(profile) {
  const blocks = profile.capabilities
    .map(
      (item) => `
      <article class="feature-card reveal">
        <h3>${item.title}</h3>
        <ul>
          ${item.points.map((point) => `<li>${point}</li>`).join("")}
        </ul>
      </article>
    `
    )
    .join("");

  return `
    <section class="section-block capabilities story-chapter" id="capabilities-chapter">
      ${sectionTitle(
        "capabilities",
        profile.ui.capabilitiesTitle,
        profile.ui.capabilitiesSubtitle
      )}
      <div class="feature-grid">
        ${blocks}
      </div>
    </section>
  `;
}

export function renderGovernance(profile) {
  const items = profile.governance.highlights
    .map((item) => `<li>${item}</li>`)
    .join("");

  return `
    <section class="section-block governance story-chapter" id="governance-chapter">
      ${sectionTitle(
        "governance",
        "How We Govern and Deliver",
        "Structure"
      )}
      <div class="governance-grid">
        <article class="gov-card reveal">
          <h3>Leadership</h3>
          <p><strong>General Manager:</strong> ${profile.governance.generalManager}</p>
          <p><strong>Deputy Manager:</strong> ${profile.governance.deputyManager}</p>
        </article>
        <article class="gov-card reveal">
          <h3>Operational Principles</h3>
          <ul>${items}</ul>
        </article>
      </div>
    </section>
  `;
}

export function renderGovernanceWithEngine(profile) {
  const items = profile.governance.highlights
    .map((item) => `<li>${item}</li>`)
    .join("");

  const phases = profile.roadmap
    .map((phase, index) => {
      const proofItems = (phase.proof || []).map((entry) => `<li>${entry}</li>`).join("");
      const proofId = `phase-proof-${index}`;
      const phaseNum = phase.phaseNumber || String(index + 1).padStart(2, "0");
      return `
    <button class="engine-phase" type="button" data-phase-index="${index}" data-case-target="${phase.caseStudyId || ""}" aria-expanded="${index === 0 ? "true" : "false"}" aria-controls="${proofId}">
      <div class="phase-ring"></div>
      <div class="phase-label">
        <span class="phase-num">${phaseNum}</span>
        <span class="phase-title">${phase.title}</span>
        <span class="phase-focus">${phase.focus || "Execution focus"}</span>
      </div>
    </button>
    <article id="${proofId}" class="phase-proof-card ${index === 0 ? "is-active" : ""}" data-phase-proof="${index}" data-case-target="${phase.caseStudyId || ""}" ${index === 0 ? "" : "hidden"}>
      <p class="proof-eyebrow">${phase.phase}</p>
      <h4>${phase.title}</h4>
      <p class="proof-description">${phase.description}</p>
      <div class="proof-metric">
        <span class="proof-metric-value">${phase.proofMetric || "-"}</span>
        <span class="proof-metric-label">${phase.proofLabel || profile.ui.governanceOutcomeFallback}</span>
      </div>
      <ul class="proof-list">${proofItems}</ul>
    </article>
  `;
    })
    .join("");

  return `
    <section class="section-block governance story-chapter" id="governance-chapter">
      ${sectionTitle(
        "governance",
        profile.ui.governanceTitle,
        profile.ui.governanceSubtitle
      )}
      
      <div class="governance-engine-wrap reveal">
        <div class="engine-canvas-container">
          <canvas id="governance-engine" class="governance-engine" aria-hidden="true"></canvas>
          <div class="engine-center-core">
            <span class="core-label">Nexora</span>
          </div>
        </div>
        <div class="engine-phases">
          ${phases}
        </div>
      </div>
      
      <div class="governance-grid">
        <article class="gov-card reveal">
          <h3>${profile.ui.governanceLeadership}</h3>
          <p><strong>${profile.ui.governanceGeneralManager}:</strong> ${profile.governance.generalManager}</p>
          <p><strong>${profile.ui.governanceDeputyManager}:</strong> ${profile.governance.deputyManager}</p>
        </article>
        <article class="gov-card reveal">
          <h3>${profile.ui.governanceOps}</h3>
          <ul>${items}</ul>
        </article>
      </div>
    </section>
  `;
}
export function renderRoadmap(profile) {
  const steps = profile.roadmap
    .map(
      (step) => `
      <article class="timeline-item reveal">
        <p class="timeline-phase">${step.phase}</p>
        <h3>${step.title}</h3>
        <p>${step.description}</p>
      </article>
    `
    )
    .join("");

  return `
    <section class="section-block roadmap story-chapter" id="roadmap-chapter">
      ${sectionTitle("roadmap", profile.ui.roadmapTitle, profile.ui.roadmapSubtitle)}
      <div class="timeline-wrap">
        ${steps}
      </div>
    </section>
  `;
}

export function renderContact(profile) {
  const primary = profile.contact.primary;
  const alternate = profile.contact.alternate;

  return `
    <section class="section-block contact story-chapter" id="contact">
      <div class="contact-panel reveal">
        <p class="eyebrow">${profile.ui.contactEyebrow}</p>
        <h2>${profile.ui.contactTitle}</h2>
        <p>
          ${profile.ui.contactCopy}
        </p>
        <div class="contact-list">
          <p><strong>${profile.ui.contactTelegram}:</strong> <a href="https://t.me/${primary.telegram.replace("@", "")}" target="_blank" rel="noopener noreferrer">${primary.telegram}</a> <span class="divider">||</span> <a href="https://t.me/${alternate.telegram.replace("@", "")}" target="_blank" rel="noopener noreferrer">${alternate.telegram}</a></p>
          <p><strong>${profile.ui.contactPhone}:</strong> <a href="tel:${primary.phone}">${primary.phone}</a> <span class="divider">||</span> <a href="tel:${alternate.phone}">${alternate.phone}</a></p>
          <p><strong>${profile.ui.contactLocation}:</strong> ${profile.office}</p>
        </div>
        <p class="contact-note">${profile.contact.note}</p>
        <a class="btn-primary magnetic" href="./work-with-us.html">${profile.ui.contactStartProject}</a>
      </div>
    </section>
  `;
}
