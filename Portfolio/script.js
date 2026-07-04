const cockpit = document.querySelector(".cockpit-shell");
const heroView = document.querySelector(".hero-view");
let effectTimer;

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

    const isCompactScreen = window.matchMedia("(max-width: 860px)").matches;
    heroView?.scrollIntoView({
      behavior: isCompactScreen ? "auto" : "smooth",
      block: "start"
    });

    window.setTimeout(() => {
      playCockpitEffect(button.dataset.effect);
    }, isCompactScreen ? 90 : 360);
  });
});
