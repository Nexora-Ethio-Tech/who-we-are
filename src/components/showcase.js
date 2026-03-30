export function renderShowcase(profile) {
  if (!profile.showcase || profile.showcase.length === 0) {
    return "";
  }

  const items = profile.showcase
    .map(
      (item, index) => `
    <div class="showcase-item reveal" data-index="${index}">
      <div class="showcase-device phone">
        <div class="device-notch"></div>
        <div class="device-screen">
          <div class="screen-content">
            <div class="screen-preview">
              <span class="preview-icon">${item.preview}</span>
              <span class="preview-label">${item.title}</span>
            </div>
          </div>
          <video 
            class="showcase-video"
            data-video="${item.video}"
            muted 
            loop 
            playsinline
            aria-label="Demo video for ${item.title}"
            style="display: none;"
          ></video>
        </div>
        <div class="device-home"></div>
      </div>

      <div class="showcase-info">
        <span class="showcase-category">${item.category}</span>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <div class="showcase-features">
          ${item.features.map((feature) => `<span class="feature-tag">${feature}</span>`).join("")}
        </div>
      </div>
    </div>
  `
    )
    .join("");

  return `
    <section class="section-block showcase story-chapter" id="showcase">
      <div class="section-head reveal">
        <p class="eyebrow">Our Work</p>
        <h2>Built by Nexora</h2>
        <p class="section-subtitle">Real products solving real problems across sectors</p>
      </div>

      <div class="showcase-grid">
        ${items}
      </div>
    </section>
  `;
}
