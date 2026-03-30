function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Import AI chat widget
import { initAIChatWidget } from "./components/ai-chat.js";

const sceneBridge = {
  setMood: null,
};

const scriptPromises = new Map();

function loadScript(src) {
  if (scriptPromises.has(src)) {
    return scriptPromises.get(src);
  }

  const promise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });

  scriptPromises.set(src, promise);
  return promise;
}

function ensureThree() {
  if (window.THREE) {
    return Promise.resolve(true);
  }

  return loadScript("https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.min.js");
}

async function ensureGsapBundle() {
  if (!window.gsap) {
    await loadScript("https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js");
  }
  if (!window.ScrollTrigger) {
    await loadScript("https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js");
  }
}

function getQualityTier() {
  const reduceMotion = prefersReducedMotion();
  const memory = Number(navigator.deviceMemory || 4);
  const cores = Number(navigator.hardwareConcurrency || 4);
  const connection = navigator.connection;
  const saveData = Boolean(connection && connection.saveData);
  const slowNetwork = Boolean(connection && /2g|slow-2g/.test(connection.effectiveType || ""));

  if (reduceMotion || saveData || slowNetwork || memory <= 2 || cores <= 2) {
    return "low";
  }

  if (memory <= 4 || cores <= 4) {
    return "medium";
  }

  return "high";
}

function getEnhancedCapabilityTier() {
  const reduceMotion = prefersReducedMotion();
  const memory = Number(navigator.deviceMemory || 4);
  const cores = Number(navigator.hardwareConcurrency || 4);
  const connection = navigator.connection;

  const connectionInfo = {
    saveData: Boolean(connection && connection.saveData),
    effectiveType: connection ? connection.effectiveType || "unknown" : "unknown",
    downlink: connection ? Number(connection.downlink || 0) : 0,
    rtt: connection ? Number(connection.rtt || 0) : 0,
  };

  // Basic device checks
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  const isMobile = /android|iphone|ipad|mobile/i.test(navigator.userAgent);

  // GPU/WebGL capability check
  let hasWebGL = false;
  let maxTextureSize = 0;
  try {
    const testCanvas = document.createElement("canvas");
    const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
    if (gl) {
      hasWebGL = true;
      maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 2048;
    }
  } catch {
    hasWebGL = false;
  }

  // Scoring system for tier determination
  let score = 0;
  if (!reduceMotion) score += 1;
  if (!connectionInfo.saveData) score += 1;
  if (!isMobile) score += 1;
  if (!isTouch) score += 1;
  if (memory >= 8) score += 2;
  else if (memory >= 4) score += 1;
  if (cores >= 8) score += 2;
  else if (cores >= 4) score += 1;
  if (hasWebGL) score += 2;
  if (maxTextureSize >= 4096) score += 1;
  if (connectionInfo.downlink >= 5) score += 1;
  if (connectionInfo.effectiveType === "4g") score += 1;
  if (connectionInfo.rtt > 0 && connectionInfo.rtt < 120) score += 1;

  let tier = "low";
  if (score >= 11) {
    tier = "high";
  } else if (score >= 6) {
    tier = "medium";
  }

  // Force low for critical constraints
  if (
    reduceMotion ||
    connectionInfo.saveData ||
    connectionInfo.effectiveType === "2g" ||
    connectionInfo.effectiveType === "slow-2g" ||
    memory <= 2 ||
    cores <= 2 ||
    !hasWebGL
  ) {
    tier = "low";
  }

  return {
    tier,
    score,
    reduceMotion,
    memory,
    cores,
    isTouch,
    isMobile,
    hasWebGL,
    maxTextureSize,
    connection: connectionInfo,
  };
}
function initCursorFollower(qualityTier) {
  if (window.matchMedia("(pointer: coarse)").matches || qualityTier === "low") {
    return;
  }

  const cursor = document.createElement("div");
  cursor.className = "cursor-follower";
  document.body.appendChild(cursor);

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let tx = x;
  let ty = y;

  window.addEventListener("pointermove", (event) => {
    tx = event.clientX;
    ty = event.clientY;
  });

  const tick = () => {
    x += (tx - x) * 0.18;
    y += (ty - y) * 0.18;
    cursor.style.transform = `translate(${x}px, ${y}px)`;
    requestAnimationFrame(tick);
  };

  tick();

  document.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("is-active"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("is-active"));
  });
}

function initMagneticButtons(qualityTier) {
  // Disable on touch devices or if user prefers reduced motion
  if (window.matchMedia("(pointer: coarse)").matches || prefersReducedMotion()) {
    return;
  }

  document.querySelectorAll(".magnetic").forEach((button) => {
    // Reduce offset on low-end devices to avoid "sticky fingers" effect
    const maxOffset = qualityTier === "high" ? 12 : qualityTier === "medium" ? 6 : 3;
    const pullStrength = qualityTier === "high" ? 0.22 : 0.16;

    button.addEventListener("mousemove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      const dx = Math.max(-maxOffset, Math.min(maxOffset, x * pullStrength));
      const dy = Math.max(-maxOffset, Math.min(maxOffset, y * pullStrength));
      button.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "translate(0, 0)";

    function initHeroTerms() {
      if (prefersReducedMotion() || window.matchMedia("(pointer: coarse)").matches) {
        return;
      }

      const heroTerms = document.querySelectorAll(".hero-term");
  
      // Map term types to 3D scene animations
      const termPresets = {
        ai: { rotX: 0.15, rotY: 0.4, scale: 1.08, lineOpacity: 0.35 },
        scale: { rotX: -0.1, rotY: -0.35, scale: 1.14, lineOpacity: 0.38 },
        secure: { rotX: 0.08, rotY: 0.2, scale: 0.96, lineOpacity: 0.28 },
        reliability: { rotX: -0.06, rotY: -0.15, scale: 1.02, lineOpacity: 0.32 },
      };

      heroTerms.forEach((term) => {
        term.addEventListener("mouseenter", () => {
          const preset = termPresets[term.dataset.term] || termPresets.ai;
          if (typeof sceneBridge.setMood !== "function") return;
      
          // Create a temporary mood based on the term
          const tmpScene = Object.assign({}, {
            rotX: preset.rotX,
            rotY: preset.rotY,
            scale: preset.scale,
            lineOpacity: preset.lineOpacity,
            coreOpacity: 0.22,
            pointSize: 0.044,
            color: 0x71e8de,
            lineColor: 0x47d5c4,
          });
          // This would require exposing the Three.js targets, 
          // so we'll use GSAP to pulse the canvas instead
          const canvas = document.querySelector("#neural-canvas");
          if (canvas && window.gsap) {
            window.gsap.to(canvas, {
              filter: "drop-shadow(0 0 16px rgba(71, 213, 196, 0.6))",
              scale: 1.02,
              duration: 0.3,
              ease: "power2.out",
            });
          }
        });

        term.addEventListener("mouseleave", () => {
          const canvas = document.querySelector("#neural-canvas");
          if (canvas && window.gsap) {
            window.gsap.to(canvas, {
              filter: "drop-shadow(0 0 0px rgba(71, 213, 196, 0))",
              scale: 1,
              duration: 0.3,
              ease: "power2.out",
            });
          }
        });
      });
    }
    });
  });
}

function initThreeNeuralScene(canvas, qualityTier) {
  const THREE = window.THREE;
  if (!THREE) {
    return null;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.2, 4.7);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);

  const root = new THREE.Group();
  scene.add(root);

  const nodeCount = qualityTier === "high" ? 220 : 150;
  const sphereRadius = 1.65;
  const rawPositions = new Float32Array(nodeCount * 3);

  for (let index = 0; index < nodeCount; index += 1) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = sphereRadius * (0.6 + Math.random() * 0.4);

    rawPositions[index * 3] = r * Math.sin(phi) * Math.cos(theta);
    rawPositions[index * 3 + 1] = r * Math.cos(phi) * 0.82;
    rawPositions[index * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }

  const pointsGeometry = new THREE.BufferGeometry();
  pointsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(rawPositions, 3));

  const pointsMaterial = new THREE.PointsMaterial({
    color: 0x71e8de,
    size: 0.04,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.9,
  });

  const points = new THREE.Points(pointsGeometry, pointsMaterial);
  root.add(points);

  const lineVertices = [];
  const maxDistance = qualityTier === "high" ? 0.52 : 0.46;
  for (let i = 0; i < nodeCount; i += 1) {
    const ax = rawPositions[i * 3];
    const ay = rawPositions[i * 3 + 1];
    const az = rawPositions[i * 3 + 2];

    for (let j = i + 1; j < nodeCount; j += 1) {
      const bx = rawPositions[j * 3];
      const by = rawPositions[j * 3 + 1];
      const bz = rawPositions[j * 3 + 2];

      const dx = ax - bx;
      const dy = ay - by;
      const dz = az - bz;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (distance < maxDistance) {
        lineVertices.push(ax, ay, az, bx, by, bz);
      }
    }
  }

  const linesGeometry = new THREE.BufferGeometry();
  linesGeometry.setAttribute("position", new THREE.Float32BufferAttribute(lineVertices, 3));
  const linesMaterial = new THREE.LineBasicMaterial({
    color: 0x47d5c4,
    transparent: true,
    opacity: 0.22,
  });
  const lines = new THREE.LineSegments(linesGeometry, linesMaterial);
  root.add(lines);

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.76, 2),
    new THREE.MeshBasicMaterial({
      color: 0xff9b54,
      transparent: true,
      opacity: 0.17,
      wireframe: true,
    })
  );
  root.add(core);

  const sceneState = {
    rotX: 0,
    rotY: 0,
    scale: 1,
    lineOpacity: 0.22,
    coreOpacity: 0.17,
    pointSize: 0.04,
    color: new THREE.Color(0x71e8de),
    lineColor: new THREE.Color(0x47d5c4),
  };

  const targets = {
    rotX: 0,
    rotY: 0,
    scale: 1,
    lineOpacity: 0.22,
    coreOpacity: 0.17,
    pointSize: 0.04,
    color: new THREE.Color(0x71e8de),
    lineColor: new THREE.Color(0x47d5c4),
  };

  const moodPresets = {
    hero: {
      rotX: 0.02,
      rotY: 0,
      scale: 1,
      lineOpacity: 0.24,
      coreOpacity: 0.19,
      pointSize: 0.041,
      color: 0x71e8de,
      lineColor: 0x47d5c4,
    },
    capabilities: {
      rotX: -0.08,
      rotY: 0.26,
      scale: 1.06,
      lineOpacity: 0.32,
      coreOpacity: 0.25,
      pointSize: 0.043,
      color: 0x75efe4,
      lineColor: 0x77dbc9,
    },
    governance: {
      rotX: 0.14,
      rotY: -0.3,
      scale: 0.94,
      lineOpacity: 0.18,
      coreOpacity: 0.13,
      pointSize: 0.038,
      color: 0x8ed9ff,
      lineColor: 0x5cb9db,
    },
    roadmap: {
      rotX: 0.05,
      rotY: 0.55,
      scale: 1.12,
      lineOpacity: 0.34,
      coreOpacity: 0.29,
      pointSize: 0.046,
      color: 0xffbf93,
      lineColor: 0xff9b54,
    },
    contact: {
      rotX: -0.1,
      rotY: -0.12,
      scale: 0.98,
      lineOpacity: 0.24,
      coreOpacity: 0.22,
      pointSize: 0.04,
      color: 0xa4ffe4,
      lineColor: 0x69d9c9,
    },
  };

  const setMood = (name) => {
    const preset = moodPresets[name] || moodPresets.hero;
    targets.rotX = preset.rotX;
    targets.rotY = preset.rotY;
    targets.scale = preset.scale;
    targets.lineOpacity = preset.lineOpacity;
    targets.coreOpacity = preset.coreOpacity;
    targets.pointSize = preset.pointSize;
    targets.color.setHex(preset.color);
    targets.lineColor.setHex(preset.lineColor);
  };

  setMood("hero");

  const ambient = new THREE.AmbientLight(0x7ce7dc, 0.55);
  const pointLight = new THREE.PointLight(0xffb789, 1.25, 12);
  pointLight.position.set(2.2, 1.8, 2.8);
  scene.add(ambient, pointLight);

  let pointerX = 0;
  let pointerY = 0;
  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    pointerX = (px - 0.5) * 0.7;
    pointerY = (py - 0.5) * 0.55;
  });

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(320, Math.floor(rect.width));
    const height = Math.max(260, Math.floor(rect.height));
    const maxDpr = qualityTier === "high" ? 1.6 : 1.2;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, maxDpr);

    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  resize();
  window.addEventListener("resize", resize);
  canvas.classList.add("is-three");
  canvas.classList.remove("is-loading");

  const clock = new THREE.Clock();

  const tick = () => {
    const elapsed = clock.getElapsedTime();
    sceneState.rotX += (targets.rotX - sceneState.rotX) * 0.04;
    sceneState.rotY += (targets.rotY - sceneState.rotY) * 0.04;
    sceneState.scale += (targets.scale - sceneState.scale) * 0.05;
    sceneState.lineOpacity += (targets.lineOpacity - sceneState.lineOpacity) * 0.04;
    sceneState.coreOpacity += (targets.coreOpacity - sceneState.coreOpacity) * 0.05;
    sceneState.pointSize += (targets.pointSize - sceneState.pointSize) * 0.05;
    sceneState.color.lerp(targets.color, 0.05);
    sceneState.lineColor.lerp(targets.lineColor, 0.05);

    root.rotation.y = elapsed * 0.18 + pointerX * 0.24 + sceneState.rotY;
    root.rotation.x = Math.sin(elapsed * 0.35) * 0.08 + pointerY * 0.2 + sceneState.rotX;
    root.scale.setScalar(sceneState.scale);

    linesMaterial.opacity = sceneState.lineOpacity;
    linesMaterial.color.copy(sceneState.lineColor);
    pointsMaterial.size = sceneState.pointSize;
    pointsMaterial.color.copy(sceneState.color);
    core.material.opacity = sceneState.coreOpacity;

    core.rotation.x = -elapsed * 0.22;
    core.rotation.y = elapsed * 0.24;

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };

  tick();
  return { setMood };
}

function initCanvasFallback(canvas, qualityTier) {
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) {
    return;
  }

  const reduce = prefersReducedMotion();
  const pointCount = reduce ? 24 : qualityTier === "high" ? 52 : 36;
  const points = [];
  let width = 0;
  let height = 0;
  let pointerX = 0;
  let pointerY = 0;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(320, Math.floor(rect.width));
    height = Math.max(260, Math.floor(rect.height));

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const resetPoints = () => {
    points.length = 0;
    for (let index = 0; index < pointCount; index += 1) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random(),
        vx: (Math.random() - 0.5) * (reduce ? 0.18 : 0.42),
        vy: (Math.random() - 0.5) * (reduce ? 0.18 : 0.42),
      });
    }
  };

  const onResize = () => {
    resize();
    resetPoints();
  };

  window.addEventListener("resize", onResize);
  onResize();
  canvas.classList.remove("is-loading");

  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointerX = event.clientX - rect.left;
    pointerY = event.clientY - rect.top;
  });

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    for (const point of points) {
      point.x += point.vx;
      point.y += point.vy;

      if (point.x <= 0 || point.x >= width) {
        point.vx *= -1;
      }
      if (point.y <= 0 || point.y >= height) {
        point.vy *= -1;
      }
    }

    for (let i = 0; i < points.length; i += 1) {
      const a = points[i];
      for (let j = i + 1; j < points.length; j += 1) {
        const b = points[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 108) {
          const alpha = (1 - distance / 108) * 0.38;
          ctx.strokeStyle = `rgba(71, 213, 196, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const point of points) {
      const offsetX = (pointerX - width * 0.5) * 0.008 * (point.z + 0.25);
      const offsetY = (pointerY - height * 0.5) * 0.008 * (point.z + 0.25);
      const radius = 1.2 + point.z * 2.4;

      ctx.fillStyle = point.z > 0.65 ? "rgba(255, 155, 84, 0.9)" : "rgba(111, 232, 222, 0.9)";
      ctx.beginPath();
      ctx.arc(point.x + offsetX, point.y + offsetY, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  };

  draw();
}

function initNeuralCanvas() {
  const canvas = document.querySelector("#neural-canvas");
  if (!canvas) {
    return;
  }

  const qualityTier = getQualityTier();

  canvas.classList.add("is-loading");

  let started = false;

  const start = async () => {
    if (started) {
      return;
    }
    started = true;

    if (prefersReducedMotion()) {
      initCanvasFallback(canvas, qualityTier);
      return;
    }

    let hasThree = false;
    try {
      hasThree = await ensureThree();
    } catch {
      hasThree = false;
    }

    if (!hasThree) {
      initCanvasFallback(canvas, qualityTier);
      return;
    }

    const threeScene = initThreeNeuralScene(canvas, qualityTier);
    if (threeScene) {
      sceneBridge.setMood = threeScene.setMood;
      return;
    }

    initCanvasFallback(canvas, qualityTier);
  };

  const hero = document.querySelector("#hero");
  if (!hero) {
    start();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          observer.disconnect();
          start();
          return;
        }
      }
    },
    { rootMargin: "240px 0px" }
  );

  observer.observe(hero);

  if (window.scrollY < 40) {
    start();
    observer.disconnect();
  }
}

function applySceneMood(mood) {
  if (typeof sceneBridge.setMood === "function") {
    sceneBridge.setMood(mood);
  }
}

// Sector-specific color schemes for mood transitions
const sectorMoodColors = {
  hero: {
    primary: "#0d1718",
    accent1: "#47d5c4",
    accent2: "#ff9b54",
    background: "linear-gradient(135deg, rgba(13, 23, 24, 0.95), rgba(16, 31, 33, 0.88))",
  },
  // Banking/Financial sector - Deep Navy + Gold (Trust)
  capabilities: {
    primary: "#0f1f2e",
    accent1: "#4db8c4",
    accent2: "#d4a574",
    background: "linear-gradient(135deg, rgba(15, 31, 46, 0.95), rgba(17, 39, 56, 0.88))",
  },
  // Healthcare/Education sector - Green + Blue (Care)
  governance: {
    primary: "#0d2417",
    accent1: "#2eb89e",
    accent2: "#5eb3d8",
    background: "linear-gradient(135deg, rgba(13, 36, 23, 0.95), rgba(15, 45, 30, 0.88))",
  },
  // Startup/AI sector - Electric Purple + Cyan (Innovation)
  roadmap: {
    primary: "#1a0a2e",
    accent1: "#9d4edd",
    accent2: "#00d9ff",
    background: "linear-gradient(135deg, rgba(26, 10, 46, 0.95), rgba(35, 15, 60, 0.88))",
  },
  // Contact - Balanced blend
  contact: {
    primary: "#0d1718",
    accent1: "#47d5c4",
    accent2: "#ff9b54",
    background: "linear-gradient(135deg, rgba(13, 23, 24, 0.95), rgba(16, 31, 33, 0.88))",
  },
};

function updateSceneColors(mood) {
  const colors = sectorMoodColors[mood] || sectorMoodColors.hero;
  const root = document.documentElement;
  
  // Use GSAP to smoothly animate color transitions
  const gsap = window.gsap;
  if (gsap) {
    gsap.to(root, {
      "--mood-primary": colors.primary,
      "--mood-accent-1": colors.accent1,
      "--mood-accent-2": colors.accent2,
      duration: 0.8,
      ease: "power2.inOut",
    });
  } else {
    // Fallback without GSAP
    root.style.setProperty("--mood-primary", colors.primary);
    root.style.setProperty("--mood-accent-1", colors.accent1);
    root.style.setProperty("--mood-accent-2", colors.accent2);
  }
}

async function initScrollStory() {
  if (prefersReducedMotion()) {
    return;
  }

  try {
    await ensureGsapBundle();
  } catch {
    return;
  }

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const moodTriggers = [
    { trigger: "#hero", mood: "hero" },
    { trigger: "#capabilities", mood: "capabilities" },
    { trigger: "#governance", mood: "governance" },
    { trigger: "#roadmap", mood: "roadmap" },
    { trigger: "#contact", mood: "contact" },
  ];

  moodTriggers.forEach(({ trigger, mood }) => {
    if (!document.querySelector(trigger)) {
      return;
    }

    ScrollTrigger.create({
      trigger,
      start: "top 65%",
      end: "bottom 35%",
      onEnter: () => {
        applySceneMood(mood);
        updateSceneColors(mood);
      },
      onEnterBack: () => {
        applySceneMood(mood);
        updateSceneColors(mood);
      },
    });
  });

  gsap.fromTo(
    ".hero-content",
    { y: 0, opacity: 1 },
    {
      y: -60,
      opacity: 0.5,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "+=420",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    }
  );

  gsap.utils.toArray(".story-chapter").forEach((chapter, index) => {
    if (index === 0) {
      return;
    }

    gsap.fromTo(
      chapter,
      { y: 38, opacity: 0.55 },
      {
        y: 0,
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: chapter,
          start: "top 82%",
          end: "top 44%",
          scrub: 0.8,
        },
      }
    );
  });

  gsap.fromTo(
    ".timeline-item",
    { y: 22, opacity: 0.4 },
    {
      y: 0,
      opacity: 1,
      stagger: 0.18,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".roadmap",
        start: "top 76%",
      },
    }
  );

  gsap.fromTo(
    ".positioning-card",
    { y: 18, opacity: 0.4, scale: 0.98 },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      stagger: 0.14,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".positioning",
        start: "top 78%",
      },
    }
  );
}

function warmupRoutePrefetch() {
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = "./work-with-us.html";
  link.as = "document";
  document.head.appendChild(link);
}

function initCaseStudiesSlider() {
  const slider = document.querySelector(".case-slider");
  const slides = document.querySelectorAll(".case-slide");
  const indicators = document.querySelectorAll(".case-indicator");
  const prevBtn = document.querySelector(".case-nav.prev");
  const nextBtn = document.querySelector(".case-nav.next");

  if (!slider || slides.length === 0) {
    return;
  }

  let currentIndex = 0;

  const goToSlide = (index) => {
    // Ensure index is within bounds
    if (index < 0) {
      currentIndex = slides.length - 1;
    } else if (index >= slides.length) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    // Update slide visibility
    slides.forEach((slide) => {
      slide.removeAttribute("data-active");
    });
    slides[currentIndex].setAttribute("data-active", "true");

    // Update indicator buttons
    indicators.forEach((indicator, idx) => {
      if (idx === currentIndex) {
        indicator.setAttribute("aria-current", "page");
      } else {
        indicator.removeAttribute("aria-current");
      }
    });
  };

  // Navigation buttons
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      goToSlide(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      goToSlide(currentIndex + 1);
    });
  }

  // Indicator buttons
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      goToSlide(index);
    });

    // Keyboard navigation for indicators (arrow keys)
    indicator.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        goToSlide(currentIndex - 1);
        indicators[currentIndex]?.focus();
      } else if (event.key === "ArrowRight") {
        goToSlide(currentIndex + 1);
        indicators[currentIndex]?.focus();
      }
    });
  });

  // Keyboard navigation for the slider
  document.addEventListener("keydown", (event) => {
    if (!slider.querySelector("[data-active='true']")) {
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToSlide(currentIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goToSlide(currentIndex + 1);
    }
  });
}

function initGovernanceEngine() {
  const canvas = document.querySelector("#governance-engine");
  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

function initShowcaseVideos() {
  const showcase = document.querySelector(".showcase");
  if (!showcase) {
    return;
  }

  const videos = document.querySelectorAll(".showcase-video");
  if (videos.length === 0) {
    return;
  }

  // Intersection observer to autoplay videos when in view
  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          // Show video and auto-play
          video.style.display = "block";
          video.play().catch(() => {
            // Video autoplay blocked, keep placeholder visible
            video.style.display = "none";
          });
        } else {
          // Pause when out of view
          video.pause();
        }
      });
    },
    { threshold: 0.5 }
  );

  videos.forEach((video) => {
    videoObserver.observe(video);
  });
}

  let width = 0;
  let height = 0;
  let centerX = 0;
  let centerY = 0;
  let rotation = 0;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(200, Math.floor(rect.width));
    height = Math.max(200, Math.floor(rect.height));

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    centerX = width / 2;
    centerY = height / 2;
  };

  window.addEventListener("resize", resize);
  resize();

  const drawEngineCore = () => {
    ctx.clearRect(0, 0, width, height);

    // Draw background circles
    for (let i = 0; i < 4; i++) {
      const radius = 30 + i * 25;
      ctx.strokeStyle = `rgba(71, 213, 196, ${0.12 - i * 0.02})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw rotating rings
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);

    // Inner rotating core
    const speeds = [0.02, 0.015, 0.01];
    const colors = ["#47d5c4", "#ff9b54", "#6ee2d6"];
    const radiuses = [45, 75, 105];

    for (let i = 0; i < 3; i++) {
      const angle = (rotation * speeds[i]) % (Math.PI * 2);
      
      // Draw arc segments
      ctx.strokeStyle = colors[i];
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.6 - i * 0.1;
      ctx.beginPath();
      ctx.arc(0, 0, radiuses[i], angle, angle + Math.PI * 0.8);
      ctx.stroke();

      // Draw nodes on rings
      for (let node = 0; node < 6; node++) {
        const nodeAngle = (node * Math.PI * 2) / 6 + angle * 0.5;
        const x = Math.cos(nodeAngle) * radiuses[i];
        const y = Math.sin(nodeAngle) * radiuses[i];

        ctx.globalAlpha = 0.8;
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();

    // Central core pulse
    ctx.globalAlpha = 0.5 + Math.sin(rotation * 0.05) * 0.3;
    ctx.fillStyle = "#47d5c4";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
    ctx.fill();

    // Core glow
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 18);
    gradient.addColorStop(0, "rgba(71, 213, 196, 0.4)");
    gradient.addColorStop(1, "rgba(71, 213, 196, 0)");
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;

    rotation += 0.6;
    requestAnimationFrame(drawEngineCore);
  };

  drawEngineCore();
}

function initGovernanceProof() {
  const phaseButtons = document.querySelectorAll(".engine-phase[data-phase-index]");
  const proofCards = document.querySelectorAll(".phase-proof-card[data-phase-proof]");
  const caseSlides = document.querySelectorAll(".case-slide[data-case]");
  const caseIndicators = document.querySelectorAll(".case-indicator[data-index]");
  const caseSection = document.querySelector("#case-studies");
  const caseSliderWrap = document.querySelector(".case-slider-wrap");

  if (!phaseButtons.length || !proofCards.length) {
    return;
  }

  const activateCaseById = (caseId) => {
    if (!caseId || !caseSlides.length) {
      return;
    }

    let activeIndex = -1;
    caseSlides.forEach((slide, idx) => {
      const isActive = slide.dataset.case === caseId;
      if (isActive) {
        activeIndex = idx;
        slide.setAttribute("data-active", "true");
      } else {
        slide.removeAttribute("data-active");
      }
    });

    caseIndicators.forEach((indicator, idx) => {
      if (idx === activeIndex) {
        indicator.setAttribute("aria-current", "page");
      } else {
        indicator.removeAttribute("aria-current");
      }
    });

    if (caseSliderWrap) {
      caseSliderWrap.classList.remove("is-linked-highlight");
      requestAnimationFrame(() => {
        caseSliderWrap.classList.add("is-linked-highlight");
      });
    }
  };

  const activate = (index) => {
    phaseButtons.forEach((button) => {
      const isActive = button.dataset.phaseIndex === String(index);
      button.setAttribute("aria-expanded", isActive ? "true" : "false");
    });

    proofCards.forEach((card) => {
      const isActive = card.dataset.phaseProof === String(index);
      card.classList.toggle("is-active", isActive);
    });

    const activeButton = Array.from(phaseButtons).find(
      (button) => button.dataset.phaseIndex === String(index)
    );
    const caseId = activeButton ? activeButton.dataset.caseTarget : "";
    activateCaseById(caseId);
  };

  phaseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activate(button.dataset.phaseIndex);

      if (caseSection) {
        const rect = caseSection.getBoundingClientRect();
        const outOfView = rect.bottom < 80 || rect.top > window.innerHeight - 80;
        if (outOfView) {
          caseSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });
}
export function setupCinematic() {
  const capabilities = getEnhancedCapabilityTier();
  const qualityTier = capabilities.tier;

  // Expose diagnostics for QA and performance tuning
  window.__nexoraCapabilities = capabilities;

  initCursorFollower(qualityTier);
  initMagneticButtons(qualityTier);
  initNeuralCanvas();
  initScrollStory();

  initHeroTerms();
  initCaseStudiesSlider();
  initGovernanceEngine();
  initGovernanceProof();
  initAIChatWidget();
  initShowcaseVideos();

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(warmupRoutePrefetch, { timeout: 1200 });
  } else {
    setTimeout(warmupRoutePrefetch, 700);
  }
}
