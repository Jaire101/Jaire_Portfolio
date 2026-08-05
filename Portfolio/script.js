const homeBody = document.querySelector(".future-home");

const readout = document.querySelector("[data-readout]");
const themeMessages = {
  airforce:
    "Air Force signal active: precision, checklist discipline, and mission focus.",
  code: "Coding signal active: responsive layouts, clean interactions, and reliable front-end systems.",
  marvel:
    "Marvel signal active: bold color, cinematic motion, and hero-level presentation.",
};

document.querySelectorAll("[data-theme]").forEach((button) => {
  button.addEventListener("click", () => {
    const theme = button.dataset.theme;

    homeBody?.setAttribute("data-theme", theme);

    if (readout) {
      readout.textContent = themeMessages[theme] || "Signal active.";
    }
  });
});

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
  gameSky
    ?.querySelectorAll(".game-dot, .enemy-shot")
    .forEach((item) => item.remove());
}

function updateGameStatus(message) {
  if (gameStatus) gameStatus.textContent = message;
}

function movePlayer(direction) {
  if (
    !gameOverlay ||
    gameOverlay.getAttribute("aria-hidden") === "true" ||
    activeGame !== "evade"
  )
    return;
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
  gameOverlay?.classList.add(
    game === "shooter" ? "game-shooter" : "game-evade",
  );
  gameOverlay?.setAttribute("aria-hidden", "false");

  if (gameTitle)
    gameTitle.textContent = game === "shooter" ? "Target Pop" : "Incoming Fire";
  if (gameScore) gameScore.textContent = score;
  if (gameTime) gameTime.textContent = timeLeft;
  setGamePlayerPosition();
  updateGameStatus(
    game === "shooter"
      ? "Click the targets before they vanish."
      : "Move left and right. Do not get hit.",
  );
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
      updateGameStatus(
        lives > 0 ? `Hit taken. ${lives} shields left.` : "Shields down.",
      );
      if (lives <= 0) endGame("Game over. Try again.");
    } else if (gameRunning) {
      score += 5;
      if (gameScore) gameScore.textContent = score;
    }
    shot.remove();
  }, 1280);
}

function startGame() {
  if (!gameOverlay || gameOverlay.getAttribute("aria-hidden") === "true")
    return;
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
  updateGameStatus(
    activeGame === "shooter" ? "Shoot every dot." : "Avoid incoming shots.",
  );
  spawnTimer = window.setInterval(
    activeGame === "shooter" ? spawnTarget : spawnShot,
    activeGame === "shooter" ? 650 : 520,
  );

  gameTimer = window.setInterval(() => {
    timeLeft -= 1;
    if (gameTime) gameTime.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame(
        activeGame === "shooter"
          ? "Time. Targets complete."
          : "You survived the minute.",
      );
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

document
  .querySelector("[data-game-start]")
  ?.addEventListener("click", startGame);
document.querySelector(".game-close")?.addEventListener("click", closeGame);

document.querySelectorAll("[data-game-move]").forEach((button) => {
  button.addEventListener("click", () =>
    movePlayer(Number(button.dataset.gameMove)),
  );
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden && gameRunning) {
    endGame("Game paused because the page is no longer active.");
  }
});

document.addEventListener("keydown", (event) => {
  const gameIsOpen = gameOverlay?.getAttribute("aria-hidden") === "false";

  if (!gameIsOpen) return;

  const key = event.key.toLowerCase();

  if (event.key === "Escape") {
    closeGame();
    return;
  }

  if (event.key === "ArrowLeft" || key === "a") {
    event.preventDefault();
    movePlayer(-1);
  }

  if (event.key === "ArrowRight" || key === "d") {
    event.preventDefault();
    movePlayer(1);
  }
});

/* =========================================================
   PERSISTENT NIGHT MODE
   ========================================================= */

const nightModeToggles = document.querySelectorAll("[data-night-mode-toggle]");

const NIGHT_MODE_STORAGE_KEY = "jaire-portfolio-night-mode";

function setNightMode(enabled, persist = false) {
  document.body.classList.toggle("night-mode", enabled);

  nightModeToggles.forEach((toggle) => {
    toggle.setAttribute("aria-pressed", String(enabled));

    toggle.setAttribute(
      "aria-label",
      enabled ? "Turn off night mode" : "Turn on night mode",
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
        enabled ? "night" : "day",
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
   MULTI-PAGE ENHANCEMENTS
   ========================================================= */

document.querySelectorAll("[data-current-year]").forEach((year) => {
  year.textContent = new Date().getFullYear();
});
