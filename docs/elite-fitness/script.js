const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const revealItems = document.querySelectorAll(".reveal");
const metrics = document.querySelectorAll("[data-count]");
const glow = document.querySelector(".cursor-glow");
const magneticButtons = document.querySelectorAll(".magnetic");
const tiltCards = document.querySelectorAll(".tilt-card");
const priceTabs = document.querySelectorAll("[data-price-tab]");
const prices = document.querySelectorAll("[data-price]");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 12);
}

function closeNav() {
  nav.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("nav-open");
}

navToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("nav-open", open);
});

nav.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) closeNav();
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16, rootMargin: "0px 0px -40px" });

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 4, 3) * 80}ms`;
  revealObserver.observe(item);
});

const metricObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    animateCount(entry.target);
    metricObserver.unobserve(entry.target);
  });
}, { threshold: 0.65 });

metrics.forEach((metric) => metricObserver.observe(metric));

function animateCount(element) {
  const target = Number(element.dataset.count);
  if (prefersReducedMotion) {
    element.textContent = String(target);
    return;
  }

  let start = null;
  const duration = 1200;

  function tick(timestamp) {
    start ??= timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = String(Math.round(target * eased));
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

if (!prefersReducedMotion && matchMedia("(pointer: fine)").matches) {
  window.addEventListener("pointermove", (event) => {
    glow.style.opacity = "1";
    glow.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
  }, { passive: true });

  magneticButtons.forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
    });

    button.addEventListener("pointerleave", () => {
      button.style.transform = "";
    });
  });

  tiltCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${y * -7}deg) rotateY(${x * 9}deg) translateY(-4px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

priceTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    priceTabs.forEach((item) => item.classList.toggle("active", item === tab));
    const mode = tab.dataset.priceTab;
    prices.forEach((price) => {
      price.textContent = price.dataset[mode];
      price.animate(
        [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }],
        { duration: prefersReducedMotion ? 1 : 240, easing: "ease-out" }
      );
    });
  });
});

document.querySelector(".trial-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector("button");
  const original = button.textContent;
  button.textContent = "Assessment reserved";
  button.disabled = true;
  setTimeout(() => {
    button.textContent = original;
    button.disabled = false;
    event.currentTarget.reset();
  }, 2200);
});

const bmiForm = document.getElementById("bmiForm");
const bmiResult = document.getElementById("bmiResult");

if (bmiForm && bmiResult) {
  bmiForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const feet = Number(document.getElementById("heightFeet").value);
    const inches = Number(document.getElementById("heightInches").value);
    const weight = Number(document.getElementById("weight").value);

    const totalInches = feet * 12 + inches;
    const bmi = (weight / (totalInches * totalInches)) * 703;

    let category = "";

    if (bmi < 18.5) {
      category = "Underweight range";
    } else if (bmi < 25) {
      category = "Healthy weight range";
    } else if (bmi < 30) {
      category = "Overweight range";
    } else {
      category = "Obesity range";
    }

    bmiResult.innerHTML = `
      <p>Your BMI is <strong>${bmi.toFixed(1)}</strong>.</p>
      <p>General category: ${category}.</p>
    `;
  });
}