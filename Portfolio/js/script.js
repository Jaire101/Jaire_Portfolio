const themeButton = document.getElementById("themeToggle");

if (themeButton) {
  themeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const darkModeIsActive = document.body.classList.contains("dark-mode");

    themeButton.textContent = darkModeIsActive ? "☀️" : "🌙";
  });
}

const welcomeButton = document.getElementById("welcomeBtn");
const welcomeMessage = document.getElementById("message");

if (welcomeButton && welcomeMessage) {
  welcomeButton.addEventListener("click", () => {
    welcomeMessage.textContent = "Thanks for visiting my portfolio!";
    welcomeButton.textContent = "Welcome!";
  });
}

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

if (contactForm && formMessage) {
  contactForm.addEventListener("submit", event => {
    event.preventDefault();

    formMessage.textContent =
      "Thanks for your message! This form is currently a portfolio demo.";

    contactForm.reset();
  });
}