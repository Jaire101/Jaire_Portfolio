(function () {
  document.documentElement.classList.add("js-enabled");

  var toggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");

  function closeMenu() {
    if (!toggle || !navLinks) {
      return;
    }

    toggle.classList.remove("is-active");
    toggle.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  if (toggle && navLinks) {
    toggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("is-open");
      toggle.classList.toggle("is-active", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("menu-open", isOpen);
    });

    navLinks.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        closeMenu();
      }
    });

    window.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  var revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.16
    });

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }
}());
