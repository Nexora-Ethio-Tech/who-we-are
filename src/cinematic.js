function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function initCursorFollower() {
  if (window.matchMedia("(pointer: coarse)").matches) {
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

function initMagneticButtons() {
  if (window.matchMedia("(pointer: coarse)").matches || prefersReducedMotion()) {
    return;
  }

  document.querySelectorAll(".magnetic").forEach((button) => {
    const maxOffset = 12;

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

function initNeuralCanvas() {
  const canvas = document.querySelector("#neural-canvas");
  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) {
    return;
  }

  const reduce = prefersReducedMotion();
  const pointCount = reduce ? 24 : 52;
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
}

export function setupCinematic() {
  initCursorFollower();
  initMagneticButtons();
  initNeuralCanvas();
  initScrollStory();
}
