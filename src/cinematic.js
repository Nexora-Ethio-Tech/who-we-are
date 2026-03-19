function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const sceneBridge = {
  setMood: null,
};

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
  if (window.matchMedia("(pointer: coarse)").matches || prefersReducedMotion()) {
    return;
  }

  document.querySelectorAll(".magnetic").forEach((button) => {
    const maxOffset = qualityTier === "high" ? 12 : 8;

    button.addEventListener("mousemove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      const dx = Math.max(-maxOffset, Math.min(maxOffset, x * 0.22));
      const dy = Math.max(-maxOffset, Math.min(maxOffset, y * 0.22));
      button.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "translate(0, 0)";
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

  const start = () => {
    if (prefersReducedMotion()) {
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

function initScrollStory() {
  if (prefersReducedMotion()) {
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
      onEnter: () => applySceneMood(mood),
      onEnterBack: () => applySceneMood(mood),
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

export function setupCinematic() {
  const qualityTier = getQualityTier();

  initCursorFollower(qualityTier);
  initMagneticButtons(qualityTier);
  initNeuralCanvas();
  initScrollStory();

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(warmupRoutePrefetch, { timeout: 1200 });
  } else {
    setTimeout(warmupRoutePrefetch, 700);
  }
}
