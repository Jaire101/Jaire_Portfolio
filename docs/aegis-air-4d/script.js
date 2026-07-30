const services = [
  {
    title: "4D Airspace Command",
    body: "A cinematic operating picture that treats altitude, velocity, signal, and mission time as one navigable field.",
    points: ["Time-axis routing", "Threat envelope projection", "Operator-grade HUD layers"]
  },
  {
    title: "Autonomous Wing Systems",
    body: "Coordinated unmanned and crewed flight groups for reconnaissance, defense, precision response, and recovery.",
    points: ["Fleet intent sync", "Formation resilience", "Adaptive return corridors"]
  },
  {
    title: "Signal Shield Network",
    body: "A hardened communications mesh for mission continuity, degraded-node isolation, and command clarity.",
    points: ["Encrypted signal lattice", "Jamming resistance", "Live readiness scoring"]
  }
];

const workItems = [
  {
    label: "Stratospheric Recon",
    title: "Reconnaissance across moving time layers.",
    body: "Persistent sensing maps flight corridors, weather behavior, and signal anomalies before a mission window opens.",
    stat: "92K ft"
  },
  {
    label: "Shield Perimeter",
    title: "Defense envelopes that rotate with the mission.",
    body: "Aegis models perimeter coverage as a live 4D surface, helping command teams see gaps before they become risks.",
    stat: "360 deg"
  },
  {
    label: "Rapid Recovery",
    title: "Return paths designed before launch.",
    body: "Recovery routing, refuel timing, runway status, and weather shifts are merged into one operational timeline.",
    stat: "3.7 sec"
  }
];

const pricing = [
  {
    name: "Sentinel",
    price: "12K",
    body: "For focused simulation, executive demos, and command-room visual prototypes.",
    points: ["4D command landing page", "Immersive hero scene", "Cinematic motion pass"]
  },
  {
    name: "Vanguard",
    price: "28K",
    body: "For a complete fictional defense-company web presence with cinematic interaction.",
    points: ["Full section system", "Reusable component structure", "Interactive 3D cards"],
    featured: true
  },
  {
    name: "Overwatch",
    price: "Custom",
    body: "For broader immersive simulations, dashboards, and multi-page command experiences.",
    points: ["Mission timeline UI", "Advanced WebGL-ready effects", "Design-system expansion"]
  }
];

const root = document.getElementById("root");
let activeWork = 0;
let phase = 0.42;
let pulseMode = false;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function listMarkup(items) {
  return items.map(item => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderApp() {
  const work = workItems[activeWork];

  root.innerHTML = `
    <div class="app-shell">
      <header class="site-header">
        <a class="brand" href="#hero" aria-label="Aegis Air Command home">
          <span class="brand-orbit" aria-hidden="true"></span>
          <span><strong>Aegis Air</strong><small>Command Systems</small></span>
        </a>
        <nav class="nav" aria-label="Primary navigation">
          <a href="#services">Services</a>
          <a href="#matrix">4D Matrix</a>
          <a href="#work">Work</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
        </nav>
        <div class="header-actions">
          <a class="ghost-button" href="#pricing">Plans</a>
          <button class="icon-button" type="button" data-pulse aria-label="Toggle pulse mode"><span>4D</span></button>
        </div>
      </header>

      <main>
        <section class="section hero" id="hero">
          <img class="hero-image" src="assets/hero-air-command.png" alt="" />
          <div class="hero-grid">
            <div class="hero-copy">
              <p class="eyebrow reveal">Fictional air force military company</p>
              <h1 class="hero-title reveal">Aegis Air Command</h1>
              <p class="lede reveal">A full 4D immersive website for aerospace defense: cinematic scroll, reusable sections, high-end transitions, and an interactive command environment.</p>
              <div class="hero-actions reveal">
                <a class="primary-button" href="#services">Explore Systems</a>
                <a class="ghost-button" href="#work">View Missions</a>
              </div>
            </div>
            <aside class="command-panel reveal" aria-label="4D command telemetry">
              <div class="panel-readout">
                ${[
                  ["Altitude", "92K", "ft"],
                  ["Response", "3.7", "sec"],
                  ["Coverage", "360", "deg"],
                  ["Dimension", "4D", "mode"]
                ]
                  .map(([label, value, suffix]) => `
                    <div class="metric">
                      <span>${label}</span>
                      <strong>${value}</strong>
                      <span>${suffix}</span>
                    </div>
                  `)
                  .join("")}
              </div>
              <div class="phase-control">
                <label for="phaseSlider">Mission time axis</label>
                <input id="phaseSlider" type="range" min="0" max="100" value="${Math.round(phase * 100)}" />
                <button class="panel-button" type="button" data-warp>Initiate Warp Scroll</button>
              </div>
            </aside>
          </div>
        </section>

        <section class="section" id="services">
          <div class="section-head">
            <div class="section-copy">
              <p class="eyebrow reveal">Services</p>
              <h2 class="reveal">Military-grade interfaces with cinematic 4D depth.</h2>
              <p class="reveal">Built as a high-trust fictional defense brand, the site keeps the content strategic, controlled, and visually immersive.</p>
            </div>
            <div class="kicker-list reveal">
              <span>HTML: hero, services, work, pricing, contact</span>
              <span>CSS: glass panels, gradients, mobile layout</span>
              <span>JavaScript: cursor glow, buttons, reveal logic</span>
            </div>
          </div>
          <div class="services-grid">
            ${services.map((service, index) => `
              <article class="service-card reveal">
                <span class="card-index">0${index + 1}</span>
                <h3>${escapeHtml(service.title)}</h3>
                <p>${escapeHtml(service.body)}</p>
                <ul>${listMarkup(service.points)}</ul>
              </article>
            `).join("")}
          </div>
        </section>

        <section class="section matrix-section" id="matrix">
          <div class="section-head">
            <div class="section-copy">
              <p class="eyebrow reveal">Playable 4D shape</p>
              <h2 class="reveal">Drag the hypercube through mission time.</h2>
              <p class="reveal">This is the interactive 4D lattice from the earlier version. Drag inside the console to bend perspective, then scrub the W-axis to rotate the time dimension.</p>
            </div>
            <div class="kicker-list reveal">
              <span>X: lateral airspace</span>
              <span>Y: altitude envelope</span>
              <span>Z: signal depth</span>
              <span>W: mission time</span>
            </div>
          </div>
          <div class="matrix-grid">
            <div class="matrix-console reveal">
              <div class="console-top">
                <span>4D vector lattice</span>
                <output id="matrixReadout">Phase 01: Recon</output>
              </div>
              <canvas id="matrixCanvas" width="980" height="620" tabindex="0" aria-label="Playable 4D hypercube lattice"></canvas>
              <div class="matrix-control">
                <label for="matrixAxis">W-axis</label>
                <input id="matrixAxis" type="range" min="0" max="100" value="42" />
              </div>
              <div class="shape-controls" aria-label="4D shape controls">
                <label class="field">
                  <span>Shape</span>
                  <select id="shapeSelect">
                    <option value="hypercube">Hypercube</option>
                    <option value="duoprism">Duo Prism</option>
                    <option value="star">Star Field</option>
                  </select>
                </label>
                <label class="field">
                  <span>Size</span>
                  <input id="shapeSize" type="range" min="70" max="150" value="100" />
                </label>
                <label class="field">
                  <span>Spin Rate <output id="spinReadout">1.0x</output></span>
                  <input id="shapeSpin" type="range" min="10" max="50000" value="100" />
                </label>
              </div>
            </div>
            <aside class="matrix-brief reveal">
              <h3>How to play</h3>
              <p>Drag the field to rotate the shape. Use the W-axis slider to move through phases, then choose a shape, size, and spin rate.</p>
              <button class="panel-button" type="button" data-center-matrix>Center Shape</button>
            </aside>
          </div>
        </section>

        <section class="section" id="work">
          <div class="section-head">
            <div class="section-copy">
              <p class="eyebrow reveal">Work</p>
              <h2 class="reveal">Mission stories move like a tactical timeline.</h2>
              <p class="reveal">The mission panel transitions between reconnaissance, shield, and recovery states.</p>
            </div>
          </div>
          <div class="work-stage">
            <div class="work-tabs reveal">
              ${workItems.map((item, index) => `
                <button class="work-tab${activeWork === index ? " active" : ""}" type="button" data-work="${index}">
                  <strong>${escapeHtml(item.label)}</strong>
                  <span>${escapeHtml(item.stat)}</span>
                </button>
              `).join("")}
            </div>
            <article class="work-card reveal">
              <div class="work-card-content">
                <p class="eyebrow">${escapeHtml(work.stat)}</p>
                <h3>${escapeHtml(work.title)}</h3>
                <p>${escapeHtml(work.body)}</p>
              </div>
              <div class="work-map" aria-hidden="true">
                ${[0, 1, 2, 3, 4].map(i => `<span style="--i:${i}"></span>`).join("")}
              </div>
            </article>
          </div>
        </section>

        <section class="section" id="pricing">
          <div class="section-head">
            <div class="section-copy">
              <p class="eyebrow reveal">Pricing</p>
              <h2 class="reveal">Packages for a cinematic command presence.</h2>
              <p class="reveal">Each tier is framed like a procurement option for a fictional aerospace company.</p>
            </div>
          </div>
          <div class="pricing-grid">
            ${pricing.map(plan => `
              <article class="price-card reveal${plan.featured ? " featured" : ""}">
                <p class="eyebrow">${escapeHtml(plan.name)}</p>
                <div class="price">${escapeHtml(plan.price)}${plan.price !== "Custom" ? "<small> / build</small>" : ""}</div>
                <p>${escapeHtml(plan.body)}</p>
                <ul>${listMarkup(plan.points)}</ul>
                <a class="${plan.featured ? "primary-button" : "ghost-button"}" href="#contact">Request Brief</a>
              </article>
            `).join("")}
          </div>
        </section>

        <section class="section" id="contact">
          <div class="section-head">
            <div class="section-copy">
              <p class="eyebrow reveal">Contact</p>
              <h2 class="reveal">Open a 4D deployment brief.</h2>
              <p class="reveal">A fictional contact surface, styled for command briefings and high-end aerospace proposals.</p>
            </div>
          </div>
          <div class="contact-grid">
            <div class="contact-card reveal">
              <h3>Command intake</h3>
              <p>Share the mission style, company tone, and level of 3D interaction you want next.</p>
            </div>
            <div class="contact-card reveal">
              <form data-contact-form>
                <label class="field"><span>Name</span><input required placeholder="Command lead" /></label>
                <label class="field"><span>Email</span><input type="email" required placeholder="briefing@example.com" /></label>
                <label class="field"><span>Brief</span><textarea required placeholder="Describe the aerospace experience..."></textarea></label>
                <button class="primary-button" type="submit">Stage Request</button>
                <div class="toast" role="status"></div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer class="footer">
        <span>Aegis Air Command is a fictional aerospace defense company concept.</span>
        <span>Built to work from this local folder, with CDN enhancements when available.</span>
      </footer>
    </div>
  `;
}

function initRevealAnimations() {
  const revealEls = [...document.querySelectorAll(".reveal")];

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.set(revealEls, { autoAlpha: 0, y: 32 });
    gsap.to(".hero-image", {
      scale: 1.14,
      yPercent: 8,
      ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true }
    });
    document.querySelectorAll(".section").forEach(section => {
      gsap.to(section.querySelectorAll(".reveal"), {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: section, start: "top 72%" }
      });
    });
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    },
    { threshold: 0.16 }
  );
  revealEls.forEach(el => observer.observe(el));
}

function initInteractions() {
  const glow = document.getElementById("cursorGlow");
  const slider = document.getElementById("phaseSlider");
  const pulse = document.querySelector("[data-pulse]");

  addEventListener("pointermove", event => {
    document.documentElement.style.setProperty("--mouse-x", (event.clientX / innerWidth - 0.5).toFixed(4));
    document.documentElement.style.setProperty("--mouse-y", (event.clientY / innerHeight - 0.5).toFixed(4));
    if (glow) {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    }
  });

  slider?.addEventListener("input", event => {
    phase = Number(event.target.value) / 100;
    window.aegisScene?.setPhase(phase);
  });

  pulse?.addEventListener("click", () => {
    pulseMode = !pulseMode;
    pulse.classList.toggle("active", pulseMode);
    window.aegisScene?.setPulse(pulseMode);
    document.querySelector("#matrix")?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => document.querySelector("#matrixCanvas")?.focus({ preventScroll: true }), 650);
  });

  document.querySelector("[data-warp]")?.addEventListener("click", () => {
    document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" });
  });

  document.querySelectorAll("[data-work]").forEach(button => {
    button.addEventListener("click", () => {
      activeWork = Number(button.dataset.work);
      const work = workItems[activeWork];
      document.querySelectorAll("[data-work]").forEach(tab => tab.classList.toggle("active", tab === button));
      const content = document.querySelector(".work-card-content");
      content.animate(
        [{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "translateY(0)" }],
        { duration: 360, easing: "cubic-bezier(.2,.8,.2,1)" }
      );
      content.innerHTML = `
        <p class="eyebrow">${escapeHtml(work.stat)}</p>
        <h3>${escapeHtml(work.title)}</h3>
        <p>${escapeHtml(work.body)}</p>
      `;
    });
  });

  document.querySelector("[data-contact-form]")?.addEventListener("submit", event => {
    event.preventDefault();
    event.currentTarget.querySelector(".toast").textContent =
      "Briefing request staged. Replace this demo action with your preferred form endpoint.";
  });
}

function initMatrixShape() {
  const canvas = document.getElementById("matrixCanvas");
  const axis = document.getElementById("matrixAxis");
  const shapeSelect = document.getElementById("shapeSelect");
  const sizeSlider = document.getElementById("shapeSize");
  const spinSlider = document.getElementById("shapeSpin");
  const spinReadout = document.getElementById("spinReadout");
  const readout = document.getElementById("matrixReadout");
  const center = document.querySelector("[data-center-matrix]");
  if (!canvas || !axis) return;

  const ctx = canvas.getContext("2d");
  const phases = [
    { name: "Phase 01: Recon", color: "#87f5bd" },
    { name: "Phase 02: Shield", color: "#59ddff" },
    { name: "Phase 03: Strike", color: "#f8b84e" },
    { name: "Phase 04: Recover", color: "#f4fbff" }
  ];
  const shapeSets = createMatrixShapes();
  let activeShape = shapeSets.hypercube;
  let dpr = 1;
  let dragging = false;
  let matrixPointer = { x: 0.18, y: -0.12 };
  let hover = { x: 0.5, y: 0.5 };

  function createMatrixShapes() {
    const hypercube = { vertices: [], edges: [] };
    [-1, 1].forEach(x => {
      [-1, 1].forEach(y => {
        [-1, 1].forEach(z => {
          [-1, 1].forEach(w => hypercube.vertices.push({ x, y, z, w }));
        });
      });
    });
    hypercube.edges = connectByDistance(hypercube.vertices, 2.01);

    const duoprism = { vertices: [], edges: [] };
    const ring = 8;
    for (let i = 0; i < ring; i += 1) {
      const a = (i / ring) * Math.PI * 2;
      for (let j = 0; j < ring; j += 1) {
        const b = (j / ring) * Math.PI * 2;
        duoprism.vertices.push({
          x: Math.cos(a),
          y: Math.sin(a),
          z: Math.cos(b),
          w: Math.sin(b)
        });
      }
    }
    for (let i = 0; i < ring; i += 1) {
      for (let j = 0; j < ring; j += 1) {
        const current = i * ring + j;
        duoprism.edges.push([current, ((i + 1) % ring) * ring + j]);
        duoprism.edges.push([current, i * ring + ((j + 1) % ring)]);
      }
    }

    const star = { vertices: [], edges: [] };
    star.vertices.push({ x: 0, y: 0, z: 0, w: 0 });
    const arms = 24;
    for (let i = 0; i < arms; i += 1) {
      const a = (i / arms) * Math.PI * 2;
      const b = ((i * 7) / arms) * Math.PI * 2;
      const radius = i % 2 ? 1.45 : 0.92;
      star.vertices.push({
        x: Math.cos(a) * radius,
        y: Math.sin(a) * radius,
        z: Math.cos(b) * (1.55 - radius * 0.28),
        w: Math.sin(b) * (1.55 - radius * 0.28)
      });
      star.edges.push([0, i + 1]);
      if (i > 0) star.edges.push([i, i + 1]);
    }
    star.edges.push([1, arms]);

    return { hypercube, duoprism, star };
  }

  function connectByDistance(vertices, threshold) {
    const edges = [];
    for (let i = 0; i < vertices.length; i += 1) {
      for (let j = i + 1; j < vertices.length; j += 1) {
        const a = vertices[i];
        const b = vertices[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        const dw = a.w - b.w;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);
        if (distance <= threshold) edges.push([i, j]);
      }
    }
    return edges;
  }

  function fit() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function rotate(point, ax, ay, az, aw) {
    let { x, y, z, w } = point;
    let c = Math.cos(ax);
    let s = Math.sin(ax);
    [x, z] = [x * c - z * s, x * s + z * c];
    c = Math.cos(ay);
    s = Math.sin(ay);
    [y, w] = [y * c - w * s, y * s + w * c];
    c = Math.cos(az);
    s = Math.sin(az);
    [x, y] = [x * c - y * s, x * s + y * c];
    c = Math.cos(aw);
    s = Math.sin(aw);
    [z, w] = [z * c - w * s, z * s + w * c];
    return { x, y, z, w };
  }

  function project(point, width, height, size = 1) {
    const wPerspective = 2.8 / (3.8 - point.w);
    const x3 = point.x * wPerspective;
    const y3 = point.y * wPerspective;
    const z3 = point.z * wPerspective;
    const zPerspective = Math.min(width, height) * 0.34 / (4.2 - z3);
    return {
      x: width / 2 + x3 * zPerspective * size,
      y: height / 2 + y3 * zPerspective * size,
      depth: z3,
      glow: wPerspective
    };
  }

  function hexToRgb(hex) {
    const value = Number.parseInt(hex.slice(1), 16);
    return `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`;
  }

  function draw(time) {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const t = time * 0.001;
    const rotation = Number(axis.value) / 100;
    const size = Number(sizeSlider?.value || 100) / 100;
    const spin = Number(spinSlider?.value || 100) / 100;
    const phaseIndex = Math.min(3, Math.floor(Number(axis.value) / 25));
    const current = phases[phaseIndex];
    const rgb = hexToRgb(current.color);
    const points = activeShape.vertices.map(point =>
      project(
        rotate(
          point,
          t * 0.42 * spin + matrixPointer.x,
          rotation * Math.PI * 1.8,
          t * 0.28 * spin + matrixPointer.y,
          t * 0.36 * spin
        ),
        width,
        height,
        size
      )
    );

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(3, 8, 13, 0.72)";
    ctx.fillRect(0, 0, width, height);

    const glow = ctx.createRadialGradient(width * hover.x, height * hover.y, 10, width * hover.x, height * hover.y, width * 0.72);
    glow.addColorStop(0, `rgba(${rgb}, 0.16)`);
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(89, 221, 255, 0.1)";
    ctx.lineWidth = 1;
    for (let x = 24; x < width; x += 42) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 24; y < height; y += 42) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.shadowBlur = pulseMode ? 26 : 14;
    ctx.shadowColor = current.color;
    ctx.lineWidth = pulseMode ? 1.8 : 1.35;
    activeShape.edges.forEach(([i, j]) => {
      const a = points[i];
      const b = points[j];
      ctx.strokeStyle = `rgba(${rgb}, ${0.16 + Math.max(a.glow, b.glow) * 0.23})`;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    });

    points.forEach((point, index) => {
      const size = Math.max(2.4, 4.6 + point.glow * 2 + Math.sin(t * 2 + index) * 0.8);
      ctx.fillStyle = index % 5 === 0 ? "#f8b84e" : current.color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    if (readout) {
      const label = shapeSelect?.selectedOptions?.[0]?.textContent || "Hypercube";
      readout.textContent = `${current.name} / ${label}`;
      readout.style.color = current.color;
    }
    if (spinReadout) spinReadout.textContent = `${spin.toFixed(1)}x`;
    requestAnimationFrame(draw);
  }

  canvas.addEventListener("pointerdown", event => {
    dragging = true;
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointerup", () => {
    dragging = false;
  });

  canvas.addEventListener("pointermove", event => {
    const rect = canvas.getBoundingClientRect();
    hover.x = (event.clientX - rect.left) / rect.width;
    hover.y = (event.clientY - rect.top) / rect.height;
    if (!dragging) return;
    matrixPointer.x = (hover.x - 0.5) * Math.PI;
    matrixPointer.y = (hover.y - 0.5) * Math.PI;
  });

  center?.addEventListener("click", () => {
    matrixPointer = { x: 0.18, y: -0.12 };
    axis.value = "42";
    if (sizeSlider) sizeSlider.value = "100";
    if (spinSlider) spinSlider.value = "100";
    axis.dispatchEvent(new Event("input"));
    canvas.focus({ preventScroll: true });
  });

  shapeSelect?.addEventListener("change", event => {
    activeShape = shapeSets[event.target.value] || shapeSets.hypercube;
    canvas.focus({ preventScroll: true });
  });

  axis.addEventListener("input", event => {
    phase = Number(event.target.value) / 100;
    window.aegisScene?.setPhase(phase);
  });

  addEventListener("resize", fit);
  fit();
  draw(0);
}

function initScene() {
  if (window.THREE) {
    initThreeScene();
  } else {
    initCanvasScene();
  }
}

function initThreeScene() {
  const canvas = document.getElementById("webglScene");
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x02050a, 0.035);

  const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 1.6, 8.2);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);

  const group = new THREE.Group();
  scene.add(group);

  const blue = new THREE.MeshStandardMaterial({
    color: 0x59ddff,
    emissive: 0x0d5f78,
    metalness: 0.55,
    roughness: 0.28,
    wireframe: true
  });
  const gold = new THREE.MeshStandardMaterial({
    color: 0xf8b84e,
    emissive: 0x6f3c05,
    metalness: 0.4,
    roughness: 0.34,
    wireframe: true
  });

  const torus = new THREE.Mesh(new THREE.TorusKnotGeometry(1.45, 0.035, 180, 12, 2, 5), blue);
  const ringA = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.01, 12, 150), gold);
  const ringB = new THREE.Mesh(new THREE.TorusGeometry(4.05, 0.008, 12, 170), blue);
  ringA.rotation.x = Math.PI / 2.6;
  ringB.rotation.y = Math.PI / 2.2;
  group.add(torus, ringA, ringB);

  const stars = new THREE.BufferGeometry();
  const starPositions = [];
  for (let i = 0; i < 760; i += 1) {
    starPositions.push((Math.random() - 0.5) * 34, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 28);
  }
  stars.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));
  const starField = new THREE.Points(
    stars,
    new THREE.PointsMaterial({ color: 0xd8f5ff, size: 0.025, transparent: true, opacity: 0.76 })
  );
  scene.add(starField);

  scene.add(new THREE.AmbientLight(0x6ba7ba, 0.9));
  const key = new THREE.DirectionalLight(0xffd18a, 1.7);
  key.position.set(3, 5, 4);
  scene.add(key);

  let localPulse = false;
  let mouseX = 0;
  let mouseY = 0;
  window.aegisScene = {
    setPhase(value) { phase = value; },
    setPulse(value) { localPulse = value; }
  };

  addEventListener("pointermove", event => {
    mouseX = event.clientX / innerWidth - 0.5;
    mouseY = event.clientY / innerHeight - 0.5;
  });

  function resize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  }

  function animate(time) {
    const t = time * 0.001;
    group.rotation.x = t * 0.12 + mouseY * 0.18;
    group.rotation.y = t * 0.18 + mouseX * 0.22 + phase * 0.8;
    torus.rotation.z = t * (localPulse ? 0.9 : 0.34);
    ringA.rotation.z = -t * 0.24 - phase * Math.PI;
    ringB.rotation.x = t * 0.17 + phase;
    starField.rotation.y = t * 0.025;
    camera.position.x = mouseX * 0.9;
    camera.position.y = 1.6 + mouseY * 0.45;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  addEventListener("resize", resize);
  animate(0);
}

function initCanvasScene() {
  const canvas = document.getElementById("webglScene");
  const ctx = canvas.getContext("2d");
  let dpr = 1;
  let localPulse = false;
  let mouseX = 0;
  let mouseY = 0;
  const stars = Array.from({ length: 180 }, () => ({
    x: Math.random(),
    y: Math.random(),
    z: Math.random() * 0.8 + 0.2
  }));

  window.aegisScene = {
    setPhase(value) { phase = value; },
    setPulse(value) { localPulse = value; }
  };

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.floor(innerWidth * dpr);
    canvas.height = Math.floor(innerHeight * dpr);
    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function point4(x, y, z, w, t) {
    const ax = t * 0.35 + mouseY * 0.8;
    const ay = phase * Math.PI * 2 + t * 0.22 + mouseX * 0.8;
    const aw = t * 0.28 + phase * 1.8;
    let nx = x * Math.cos(ay) - z * Math.sin(ay);
    let nz = x * Math.sin(ay) + z * Math.cos(ay);
    let ny = y * Math.cos(ax) - w * Math.sin(ax);
    let nw = y * Math.sin(ax) + w * Math.cos(ax);
    const p4 = 2.8 / (3.8 - nw);
    nx *= p4;
    ny *= p4;
    nz *= p4;
    const px = nx * Math.cos(aw) - ny * Math.sin(aw);
    const py = nx * Math.sin(aw) + ny * Math.cos(aw);
    const p3 = 280 / (4.4 - nz);
    return {
      x: innerWidth / 2 + px * p3,
      y: innerHeight / 2 + py * p3,
      g: p4
    };
  }

  const vertices = [];
  [-1, 1].forEach(x => [-1, 1].forEach(y => [-1, 1].forEach(z => [-1, 1].forEach(w => vertices.push({ x, y, z, w })))));
  const edges = [];
  for (let i = 0; i < vertices.length; i += 1) {
    for (let j = i + 1; j < vertices.length; j += 1) {
      const a = vertices[i];
      const b = vertices[j];
      const diff = Number(a.x !== b.x) + Number(a.y !== b.y) + Number(a.z !== b.z) + Number(a.w !== b.w);
      if (diff === 1) edges.push([i, j]);
    }
  }

  addEventListener("pointermove", event => {
    mouseX = event.clientX / innerWidth - 0.5;
    mouseY = event.clientY / innerHeight - 0.5;
  });

  function draw(time) {
    const t = time * 0.001;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    const gradient = ctx.createLinearGradient(0, 0, 0, innerHeight);
    gradient.addColorStop(0, "#02050a");
    gradient.addColorStop(0.55, "#071420");
    gradient.addColorStop(1, "#03070c");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, innerWidth, innerHeight);

    stars.forEach(star => {
      star.x -= 0.00012 * star.z * (localPulse ? 4 : 1);
      if (star.x < 0) star.x = 1;
      ctx.globalAlpha = 0.25 + star.z * 0.55;
      ctx.fillStyle = star.z > 0.75 ? "#f8d188" : "#d8f5ff";
      ctx.fillRect(star.x * innerWidth, star.y * innerHeight, 1.2 + star.z * 1.6, 1.2 + star.z * 1.6);
    });

    const projected = vertices.map(v => point4(v.x, v.y, v.z, v.w, t));
    ctx.globalAlpha = 1;
    ctx.lineWidth = localPulse ? 1.8 : 1.2;
    edges.forEach(([i, j]) => {
      const a = projected[i];
      const b = projected[j];
      ctx.strokeStyle = `rgba(89, 221, 255, ${0.16 + Math.max(a.g, b.g) * 0.2})`;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    });

    projected.forEach((p, index) => {
      ctx.fillStyle = index % 5 === 0 ? "#f8b84e" : "#59ddff";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3 + p.g * 2, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  addEventListener("resize", resize);
  resize();
  draw(0);
}

renderApp();
initScene();
initRevealAnimations();
initInteractions();
initMatrixShape();
