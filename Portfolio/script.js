const cockpit = document.querySelector(".cockpit-shell");
const gameOverlay = document.querySelector(".game-overlay");
const gameTitle = document.querySelector("#game-title");
const gameScore = document.querySelector("[data-game-score]");
const gameTime = document.querySelector("[data-game-time]");
const gameStatus = document.querySelector("[data-game-status]");
const gameStage = document.querySelector("[data-game-stage]");
const gameSky = document.querySelector(".game-sky");
const gamePlayer = document.querySelector("[data-game-player]");
let effectTimer;
let gameTimer;
let spawnTimer;
let activeGame = "shooter";
let gameRunning = false;
let gameX = 50;
let score = 0;
let timeLeft = 60;
let lives = 3;

function playCockpitEffect(effect) {
  if (!cockpit) return;

  window.clearTimeout(effectTimer);
  cockpit.classList.remove("effect-dogfight", "effect-fireworks", "effect-night", "effect-flyby");
  void cockpit.offsetWidth;
  cockpit.classList.add(`effect-${effect}`);

  effectTimer = window.setTimeout(() => {
    cockpit.classList.remove("effect-dogfight", "effect-fireworks", "effect-flyby");
  }, 5200);
}

document.querySelectorAll(".screen-link").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.target;
    button.classList.add("locked");
    window.setTimeout(() => {
      window.location.href = target;
    }, 260);
  });
});

if (cockpit) {
  cockpit.addEventListener("pointermove", (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 12;
    const y = (event.clientY / window.innerHeight - 0.5) * 8;
    cockpit.style.setProperty("--look-x", `${x}px`);
    cockpit.style.setProperty("--look-y", `${y}px`);
  });
}

document.querySelectorAll("[data-effect]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!cockpit) return;

    playCockpitEffect(button.dataset.effect);
  });
});

function setGamePlayerPosition() {
  if (!gamePlayer) return;
  gamePlayer.style.left = `${gameX}%`;
}

function clearGameObjects() {
  gameSky?.querySelectorAll(".game-dot, .enemy-shot").forEach((item) => item.remove());
}

function movePlayer(direction) {
  if (!gameOverlay || gameOverlay.getAttribute("aria-hidden") === "true" || activeGame !== "evade") return;
  gameX = Math.max(8, Math.min(92, gameX + direction * 10));
  setGamePlayerPosition();
}

function updateGameStatus(message) {
  if (gameStatus) gameStatus.textContent = message;
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
  gameOverlay?.classList.remove("game-runway", "game-radar", "game-shooter", "game-evade", "is-playing");
  gameOverlay?.classList.add(game === "shooter" ? "game-shooter" : "game-evade");
  gameOverlay?.setAttribute("aria-hidden", "false");

  gameTitle.textContent = game === "shooter" ? "Target Pop" : "Incoming Fire";
  gameScore.textContent = score;
  gameTime.textContent = timeLeft;
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
    gameScore.textContent = score;
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
      gameScore.textContent = score;
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
  gameScore.textContent = score;
  gameTime.textContent = timeLeft;
  setGamePlayerPosition();
  gameOverlay.classList.add("is-playing");
  updateGameStatus(activeGame === "shooter" ? "Shoot every dot." : "Avoid incoming shots.");
  spawnTimer = window.setInterval(activeGame === "shooter" ? spawnTarget : spawnShot, activeGame === "shooter" ? 650 : 520);

  gameTimer = window.setInterval(() => {
    timeLeft -= 1;
    gameTime.textContent = timeLeft;

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
