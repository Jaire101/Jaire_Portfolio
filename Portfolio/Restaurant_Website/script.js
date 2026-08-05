const header = document.querySelector("[data-header]");
const heroImage = document.querySelector(".hero-image");
const cursorLight = document.querySelector(".cursor-light");
const revealItems = document.querySelectorAll(".reveal");
const magneticItems = document.querySelectorAll(".magnetic");

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 4, 3) * 90}ms`;
  revealObserver.observe(item);
});

function syncScrollMotion() {
  const y = window.scrollY;
  header.classList.toggle("is-scrolled", y > 28);

  if (heroImage) {
    heroImage.style.setProperty("--parallax", `${Math.min(y * 0.18, 100)}px`);
  }
}

window.addEventListener("scroll", syncScrollMotion, { passive: true });
syncScrollMotion();

window.addEventListener("pointermove", event => {
  if (!cursorLight) return;
  cursorLight.animate(
    {
      transform: `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate3d(-50%, -50%, 0)`
    },
    { duration: 700, fill: "forwards", easing: "cubic-bezier(.2,.8,.2,1)" }
  );
});

magneticItems.forEach(item => {
  item.addEventListener("pointermove", event => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    item.style.transform = `translate(${x * 0.12}px, ${y * 0.2}px)`;
  });

  item.addEventListener("pointerleave", () => {
    item.style.transform = "";
  });
});
