const cockpit = document.querySelector(".cockpit-shell");

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
