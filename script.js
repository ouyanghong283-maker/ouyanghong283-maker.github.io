(function () {
  "use strict";

  /* Intro animation */
  var introOverlay = document.getElementById("introOverlay");
  if (introOverlay) {
    var introHidden = false;
    var AUTO_HIDE_DELAY = 4200;

    function hideIntro() {
      if (introHidden) return;
      introHidden = true;
      introOverlay.classList.add("hidden");
      document.body.style.overflow = "";
      setTimeout(function () {
        if (introOverlay.parentNode) introOverlay.parentNode.removeChild(introOverlay);
      }, 800);
    }

    document.body.style.overflow = "hidden";

    var autoTimer = setTimeout(hideIntro, AUTO_HIDE_DELAY);

    document.addEventListener("keydown", function handler(e) {
      clearTimeout(autoTimer);
      hideIntro();
      document.removeEventListener("keydown", handler);
    });

    introOverlay.addEventListener("click", function () {
      clearTimeout(autoTimer);
      hideIntro();
    });

    /* Nested: re-trigger scroll-reveal after intro hides */
    var origObserve = null;
    document.addEventListener("scroll", function checkReveal() {
      if (!introHidden) return;
      /* Force a quick scroll tick to trigger intersection observer */
      window.dispatchEvent(new Event("scroll"));
    }, { once: false });
  }

  var STORAGE_KEY = "konye-theme";
  var themeToggle = document.getElementById("themeToggle");
  var html = document.documentElement;

  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    html.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  var saved = localStorage.getItem(STORAGE_KEY);
  var initial = saved || getSystemTheme();
  applyTheme(initial);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? "dark" : "light");
    }
  });

  /* Mobile menu */
  var mobileBtn = document.getElementById("mobileMenuBtn");
  var navLinks = document.querySelector(".nav-links");

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener("click", function () {
      navLinks.classList.toggle("open");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
      });
    });

    document.addEventListener("click", function (e) {
      if (!navLinks.contains(e.target) && !mobileBtn.contains(e.target)) {
        navLinks.classList.remove("open");
      }
    });
  }

  /* Active nav link on scroll */
  var sections = document.querySelectorAll("section[id]");
  var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function setActiveLink() {
    var current = "";
    sections.forEach(function (section) {
      var top = section.offsetTop - 100;
      if (window.scrollY >= top) {
        current = section.getAttribute("id");
      }
    });

    navAnchors.forEach(function (a) {
      a.classList.remove("active");
      if (a.getAttribute("href") === "#" + current) {
        a.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  /* Scroll-reveal animations */
  var revealEls = document.querySelectorAll(
    ".edu-card, .skill-category, .timeline-content, .project-card, .highlight-item, .contact-link"
  );

  revealEls.forEach(function (el) {
    el.classList.add("reveal");
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach(function (el) {
    observer.observe(el);
  });
})();
