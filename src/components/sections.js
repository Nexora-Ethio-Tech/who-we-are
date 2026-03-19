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
        "What We Build",
        "Capabilities"
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
      ${sectionTitle("roadmap", "Where We Are Going", "Vision")}
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
        <p class="eyebrow">Contact</p>
        <h2>Let's Build Something Real Together</h2>
        <p>
          We collaborate with institutions, startups, and teams that want practical,
          scalable digital systems.
        </p>
        <div class="contact-list">
          <p><strong>Telegram:</strong> <a href="https://t.me/${primary.telegram.replace("@", "")}" target="_blank" rel="noopener noreferrer">${primary.telegram}</a> <span class="divider">||</span> <a href="https://t.me/${alternate.telegram.replace("@", "")}" target="_blank" rel="noopener noreferrer">${alternate.telegram}</a></p>
          <p><strong>Phone:</strong> <a href="tel:${primary.phone}">${primary.phone}</a> <span class="divider">||</span> <a href="tel:${alternate.phone}">${alternate.phone}</a></p>
          <p><strong>GitHub:</strong> <a href="${primary.github}" target="_blank" rel="noopener noreferrer">${primary.github}</a> <span class="divider">||</span> <a href="${alternate.github}" target="_blank" rel="noopener noreferrer">${alternate.github}</a></p>
          <p><strong>LinkedIn:</strong> <a href="${primary.linkedin}" target="_blank" rel="noopener noreferrer">${primary.linkedin}</a></p>
          <p><strong>Location:</strong> ${profile.office}</p>
        </div>
        <p class="contact-note">${profile.contact.note}</p>
        <a class="btn-primary magnetic" href="./work-with-us.html">Start a Project</a>
      </div>
    </section>
  `;
}
