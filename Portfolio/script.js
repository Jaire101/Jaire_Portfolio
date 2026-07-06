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
