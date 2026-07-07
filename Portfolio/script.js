const homeBody = document.querySelector(".future-home");
const cursorGlow = document.querySelector(".cursor-glow");
const readout = document.querySelector("[data-readout]");
const themeMessages = {
  airforce: "Air Force signal active: precision, checklist discipline, and mission focus.",
  code: "Coding signal active: responsive layouts, clean interactions, and reliable front-end systems.",
  marvel: "Marvel signal active: bold color, cinematic motion, and hero-level presentation."
};

if (homeBody && cursorGlow) {
  window.addEventListener("pointermove", (event) => {
    homeBody.style.setProperty("--cursor-x", `${event.clientX}px`);
    homeBody.style.setProperty("--cursor-y", `${event.clientY}px`);
  });
}

const revealItems = document.querySelectorAll(".reveal-on-scroll");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

document.querySelectorAll("[data-theme]").forEach((button) => {
  button.addEventListener("click", () => {
    const theme = button.dataset.theme;
    homeBody?.setAttribute("data-theme", theme);
    homeBody?.classList.remove("is-pulsing");
    void homeBody?.offsetWidth;
    homeBody?.classList.add("is-pulsing");

    if (readout) {
      readout.textContent = themeMessages[theme] || "Signal active.";
    }

    window.setTimeout(() => {
      homeBody?.classList.remove("is-pulsing");
    }, 950);
  });
});

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    card.style.transform = `rotateX(${y * -8}deg) rotateY(${x * 8}deg) translateY(-4px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

const counters = document.querySelectorAll("[data-count-to]");

function animateCounter(counter) {
  const target = Number(counter.dataset.countTo || 0);
  const duration = 900;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    counter.textContent = Math.round(target * progress);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else if (target === 100) {
      counter.textContent = "100%";
    }
  }

  requestAnimationFrame(tick);
}

if ("IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.55 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
} else {
  counters.forEach(animateCounter);
}

const gameOverlay = document.querySelector(".game-overlay");
const gameTitle = document.querySelector("#game-title");
const gameScore = document.querySelector("[data-game-score]");
const gameTime = document.querySelector("[data-game-time]");
const gameStatus = document.querySelector("[data-game-status]");
const gameSky = document.querySelector(".game-sky");
const gamePlayer = document.querySelector("[data-game-player]");
let gameTimer;
let spawnTimer;
let activeGame = "shooter";
let gameRunning = false;
let gameX = 50;
let score = 0;
let timeLeft = 60;
let lives = 3;

function setGamePlayerPosition() {
  if (!gamePlayer) return;
  gamePlayer.style.left = `${gameX}%`;
}

function clearGameObjects() {
  gameSky?.querySelectorAll(".game-dot, .enemy-shot").forEach((item) => item.remove());
}

function updateGameStatus(message) {
  if (gameStatus) gameStatus.textContent = message;
}

function movePlayer(direction) {
  if (!gameOverlay || gameOverlay.getAttribute("aria-hidden") === "true" || activeGame !== "evade") return;
  gameX = Math.max(8, Math.min(92, gameX + direction * 10));
  setGamePlayerPosition();
}

function openGame(game) {
  activeGame = game;
  gameRunning = false;
  score = 0;
  timeLeft = 60;
  lives = 3;
  gameX = 50;

  window.clearInterval(gameTimer);
  window.clearInterval(spawnTimer);
  clearGameObjects();
  gameOverlay?.classList.remove("game-shooter", "game-evade", "is-playing");
  gameOverlay?.classList.add(game === "shooter" ? "game-shooter" : "game-evade");
  gameOverlay?.setAttribute("aria-hidden", "false");

  if (gameTitle) gameTitle.textContent = game === "shooter" ? "Target Pop" : "Incoming Fire";
  if (gameScore) gameScore.textContent = score;
  if (gameTime) gameTime.textContent = timeLeft;
  setGamePlayerPosition();
  updateGameStatus(game === "shooter" ? "Click the targets before they vanish." : "Move left and right. Do not get hit.");
}

function spawnTarget() {
  if (!gameRunning || activeGame !== "shooter" || !gameSky) return;

  const dot = document.createElement("button");
  dot.type = "button";
  dot.className = "game-dot";
  dot.setAttribute("aria-label", "Target");
  dot.style.left = `${12 + Math.random() * 76}%`;
  dot.style.top = `${12 + Math.random() * 68}%`;
  dot.style.setProperty("--size", `${34 + Math.random() * 26}px`);

  dot.addEventListener("click", () => {
    score += 10;
    if (gameScore) gameScore.textContent = score;
    dot.classList.add("is-hit");
    window.setTimeout(() => dot.remove(), 120);
  });

  gameSky.appendChild(dot);
  window.setTimeout(() => dot.remove(), 1150);
}

function spawnShot() {
  if (!gameRunning || activeGame !== "evade" || !gameSky) return;

  const shot = document.createElement("span");
  shot.className = "enemy-shot";
  shot.style.left = `${8 + Math.random() * 84}%`;
  gameSky.appendChild(shot);

  window.setTimeout(() => {
    const shotX = parseFloat(shot.style.left);
    if (Math.abs(shotX - gameX) < 8 && gameRunning) {
      lives -= 1;
      updateGameStatus(lives > 0 ? `Hit taken. ${lives} shields left.` : "Shields down.");
      if (lives <= 0) endGame("Game over. Try again.");
    } else if (gameRunning) {
      score += 5;
      if (gameScore) gameScore.textContent = score;
    }
    shot.remove();
  }, 1280);
}

function startGame() {
  if (!gameOverlay || gameOverlay.getAttribute("aria-hidden") === "true") return;
  window.clearInterval(gameTimer);
  window.clearInterval(spawnTimer);
  clearGameObjects();
  gameRunning = true;
  score = 0;
  timeLeft = 60;
  lives = 3;
  gameX = 50;
  if (gameScore) gameScore.textContent = score;
  if (gameTime) gameTime.textContent = timeLeft;
  setGamePlayerPosition();
  gameOverlay.classList.add("is-playing");
  updateGameStatus(activeGame === "shooter" ? "Shoot every dot." : "Avoid incoming shots.");
  spawnTimer = window.setInterval(activeGame === "shooter" ? spawnTarget : spawnShot, activeGame === "shooter" ? 650 : 520);

  gameTimer = window.setInterval(() => {
    timeLeft -= 1;
    if (gameTime) gameTime.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame(activeGame === "shooter" ? "Time. Targets complete." : "You survived the minute.");
    }
  }, 1000);
}

function endGame(message) {
  window.clearInterval(gameTimer);
  window.clearInterval(spawnTimer);
  gameRunning = false;
  gameOverlay?.classList.remove("is-playing");
  updateGameStatus(message);
}

function closeGame() {
  window.clearInterval(gameTimer);
  window.clearInterval(spawnTimer);
  clearGameObjects();
  gameRunning = false;
  gameOverlay?.classList.remove("is-playing");
  gameOverlay?.setAttribute("aria-hidden", "true");
}

document.querySelectorAll("[data-game]").forEach((button) => {
  button.addEventListener("click", () => openGame(button.dataset.game));
});

document.querySelector("[data-game-start]")?.addEventListener("click", startGame);
document.querySelector(".game-close")?.addEventListener("click", closeGame);

document.querySelectorAll("[data-game-move]").forEach((button) => {
  button.addEventListener("click", () => movePlayer(Number(button.dataset.gameMove)));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeGame();
  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") movePlayer(-1);
  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") movePlayer(1);
});

/* =========================================================
   PERSISTENT NIGHT MODE
   ========================================================= */

const nightModeToggles = document.querySelectorAll(
  "[data-night-mode-toggle]"
);

const NIGHT_MODE_STORAGE_KEY = "jaire-portfolio-night-mode";

function setNightMode(enabled, persist = false) {
  document.body.classList.toggle("night-mode", enabled);

  nightModeToggles.forEach((toggle) => {
    toggle.setAttribute("aria-pressed", String(enabled));

    toggle.setAttribute(
      "aria-label",
      enabled ? "Turn off night mode" : "Turn on night mode"
    );

    const modeLabel = toggle.querySelector(".mode-label");
    const modeIcon = toggle.querySelector(".mode-icon");

    if (modeLabel) {
      modeLabel.textContent = enabled ? "Day Mode" : "Night Mode";
    }

    if (modeIcon) {
      modeIcon.textContent = enabled ? "☀" : "☾";
    }
  });

  if (persist) {
    try {
      window.localStorage.setItem(
        NIGHT_MODE_STORAGE_KEY,
        enabled ? "night" : "day"
      );
    } catch {
      /* Mode still works if browser storage is unavailable. */
    }
  }
}

let savedNightMode = null;

try {
  savedNightMode = window.localStorage.getItem(NIGHT_MODE_STORAGE_KEY);
} catch {
  savedNightMode = null;
}

setNightMode(savedNightMode === "night");

nightModeToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const isNightMode = document.body.classList.contains("night-mode");

    setNightMode(!isNightMode, true);
  });
});

/* =========================================================
   SCROLLING DROPDOWN NAVIGATION
   ========================================================= */

const futureNav = document.querySelector(".future-nav");
const sideMenuToggle = document.querySelector("[data-side-menu-toggle]");
const sideNavMenu = document.querySelector("#side-nav-menu");

function setSideMenu(open) {
  if (!futureNav || !sideMenuToggle) return;

  const canOpen = futureNav.classList.contains("is-side-nav");
  const shouldOpen = Boolean(open && canOpen);

  futureNav.classList.toggle("is-side-menu-open", shouldOpen);

  sideMenuToggle.setAttribute("aria-expanded", String(shouldOpen));
  sideMenuToggle.setAttribute(
    "aria-label",
    shouldOpen ? "Close navigation menu" : "Open navigation menu"
  );

  const icon = sideMenuToggle.querySelector("span");

  if (icon) {
    icon.textContent = shouldOpen ? "×" : "☰";
  }
}

function updateSideNavigation() {
  if (!futureNav) return;

  const isPhone = window.matchMedia("(max-width: 760px)").matches;
  const scrollTrigger = isPhone ? 85 : 140;
  const shouldUseSideNav = window.scrollY > scrollTrigger;

  futureNav.classList.toggle("is-side-nav", shouldUseSideNav);

  if (!shouldUseSideNav) {
    setSideMenu(false);
  }
}

sideMenuToggle?.addEventListener("click", () => {
  const isOpen = futureNav?.classList.contains("is-side-menu-open");

  setSideMenu(!isOpen);
});

sideNavMenu?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    setSideMenu(false);
  }
});

document.addEventListener("click", (event) => {
  if (
    futureNav?.classList.contains("is-side-menu-open") &&
    !futureNav.contains(event.target)
  ) {
    setSideMenu(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setSideMenu(false);
  }
});

window.addEventListener("scroll", updateSideNavigation, {
  passive: true
});

window.addEventListener("resize", updateSideNavigation);

updateSideNavigation();