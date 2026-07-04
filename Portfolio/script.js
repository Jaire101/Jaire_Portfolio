const cockpit = document.querySelector(".cockpit-shell");
let effectTimer;

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

    window.clearTimeout(effectTimer);
    document.querySelector(".hero-view")?.scrollIntoView({ behavior: "smooth", block: "start" });
    cockpit.classList.remove("effect-dogfight", "effect-fireworks", "effect-night", "effect-flyby");
    void cockpit.offsetWidth;
    cockpit.classList.add(`effect-${button.dataset.effect}`);

    effectTimer = window.setTimeout(() => {
      cockpit.classList.remove("effect-dogfight", "effect-fireworks", "effect-flyby");
    }, 5200);
  });
});
